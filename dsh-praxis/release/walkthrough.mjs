#!/usr/bin/env node
// Fresh-install walkthrough, the release regression: copy exactly the files `npm pack` would ship into
// an empty folder, give it an empty DSH home and an empty working folder, and drive it over MCP the way
// a fresh agent would: find the entry, take a task, register two sources (one a collection), relate
// them, register the folder as a project, deliver a draft and a page, record the run, then change the
// collection upstream and expect upkeep to propose the revision. Synthetic material only; nothing is
// written outside the scratch folder. Prints one JSON report and exits 1 when a check fails.
import { spawn, execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'

const PKG = join(dirname(fileURLToPath(import.meta.url)), '..')
const scratch = mkdtempSync(join(process.argv[2] ?? tmpdir(), 'praxis-walkthrough-'))
const [pkg, home, work] = ['package', 'dsh-home', 'work'].map((d) => join(scratch, d))
const checks = []
const check = (id, passed, observed) => checks.push({ id, passed: !!passed, observed })

// 1. Install: the shipped files only, no data folder.
const shipped = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--offline'], { cwd: PKG, encoding: 'utf8' }))[0].files.map((f) => f.path)
for (const rel of shipped) { mkdirSync(dirname(join(pkg, rel)), { recursive: true }); cpSync(join(PKG, rel), join(pkg, rel)) }
mkdirSync(home); mkdirSync(work)
check('install_has_no_data', !existsSync(join(pkg, 'data')) && shipped.some((f) => f.startsWith('kit/')), { files: shipped.length })
const outside = []
for (const rel of shipped.filter((f) => f.endsWith('.md'))) {
  for (const m of readFileSync(join(pkg, rel), 'utf8').matchAll(/\]\(([^)#\s]+)/g)) {
    if (/^[a-z]+:/.test(m[1])) continue
    if (!existsSync(join(pkg, dirname(rel), m[1]))) outside.push(`${rel} -> ${m[1]}`)
  }
}
check('shipped_links_resolve_inside', outside.length === 0, outside.slice(0, 10))

// A stand-in upstream: a gallery page that lists member pages.
let gallery = '<a href="/items/a.html">a</a><a href="/items/b.html">b</a>'
const upstream = createServer((req, res) => { res.setHeader('content-type', 'text/html'); res.end(req.url === '/' ? gallery : `<h1>${req.url}</h1>`) })
await new Promise((r) => upstream.listen(0, '127.0.0.1', r))
const origin = `http://127.0.0.1:${upstream.address().port}`

// 2. A fresh MCP server from the installed copy, in the empty working folder.
const env = { ...process.env, DSH_HOME: home, PRAXIS_DATA: '', NO_PROXY: '127.0.0.1,localhost', no_proxy: '127.0.0.1,localhost' }
delete env.PRAXIS_DATA
const server = spawn(process.execPath, [join(pkg, 'adapters/mcp.js')], { cwd: work, env, stdio: ['pipe', 'pipe', 'inherit'] })
const pending = new Map()
// A server that never starts or dies mid-run fails the walkthrough instead of leaving it waiting.
server.on('exit', (code) => { if (pending.size) { console.error(`MCP server exited (${code}) with ${pending.size} call(s) waiting`); process.exit(1) } })
createInterface({ input: server.stdout }).on('line', (line) => { const m = JSON.parse(line); pending.get(m.id)?.(m); pending.delete(m.id) })
let next = 1
const rpc = (method, params) => new Promise((resolve) => { const id = next++; pending.set(id, resolve); server.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n') })
const tool = async (name, args = {}) => {
  const m = await rpc('tools/call', { name, arguments: args })
  const value = JSON.parse(m.result.content[0].text)
  if (m.result.isError) throw new Error(`${name}: ${value.error}`)
  return value
}

try {
  const init = await rpc('initialize', { protocolVersion: '2025-06-18', clientInfo: { name: 'walkthrough' } })
  check('mcp_offers_tools_resources_prompts', ['tools', 'resources', 'prompts'].every((k) => init.result.capabilities[k]), Object.keys(init.result.capabilities))
  const resources = (await rpc('resources/list')).result.resources
  const entry = await tool('praxis_entry')
  check('entry_from_the_package_kit', entry.task_types.length > 0 && resources[0].uri === 'praxis://entry', { task_types: entry.task_types.length, resources: resources.length })
  const type = entry.task_types.find((t) => t.pipelines.includes('html')) ?? entry.task_types[0]
  const prompt = (await rpc('prompts/get', { name: type.id.replace('task/types/', ''), arguments: { brief: '给新同事讲清一个缓存系统' } })).result
  check('prompt_starts_the_task', /praxis_resolve/.test(prompt.messages[0].content.text), type.id)
  const before = await tool('praxis_resolve', { task_type: type.id, pipeline: 'html' })
  check('fresh_roster_is_empty', before.materials.length === 0 && before.units.length > 0, { units: before.units.length, materials: before.materials.length })

  // 3. Two sources: a collection and one of its members, filed and related to a unit the task reads.
  const unit = before.units.find((u) => u.id.startsWith('design')) ?? before.units[0]
  const area = (await tool('praxis_units')).filter((u) => u.path.endsWith('/README.md')).map((u) => u.id).find((id) => unit.id.startsWith(id))
  const [col, member] = await tool('praxis_capture', { task: '缓存系统讲解页的版式参考', sources: [
    { url: `${origin}/`, title: '版式作品集', summary: '一组长文页面作品。', read_scope: '看过列表页', limits: '只看列表', revisit_when: '每月', category: area, members: { pattern: `${origin}/items/*.html` } },
  ] }).then(async ([c]) => [c, (await tool('praxis_capture', { task: '缓存系统讲解页的版式参考', sources: [
    { url: `${origin}/items/a.html`, title: '作品 A', summary: '一页长文。', read_scope: '读过全文', limits: '单件作品', revisit_when: '改版时', member_of: c.id, excerpts: [{ locator: '标题区', claim: '大字号标题配窄栏正文。' }] },
  ] }))[0]])
  await tool('praxis_curate', { binding: `${member.id}@${unit.path}`, expected_revision: 0, description: '做长文页时打开，取标题区与窄栏的比例。' })
  const after = await tool('praxis_resolve', { task_type: type.id, pipeline: 'html' })
  const material = after.materials.find((m) => m.source === member.id)
  check('related_source_reaches_the_task_with_its_link', material?.url === `${origin}/items/a.html` && material.excerpts[0].locator === '标题区', material)
  check('roster_files_by_category', (await tool('praxis_search', { category: area })).some((s) => s.id === col.id), area)
  await tool('praxis_refresh', { source: col.id })

  // 4. Deliver into a project: draft and final in the template's places, recorded with what was read.
  const project = await tool('praxis_project', { expected_revision: 0, root: work, title: 'Cache explainer', purpose: '讲清缓存系统', template: 'standard' })
  mkdirSync(join(work, 'draft')); mkdirSync(join(work, 'out')); mkdirSync(join(work, 'build'))
  writeFileSync(join(work, 'draft/page.md'), '# 缓存\n\n读者要能说出三层缓存各自的失效条件。\n')
  writeFileSync(join(work, 'build/render.log'), 'render ok\n')
  writeFileSync(join(work, 'out/index.html'), '<!doctype html><title>缓存</title><h1>缓存</h1>')
  const run = await tool('praxis_consume', { title: '缓存讲解页', task_type: type.id, pipeline: 'html', units: after.units.map((u) => u.id), sources: [member.id],
    artifacts: [join(work, 'draft/page.md'), { path: join(work, 'out/index.html'), derived_from: [] }] })
  check('run_records_units_sources_and_session', run.units.length === after.units.length && run.sources[0].id === member.id && run.session?.host === 'mcp', { units: run.units.length, sources: run.sources, session: run.session?.host })
  const projects = await tool('praxis_projects', { path: work })
  check('finals_registered_and_in_place', projects[0]?.id === project.id && projects[0].artifacts === 2 && projects[0].unregistered.length === 0, projects[0] && { artifacts: projects[0].artifacts, unregistered: projects[0].unregistered })
  const arts = await tool('praxis_artifacts', { project: project.id })
  check('artifacts_carry_roles_without_signals', arts.every((a) => ['draft', 'final'].includes(a.role) && a.signals.length === 0), arts.map((a) => [a.project_path, a.role, a.signals]))

  // 5. Upstream moves: the collection adds a member and drops the one in the roster; upkeep proposes both.
  gallery = '<a href="/items/b.html">b</a><a href="/items/c.html">c</a>'
  await tool('praxis_refresh', { source: col.id })
  const up = await tool('praxis_upkeep')
  const c = up.collections.find((x) => x.id === col.id)
  check('upkeep_proposes_roster_revisions', c?.added.includes(`${origin}/items/c.html`) && c.gone.some((g) => g.id === member.id), c)

  // 6. Everything Praxis wrote is in the plugin's data folder; nothing in the package or elsewhere.
  const data = join(home, 'dsh-praxis')
  check('data_lives_in_the_plugin_folder', ['sources.json', 'bindings.json', 'projects.json', 'artifacts.json', 'checks.jsonl', 'history.jsonl'].every((f) => existsSync(join(data, f))) && existsSync(join(data, 'runs')), readdirSync(data))
  check('package_untouched', !existsSync(join(pkg, 'data')), null)
} catch (error) {
  check('walkthrough_completed', false, error.message)
} finally {
  server.kill()
  upstream.close()
}
const passed = checks.every((c) => c.passed)
console.log(JSON.stringify({ scratch, passed, checks }, null, 1))
process.exit(passed ? 0 : 1)
