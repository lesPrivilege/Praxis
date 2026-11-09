import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { createPraxis, ConflictError } from './index.js'
import { patchJson } from './store.js'
import { exportState, checkArchive, restoreState } from './backup.js'
import { jsonValue } from '../adapters/tools.js'
import { utimesSync, renameSync, unlinkSync } from 'node:fs'

// A package (Kit pages) and a data root whose base is the fixture, with a vault registry as a pack.
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'praxis-'))
  const put = (rel, text) => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), text) }
  put('pkg/kit/writing/README.md', '# Writing\n\n写作入口。\n')
  put('pkg/kit/writing/evidence.md', '# 证据与来源\n\n底线。\n')
  put('pkg/kit/writing/organization/mechanism.md', '# 机制讲解\n\n讲清机制。\n')
  put('pkg/kit/publish/README.md', '# Publish\n\n媒介。\n')
  put('pkg/kit/publish/html/README.md', '# html\n\n页面。\n')
  put('pkg/kit/publish/video/README.md', '# video\n\n成片。\n')
  put('pkg/kit/task/README.md', '# Task\n\n任务。\n')
  put('pkg/kit/task/types/explainer.md', [
    '# 技术说明', '', '讲清一个系统。', '',
    '| 项 | 内容 |', '|---|---|',
    '| 结果 | 能说出核心关系 |',
    '| 默认流水线 | html；另出 video |',
    '| Writing | [机制讲解](../../writing/organization/mechanism.md) |',
    '| Design | [控件](../../design/controls.md)；video 另加 [运动](../../design/motion.md) |',
    '| Publish | html：[html](../../publish/html/README.md)；video：[video](../../publish/video/README.md) |',
    '', '## 验收', '', '- 关系说得清。', '',
  ].join('\n'))
  put('pkg/kit/design/README.md', '# Design\n\n设计入口。\n')
  put('pkg/kit/design/foundations/grammar.md', '# 判断契约\n\n先定读者。\n')
  put('pkg/kit/design/controls.md', '# 控件\n\n语法 ID：`DWG-I-CONTROLS`\n\n控件语义。\n')
  put('pkg/kit/design/motion.md', '# 运动\n\n运动判断。\n')
  put('pkg/package.json', '{"version":"0.0.0"}')
  put('vault/provenance/demo/apg.md', '# APG\n')
  put(REGISTRY, JSON.stringify({ collections: [{ id: 'provenance-demo', path: 'vault/provenance/demo/catalog.json', purpose: '交互参考。' }], sources: [
    { id: SRC, collection: 'provenance-demo', title: 'APG Accordion', canonical_url: 'https://example.org/apg/', evidence_status: 'verified', summary: '分段披露的键盘约定。',
      purpose_tags: ['ARIA'], local_card: 'vault/provenance/demo/apg.md', limitations: ['未测实现。'], revisit_when: '修订时。', reference_priority: 'normal',
      grammar_paths: ['pkg/kit/design/controls.md'] },
  ] }, null, 1) + '\n')
  put('data/settings.json', '{"base": ".."}\n')
  return root
}

// With `project`, the fixture root is a project whose drafts are top-level .md files and finals .html or out/.
function setup({ project = false } = {}) {
  const root = fixture()
  const p = createPraxis({ data: join(root, 'data'), package: join(root, 'pkg') })
  p.materials.registerPack({ id: 'vault', format: 'registry', path: REGISTRY, root: '.', title: 'Vault', purpose: '测试来源包' })
  if (project) p.saveProject({ expected_revision: 0, root: '.', title: 'Fixture', purpose: '测试交付', layout: { draft: ['*.md'], final: ['*.html', 'out/**'] } })
  return { root, p }
}

const REGISTRY = 'vault/registry.json'
const SRC = 'provenance-demo:apg'
const BIND = `${SRC}@kit/design/controls.md`

test('stream: an authored page in the data root reads as a unit and resolves with what it draws on', () => {
  const { p } = setup()
  mkdirSync(join(p.where.data, 'streams'), { recursive: true })
  writeFileSync(join(p.where.data, 'streams', 'README.md'), '# Streams\n')
  writeFileSync(join(p.where.data, 'streams', 'visual.md'), '# 视觉语法\n\n成熟语法加少量陌生化。\n\n取用 `kit/design/motion.md` 与 `kit/nope.md`。\n')
  assert.deepEqual(p.entry().streams.map((s) => s.id), ['stream/visual'])
  const s = p.unit('stream/visual')
  assert.match(s.body, /陌生化/)
  assert.equal(s.description, '成熟语法加少量陌生化。')

  const before = p.resolve({ task_type: 'explainer' })
  assert.ok(!before.units.some((u) => u.id === 'stream/visual'), 'not read unless named')
  const r = p.resolve({ stream: 'visual' })
  assert.equal(r.stream.id, 'stream/visual')
  assert.ok(r.units.some((u) => u.id === 'design/motion'), 'draws on the Kit units it names')
  p.materials.curate(`${SRC}@${s.path}`, { description: '这条 stream 用它。' }, { expected_revision: 0 })
  assert.equal(p.resolve({ stream: 'visual' }).materials[0].binding, `${SRC}@${s.path}`, "the stream's own sources come first")

  assert.throws(() => p.resolve({ stream: 'nope' }), /unknown stream/)
  assert.throws(() => p.reviseUnit({ unit: 'stream/visual', body: '# x\n', reason: 'r', expected_revision: 0 }), /edited in place/)
})

test('resolve: resident units, then the type units for the chosen pipeline, then materials', () => {
  const { p } = setup()
  const html = p.resolve({ task_type: 'explainer' })
  const ids = html.units.map((u) => u.id)
  assert.equal(html.pipeline, 'html')
  assert.deepEqual(ids.slice(0, 4), ['writing', 'writing/evidence', 'design', 'design/foundations/grammar'])
  assert.ok(ids.includes('writing/organization/mechanism'))
  assert.ok(ids.includes('publish/html'))
  assert.ok(!ids.includes('design/motion'), 'video-only unit left out of html')
  assert.equal(html.materials[0].binding, BIND)
  const video = p.resolve({ task_type: 'explainer', pipeline: 'video' })
  assert.ok(video.units.some((u) => u.id === 'design/motion'))
  assert.throws(() => p.resolve({ task_type: 'nope' }), /unknown task type/)
})

test('units are found by id, path and grammar ID', () => {
  const { p } = setup()
  assert.equal(p.unit('DWG-I-CONTROLS').id, 'design/controls')
  assert.equal(p.unit('kit/design/controls.md#x').id, 'design/controls')
  assert.equal(p.unit('design/controls').description, '控件语义。')
})

test('curate: revisions advance and a stale expected_revision is refused', () => {
  const { p } = setup()
  const first = p.materials.curate(BIND, { favorite: true, description: '键盘与展开状态。' }, { expected_revision: 0, by: 'test' })
  assert.equal(first.binding.revision, 1)
  assert.equal(first.binding.favorite, true)
  assert.throws(() => p.materials.curate(BIND, { enabled: false }, { expected_revision: 0 }), ConflictError)
  const second = p.materials.curate(BIND, { enabled: false }, { expected_revision: 1 })
  assert.equal(second.binding.enabled, false)
  assert.equal(second.binding.description, '键盘与展开状态。', 'earlier curation kept')
  assert.equal(p.resolve({ task_type: 'explainer' }).materials.length, 0, 'disabled binding not offered')
  assert.throws(() => p.materials.curate(BIND, { state: 'removed' }), /not curatable/)
  const revisions = p.history({ id: BIND }).map((h) => [h.revision, h.set.description, h.set.enabled])
  assert.deepEqual(revisions, [[2, undefined, false], [1, '键盘与展开状态。', undefined]], 'each revision keeps the values it set')
})

test('curate on a new target makes the relation in the roster; the pack is never written', () => {
  const { root, p } = setup()
  const before = readFileSync(join(root, REGISTRY), 'utf8')
  p.materials.curate(`${SRC}@kit/design/motion.md`, { usage: { problem: '折叠动效', how: '对照展开状态' } }, { by: 'test' })
  assert.deepEqual(p.materials.listBindings({ source: SRC }).map((b) => [b.target, b.declared]), [['kit/design/controls.md', true], ['kit/design/motion.md', false]])
  assert.equal(readFileSync(join(root, REGISTRY), 'utf8'), before)
  assert.equal(p.materials.binding(`${SRC}@pkg/kit/design/motion.md`).target, 'kit/design/motion.md', 'a base path to a Kit page names the same binding')
  assert.throws(() => p.materials.curate(`${SRC}@kit/design/missing.md`, {}), /does not exist/)
})

test('remove and restore keep curation and history', () => {
  const { p } = setup()
  p.materials.curate(BIND, { favorite: true })
  const removed = p.materials.remove(BIND, { by: 'test' })
  assert.equal(removed.state, 'removed')
  assert.equal(p.materials.listBindings().length, 0)
  assert.equal(p.materials.listBindings({ includeRemoved: true }).length, 1)
  const back = p.materials.restore(BIND, { by: 'test' })
  assert.equal(back.state, 'active')
  assert.equal(back.favorite, true)
  assert.deepEqual(p.history().map((h) => h.op).slice(0, 3), ['restore', 'remove', 'curate'])
})

test('review records the reviewed revision', () => {
  const { p } = setup()
  p.materials.curate(BIND, { description: '新说明。' })
  const b = p.materials.review(BIND, { verdict: 'accurate', by: 'agent', note: 'ok' })
  assert.equal(b.review.revision, 1)
  assert.throws(() => p.materials.review(BIND, { verdict: 'fine' }), /verdict/)
})

test('capture: a batch is checked whole, written once, deduped by URL, and says what it was collected for', () => {
  const { p } = setup()
  const item = (url, title) => ({ url, title, form: 'practice', description: '做交互说明时打开；取键盘约定。', summary: '一份指南。', read_scope: '读了正文', limits: '未运行示例。', revisit_when: '改版时。', tags: ['GUIDE'] })
  assert.throws(() => p.materials.capture([item('https://example.org/a', 'A')]), /needs task/)
  assert.throws(() => p.materials.capture([{ ...item(undefined, 'Notes'), locator: 'work/notes.md' }], { task: '调研' }), /http\(s\) url; local work is recorded as an artifact/)
  assert.throws(() => p.materials.capture([{ ...item('https://example.org/a', 'A'), form: 'blog' }], { task: '调研' }), /form must be/)
  assert.throws(() => p.materials.capture([item('https://example.org/a', 'A'), { url: 'https://x.org' }], { task: '调研' }), /needs title/)
  assert.throws(() => p.materials.capture([{ ...item('https://example.org/a', 'A'), category: 'nowhere' }], { task: '调研' }), /category must be a Kit area/)
  assert.deepEqual(p.materials.own.all(), {}, 'a refused batch writes nothing')
  const made = p.materials.capture([
    item('https://example.org/new-guide?utm_source=x', 'New Guide'),
    item('https://example.org/new-guide', 'Same Guide'),
    item('https://example.org/apg', 'APG again'),
    { ...item('https://example.org/other', 'Other Guide'), category: 'design' },
  ], { task: '技术说明页的交互调研', by: 'test' })
  assert.deepEqual(made.map((m) => [m.id, m.existing]), [
    ['praxis:new-guide', false], ['praxis:new-guide', true], [SRC, true], ['praxis:other-guide', false]])
  assert.equal(p.source('praxis:other-guide').captured_for.task, '技术说明页的交互调研')
  assert.deepEqual(p.materials.search({ category: 'design' }).map((s) => s.id).sort(), ['praxis:other-guide', SRC], 'filed by category, or by the page a binding serves')
  assert.deepEqual(p.upkeep().unfiled.map((s) => s.id), ['praxis:new-guide'], 'a source with neither a Kit area nor a page cannot be placed')
})

test('consume records versions; stale finds runs whose units or bindings changed', () => {
  const { root, p } = setup()
  const run = p.consume({ title: '讲解页', task_type: 'explainer', units: ['writing/organization/mechanism', 'design/controls'], sources: [SRC, SRC], by: 'test' })
  assert.equal(p.runs()[0].id, run.id)
  assert.deepEqual([run.sources.map((s) => s.id), run.bindings.map((b) => b.id)], [[SRC], [BIND]], 'the binding joining a read source to a read unit is recorded')
  assert.deepEqual(p.stale(), [])
  writeFileSync(join(root, 'pkg/kit/writing/organization/mechanism.md'), '# 机制讲解\n\n改过了。\n')
  p.materials.curate(BIND, { favorite: true })
  const [stale] = p.stale()
  assert.deepEqual(stale.units, ['writing/organization/mechanism'])
  assert.deepEqual(stale.bindings, [BIND])
  assert.throws(() => p.consume({ title: 'x', sources: ['no:such'] }), /unknown source/)
})

test('stale finds runs whose consumed source got a new snapshot', async () => {
  const { p } = setup()
  let body = 'v1'
  const fetchImpl = async () => new Response(body, { headers: { 'content-type': 'text/plain' } })
  await p.materials.refresh(SRC, { fetchImpl })
  const run = p.consume({ title: '只用来源', sources: [SRC] })
  assert.deepEqual(p.stale(), [])
  body = 'v2'
  await p.materials.refresh(SRC, { fetchImpl })
  assert.deepEqual(p.stale().map((r) => [r.run, r.sources]), [[run.id, [SRC]]])
  assert.equal(p.stale()[0].run, run.id)
  assert.equal(p.upkeep().stale, undefined, 'a stale run waits for the next delivery, not in upkeep')
})

test('refresh checks upstream by hash without storing content; keep saves a snapshot; a dead link is a signal', async () => {
  const { root, p } = setup()
  let body = '<html>v1</html>'
  let up = true
  let blocked = false
  const fetchImpl = async () => (blocked ? new Response('no', { status: 403 }) : up ? new Response(body, { headers: { 'content-type': 'text/html' } }) : new Response('gone', { status: 404 }))
  const first = await p.materials.refresh(SRC, { fetchImpl, by: 'test' })
  assert.deepEqual([first.reachable, first.changed, first.snapshot, first.check.status], [true, false, undefined, 'ok'], 'the first check is the baseline')
  assert.equal(existsSync(join(root, 'data/snapshots')), false, 'no content stored')
  body = '<html>v2</html>'
  const second = await p.materials.refresh(SRC, { fetchImpl })
  assert.deepEqual([second.changed, second.bindings], [true, [BIND]])
  assert.deepEqual(p.materials.binding(BIND).signals, ['changed'])
  const kept = await p.materials.refresh(SRC, { fetchImpl, keep: true })
  assert.ok(existsSync(join(root, kept.snapshot.path)))
  assert.ok(kept.snapshot.path.startsWith('data/snapshots/apg/'), 'kept snapshots live under the snapshots folder')
  assert.deepEqual(readFileSync(join(root, kept.snapshot.path), 'utf8'), '<html>v2</html>')
  assert.equal(p.materials.source(SRC).snapshot.sha256, kept.check.sha256)
  assert.equal((await p.materials.refresh(SRC, { fetchImpl, keep: true })).snapshot, undefined, 'the same bytes are not kept twice')
  blocked = true
  assert.equal((await p.materials.refresh(SRC, { fetchImpl })).reachable, false)
  assert.deepEqual(p.materials.binding(BIND).signals, ['changed'], 'a refusal is not a dead link')
  blocked = false
  up = false
  const dead = await p.materials.refresh(SRC, { fetchImpl })
  assert.deepEqual([dead.reachable, dead.check.error], [false, 'HTTP 404'])
  assert.deepEqual(p.materials.binding(BIND).signals, ['changed', 'unreachable'])
  up = true
  await p.materials.refresh(SRC, { fetchImpl })
  assert.deepEqual(p.materials.binding(BIND).signals, ['changed'], 'a link that answers again is no longer flagged')
})

test('an HTML page is compared by its text: markup that changes per load is not a change', async () => {
  const { root, p } = setup()
  const page = (nonce, text) => `<html><head><script nonce="${nonce}">var t=${nonce}</script><style>.a{}</style></head><body><!-- ${nonce} --><p data-n="${nonce}">${text}</p></body></html>`
  let body = page(1, '正文')
  const fetchImpl = async () => new Response(body, { headers: { 'content-type': 'text/html; charset=utf-8' } })
  // An older check of the same page that recorded only the bytes has no basis to compare against.
  writeFileSync(join(root, 'data/checks.jsonl'), JSON.stringify({ source: SRC, at: '2026-01-01T00:00:00.000Z', status: 'ok', http: 200, sha256: 'old-bytes', content_type: 'text/html' }) + '\n')
  const first = await p.materials.refresh(SRC, { fetchImpl })
  assert.equal(first.changed, false, 'a check that recorded only bytes is not compared')
  body = page(2, '正文')
  const second = await p.materials.refresh(SRC, { fetchImpl })
  assert.notEqual(second.check.sha256, first.check.sha256)
  assert.deepEqual([second.changed, p.materials.binding(BIND).signals], [false, []])
  body = page(3, '改过的正文')
  assert.equal((await p.materials.refresh(SRC, { fetchImpl })).changed, true)
  assert.deepEqual(p.materials.binding(BIND).signals, ['changed'])
})

test('upkeep lists only signals: needs-work, changed sources, stale runs, unfiled sources, catalog entries no binding shows', async () => {
  const { p } = setup()
  const signals = () => p.materials.binding(BIND).signals
  assert.deepEqual(signals(), [])
  assert.deepEqual(p.upkeep().bindings, [])
  p.materials.review(BIND, { verdict: 'accurate', by: 'test' })
  let body = 'v1'
  const fetchImpl = async () => new Response(body, { headers: { 'content-type': 'text/html' } })
  await p.materials.refresh(SRC, { fetchImpl })
  body = 'v2'
  await p.materials.refresh(SRC, { fetchImpl })
  assert.deepEqual(signals(), ['changed'])
  p.materials.review(BIND, { verdict: 'needs-work', by: 'test' })
  assert.deepEqual(signals(), ['needs_work'])
  const [fresh] = p.materials.capture([{ url: 'https://example.org/new', title: '新来源', form: 'article', description: '查做法时打开；取步骤。', summary: '概要', read_scope: '读过', limits: '边界', revisit_when: '修订时' }], { task: '测试', by: 'test' })
  p.materials.file(SRC, { form: 'standard', description: '写控件时打开；取键盘约定。' }, { expected_revision: 0, by: 'test' })
  // The binding showed the summary when it was judged; filing a description replaced that text, so the verdict lapses.
  assert.equal(p.materials.binding(BIND).review.current, false)
  assert.ok(!signals().includes('needs_work'), 'a verdict on a description that has since changed is not a signal')
  p.materials.review(BIND, { verdict: 'needs-work', by: 'test' })
  p.materials.reviewEntry(SRC, { verdict: 'needs-work', by: 'test' })
  p.materials.reviewEntry(fresh.id, { verdict: 'needs-work', by: 'test' })
  const up = p.upkeep()
  assert.deepEqual(up.bindings.map((b) => [b.id, b.unit, b.signals]), [[BIND, 'design/controls', ['needs_work']]])
  assert.deepEqual(up.unfiled.map((s) => s.title), ['新来源'])
  assert.deepEqual(up.sources.map((s) => [s.id, s.signals]), [[fresh.id, ['needs_work']], [SRC, ['needs_work']]], 'an entry review is its own; a change shows once')
})

test('presets: validated per pipeline, one default, recorded by runs', () => {
  const { p } = setup()
  assert.throws(() => p.savePreset({ pipeline: 'video', title: '旁白', values: { tts_voice: 'x' } }), /tts_provider is required/)
  assert.throws(() => p.savePreset({ pipeline: 'video', title: '旁白', values: { tts_provider: 'mimo', tts_voice: 'x', api_key_env: 'sk-abcdefghijklmnopqr' } }), /secret|environment variable/)
  assert.throws(() => p.savePreset({ pipeline: 'audio', title: 'x' }), /pipeline must be/)
  const a = p.savePreset({ pipeline: 'video', title: 'Narration zh', values: { tts_provider: 'mimo', tts_voice: 'default_zh', aspect: ['16:9'], api_key_env: 'MIMO_API_KEY' }, default: true, by: 'test' })
  assert.equal(a.id, 'video/narration-zh')
  const b = p.savePreset({ pipeline: 'video', title: 'Narration en', values: { tts_provider: 'seed', tts_voice: 'en_f' }, default: true })
  assert.equal(p.preset(a.id).default, false, 'only one default per pipeline')
  assert.equal(p.resolve({ task_type: 'explainer', pipeline: 'video' }).preset.id, b.id)
  assert.throws(() => p.savePreset({ id: b.id, expected_revision: 0, title: 'x' }), ConflictError)
  const run = p.consume({ title: '成片', preset: b.id, overrides: { tts_rate: 1.1 } })
  assert.equal(run.preset.revision, 1)
  p.savePreset({ id: b.id, expected_revision: 1, values: { tts_provider: 'seed', tts_voice: 'en_m' } })
  assert.equal(p.stale()[0].preset, b.id)
  p.removePreset({ id: a.id })
  assert.equal(p.presets({ pipeline: 'video' }).length, 1)
})

test('a refused preset save changes no preset', () => {
  const { p } = setup()
  const a = p.savePreset({ pipeline: 'html', title: 'A', default: true })
  const b = p.savePreset({ pipeline: 'html', title: 'B' })
  p.savePreset({ id: b.id, expected_revision: b.revision, description: '改过' })
  const before = p.presets()
  assert.throws(() => p.savePreset({ id: b.id, expected_revision: b.revision, default: true }), ConflictError)
  assert.deepEqual(p.presets(), before)
  p.savePreset({ id: b.id, expected_revision: b.revision + 1, default: true })
  assert.deepEqual(p.presets().filter((x) => x.default).map((x) => x.id), [b.id])
  assert.equal(p.preset(a.id).default, false)
})

test('export, check and restore the control plane state', () => {
  const { root, p } = setup()
  p.materials.curate(BIND, { favorite: true, description: '导出前。' })
  const MOVED = `${SRC}@kit/design/motion.md`
  p.materials.curate(MOVED, { description: '新挂载。' })
  p.materials.remove(BIND)
  const archive = join(root, 'state.tar.gz')
  const out = exportState(p.where, archive)
  assert.ok(out.files >= 2)
  assert.equal(checkArchive(archive).ok, true)
  p.materials.restore(BIND)
  p.materials.curate(BIND, { description: '导出后改过。' })
  p.materials.remove(MOVED)
  const blocked = restoreState(p.where, archive)
  assert.equal(blocked.restored, 0)
  assert.ok(blocked.conflicts.includes('data/bindings.json'))
  restoreState(p.where, archive, { force: true })
  assert.equal(p.materials.binding(BIND).description, '导出前。')
  assert.deepEqual(p.materials.listBindings().map((b) => b.id), [MOVED], 'added and removed relations come back as exported')
})

test('artifacts: consume registers files; same bytes dedupe, new bytes are a new version', () => {
  const { root, p } = setup({ project: true })
  writeFileSync(join(root, 'brief.md'), '# v1\n')
  writeFileSync(join(root, 'page.html'), '<p>v1</p>')
  const first = p.consume({ title: '底稿与页面', artifacts: ['brief.md', { path: 'page.html', title: '讲解页', derived_from: [] }], by: 'agent' })
  const [md, html] = first.artifacts
  assert.deepEqual([md.version, html.version], [1, 1])
  assert.equal(p.artifact(html.artifact).title, '讲解页')
  const retry = p.consume({ title: '重试', artifacts: ['brief.md'] })
  assert.equal(retry.artifacts[0].artifact, md.artifact, 'a retry finds the same artifact')
  assert.equal(p.artifact(md.artifact).versions.length, 1, 'and adds no version')
  writeFileSync(join(root, 'page.html'), '<p>v2</p>')
  const second = p.consume({ title: '修订', artifacts: [{ path: 'page.html', derived_from: [md.artifact] }] })
  const detail = p.artifact(html.artifact)
  assert.equal(second.artifacts[0].version, 2)
  assert.deepEqual(detail.versions.map((v) => [v.version, v.run.id]), [[1, first.id], [2, second.id]])
  assert.deepEqual(detail.versions[1].derived_from, [{ artifact: md.artifact, version: 1 }])
  assert.equal(p.artifactList().length, 2)
  assert.throws(() => p.consume({ title: '缺文件', artifacts: ['nope.md'] }), /not found/)
  assert.equal(p.runs().length, 3, 'a refused consume writes no run')
})

test('artifacts: reviews bind to a version; status and signals follow the file and its basis', () => {
  const { root, p } = setup({ project: true })
  writeFileSync(join(root, 'page.html'), '<p>v1</p>')
  const run = p.consume({ title: '页面', units: ['writing/organization/mechanism'], artifacts: ['page.html'] })
  const id = run.artifacts[0].artifact
  p.reviewArtifact({ id, version: 1, verdict: 'needs-work', note: '图注太长', by: 'owner' })
  assert.deepEqual(p.artifactList()[0].signals, ['needs_work'])
  assert.throws(() => p.reviewArtifact({ id, version: 2, verdict: 'accepted' }), /no version 2/)
  writeFileSync(join(root, 'page.html'), '<p>v2</p>')
  assert.deepEqual([p.artifactList()[0].status, p.artifactList()[0].signals], ['modified', ['needs_work']], 'later edits are status, not a signal')
  p.consume({ title: '改', artifacts: ['page.html'] })
  const now = p.artifactList()[0]
  assert.deepEqual([now.version, now.status, now.review, now.signals], [2, 'current', null, []], 'v2 does not inherit the v1 verdict')
  p.reviewArtifact({ id, version: 2, verdict: 'accepted', by: 'owner' })
  assert.deepEqual(p.artifact(id).versions.map((v) => v.review?.verdict ?? null), [null, 'accepted'], 'only the latest review is kept')
  writeFileSync(join(root, 'pkg/kit/writing/organization/mechanism.md'), '# 机制讲解\n\n改过了。\n')
  assert.equal(p.artifactList()[0].basis_changed, false, 'the latest run did not use the changed unit')
  const old = p.artifact(id).versions[0].run
  assert.deepEqual(old.changed.units, ['writing/organization/mechanism'], 'v1 shows its basis changed')
  unlinkSync(join(root, 'page.html'))
  assert.deepEqual(p.upkeep().artifacts.map((a) => [a.id, a.signals]), [[id, ['missing']]])
})

test('artifacts: moving a file keeps identity only when the bytes are the latest version', () => {
  const { root, p } = setup({ project: true })
  writeFileSync(join(root, 'page.html'), '<p>v1</p>')
  const id = p.consume({ title: '页面', artifacts: ['page.html'] }).artifacts[0].artifact
  mkdirSync(join(root, 'out'))
  renameSync(join(root, 'page.html'), join(root, 'out/page.html'))
  assert.equal(p.artifactList()[0].status, 'missing')
  writeFileSync(join(root, 'other.html'), '<p>other</p>')
  const rev = p.artifact(id).revision
  assert.throws(() => p.updateArtifact({ id, expected_revision: rev, path: 'other.html' }), /not version 1/)
  const moved = p.updateArtifact({ id, expected_revision: rev, path: join(root, 'out/page.html') })
  assert.deepEqual([moved.path, moved.status, moved.version], ['out/page.html', 'current', 1], 'repo files are stored repo-relative')
  assert.throws(() => p.updateArtifact({ id, expected_revision: rev, title: 'x' }), ConflictError)
  writeFileSync(join(root, 'out/page.html'), '<p>v2</p>')
  utimesSync(join(root, 'out/page.html'), new Date(), new Date())
  assert.equal(p.consume({ title: '改', artifacts: [{ path: 'out/page.html', artifact: id }] }).artifacts[0].version, 2)
  const removed = p.updateArtifact({ id, state: 'removed' })
  assert.equal(p.artifactList().length, 0)
  assert.equal(p.artifactList({ include_removed: true }).length, 1)
  // Writes report through the same lossless boundary as reads; a refusal there would follow a committed write.
  for (const v of [removed, p.reviewArtifact({ id, version: 2, verdict: 'checked' }), p.consume({ title: '无预设', artifacts: ['out/page.html'] }), p.artifact(id), p.upkeep(), p.entry()]) jsonValue(v)
})

test('resolve hands over the way to the original; source shows why it is here, where it serves and who read it', () => {
  const { root, p } = setup({ project: true })
  const registry = JSON.parse(readFileSync(join(root, REGISTRY), 'utf8'))
  registry.sources[0].supported_claims = [{ claim_id: 'C1', locator: 'Keyboard Interaction', claim: 'Enter 与 Space 切换展开。' }, { claim_id: 'C2', locator: 'Roles', claim_zh: '中文字段名的说法。' }, '只有一句话的说法']
  writeFileSync(join(root, REGISTRY), JSON.stringify(registry))
  const [m] = p.resolve({ task_type: 'explainer' }).materials
  assert.deepEqual([m.source, m.url, m.evidence_status, m.excerpts], [SRC, 'https://example.org/apg/', 'verified',
    [{ locator: 'Keyboard Interaction', claim: 'Enter 与 Space 切换展开。' }, { locator: 'Roles', claim: '中文字段名的说法。' }, { claim: '只有一句话的说法' }]], 'every claim shape catalogs use comes through')
  writeFileSync(join(root, 'page.html'), '<p>v1</p>')
  const run = p.consume({ title: '讲解页', units: ['design/controls'], sources: [m.source], artifacts: ['page.html'] })
  const s = p.source(SRC)
  assert.deepEqual(s.relations.map((r) => r.unit), ['design/controls'])
  assert.deepEqual(s.serves.map((t) => t.id), ['task/types/explainer'])
  assert.deepEqual(s.used_by.map((r) => [r.id, r.artifacts.map((a) => a.artifact)]), [[run.id, [run.artifacts[0].artifact]]])
  assert.deepEqual(p.artifact(run.artifacts[0].artifact).versions[0].run.sources, [{ id: SRC, title: 'APG Accordion' }])
  assert.deepEqual([s.card, s.collection.purpose], ['vault/provenance/demo/apg.md', '交互参考。'])
  // A pipeline is a pipeline artifact that serves a page; an artifact names the one that made it, and resolve offers it after the web sources.
  writeFileSync(join(root, 'build.md'), '# 短片管线\n\n念白、合成、逐帧渲染。\n')
  const [pipe] = p.consume({ title: '登记管线', artifacts: [{ path: 'build.md', kind: 'pipeline', title: '短片管线', serves: [{ target: 'kit/design/controls.md', description: '要再做一条短片时对照；看合成与渲染步骤。' }] }] }).artifacts
  writeFileSync(join(root, 'cut.html'), '<p>cut</p>')
  assert.throws(() => p.consume({ title: '成片', artifacts: [{ path: 'cut.html', made_with: run.artifacts[0].artifact }] }), /not a pipeline artifact/)
  const made = p.consume({ title: '成片', artifacts: [{ path: 'cut.html', made_with: pipe.artifact }] })
  assert.deepEqual(p.artifact(made.artifacts[0].artifact).versions[0].made_with, { id: pipe.artifact, title: '短片管线' })
  const offered = p.resolve({ task_type: 'explainer' })
  assert.deepEqual([offered.materials[0].source, offered.exemplars.map((x) => [x.artifact, x.kind, x.page, x.description])],
    [SRC, [[pipe.artifact, 'pipeline', 'kit/design/controls.md', '要再做一条短片时对照；看合成与渲染步骤。']]], 'web sources first, then exemplars')
})

test('a project source index is registered by reference as a pack, related in the roster, and read like any source', () => {
  const { root, p } = setup()
  mkdirSync(join(root, 'proj/research'), { recursive: true })
  const index = { as_of: '2026-10-23', sources: [
    { id: 'A-01', title: 'Vendor docs', canonical_url: 'https://vendor.example/docs', notes: '官方文档。', access: 'read-full' },
    { id: 'A-02', title: 'Blog post', canonical_url: 'https://vendor.example/blog', notes: '', access: 'blocked' },
  ] }
  writeFileSync(join(root, 'proj/research/sources.json'), JSON.stringify(index))
  writeFileSync(join(root, 'proj/research/claims.jsonl'), JSON.stringify({ id: 'C-1', source_id: 'A-01', locator: 'Pricing', claim: '按 token 计价。' }) + '\n')
  const reg = { id: 'proj-research', path: 'proj/research/sources.json', list: 'sources', title: 'Proj 研究登记', purpose: '为 Proj 专章核对事实', limits: '摘要式抓取', revisit_when: '新版本时',
    fields: { id: 'id', title: 'title', url: 'canonical_url', summary: 'notes', status: 'access' }, status: { 'read-full': 'verified', blocked: 'unavailable' },
    excerpts: { path: 'proj/research/claims.jsonl', id: 'id', source: 'source_id', locator: 'locator', claim: 'claim' } }
  assert.throws(() => p.materials.registerPack({ ...reg, status: { 'read-full': 'verified' } }), /blocked needs a mapping/)
  assert.throws(() => p.materials.registerPack({ ...reg, fields: { ...reg.fields, author: 'x' } }), /unknown author/)
  assert.deepEqual(p.materials.registerPack(reg, { by: 'test' }), { id: 'proj-research', path: reg.path, format: 'index', created: true, sources: 2 })
  const s = p.source('proj-research:A-01')
  assert.deepEqual([s.url, s.evidence_status, s.excerpts.map((e) => e.claim), s.collection.purpose], ['https://vendor.example/docs', 'verified', ['按 token 计价。'], '为 Proj 专章核对事实'])
  p.materials.curate('proj-research:A-01@kit/design/controls.md', { description: '控件页取它的计价说法' }, { expected_revision: 0 })
  assert.deepEqual(JSON.parse(readFileSync(join(root, 'proj/research/sources.json'), 'utf8')), index, 'the project file is not touched')
  p.materials.registerPack({ ...reg, title: '改名' })
  assert.deepEqual(p.materials.listBindings({ source: 'proj-research:A-01' }).map((b) => b.description), ['控件页取它的计价说法'], 'registering again keeps relations')
  assert.ok(p.resolve({ task_type: 'explainer' }).materials.some((m) => m.source === 'proj-research:A-01'))
})

test('projects: evidence is allowed and tmp ignored; layouts without those roles are filled from the template', () => {
  const { root, p } = setup()
  for (const d of ['evidence', 'tmp', 'out']) mkdirSync(join(root, 'work/ev', d), { recursive: true })
  writeFileSync(join(root, 'work/ev/evidence/receipt.md'), '# 回执\n')
  writeFileSync(join(root, 'work/ev/tmp/scratch.txt'), 'x')
  writeFileSync(join(root, 'work/ev/out/a.html'), '<p>a</p>')
  const ev = p.saveProject({ expected_revision: 0, root: 'work/ev', title: 'Ev', purpose: '回执测试', layout: { final: ['out/*.html'] } })
  assert.deepEqual([ev.layout.evidence, ev.layout.tmp, ev.unregistered], [['evidence/**'], ['tmp/**'], ['out/a.html']], 'evidence files are never unregistered finals')
  assert.throws(() => p.saveProject({ id: 'ev', expected_revision: ev.revision, layout: { scratch: ['x/**'] } }), /layout role must be/)
  const run = p.consume({ title: '回执', artifacts: ['work/ev/evidence/receipt.md', 'work/ev/out/a.html'] })
  assert.equal(run.artifacts.length, 2)
  const roles = Object.fromEntries(p.artifactList({ project: 'ev' }).map((a) => [a.project_path, [a.role, a.signals]]))
  assert.deepEqual(roles, { 'evidence/receipt.md': ['evidence', []], 'out/a.html': ['final', []] })
  assert.equal(p.projects.role(p.projects.get('ev'), 'tmp/scratch.txt'), 'tmp')
  // a project registered before these roles existed gains them on its next save
  const old = p.projects.store.update('ev', ev.revision, (cur) => ({ ...cur, layout: { draft: ['draft/**'], build: ['build/**'], final: ['out/*.html'] } }), { op: 'project' })
  const again = p.saveProject({ id: 'ev', expected_revision: old.revision, title: 'Ev 2' })
  assert.deepEqual([again.layout.evidence, again.layout.final], [['evidence/**'], ['out/*.html']])
})

test('projects: deliverables live in a registered project; the layout says where drafts and finals go', () => {
  const { root, p } = setup()
  mkdirSync(join(root, 'work/series/out'), { recursive: true })
  mkdirSync(join(root, 'work/series/draft'), { recursive: true })
  writeFileSync(join(root, 'work/series/draft/ep01.md'), '# 第一集\n')
  writeFileSync(join(root, 'work/series/out/ep01.mp4'), 'video')
  writeFileSync(join(root, 'work/series/out/ep02.mp4'), 'video')
  writeFileSync(join(root, 'work/series/out/ep01.mix.wav'), 'audio')
  writeFileSync(join(root, 'work/series/out/README.md'), '# out\n')
  writeFileSync(join(root, 'work/series/notes.txt'), '随手记')
  assert.throws(() => p.consume({ title: '交付', artifacts: ['work/series/out/ep01.mp4'] }), /not inside a registered project/)
  assert.throws(() => p.saveProject({ expected_revision: 0, root: 'work/none', title: '无', purpose: 'x' }), /not a directory/)
  assert.throws(() => p.saveProject({ expected_revision: 0, root: 'work/series', title: 'Series', purpose: 'x', layout: { final: ['../out/**'] } }), /relative to the root/)
  const series = p.saveProject({ expected_revision: 0, root: 'work/series', title: 'Series', purpose: '讲解视频系列', layout: { final: ['out/*.mp4'], build: ['out/*.wav', 'build/**'] } })
  assert.deepEqual([series.id, series.layout.draft, series.unregistered], ['series', ['draft/**'], ['out/ep01.mp4', 'out/ep02.mp4']], 'template fills roles not given; README and intermediates are not finals')
  p.saveProject({ expected_revision: 0, root: 'work', title: 'Work', purpose: '外层' })
  assert.throws(() => p.saveProject({ expected_revision: 0, root: 'work/series', title: 'Again', purpose: 'x' }), /already has this root/)
  const run = p.consume({ title: '第一集', artifacts: ['work/series/draft/ep01.md', 'work/series/out/ep01.mp4', 'work/series/notes.txt'] })
  assert.deepEqual(run.artifacts.map((a) => a.project), ['series', 'series', 'series'], 'the deepest project holds the file')
  const byPath = Object.fromEntries(p.artifactList({ project: 'series' }).map((a) => [a.project_path, [a.role ?? null, a.signals]]))
  assert.deepEqual(byPath, { 'draft/ep01.md': ['draft', []], 'out/ep01.mp4': ['final', []], 'notes.txt': [null, ['misplaced']] })
  const up = p.upkeep()
  assert.deepEqual(p.projectList().filter((x) => x.unregistered.length).map((x) => [x.id, x.unregistered]), [['series', ['out/ep02.mp4']]])
  assert.equal(up.projects, undefined, 'unregistered finals show on the project, not in upkeep')
  assert.deepEqual(up.artifacts.map((a) => a.project_path), ['notes.txt'])
  assert.deepEqual(p.projectList({ path: 'work/series/out/ep01.mp4' }).map((x) => x.id), ['series'])
  p.saveProject({ id: 'series', expected_revision: series.revision, layout: { final: ['out/*.mp4', '*.txt'] } })
  assert.deepEqual(p.upkeep().artifacts, [], 'widening the layout resolves the misplaced file; nothing was moved')
  assert.ok(existsSync(join(root, 'work/series/notes.txt')))
})

test('a collection follows its upstream: new member links are proposed once, members gone upstream are flagged', async () => {
  const { p } = setup()
  let page = '<a href="items/a.html">a</a> <a href="items/b.html">b</a> <a href="/about">about</a>'
  const fetchImpl = async () => new Response(page, { headers: { 'content-type': 'text/html' } })
  const item = { url: 'https://gallery.example/', title: '作品集', form: 'case-library', description: '找版式样例时打开；取成页的版式。', summary: '一组页面作品。', read_scope: '看过首页', limits: '只看列表', revisit_when: '每月' }
  const [c] = p.materials.capture([{ ...item, members: { pattern: 'https://gallery.example/items/*.html' } }], { task: '找版式样例', by: 'test' })
  const [a] = p.materials.capture([{ url: 'https://gallery.example/items/a.html', title: 'A', form: 'case', description: '看长文版式时打开。', summary: '一页。', read_scope: '读过', limits: '无', revisit_when: '改版时', member_of: c.id }], { task: '找版式样例' })
  assert.throws(() => p.materials.capture([{ ...item, url: 'https://x.example/', member_of: a.id }], { task: 't' }), /not a collection/)
  const first = await p.materials.refresh(c.id, { fetchImpl })
  assert.deepEqual([first.members.upstream, first.members.added, first.members.gone], [2, [], []], 'the first check is the baseline')
  page = '<a href="items/b.html">b</a> <a href="items/c.html">c</a> <a href="items/d.html">d</a>'
  await p.materials.refresh(c.id, { fetchImpl })
  const m = p.materials.members(c.id)
  assert.deepEqual([m.added, m.gone.map((g) => g.id)], [['https://gallery.example/items/c.html', 'https://gallery.example/items/d.html'], [a.id]])
  assert.deepEqual(p.upkeep().collections.map((x) => x.id), [c.id])
  p.materials.skipMember(c.id, 'https://gallery.example/items/d.html', { reason: '风格不合', by: 'test' })
  p.materials.retire(a.id, { reason: '上游已下线', by: 'test' })
  assert.deepEqual([p.materials.members(c.id).added, p.materials.members(c.id).gone], [['https://gallery.example/items/c.html'], []])
  assert.deepEqual(p.materials.ledger(c.id).map((e) => [e.url.split('/').at(-1), e.state, e.added]),
    [['b.html', 'open', false], ['c.html', 'open', true], ['d.html', 'skipped', true]], 'the ledger lists every upstream link with what was done about it')
  const [b] = p.materials.capture([{ url: 'https://gallery.example/items/b.html', title: 'B', form: 'case', description: '看长文版式时打开。', summary: '一页。', read_scope: '读过', limits: '无', revisit_when: '改版时', member_of: c.id }], { task: '找版式样例' })
  assert.deepEqual(p.source(c.id).members.ledger[0], { url: 'https://gallery.example/items/b.html', state: 'registered', id: b.id, title: 'B', retired: false, added: false })
  assert.equal(p.materials.search({ query: 'A' }).some((s) => s.id === a.id), false, 'a retired source leaves the active lists')
  const revised = p.materials.file(c.id, { category: 'design' }, { expected_revision: 1, by: 'test' })
  assert.equal(revised.category, 'design')
  assert.throws(() => p.materials.updateOwn(c.id, { category: 'design' }), /not editable: category/)
  assert.throws(() => p.materials.updateOwn(SRC, { title: 'x' }), /not an own source/)
})

test('the catalog files any source by form and Kit area; local work is an example, pipeline or delivery that serves pages', () => {
  const { root, p } = setup({ project: true })
  assert.deepEqual(p.catalog().areas, [], 'nothing is catalogued until it is filed')
  const filed = p.materials.file(SRC, { form: 'standard', description: '写折叠控件时打开；取键盘约定。' }, { expected_revision: 0, by: 'test' })
  assert.deepEqual([filed.form, filed.description, filed.pack], ['standard', '写折叠控件时打开；取键盘约定。', 'vault'], 'a pack source is filed in the roster, not in the pack')
  assert.equal(p.materials.binding(BIND).description, '写折叠控件时打开；取键盘约定。', 'a binding without its own description shows the entry\'s')
  p.materials.capture([{ url: 'https://example.org/motion', title: 'Motion guide', form: 'practice', category: 'design', description: '编排动效时打开；取时长与缓动。', summary: '动效指南。', read_scope: '读过', limits: '无', revisit_when: '改版时' }], { task: '测试' })
  const outline = p.catalog()
  assert.deepEqual(outline.areas.map((a) => [a.area, a.count, a.forms]), [['design', 2, [{ form: 'standard', count: 1 }, { form: 'practice', count: 1 }]]])
  const rows = p.catalog({ area: 'design', form: 'practice' })
  assert.deepEqual(rows.areas[0].forms[0].sources.map((r) => [r.title, r.description]), [['Motion guide', '编排动效时打开；取时长与缓动。']])
  assert.deepEqual(p.catalog({ query: '键盘' }).areas[0].forms[0].sources.map((r) => [r.id, r.pages]), [[SRC, ['design/controls']]])
  assert.throws(() => p.materials.file(SRC, { form: 'standard' }, { expected_revision: 0 }), /revision/)
  // A review holds until the entry is edited again; the review write itself does not reopen it.
  const row = () => p.catalog({ query: '键盘' }).areas[0].forms[0].sources[0]
  assert.equal(row().review, undefined)
  p.materials.reviewEntry(SRC, { verdict: 'accurate', by: 'person' })
  assert.deepEqual([row().review.verdict, row().review.current], ['accurate', true])
  p.materials.file(SRC, { description: '写折叠控件时打开；取键盘与焦点约定。' }, { expected_revision: row().entry_revision, by: 'test' })
  assert.equal(row().review.current, false, 'an edit after the review reopens the entry')
  assert.throws(() => p.materials.reviewEntry(SRC, { verdict: 'accurate', revision: row().entry_revision - 1, by: 'person' }), /revision conflict/, 'a verdict on a description the reviewer did not see is refused')
  p.materials.reviewEntry(SRC, { verdict: 'accurate', revision: row().entry_revision, by: 'person' })
  assert.equal(row().review.current, true, 'a verdict on the description the reviewer saw holds')
  const notes =join(mkdtempSync(join(tmpdir(), 'praxis-notes-')), 'controls.md')
  writeFileSync(notes, '# 控件笔记')
  assert.throws(() => p.consume({ title: '笔记', artifacts: [notes] }), /not inside a registered project/)
  assert.throws(() => p.consume({ title: '笔记', artifacts: [{ path: notes, kind: 'trace' }] }), /kind must be/)
  const run = p.consume({ title: '控件样张', artifacts: [{ path: notes, kind: 'example', serves: [{ target: 'kit/design/controls.md', description: '定键盘约定时对照；看三种控件。' }] }] })
  const example = p.artifact(run.artifacts[0].artifact)
  assert.deepEqual([example.kind, example.project, example.signals, example.serves.map((x) => x.unit)], ['example', undefined, [], ['design/controls']], 'an example is not held to a project layout')
  assert.deepEqual(p.resolve({ units: ['design/controls'] }).exemplars.map((x) => x.artifact), [example.id])
  // A delivery serves a page only once a review accepted its latest version.
  writeFileSync(join(root, 'page.html'), '<p>页</p>')
  const page = p.consume({ title: '页面', artifacts: [{ path: 'page.html', serves: [{ target: 'kit/design/controls.md' }] }] }).artifacts[0].artifact
  assert.deepEqual(p.resolve({ units: ['design/controls'] }).exemplars.map((x) => x.artifact), [example.id])
  p.reviewArtifact({ id: page, version: 1, verdict: 'accepted', by: 'owner' })
  assert.deepEqual(p.resolve({ units: ['design/controls'] }).exemplars.map((x) => [x.artifact, x.kind]), [[example.id, 'example'], [page, 'delivery']])
  assert.deepEqual(p.artifactList({ kind: 'example' }).map((a) => a.id), [example.id])
})

test('a unit revision lives in the overlay, applies everywhere, and conflicts when the package page changes', () => {
  const { root, p } = setup()
  const before = p.unit('design/controls')
  assert.throws(() => p.reviseUnit({ unit: 'design/controls', body: '# 控件\n\n新说法。', expected_revision: 0 }), /needs reason/)
  const r = p.reviseUnit({ unit: 'design/controls', body: '# 控件\n\n按真实交付改过的说法。\n', expected_revision: 0, reason: '交付里发现旧说法误导', example: 'run-1', by: 'agent' })
  assert.equal(r.description, '按真实交付改过的说法。')
  assert.notEqual(p.unit('design/controls').version, before.version)
  assert.equal(readFileSync(join(root, 'pkg/kit/design/controls.md'), 'utf8').includes('控件语义'), true, 'the package page is untouched')
  assert.deepEqual(p.upkeep().revisions, [])
  writeFileSync(join(root, 'pkg/kit/design/controls.md'), '# 控件\n\n包升级后的说法。\n')
  assert.deepEqual(p.upkeep().revisions.map((x) => [x.unit, x.conflict]), [['design/controls', true]])
  p.revertUnit({ unit: 'design/controls', by: 'test', reason: '采用包里的新说法' })
  assert.equal(p.unit('design/controls').description, '包升级后的说法。')
  assert.equal(p.history({ id: 'kit/design/controls.md' })[0].body, '# 控件\n\n按真实交付改过的说法。\n')
})

test('JSON writes keep the file\'s own formatting and change only what changed', () => {
  const hand = '{\n  "a": ["x", "y"],\n  "list": [{"slug": "s1", "tags": ["A", "B"]},\n    {"slug": "s2"}\n  ],\n  "n": 1\n}'
  const v = JSON.parse(hand)
  v.list[1].grammar_paths = ['p.md']
  v.a = ['y']
  assert.equal(patchJson(hand, v), '{\n  "a": ["y"],\n  "list": [{"slug": "s1", "tags": ["A", "B"]},\n    {"slug": "s2", "grammar_paths": ["p.md"]}\n  ],\n  "n": 1\n}')
  for (const indent of [1, 2, 4]) {
    const text = JSON.stringify({ x: [1, 2], y: { z: 'q', w: [{ k: 1 }], e: [] } }, null, indent)
    const next = JSON.parse(text)
    next.y.w.push({ k: 2 })
    next.y.n = [3]
    delete next.y.z
    assert.equal(patchJson(text, next), JSON.stringify(next, null, indent), `canonical files stay canonical (indent ${indent})`)
    assert.equal(patchJson(text, JSON.parse(text)), text, 'unchanged data, unchanged text')
  }
})

test('lifecycles: a retired source stays readable but takes no writes; a rewrite clears needs-work until reviewed again', () => {
  const { p } = setup()
  const item = { url: 'https://example.org/guide', title: 'Guide', form: 'practice', description: '做交互说明时打开；取键盘约定。', summary: '一份指南。', read_scope: '读了正文', limits: '未运行示例。', revisit_when: '改版时。' }
  const [g] = p.materials.capture([item], { task: '测试', by: 'agent' })
  const src = () => p.materials.source(g.id)
  assert.equal(src().state, 'active')
  p.materials.reviewEntry(g.id, { verdict: 'needs-work', revision: src().entry_revision, by: 'person' })
  assert.deepEqual([src().review.current, src().signals], [true, ['needs_work']])
  p.materials.file(g.id, { description: '写自定义控件的键盘行为时打开；取焦点约定。' }, { expected_revision: src().entry_revision, by: 'agent' })
  assert.deepEqual([src().review.current, src().signals], [false, []], 'the rewrite waits for a review; it is no longer a signal')
  p.materials.reviewEntry(g.id, { verdict: 'accurate', revision: src().entry_revision, by: 'person' })
  assert.deepEqual([src().review.verdict, src().review.current], ['accurate', true])
  p.materials.retire(g.id, { reason: '上游下线', by: 'person' })
  assert.equal(src().state, 'retired', 'a retired source is still readable')
  assert.throws(() => p.materials.file(g.id, { description: '别的说明。' }, { by: 'agent' }), /retired/)
  assert.throws(() => p.materials.reviewEntry(g.id, { verdict: 'accurate', by: 'person' }), /retired/)
  assert.throws(() => p.materials.retire(g.id, { reason: '再次', by: 'person' }), /retired/, 'retiring is final and happens once')
  assert.deepEqual(p.materials.capture([item], { task: '再收', by: 'agent' }).map((r) => [r.id, r.existing, r.retired]), [[g.id, true, true]], 'capturing a retired URL says so')
})
