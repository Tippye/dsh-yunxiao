import { Worker } from 'node:worker_threads';
import { YunxiaoError } from './client.js';

const PANEL_READS = new Set([
  'list_workitem_activities', 'list_change_request_comments', 'list_pipeline_runs',
  'get_pipeline_run', 'get_pipeline_job_run_log', 'list_workitem_attachments', 'get_workitem_file',
  'list_test_repos', 'list_testcase_directories', 'search_testcases', 'get_testcase',
  'list_test_plans', 'get_test_plan_progress', 'list_test_plan_result_directories', 'get_test_result_list',
  'list_package_repositories', 'list_artifacts', 'get_artifact', 'list_applications', 'get_application',
  'list_application_sources', 'get_user_organizations', 'list_organization_departments',
  'get_organization_department_info', 'list_organization_members', 'get_organization_member_info',
  'list_organization_roles', 'get_organization_role',
]);

function runWorker(data, edition) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./official-worker.js', import.meta.url), {
      workerData: data,
      env: { YUNXIAO_EDITION: edition ?? 'central', LOG_LEVEL: 'silent' },
      execArgv: [],
      resourceLimits: { maxOldGenerationSizeMb: 96 },
    });
    const timer = setTimeout(() => {
      reject(new Error('Official Yunxiao action timed out. Check the resource before retrying a write.'));
      void worker.terminate();
    }, 45000);
    worker.once('message', result => {
      clearTimeout(timer);
      if (result.ok) resolve(result.value);
      else reject(new YunxiaoError(result.message, { status: result.status }));
      void worker.terminate();
    });
    worker.once('error', reject);
    worker.once('exit', code => {
      clearTimeout(timer);
      reject(new Error(`Official Yunxiao worker exited before returning a result (${code}).`));
    });
  });
}

let catalogPromise;
async function catalog() {
  if (!catalogPromise) {
    catalogPromise = runWorker({ mode: 'catalog' }).then(groups => {
      const entries = Object.entries(groups).flatMap(([group, tools]) => tools.map(tool => ({ ...tool, group })));
      return new Map(entries.map(tool => [tool.name, tool]));
    }).catch(error => { catalogPromise = undefined; throw error; });
  }
  return catalogPromise;
}

export function createOfficial(yunxiao) {
  return {
    async list({ group, search, name, offset = 0, limit = 30 } = {}) {
      const tools = await catalog();
      if (name) {
        const tool = tools.get(name);
        if (!tool) throw new Error('Unknown official Yunxiao action.');
        const inputSchema = structuredClone(tool.inputSchema);
        if (inputSchema?.required) inputSchema.required = inputSchema.required.filter(key => key !== 'organizationId');
        if (name === 'create_workitem_attachment') {
          delete inputSchema.properties?.filePath;
          inputSchema.required = [...new Set([...(inputSchema.required ?? []), 'fileContent', 'fileName'])];
          return { ...tool, inputSchema, description: 'Upload a work item attachment from base64 fileContent and fileName. The complete JSON arguments must fit within 6 MiB.' };
        }
        return { ...tool, inputSchema };
      }
      const needle = String(search ?? '').trim().toLowerCase();
      const matching = [...tools.values()].filter(tool => (!group || tool.group === group)
        && (!needle || `${tool.name} ${tool.description}`.toLowerCase().includes(needle)));
      const items = matching.map(({ name, group, description }) => ({ name, group, description }));
      if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
        throw new Error('offset must be a nonnegative integer and limit must be between 1 and 100.');
      }
      return {
        total: items.length,
        nextOffset: offset + limit < items.length ? offset + limit : null,
        groups: [...new Set([...tools.values()].map(tool => tool.group))],
        items: items.slice(offset, offset + limit),
      };
    },
    async call({ name, args = {} }, { readOnly = false } = {}) {
      if (readOnly && !PANEL_READS.has(name)) throw new Error('This official action is not exposed in the panel.');
      const tool = (await catalog()).get(name);
      if (!tool) throw new Error('Unknown official Yunxiao action.');
      if (!args || typeof args !== 'object' || Array.isArray(args)) throw new Error('args must be an object.');
      if (Buffer.byteLength(JSON.stringify(args)) > 6 * 1024 * 1024) throw new Error('Official action input exceeded 6 MiB.');
      if (name === 'create_workitem_attachment' && args.filePath != null) {
        throw new Error('Provide fileContent (base64) and fileName for work item attachments.');
      }
      const { baseUrl, edition } = yunxiao.settings();
      const secret = await yunxiao.resolveToken();
      if (!secret?.token) throw new Error('Configure a Yunxiao access token in Settings first.');
      const input = { ...args };
      if (tool.inputSchema?.properties?.organizationId && (readOnly || !input.organizationId)) {
        input.organizationId = edition === 'region' ? 'default' : await yunxiao.organizationId();
      }
      return runWorker({ name, args: input, token: secret.token, baseUrl, readOnly }, edition);
    },
  };
}
