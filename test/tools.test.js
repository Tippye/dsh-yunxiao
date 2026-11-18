import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createYunxiao,
  encodeFilePath,
  encodeFilePathSegment,
  encodeRepositoryId,
  parseEnvFile,
} from '../lib/client.js';
import { createService } from '../lib/service.js';
import { createTools } from '../lib/tools.js';

const ORG = 'org-1';

function jsonResponse(body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

function fakeContext() {
  return { get: () => undefined };
}

function harness({ config = {}, settings = {}, responses = {}, responder } = {}) {
  const calls = [];
  const previousFetch = globalThis.fetch;
  const respond = response => (typeof response === 'function' ? response() : response.clone());
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method ?? 'GET', headers: init.headers ?? {}, body: init.body });
    if (responder) {
      const custom = responder(String(url), init);
      if (custom) return respond(custom);
    }
    if (String(url).includes('/platform/user')) {
      return respond(responses.user ?? jsonResponse({ id: 'user-1', name: 'Alice', lastOrganization: ORG }));
    }
    if (String(url).includes('/platform/organizations')) {
      return respond(responses.organizations ?? jsonResponse([{ id: ORG, name: 'Acme' }]));
    }
    return respond(responses.any ?? jsonResponse({ ok: true }));
  };
  const store = {
    value: { baseUrl: '', edition: 'auto', organizationId: '', ...settings },
    get() {
      return this.value;
    },
    async put(next) {
      this.value = next;
    },
  };
  const yunxiao = createYunxiao({
    ctx: fakeContext(),
    config: { accessToken: 'token-123', ...config },
    settingsStore: store,
  });
  const service = createService(yunxiao, { settingsStore: store });
  const tools = new Map(createTools(yunxiao, service).map(tool => [tool.name, tool]));
  return {
    calls,
    tools,
    service,
    store,
    yunxiao,
    restore: () => {
      globalThis.fetch = previousFetch;
    },
  };
}

test('encodes repository ids and file paths', () => {
  assert.equal(encodeRepositoryId('1234'), '1234');
  assert.equal(encodeRepositoryId('org-1/demo repo'), 'org-1%2Fdemo%20repo');
  assert.equal(encodeFilePath('src/a b.ts'), 'src/a%20b.ts');
  assert.equal(encodeFilePathSegment('/src/a b.ts'), 'src%2Fa%20b.ts');
});

test('parses a KEY=VALUE credentials file for the one-time import', () => {
  const values = parseEnvFile(['# comment', 'ALIBABA_CLOUD_YUNXIAO_ACCESS_TOKEN=pt-abc', 'QUOTED="a b"', ''].join('\n'));
  assert.equal(values.get('ALIBABA_CLOUD_YUNXIAO_ACCESS_TOKEN'), 'pt-abc');
  assert.equal(values.get('QUOTED'), 'a b');
});

test('registers unique tools with closed parameter schemas', () => {
  const h = harness();
  try {
    const names = [...h.tools.keys()];
    assert.equal(new Set(names).size, names.length);
    for (const tool of h.tools.values()) {
      assert.equal(typeof tool.description, 'string');
      assert.equal(tool.parameters.additionalProperties, false);
      assert.equal(typeof tool.execute, 'function');
      assert.equal(typeof tool.output.render, 'function');
    }
    assert.ok(names.includes('yunxiao_list_work_items'));
    assert.ok(names.includes('yunxiao_create_change_request'));
    assert.ok(names.includes('yunxiao_run_pipeline'));
  } finally {
    h.restore();
  }
});

test('search work items targets the org-scoped Projex path with filters', async () => {
  const h = harness({ responses: { any: jsonResponse([]) } });
  try {
    await h.tools.get('yunxiao_list_work_items').execute({ spaceId: 'p1', category: 'Bug', subject: 'login', status: '待处理,处理中' });
    const search = h.calls.at(-1);
    assert.equal(search.method, 'POST');
    assert.equal(search.url, 'https://openapi-rdc.aliyuncs.com/oapi/v1/projex/organizations/org-1/workitems:search');
    assert.equal(search.headers['x-yunxiao-token'], 'token-123');
    const body = JSON.parse(search.body);
    assert.equal(body.spaceId, 'p1');
    assert.equal(body.category, 'Bug');
    const conditions = JSON.parse(body.conditions).conditionGroups[0];
    assert.equal(conditions[0].fieldIdentifier, 'subject');
    assert.deepEqual(conditions[1].value, ['待处理', '处理中']);
  } finally {
    h.restore();
  }
});

test('region edition drops the organization path segment', async () => {
  const h = harness({
    settings: { baseUrl: 'https://acme.devops.aliyuncs.com', edition: 'region', organizationId: 'x' },
    responses: { any: jsonResponse([]) },
  });
  try {
    await h.tools.get('yunxiao_list_repositories').execute({ page: 1 });
    assert.equal(h.calls.at(-1).url, 'https://acme.devops.aliyuncs.com/oapi/v1/codeup/repositories?page=1');
  } finally {
    h.restore();
  }
});

test('write file uses POST for create and PUT with an encoded path for update', async () => {
  const h = harness({ responses: { any: jsonResponse({ commitSha: 'abc' }) } });
  try {
    const tool = h.tools.get('yunxiao_write_file');
    await tool.execute({ repositoryId: '1234', filePath: 'src/a.ts', content: 'x', commitMessage: 'm', create: true });
    assert.equal(h.calls.at(-1).method, 'POST');
    assert.equal(h.calls.at(-1).url, 'https://openapi-rdc.aliyuncs.com/oapi/v1/codeup/organizations/org-1/repositories/1234/files');
    assert.equal(JSON.parse(h.calls.at(-1).body).filePath, 'src/a.ts');

    await tool.execute({ repositoryId: '1234', filePath: 'src/a.ts', content: 'x', commitMessage: 'm', branch: 'dev' });
    assert.equal(h.calls.at(-1).method, 'PUT');
    assert.equal(h.calls.at(-1).url, 'https://openapi-rdc.aliyuncs.com/oapi/v1/codeup/organizations/org-1/repositories/1234/files/src%2Fa.ts');
    assert.equal(JSON.parse(h.calls.at(-1).body).branch, 'dev');
  } finally {
    h.restore();
  }
});

test('create change request resolves numeric project ids from the repository', async () => {
  const h = harness({ responses: { any: jsonResponse({ id: 4242, name: 'demo' }) } });
  try {
    await h.tools.get('yunxiao_create_change_request').execute({
      repositoryId: 'org-1/demo',
      title: 'feat: x',
      sourceBranch: 'feat/x',
      targetBranch: 'master',
    });
    const createCall = h.calls.at(-1);
    assert.equal(createCall.url, 'https://openapi-rdc.aliyuncs.com/oapi/v1/codeup/organizations/org-1/repositories/org-1%2Fdemo/changeRequests');
    const body = JSON.parse(createCall.body);
    assert.equal(body.sourceProjectId, '4242');
    assert.equal(body.targetProjectId, '4242');
  } finally {
    h.restore();
  }
});

test('run pipeline posts JSON-encoded params', async () => {
  const h = harness({ responses: { any: jsonResponse(99) } });
  try {
    const result = await h.tools.get('yunxiao_run_pipeline').execute({ pipelineId: 'p1', params: { envs: { A: '1' } } });
    assert.equal(result.pipelineRunId, 99);
    assert.equal(h.calls.at(-1).url, 'https://openapi-rdc.aliyuncs.com/oapi/v1/flow/organizations/org-1/pipelines/p1/runs');
    assert.deepEqual(JSON.parse(JSON.parse(h.calls.at(-1).body).params), { envs: { A: '1' } });
  } finally {
    h.restore();
  }
});

test('raw API tool rejects paths outside /oapi/v1', async () => {
  const h = harness();
  try {
    await assert.rejects(() => h.tools.get('yunxiao_api_request').execute({ path: '/etc/passwd' }), /non-OpenAPI path/);
  } finally {
    h.restore();
  }
});

test('missing token produces an actionable error', async () => {
  const previous = process.env.YUNXIAO_ACCESS_TOKEN;
  delete process.env.YUNXIAO_ACCESS_TOKEN;
  const h = harness({ config: { accessToken: '' } });
  try {
    await assert.rejects(() => h.tools.get('yunxiao_list_repositories').execute({}), /No Yunxiao access token is configured/);
  } finally {
    h.restore();
    if (previous !== undefined) process.env.YUNXIAO_ACCESS_TOKEN = previous;
  }
});

test('HTTP errors surface status, path, and permission hint', async () => {
  const h = harness();
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ errorMessage: 'invalid token' }), { status: 401 });
  try {
    await assert.rejects(() => h.tools.get('yunxiao_list_repositories').execute({}), /Yunxiao API 401 .*invalid token.*permission/);
  } finally {
    globalThis.fetch = previousFetch;
    h.restore();
  }
});

test('decodes base64 file content into text', async () => {
  const content = Buffer.from('# hello\n', 'utf8').toString('base64');
  const h = harness({ responses: { any: jsonResponse({ encoding: 'base64', content, fileName: 'README.md' }) } });
  try {
    const file = await h.tools.get('yunxiao_get_file').execute({ repositoryId: '1', filePath: 'README.md' });
    assert.equal(file.text, '# hello\n');
    assert.equal(file.decodedBytes, 8);
  } finally {
    h.restore();
  }
});

test('saving settings persists them and takes effect without a restart', async () => {
  const h = harness({ responses: { any: jsonResponse([]) } });
  try {
    await h.service.saveSettings({ baseUrl: 'https://acme.devops.aliyuncs.com', edition: 'region', organizationId: 'org-9' });
    assert.deepEqual(h.store.value, {
      baseUrl: 'https://acme.devops.aliyuncs.com',
      edition: 'region',
      organizationId: 'org-9',
    });
    await h.tools.get('yunxiao_list_repositories').execute({});
    assert.equal(h.calls.at(-1).url, 'https://acme.devops.aliyuncs.com/oapi/v1/codeup/repositories');
  } finally {
    h.restore();
  }
});

test('invalid settings are rejected before attempting to save the token', async () => {
  const h = harness();
  try {
    await assert.rejects(() => h.service.saveSettings({ baseUrl: 'ftp://nope', token: 'pt-test' }), /baseUrl must start with http/);
    assert.equal(h.calls.length, 0);
  } finally {
    h.restore();
  }
});

test('the panel route and the tool share one implementation', async () => {
  const h = harness({ responses: { any: jsonResponse({ id: 'w1', subject: 'x' }) } });
  try {
    await h.service.updateWorkItem('w1', { status: '142838' });
    const call = h.calls.at(-1);
    assert.equal(call.method, 'PUT');
    assert.equal(call.url, 'https://openapi-rdc.aliyuncs.com/oapi/v1/projex/organizations/org-1/workitems/w1');
    assert.deepEqual(JSON.parse(call.body), { status: '142838' });

    await h.tools.get('yunxiao_update_work_item').execute({ workItemId: 'w1', status: '142838' });
    assert.equal(h.calls.at(-1).url, call.url);
    assert.deepEqual(JSON.parse(h.calls.at(-1).body), JSON.parse(call.body));
  } finally {
    h.restore();
  }
});

test('tool results are normalized to lossless JSON', async () => {
  const { toLossless } = await import('../index.js');
  assert.deepEqual(toLossless({ a: undefined, b: [undefined, 1], c: null }), { b: [null, 1], c: null });
  assert.equal(toLossless(undefined), null);
  assert.deepEqual(toLossless({ n: Number.NaN }), { n: null });
});
test('loads the workflow statuses for a work item type', async () => {
  const h = harness({
    responses: {
      any: jsonResponse({
        name: '默认需求工作流',
        statuses: [
          { name: '待处理', displayName: '待处理', id: '100005' },
          { name: '设计中', displayName: '设计中', id: '156603' },
        ],
      }),
    },
  });
  try {
    const flow = await h.service.listWorkItemStatuses({ projectId: 'p1', workitemTypeId: 't1' });
    assert.equal(flow.items.length, 2);
    assert.equal(flow.items[1].name, '设计中');
    assert.equal(h.calls.at(-1).url, 'https://openapi-rdc.aliyuncs.com/oapi/v1/projex/organizations/org-1/projects/p1/workitemTypes/t1/workflows');
  } finally {
    h.restore();
  }
});

test('numeric repository ids are accepted from the panel', async () => {
  const h = harness({ responses: { any: jsonResponse([]) } });
  try {
    await h.service.listBranches({ repositoryId: 12345, perPage: 5 });
    assert.equal(h.calls.at(-1).url, 'https://openapi-rdc.aliyuncs.com/oapi/v1/codeup/organizations/org-1/repositories/12345/branches?perPage=5');
  } finally {
    h.restore();
  }
});

test('update work item resolves a status name to the workflow status id', async () => {
  const h = harness({
    responder: url => {
      if (url.includes('/workitems/w1')) return jsonResponse({ space: { id: 'p1' }, workitemType: { id: 't1' }, status: { id: '100005' } });
      if (url.includes('/workflows')) return jsonResponse({ statuses: [{ id: '142838', name: '开发中', displayName: '开发中' }] });
      return undefined;
    },
  });
  try {
    await h.service.updateWorkItem('w1', { status: '开发中' });
    const put = h.calls.find(call => call.method === 'PUT');
    assert.ok(put, 'expected a PUT call');
    assert.deepEqual(JSON.parse(put.body), { status: '142838' });
  } finally {
    h.restore();
  }
});

test('an unknown status name lists the valid workflow statuses', async () => {
  const h = harness({
    responder: url => {
      if (url.includes('/workitems/w1')) return jsonResponse({ space: { id: 'p1' }, workitemType: { id: 't1' } });
      if (url.includes('/workflows')) return jsonResponse({ statuses: [{ id: '142838', name: '开发中' }] });
      return undefined;
    },
  });
  try {
    await assert.rejects(() => h.service.updateWorkItem('w1', { status: '处理中' }), /Unknown work item status "处理中".*开发中/);
  } finally {
    h.restore();
  }
});
