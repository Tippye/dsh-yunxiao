import assert from 'node:assert/strict';
import { test } from 'node:test';
import { apply } from '../index.js';

test('the panel receives HTTP 403 when Flow denies pipeline run access', async t => {
  let handle;
  t.mock.method(globalThis, 'fetch', async url => {
    assert.match(String(url), /\/pipelines\/123\/runs\/latestPipelineRun$/);
    return Response.json({ errorCode: 'InvalidPipeline.NotHavePipelinePermission' }, { status: 403 });
  });
  await apply({
    storageDomain: { open: async () => ({ table: () => new Map(), close() {} }) },
    effect: callback => callback(),
    provide() {},
    get() {},
    tools: { register() {} },
    connection: { fetch: { register: route => { handle = route.fetch; } } },
  }, { organizationId: 'test-org', accessToken: 'test-token' });
  const response = await handle(new Request('http://localhost/api/dsh-yunxiao', {
    method: 'POST',
    body: JSON.stringify({ action: 'pipelineRun', pipelineId: 123 }),
  }));
  assert.equal(response.status, 403);
  const payload = await response.json();
  assert.equal(payload.ok, false);
  assert.deepEqual(payload.error, { code: 'FORBIDDEN', message: 'Permission denied.' });
});

test('the settings probe replaces upstream permission details in successful responses', async t => {
  let handle;
  t.mock.method(globalThis, 'fetch', async () =>
    Response.json({ message: 'internal authorization details' }, { status: 403 }),
  );
  await apply({
    storageDomain: { open: async () => ({ table: () => new Map(), close() {} }) },
    effect: callback => callback(),
    provide() {},
    get() {},
    tools: { register() {} },
    connection: { fetch: { register: route => { handle = route.fetch; } } },
  }, { accessToken: 'test-token' });
  const response = await handle(new Request('http://localhost/api/dsh-yunxiao', {
    method: 'POST',
    body: JSON.stringify({ action: 'status', probe: true }),
  }));
  const payload = await response.json();
  assert.equal(payload.ok, true);
  assert.equal(payload.value.errorStatus, 403);
  assert.equal(payload.value.error, 'Permission denied.');
});
