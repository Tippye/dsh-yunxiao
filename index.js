/**
 * dsh-yunxiao — read and write Alibaba Cloud Yunxiao (云效) from DeepSeek Harness.
 *
 * One implementation, three surfaces:
 *   - agent tools `yunxiao_*`
 *   - the sidebar panel served at /api/dsh-yunxiao
 *   - a provided `yunxiao` service for other plugins
 *
 * The panel edits settings; they live in this plugin's own storage record, not
 * in a file the user has to maintain. The token lives in the DSH credentials store.
 */

import { createYunxiao } from './lib/client.js';
import { createService } from './lib/service.js';
import { createTools } from './lib/tools.js';

export const inject = ['tools', 'storageDomain', 'connection'];

const DEFAULT_SETTINGS = { baseUrl: '', edition: 'auto', organizationId: '' };

/** Settings schema for the storage domain: sanitize rather than reject stored data. */
const settingsSchema = {
  parse(raw) {
    const value = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    return {
      baseUrl: typeof value.baseUrl === 'string' ? value.baseUrl.slice(0, 300) : '',
      edition: ['auto', 'central', 'region'].includes(value.edition) ? value.edition : 'auto',
      organizationId: typeof value.organizationId === 'string' ? value.organizationId.slice(0, 120) : '',
    };
  },
};

/**
 * Tool results must be lossless JSON: `undefined` properties and NaN do not
 * survive a JSON round-trip, so normalize every result before it is stored.
 */
export function toLossless(value) {
  if (value === undefined) return null;
  try {
    const text = JSON.stringify(value);
    return text === undefined ? null : JSON.parse(text);
  } catch {
    return String(value);
  }
}

export async function apply(ctx, config) {
  const domain = await ctx.storageDomain.open({
    name: 'dsh_yunxiao',
    version: 1,
    layout: 'per-record',
    tables: { settings: { valueSchema: settingsSchema } },
  });
  ctx.effect(() => () => domain.close());

  const table = domain.table('settings');
  const settingsStore = {
    get() {
      return table.get('settings') ?? DEFAULT_SETTINGS;
    },
    async put(value) {
      await table.put('settings', value);
    },
  };

  const yunxiao = createYunxiao({ ctx, config, settingsStore });
  const service = createService(yunxiao, { settingsStore });

  // One-time import for profiles that still point at a KEY=VALUE credentials file.
  // The secret moves into the credentials store; nothing else reads that file.
  if (config?.tokenFile) {
    try {
      const imported = await yunxiao.importTokenFile(config.tokenFile);
      const credentials = await yunxiao.credentialsStatus();
      if (imported?.token && !credentials.configured) {
        await yunxiao.saveToken(imported.token);
        const current = settingsStore.get();
        if (!current.organizationId && imported.organizationId) {
          await settingsStore.put({ ...current, organizationId: imported.organizationId });
        }
        ctx.logger?.info?.('dsh-yunxiao: imported the token from %s into the credentials store', config.tokenFile);
      }
    } catch (error) {
      ctx.logger?.warn?.('dsh-yunxiao: token import failed: %s', error?.message ?? error);
    }
  }

  ctx.provide('yunxiao', service);

  for (const definition of createTools(yunxiao, service)) {
    const execute = definition.execute;
    const tool = {
      ...definition,
      execute: async (args, exec) => toLossless(await execute(args, exec)),
    };
    ctx.effect(() => ctx.tools.register(tool));
  }

  ctx.connection.fetch.register({
    path: '/api/dsh-yunxiao',
    methods: ['POST'],
    requestBody: 'buffered',
    fetch: async request => {
      try {
        const length = Number(request.headers.get('content-length') ?? 0);
        if (length > 262_144) return Response.json({ ok: false, error: { code: 'TOO_LARGE', message: 'Request exceeds 256 KiB.' } }, { status: 413 });
        const raw = await request.text();
        if (raw.length > 262_144) return Response.json({ ok: false, error: { code: 'TOO_LARGE', message: 'Request exceeds 256 KiB.' } }, { status: 413 });
        const input = JSON.parse(raw || '{}');
        const value = await runAction(service, input);
        return Response.json({ ok: true, value }, { headers: { 'Cache-Control': 'no-store' } });
      } catch (error) {
        const code = error?.code ?? 'INVALID_REQUEST';
        const status = code === 'NOT_FOUND' ? 404 : code === 'NO_TOKEN' ? 400 : code === 'NOT_RESOLVED' ? 400 : error?.status === 401 ? 401 : 400;
        return Response.json({ ok: false, error: { code, message: error?.message ?? String(error) } }, { status, headers: { 'Cache-Control': 'no-store' } });
      }
    },
  });

  const systemPrompt = ctx.get('systemPrompt');
  if (systemPrompt?.section) {
    ctx.effect(() =>
      systemPrompt.section({
        name: 'dsh-yunxiao',
        order: 830,
        text: '云效 (Yunxiao): the yunxiao_* tools read and write Alibaba Cloud Yunxiao work items, Codeup repositories, merge requests and Flow pipelines. Call yunxiao_whoami first when the organization, project, or repository ids are unknown; yunxiao_auth inspects or saves the personal access token. The 云效 panel in the sidebar edits the same settings and data. Every call runs with the token owner permissions, and writes change the real platform.',
      }),
    );
  }
}

async function runAction(service, input) {
  const action = input?.action;
  switch (action) {
    case 'status':
      return service.status(Boolean(input.probe));
    case 'saveSettings':
      return service.saveSettings(input);
    case 'clearToken':
      return service.clearToken();
    case 'test':
      return service.testConnection();
    case 'projects':
      return service.listProjects(input);
    case 'sprints':
      return service.listSprints(input);
    case 'workItemTypes':
      return service.listWorkItemTypes(input);
    case 'workItemStatuses':
      return service.listWorkItemStatuses(input);
    case 'workItems':
      return service.searchWorkItems(input);
    case 'workItem':
      return service.getWorkItem(input.workItemId);
    case 'updateWorkItem':
      return service.updateWorkItem(input.workItemId, input);
    case 'comment':
      return service.addWorkItemComment(input.workItemId, input.content, input.formatType);
    case 'repositories':
      return service.listRepositories(input);
    case 'branches':
      return service.listBranches(input);
    case 'changeRequests':
      return service.listChangeRequests(input);
    case 'changeRequest':
      return service.getChangeRequest(input);
    case 'pipelines':
      return service.listPipelines(input);
    case 'pipelineRun':
      return service.getPipelineRun(input);
    default: {
      const error = new Error(`Unknown action: ${action}`);
      error.code = 'INVALID_REQUEST';
      throw error;
    }
  }
}