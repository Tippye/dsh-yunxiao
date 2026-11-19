import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { test } from 'node:test';
import { createOfficial } from '../lib/official.js';

async function mockApi(t, handler) {
  const server = createServer(handler);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  return `http://127.0.0.1:${server.address().port}`;
}

function bridge(baseUrl, edition = 'central') {
  return createOfficial({
    settings: () => ({ baseUrl, edition }),
    resolveToken: async () => ({ token: 'mock-token' }),
    organizationId: async () => 'demo-org',
  });
}

test('discovers all pinned official actions and obtains exact parameter schemas', async () => {
  const official = bridge('https://example.com');
  const catalog = await official.list();
  assert.equal(catalog.total, 215);
  assert.equal(catalog.groups.length, 8);
  assert.equal((await official.list({ name: 'create_workitem_attachment' })).inputSchema.properties.filePath, undefined);
  assert.equal((await official.list({ name: 'list_pipeline_runs' })).inputSchema.required.includes('organizationId'), false);
  await assert.rejects(official.call({ name: 'delete_branch', args: {} }, { readOnly: true }), /not exposed/);
  await assert.rejects(official.call({ name: 'create_workitem_attachment', args: { filePath: '/any-file' } }), /fileContent/);
});

test('runs the real official handler and uses scoped token and organization', async t => {
  const requests = [];
  const baseUrl = await mockApi(t, (req, res) => {
    requests.push({ path: req.url, token: req.headers['x-yunxiao-token'] });
    res.writeHead(200, { 'Content-Type': 'application/json', 'X-Total': 42, 'X-Next-Page': 2 });
    res.end('[]');
  });
  const args = { pipelineId: 123, page: 1, perPage: 10 };
  const result = await bridge(`${baseUrl}/proxy`).call({ name: 'list_pipeline_runs', args }, { readOnly: true });
  assert.equal(result.pagination.total, 42);
  assert.equal(result.pagination.nextPage, 2);
  assert.equal(requests.length, 1);
  assert.match(requests[0].path, /^\/proxy\/oapi\/v1\/flow\/organizations\/demo-org\/pipelines\/123\/runs/);
  assert.equal(requests[0].token, 'mock-token');
  await bridge(baseUrl, 'region').call({ name: 'list_pipeline_runs', args }, { readOnly: true });
  assert.match(requests[1].path, /^\/oapi\/v1\/flow\/pipelines\/123\/runs/);
});

test('the panel permits the exact Testhub read-only POST operation', async t => {
  const seen = [];
  const baseUrl = await mockApi(t, (req, res) => {
    seen.push({ method: req.method, path: req.url });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('[]');
  });
  const value = await bridge(baseUrl).call({ name: 'list_test_plans', args: { page: 1 } }, { readOnly: true });
  assert.deepEqual(value, []);
  assert.deepEqual(seen, [{ method: 'POST', path: '/oapi/v1/projex/organizations/demo-org/testPlan/list' }]);
});

test('official route keeps a forbidden denial actionable without exposing upstream details', async t => {
  const baseUrl = await mockApi(t, (req, res) => {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end('{"errorMessage":"upstream detail"}');
  });
  await assert.rejects(bridge(baseUrl).call({ name: 'list_pipeline_runs', args: { pipelineId: 123 } }), {
    status: 403, message: 'Permission denied.',
  });
});
