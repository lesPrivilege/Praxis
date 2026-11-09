import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from './mcp.js'
import { CALL_PATH, praxisFetch } from './http.js'
import { TOOLS, callTool, inputSchema, jsonValue } from './tools.js'
import { createPraxis } from '../core/index.js'
import { apply, entryText } from './dsh.js'
import { askPrompt, createAsks } from './ask.js'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

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
  await handle({ jsonrpc: '2.0', id: 5, method: 'sampling/createMessage' })
  assert.equal(out[6].error.code, -32601)
  await handle({ jsonrpc: '2.0', id: 6, method: 'initialize', params: { protocolVersion: '1999-01-01' } })
  assert.equal(out[7].result.protocolVersion, '2026-07-28')
})

const call = (body, headers = { 'content-type': 'application/json' }) => new Request(`http://dsh${CALL_PATH}`, { method: 'POST', headers, body: JSON.stringify(body) })

test('MCP resources are the catalog (links, never originals) and prompts start a task type', async () => {
  const out = []
  const handle = createServer({ praxis: createPraxis(), write: (m) => out.push(m) })
  await handle({ jsonrpc: '2.0', id: 1, method: 'resources/list' })
  const uris = out[0].result.resources.map((r) => r.uri)
  assert.equal(uris[0], 'praxis://entry')
  assert.ok(uris.includes('praxis://unit/design/foundations/grammar'))
  await handle({ jsonrpc: '2.0', id: 2, method: 'resources/read', params: { uri: 'praxis://unit/writing' } })
  assert.match(out[1].result.contents[0].text, /^# /)
  await handle({ jsonrpc: '2.0', id: 3, method: 'resources/read', params: { uri: 'praxis://source/ref-ant-design-pro' } })
  assert.equal(JSON.parse(out[2].result.contents[0].text).url, 'https://github.com/ant-design/ant-design-pro')
  await handle({ jsonrpc: '2.0', id: 4, method: 'resources/read', params: { uri: 'praxis://source/no-such' } })
  assert.equal(out[3].error.code, -32603)
  await handle({ jsonrpc: '2.0', id: 5, method: 'prompts/list' })
  const name = out[4].result.prompts[0].name
  await handle({ jsonrpc: '2.0', id: 6, method: 'prompts/get', params: { name, arguments: { brief: '给新同事讲清一个系统' } } })
  assert.match(out[5].result.messages[0].content.text, /praxis_resolve/)
})

test('HTTP: call route, JSON guard, errors; no page route', async () => {
  const fetch = praxisFetch(fake)
  assert.equal((await fetch(new Request('http://dsh/api/praxis'))).status, 404, 'the page lives in the DSH client now')
  let res = await fetch(call({ tool: 'praxis_resolve', args: { task_type: 'x' } }))
  assert.equal(res.status, 200)
  assert.deepEqual(calls.at(-1), ['resolve', { task_type: 'x' }])
  res = await fetch(call({ tool: 'praxis_resolve' }, { 'content-type': 'text/plain' }))
  assert.equal(res.status, 415)
  res = await fetch(call({ tool: 'praxis_nope' }))
  assert.equal(res.status, 400)
  res = await fetch(new Request(`http://dsh${CALL_PATH}`))
  assert.equal(res.status, 404)
})

test('DSH plugin registers the worker tools, three Connection routes, /praxis and an agent-only prompt section', async () => {
  const tools = []
  const routes = []
  const sections = []
  const commands = []
  const ctx = {
    tools: { register: (t) => tools.push(t) },
    connection: { fetch: { register: (r) => { routes.push(r); return async () => {} } } },
    systemPrompt: { section: (s) => { sections.push(s); return () => {} } },
    commands: { register: (c) => { commands.push(c); return () => {} } },
    effect: (fn) => fn(),
  }
  apply(ctx, {})
  assert.deepEqual(tools.map((t) => t.name), TOOLS.filter((t) => t.agent).map((t) => t.name))
  assert.ok(!tools.some((t) => t.name === 'praxis_preset_save'), 'maintenance tools stay off the session')
  assert.equal(commands[0].name, 'praxis')
  assert.match(commands[0].handler({ rawInput: '' }).text, /Task types/)
  assert.deepEqual(routes.map((r) => [r.path, r.methods]), [[CALL_PATH, ['POST']], ['/api/praxis.file', ['GET', 'HEAD']], ['/api/praxis.ask', ['GET', 'POST']]])
  assert.equal(tools.find((t) => t.name === 'praxis_unit').isConcurrencySafe(), true)
  assert.equal(tools.find((t) => t.name === 'praxis_curate').isConcurrencySafe, undefined)
  await assert.rejects(tools.find((t) => t.name === 'praxis_unit').execute({ ref: 'no/such/unit' }), /unknown unit/)
  assert.equal(sections[0].name, 'praxis:entry')
  assert.match(sections[0].text(), /praxis_resolve/)
  assert.match(sections[0].text({ agent: {} }), /praxis_resolve/)
  assert.equal(sections[0].text({ agent: undefined, scope: 'title' }), '', 'not in non-agent prompts')
  assert.ok(entryText(fake).includes('x（html）'))
})

test('HTTP file route serves registered artifact files by id and stocked files a manifest lists', async () => {
  const repo = new URL('../..', import.meta.url).pathname.replace(/\/$/, '')
  const records = { 'readme-1': { path: 'dsh-praxis/README.md' }, 'gone-2': { path: 'dsh-praxis/no-such.md' } }
  const dir = mkdtempSync(join(tmpdir(), 'praxis-file-'))
  writeFileSync(join(dir, 'paper.pdf'), '%PDF-1.4')
  writeFileSync(join(dir, 'index.html'), '<p>kept page</p>')
  const listed = (id, version, file) => (id === 'praxis:a' && version === '20261109T000000Z' && ['paper.pdf', 'index.html'].includes(file) ? join(dir, file) : undefined)
  const handle = praxisFetch({ artifacts: { get: (id) => records[id], absolute: (p) => `${repo}/${p}` }, stock: { file: listed } }, 'test')
  const get = (query) => handle(new Request(`http://dsh/api/praxis.file?${query}`))
  const ok = await get('artifact=readme-1')
  assert.equal(ok.status, 200)
  assert.match(ok.headers.get('content-type'), /^text\/markdown/)
  assert.equal(ok.headers.get('content-security-policy'), 'sandbox')
  for (const bad of ['artifact=gone-2', 'artifact=nope', 'path=dsh-praxis/README.md', '']) assert.equal((await get(bad)).status, 404, bad)
  const pdf = await get('source=praxis:a&version=20261109T000000Z&file=paper.pdf')
  assert.deepEqual([pdf.status, pdf.headers.get('content-type'), pdf.headers.get('content-security-policy')], [200, 'application/pdf', null], 'a PDF is shown, not run')
  const page = await get('source=praxis:a&version=20261109T000000Z&file=index.html')
  assert.equal(page.headers.get('content-security-policy'), 'sandbox', 'a kept page never runs with the page origin')
  for (const bad of ['source=praxis:a&version=20261109T000000Z&file=../settings.json', 'source=praxis:b&version=20261109T000000Z&file=paper.pdf']) assert.equal((await get(bad)).status, 404, bad)
})

test('tool values are lossless JSON: absent fields omitted, non-JSON values refused', async () => {
  assert.deepEqual(jsonValue({ a: 1, b: undefined, c: [{ d: undefined, e: null }] }), { a: 1, c: [{ e: null }] })
  for (const bad of [{ n: NaN }, { f: () => 1 }, { d: new Date(0) }, [undefined]]) assert.throws(() => jsonValue(bad), /not/)
  // DSH's own check, on the real data: a value survives a JSON round trip unchanged, with no undefined anywhere.
  const praxis = createPraxis()
  const lossless = (v) => assert.deepStrictEqual(JSON.parse(JSON.stringify(v)), v)
  for (const name of ['praxis_upkeep', 'praxis_stale', 'praxis_entry', 'praxis_runs', 'praxis_artifacts', 'praxis_presets', 'praxis_packs']) lossless(await callTool(praxis, name, {}))
  // Every task type resolves, with whatever claim shapes the source packs use.
  for (const t of (await callTool(praxis, 'praxis_entry', {})).task_types) {
    for (const pipeline of t.pipelines) lossless(await callTool(praxis, 'praxis_resolve', { task_type: t.id, pipeline }))
  }
})

test('a capture request runs as a Host-created agent session; outside DSH the route says so', async () => {
  const data = mkdtempSync(join(tmpdir(), 'praxis-ask-'))
  const praxis = { where: { data }, materials: { roster: () => ({ list: [{ id: 'praxis:x', title: 'X', url: 'https://x.example', captured_for: { session: { host: 'dsh', id: 'S' } } }] }) } }
  const offline = praxisFetch(praxis, 'test', createAsks({}, praxis))
  assert.deepEqual(await (await offline(new Request('http://dsh/api/praxis.ask'))).json(), { available: false, asks: [] })
  assert.equal((await offline(new Request('http://dsh/api/praxis.ask', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"text":"https://x.example"}' }))).status, 501)

  const sent = []
  let idle
  const agent = { session: {}, followup: (m) => sent.push(m), whenIdle: () => new Promise((r) => { idle = r }) }
  const created = []
  const services = {
    sessionController: { create: async (r) => created.push(r), resolveAgent: async () => ({ agent }) },
    agents: { get: () => agent },
  }
  const asks = createAsks({ get: (name) => services[name] }, praxis)
  const ask = await asks.start('收这个 https://x.example 和 https://y.example')
  assert.deepEqual([ask.status, ask.urls, created[0].cwd], ['running', ['https://x.example', 'https://y.example'], data])
  assert.ok(Object.isFrozen(sent[0]) && sent[0].role === 'user')
  assert.match(sent[0].content[0].text, /praxis_capture/)
  assert.ok(sent[0].content[0].text.includes('<<<\n收这个 https://x.example'), 'the words go in as quoted data')
  idle(); await new Promise((r) => setTimeout(r, 0))
  services.sessionController.resolveAgent = async () => ({ agent })
  const [done] = asks.list()
  assert.equal(done.status, 'done')
  assert.deepEqual(done.captured, [], 'only sources captured in its own session count')
  await assert.rejects(asks.start('   '), /nothing to capture/)
  assert.match(askPrompt('a'), /打开原件读/)
})

test('a distill request runs as an agent session that saves through praxis_stock', async () => {
  const data = mkdtempSync(join(tmpdir(), 'praxis-distill-'))
  const versions = []
  const praxis = { where: { data }, materials: { roster: () => ({ list: [] }), source: (id) => (id === 'praxis:x' ? { id, title: 'X', url: 'https://x.example' } : undefined) }, stock: { list: () => versions } }
  const sent = []
  let idle
  const agent = { session: {}, followup: (m) => sent.push(m), whenIdle: () => new Promise((r) => { idle = r }) }
  const services = { sessionController: { create: async () => {}, resolveAgent: async () => ({ agent }) }, agents: { get: () => agent } }
  const asks = createAsks({ get: (name) => services[name] }, praxis)
  const handle = praxisFetch(praxis, 'test', asks)
  const ask = await (await handle(new Request('http://dsh/api/praxis.ask', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ distill: 'praxis:x' }) }))).json()
  assert.deepEqual([ask.kind, ask.source, ask.status, ask.distilled], ['distill', 'praxis:x', 'running', []])
  assert.match(sent[0].content[0].text, /praxis_source praxis:x/)
  assert.match(sent[0].content[0].text, /praxis_stock[\s\S]*distill/)
  assert.match(sent[0].content[0].text, /不改任何文件，也不跑命令/)
  versions.push({ kind: 'distill', version: '20991231T000000Z', at: new Date(Date.now() + 1000).toISOString() })
  idle(); await new Promise((r) => setTimeout(r, 0))
  assert.deepEqual([asks.list()[0].status, asks.list()[0].distilled], ['done', ['20991231T000000Z']])
  await assert.rejects(asks.distill('praxis:nope'), /unknown source/)
})
