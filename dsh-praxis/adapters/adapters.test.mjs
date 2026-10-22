import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from './mcp.js'
import { createHandler, hostIsLoopback } from './http.js'
import { TOOLS, inputSchema } from './tools.js'
import { apply, entryText } from './dsh.js'

// A stand-in core: adapters only route calls, so they are tested against a fake.
const calls = []
const fake = {
  entry: () => ({ resident: [{ id: 'writing', description: '写作入口。' }], layers: [], task_types: [{ id: 'task/types/x', description: '一种任务。', pipelines: ['html'] }] }),
  resolve: (a) => { calls.push(['resolve', a]); return { units: [] } },
  materials: { curate: (id, patch, opts) => { calls.push(['curate', id, patch, opts.by]); return { ok: true } } },
}

test('every tool has a valid object schema whose required keys exist', () => {
  for (const t of TOOLS) {
    const s = inputSchema(t)
    assert.equal(s.type, 'object')
    for (const r of s.required ?? []) assert.ok(r in s.properties, `${t.name}.${r}`)
  }
  assert.equal(new Set(TOOLS.map((t) => t.name)).size, TOOLS.length)
})

test('MCP: initialize, list, call, errors', async () => {
  const out = []
  const handle = createServer({ praxis: fake, write: (m) => out.push(m) })
  await handle({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', clientInfo: { name: 'agent' } } })
  assert.equal(out[0].result.protocolVersion, '2025-06-18')
  assert.ok(out[0].result.capabilities.tools)
  await handle({ jsonrpc: '2.0', method: 'notifications/initialized' })
  assert.equal(out.length, 1, 'notifications get no reply')
  await handle({ jsonrpc: '2.0', id: 2, method: 'tools/list' })
  assert.equal(out[1].result.tools.length, TOOLS.length)
  await handle({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'praxis_curate', arguments: { binding: 's@kit/a.md', favorite: true } } })
  assert.equal(out[2].result.isError, false)
  assert.deepEqual(calls.at(-1), ['curate', 's@kit/a.md', { favorite: true }, 'mcp:agent'])
  await handle({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'praxis_unit', arguments: {} } })
  assert.equal(out[3].result.isError, true)
  assert.match(out[3].result.content[0].text, /missing ref/)
  await handle({ jsonrpc: '2.0', id: 5, method: 'resources/list' })
  assert.equal(out[4].error.code, -32601)
  await handle({ jsonrpc: '2.0', id: 6, method: 'initialize', params: { protocolVersion: '1999-01-01' } })
  assert.equal(out[5].result.protocolVersion, '2026-07-28')
})

function fakeReq(method, url, body, headers = {}) {
  const chunks = body ? [Buffer.from(JSON.stringify(body))] : []
  return { method, url, headers: { host: '127.0.0.1:7878', 'content-type': 'application/json', ...headers }, async *[Symbol.asyncIterator]() { yield* chunks } }
}
function fakeRes() {
  const res = { status: 0, body: '', writeHead(s) { res.status = s }, end(b) { res.body = String(b ?? '') } }
  return res
}

test('HTTP: UI, tool calls, loopback and JSON guards', async () => {
  const handle = createHandler(fake, { prefix: '/praxis' })
  let res = fakeRes(); await handle(fakeReq('GET', '/praxis/'), res)
  assert.equal(res.status, 200); assert.match(res.body, /Praxis 控制面/)
  res = fakeRes(); await handle(fakeReq('POST', '/praxis/api/praxis_resolve', { task_type: 'x' }), res)
  assert.equal(res.status, 200)
  assert.deepEqual(calls.at(-1), ['resolve', { task_type: 'x' }])
  res = fakeRes(); await handle(fakeReq('POST', '/praxis/api/praxis_resolve', {}, { host: 'evil.example:7878' }), res)
  assert.equal(res.status, 403)
  res = fakeRes(); await handle(fakeReq('POST', '/praxis/api/praxis_resolve', {}, { 'content-type': 'text/plain' }), res)
  assert.equal(res.status, 415)
  res = fakeRes(); await handle(fakeReq('POST', '/praxis/api/praxis_nope', {}), res)
  assert.equal(res.status, 400)
  assert.equal(hostIsLoopback({ headers: { host: '[::1]:80' } }), true)
})

test('DSH plugin registers every tool and adds a short entry section', async () => {
  const tools = []
  const handlers = {}
  const routes = []
  const ctx = {
    tools: { register: (t) => tools.push(t) },
    on: (event, fn) => { handlers[event] = fn },
    webServer: { register: (r) => routes.push(r) },
    effect: (fn) => fn(),
  }
  apply(ctx, { root: new URL('../..', import.meta.url).pathname })
  assert.equal(tools.length, TOOLS.length)
  assert.equal(routes[0].path, '/praxis')
  const assembled = await handlers['system-prompt/assemble'](null, null, async () => ({ sections: [] }))
  assert.equal(assembled.sections[0].name, 'praxis:entry')
  assert.ok(entryText(fake).includes('task/types/x'.replace('task/types/', '')))
})
