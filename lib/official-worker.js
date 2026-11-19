import { createRequire } from 'node:module';
import { parentPort, workerData } from 'node:worker_threads';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const root = dirname(require.resolve('alibabacloud-devops-mcp-server/package.json'));
const load = file => import(pathToFileURL(join(root, 'dist', file)).href);
const MAX_RESPONSE = 4 * 1024 * 1024;
let denied;

async function run() {
  if (workerData.mode === 'catalog') {
    const [{ defaultToolsetManager }, { Toolset }] = await Promise.all([
      load('common/toolsetManager.js'), load('common/toolsets.js'),
    ]);
    const [{ getTagTools }, { getAppStackReleaseWorkflowTools }] = await Promise.all([
      load('tool-registry/tag.js'), load('tool-registry/appstack-release-workflows.js'),
    ]);
    const groups = Object.fromEntries(Object.values(Toolset).map(group => [group, defaultToolsetManager.getToolsByToolset(group)]));
    groups['pipeline-management'].push(...getTagTools());
    groups['application-delivery'].push(...getAppStackReleaseWorkflowTools());
    return groups;
  }

  const { name, args, token, baseUrl, readOnly } = workerData;
  const endpoint = new URL(baseUrl);
  const prefix = endpoint.pathname.replace(/\/+$/, '');
  const fetchOpenApi = globalThis.fetch;
  let runPageHeaders;
  globalThis.fetch = async (url, options = {}) => {
    const target = new URL(url);
    const method = (options.method ?? 'GET').toUpperCase();
    if (target.origin !== endpoint.origin || !target.pathname.startsWith('/oapi/v1/') || target.username || target.password) {
      throw new Error('The official action attempted a request outside the configured Yunxiao API.');
    }
    const searchRoutes = {
      list_change_request_comments: /^\/oapi\/v1\/codeup\/(?:organizations\/[^/]+\/)?repositories\/[^/]+\/changeRequests\/[^/]+\/comments\/list$/,
      search_testcases: /^\/oapi\/v1\/testhub\/(?:organizations\/[^/]+\/)?testRepos\/[^/]+\/testcases:search$/,
      list_test_plans: /^\/oapi\/v1\/projex\/(?:organizations\/[^/]+\/)?testPlan\/list$/,
      get_test_result_list: /^\/oapi\/v1\/(?:projex|testhub)\/(?:organizations\/[^/]+\/)?[^/]+\/result\/list\/[^/]+$/,
    };
    const readSearch = method === 'POST' && Object.hasOwn(searchRoutes, name) && searchRoutes[name].test(target.pathname);
    if (readOnly && method !== 'GET' && method !== 'HEAD' && !readSearch) {
      throw new Error('This entry only permits read requests.');
    }
    target.pathname = `${prefix}${target.pathname}`;
    const response = await fetchOpenApi(target, { ...options, redirect: 'error', signal: AbortSignal.timeout(25000) });
    if (name === 'list_pipeline_runs' && response.ok && target.pathname.endsWith('/runs')) runPageHeaders = response.headers;
    if (response.status === 401 || response.status === 403) denied = response.status;
    const parts = [];
    let length = 0;
    if (response.body) {
      for await (const chunk of response.body) {
        length += chunk.byteLength;
        if (length > MAX_RESPONSE) throw new Error('Yunxiao response exceeded 4 MiB. Request a smaller page or time range.');
        parts.push(chunk);
      }
    }
    return new Response(response.body ? Buffer.concat(parts) : null, { status: response.status, headers: response.headers });
  };

  const [{ handleToolRequest }, { runWithAuth, setNetworkTransport }] = await Promise.all([
    load('tool-handlers/index.js'), load('common/utils.js'),
  ]);
  setNetworkTransport(true);
  const request = { params: { name, arguments: args } };
  const result = await runWithAuth({ token, apiBaseUrl: endpoint.origin }, async () => {
    const [{ handleTagTools }, { handleAppStackReleaseWorkflowTools }] = await Promise.all([
      load('tool-handlers/tag.js'), load('tool-handlers/appstack-release-workflows.js'),
    ]);
    return (await handleTagTools(request)) ?? (await handleAppStackReleaseWorkflowTools(request)) ?? handleToolRequest(request);
  });
  if (result?.isError || (denied && !result?.structuredContent && result?.content?.[0]?.text === 'null')) {
    throw new Error(result.content?.map(part => part.text).filter(Boolean).join('\n') || 'Official Yunxiao action failed.');
  }
  let value = result?.structuredContent ?? result;
  if (value === result && result?.content?.length === 1 && result.content[0].type === 'text') {
    const text = result.content[0].text;
    try { value = JSON.parse(text); } catch { value = text; }
  }
  if (runPageHeaders && value?.pagination) {
    const headerFields = { 'x-total': 'total', 'x-total-pages': 'totalPages', 'x-next-page': 'nextPage',
      'x-prev-page': 'prevPage', 'x-page': 'page', 'x-per-page': 'perPage' };
    for (const [header, field] of Object.entries(headerFields)) {
      const raw = runPageHeaders.get(header);
      if (raw && /^\d+$/.test(raw)) value.pagination[field] = Number(raw) || (field.endsWith('Page') ? null : 0);
    }
  }
  return value;
}

try {
  parentPort.postMessage({ ok: true, value: await run() });
} catch (error) {
  const status = denied ?? error?.status;
  parentPort.postMessage({ ok: false, status, message: status === 403 ? 'Permission denied.'
    : status === 401 ? 'Authentication failed.' : String(error?.message ?? error).slice(0, 2000) });
}
