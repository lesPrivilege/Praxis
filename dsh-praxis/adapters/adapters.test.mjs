import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from './mcp.js'
import { CALL_PATH, PAGE_PATH, hostIsLoopback, praxisFetch } from './http.js'
import { TOOLS, inputSchema, jsonValue } from './tools.js'
import { apply, entryText } from './dsh.js'

// A stand-in core: adapters only route calls, so they are tested against a fake.
const calls = []
const fake = {
  entry: () => ({ resident: [{ id: 'writing', description: '写作入口。' }], layers: [], task_types: [{ id: 'task/types/x', description: '一种任务。', pipelines: ['html'] }] }),
  resolve: (a) => { calls.push(['resolve', a]); return { units: [] } },
  unit: () => undefined,
  source: () => undefined,
  materials: { curate: (id, patch, opts) => { calls.push(['curate', id, patch, opts.by]); return { ok: true } }, source: () => undefined },
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
  await handle({ jsonrpc: '2.0', id: 41, method: 'tools/call', params: { name: 'praxis_unit', arguments: { ref: 'no/such' } } })
  await handle({ jsonrpc: '2.0', id: 42, method: 'tools/call', params: { name: 'praxis_source', arguments: { id: 'no:such' } } })
  assert.deepEqual(out.slice(4, 6).map((m) => [m.result.isError, JSON.parse(m.result.content[0].text).error]), [[true, 'unknown unit: no/such'], [true, 'unknown source: no:such']])
  await handle({ jsonrpc: '2.0', id: 5, method: 'resources/list' })
  assert.equal(out[6].error.code, -32601)
  await handle({ jsonrpc: '2.0', id: 6, method: 'initialize', params: { protocolVersion: '1999-01-01' } })
  assert.equal(out[7].result.protocolVersion, '2026-07-28')
})

const call = (body, headers = { 'content-type': 'application/json' }) => new Request(`http://dsh${CALL_PATH}`, { method: 'POST', headers, body: JSON.stringify(body) })

test('HTTP: page and call routes, JSON guard, errors', async () => {
  const fetch = praxisFetch(fake)
  let res = await fetch(new Request(`http://dsh${PAGE_PATH}`))
  assert.equal(res.status, 200); assert.match(await res.text(), /Praxis 控制面/)
  res = await fetch(call({ tool: 'praxis_resolve', args: { task_type: 'x' } }))
  assert.equal(res.status, 200)
  assert.deepEqual(calls.at(-1), ['resolve', { task_type: 'x' }])
  res = await fetch(call({ tool: 'praxis_resolve' }, { 'content-type': 'text/plain' }))
  assert.equal(res.status, 415)
  res = await fetch(call({ tool: 'praxis_nope' }))
  assert.equal(res.status, 400)
  res = await fetch(new Request(`http://dsh${CALL_PATH}`))
  assert.equal(res.status, 404)
  assert.equal(hostIsLoopback({ headers: { host: '[::1]:80' } }), true)
  assert.equal(hostIsLoopback({ headers: { host: 'evil.example:7878' } }), false)
})

test('DSH plugin registers every tool, two Connection routes and a prompt section', async () => {
  const tools = []
  const routes = []
  const sections = []
  const ctx = {
    tools: { register: (t) => tools.push(t) },
    connection: { fetch: { register: (r) => { routes.push(r); return async () => {} } } },
    systemPrompt: { section: (s) => { sections.push(s); return () => {} } },
    effect: (fn) => fn(),
  }
  apply(ctx, { root: new URL('../..', import.meta.url).pathname })
  assert.equal(tools.length, TOOLS.length)
  assert.deepEqual(routes.map((r) => [r.path, r.methods]), [[PAGE_PATH, ['GET', 'HEAD']], [CALL_PATH, ['POST']], ['/api/praxis.file', ['GET', 'HEAD']]])
  assert.equal(tools.find((t) => t.name === 'praxis_units').isConcurrencySafe(), true)
  assert.equal(tools.find((t) => t.name === 'praxis_curate').isConcurrencySafe, undefined)
  await assert.rejects(tools.find((t) => t.name === 'praxis_unit').execute({ ref: 'no/such/unit' }), /unknown unit/)
  assert.equal(sections[0].name, 'praxis:entry')
  assert.match(sections[0].text(), /praxis_resolve/)
  assert.ok(entryText(fake).includes('x（html）'))
})

test('HTTP file route serves registered artifact files only, by id', async () => {
  const repo = new URL('../..', import.meta.url).pathname.replace(/\/$/, '')
  const records = { 'readme-1': { path: 'dsh-praxis/README.md' }, 'gone-2': { path: 'dsh-praxis/no-such.md' } }
  const handle = praxisFetch({ artifacts: { get: (id) => records[id], absolute: (p) => `${repo}/${p}` } }, 'test')
  const get = (query) => handle(new Request(`http://dsh/api/praxis.file?${query}`))
  const ok = await get('artifact=readme-1')
  assert.equal(ok.status, 200)
  assert.match(ok.headers.get('content-type'), /^text\/markdown/)
  assert.equal(ok.headers.get('content-security-policy'), 'sandbox')
  for (const bad of ['artifact=gone-2', 'artifact=nope', 'path=dsh-praxis/README.md', '']) assert.equal((await get(bad)).status, 404, bad)
})

test('tool values are lossless JSON: absent fields omitted, non-JSON values refused', async () => {
  assert.deepEqual(jsonValue({ a: 1, b: undefined, c: [{ d: undefined, e: null }] }), { a: 1, c: [{ e: null }] })
  for (const bad of [{ n: NaN }, { f: () => 1 }, { d: new Date(0) }, [undefined]]) assert.throws(() => jsonValue(bad), /not/)
  const tools = []
  apply({ tools: { register: (t) => tools.push(t) }, effect: (fn) => fn() }, { root: new URL('../..', import.meta.url).pathname, prompt: false })
  // DSH's own check: a value survives a JSON round trip unchanged, with no undefined anywhere.
  const lossless = (v) => assert.deepStrictEqual(JSON.parse(JSON.stringify(v)), v)
  for (const name of ['praxis_upkeep', 'praxis_stale', 'praxis_entry', 'praxis_runs', 'praxis_artifacts', 'praxis_presets']) lossless(await tools.find((t) => t.name === name).execute({}))
  // Every task type resolves on the real repository, with whatever claim shapes its catalogs use.
  const resolve = tools.find((t) => t.name === 'praxis_resolve')
  for (const t of (await tools.find((x) => x.name === 'praxis_entry').execute({})).task_types) {
    for (const pipeline of t.pipelines) lossless(await resolve.execute({ task_type: t.id, pipeline }))
  }
})
