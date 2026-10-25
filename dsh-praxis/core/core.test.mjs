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

const CATALOG = 'vault/provenance/demo/catalog.json'

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'praxis-'))
  const put = (rel, text) => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), text) }
  put('dsh-praxis/layers.md', '# 分层体例\n')
  put('dsh-praxis/kit/writing/README.md', '# Writing\n\n写作入口。\n')
  put('dsh-praxis/kit/writing/evidence.md', '# 证据与来源\n\n底线。\n')
  put('dsh-praxis/kit/writing/organization/mechanism.md', '# 机制讲解\n\n讲清机制。\n')
  put('dsh-praxis/kit/publish/README.md', '# Publish\n\n媒介。\n')
  put('dsh-praxis/kit/publish/html/README.md', '# html\n\n页面。\n')
  put('dsh-praxis/kit/publish/video/README.md', '# video\n\n成片。\n')
  put('dsh-praxis/kit/task/README.md', '# Task\n\n任务。\n')
  put('dsh-praxis/kit/task/types/explainer.md', [
    '# 技术说明', '', '讲清一个系统。', '',
    '| 项 | 内容 |', '|---|---|',
    '| 结果 | 能说出核心关系 |',
    '| 默认流水线 | html；另出 video |',
    '| Writing | [机制讲解](../../writing/organization/mechanism.md) |',
    '| Design | [控件](../../design/controls.md)；video 另加 [运动](../../design/motion.md) |',
    '| Publish | html：[html](../../publish/html/README.md)；video：[video](../../publish/video/README.md) |',
    '', '## 验收', '', '- 关系说得清。', '',
  ].join('\n'))
  put('dsh-praxis/kit/design/README.md', '# Design\n\n设计入口。\n')
  put('dsh-praxis/kit/design/foundations/grammar.md', '# 判断契约\n\n先定读者。\n')
  put('dsh-praxis/kit/design/controls.md', '# 控件\n\n语法 ID：`DWG-I-CONTROLS`\n\n控件语义。\n')
  put('dsh-praxis/kit/design/motion.md', '# 运动\n\n运动判断。\n')
  put(CATALOG, JSON.stringify({ schema_version: '1.0', cards: 'maintained', as_of: null, registry_extensions: true, sources: [
    { slug: 'apg', url: 'https://example.org/apg/', title: 'APG Accordion', status: 'verified', summary_zh: '分段披露的键盘约定。', limits: '未测实现。', revisit_trigger: '修订时。', card_path: 'vault/provenance/demo/apg.md', purpose_tags: ['ARIA'], reference_priority: 'normal', grammar_paths: ['dsh-praxis/kit/design/controls.md'] },
  ], occurrences: [] }, null, 1) + '\n')
  return root
}

// Stand-in for scripts/build_registry.py: project every catalog into vault/registry.json.
function rebuildFor(root) {
  return function rebuild() {
    const sources = []
    for (const rel of [CATALOG, 'vault/provenance/praxis-captures/catalog.json']) {
      if (!existsSync(join(root, rel))) continue
      const cat = JSON.parse(readFileSync(join(root, rel), 'utf8'))
      const ns = rel === CATALOG ? 'provenance-demo' : 'provenance-praxis-captures'
      for (const s of cat.sources) {
        sources.push({ id: `${ns}:${s.slug}`, collection: ns, title: s.title, canonical_url: s.url, evidence_status: s.status, summary: s.summary_zh,
          purpose_tags: s.purpose_tags ?? [], local_card: s.card_path, record_path: rel, limitations: [s.limits], revisit_when: s.revisit_trigger,
          ...(s.supported_claims ? { supported_claims: s.supported_claims } : {}), ...(s.captured_for ? { captured_for: s.captured_for } : {}),
          ...(s.grammar_paths ? { grammar_paths: s.grammar_paths } : {}) })
      }
    }
    // Project indexes registered by reference: read in place, fields mapped, relations from the registration.
    const collections = []
    const regs = existsSync(join(root, 'vault/project-indexes.json')) ? JSON.parse(readFileSync(join(root, 'vault/project-indexes.json'), 'utf8')).indexes : []
    for (const reg of regs) {
      const data = JSON.parse(readFileSync(join(root, reg.path), 'utf8'))
      const claims = reg.excerpts ? readFileSync(join(root, reg.excerpts.path), 'utf8').trim().split('\n').map((l) => JSON.parse(l)) : []
      const f = reg.fields
      for (const r of reg.list ? data[reg.list] : data) {
        const local = String(r[f.id])
        sources.push({ id: `${reg.id}:${local}`, kind: 'project-index', collection: reg.id, title: r[f.title], canonical_url: f.url ? r[f.url] : null,
          evidence_status: reg.status?.[r[f.status]] ?? 'partial', summary: f.summary ? r[f.summary] ?? '' : '', purpose_tags: [], local_card: null, record_path: reg.path,
          limitations: [reg.limits], revisit_when: reg.revisit_when,
          supported_claims: claims.filter((c) => c[reg.excerpts.source] === local).map((c) => ({ claim_id: c[reg.excerpts.id], locator: c[reg.excerpts.locator], claim: c[reg.excerpts.claim] })),
          ...(reg.relations?.[local] ? { grammar_paths: reg.relations[local] } : {}) })
      }
      collections.push({ id: reg.id, path: reg.path, title: reg.title, purpose: reg.purpose })
    }
    writeFileSync(join(root, 'vault/registry.json'), JSON.stringify({ collections, sources }, null, 2) + '\n')
  }
}

// With `project`, the fixture root is a project whose drafts are top-level .md files and finals .html or out/.
function setup({ project = false } = {}) {
  const root = fixture()
  const rebuild = rebuildFor(root)
  rebuild()
  const p = createPraxis({ root, rebuild })
  if (project) p.saveProject({ expected_revision: 0, root: '.', title: 'Fixture', purpose: '测试交付', layout: { draft: ['*.md'], final: ['*.html', 'out/**'] } })
  return { root, p }
}

const SRC = 'provenance-demo:apg'
const BIND = `${SRC}@dsh-praxis/kit/design/controls.md`

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
  assert.equal(p.unit('dsh-praxis/kit/design/controls.md#x').id, 'design/controls')
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

test('curate on a new target creates the relation in the catalog', () => {
  const { root, p } = setup()
  p.materials.curate(`${SRC}@dsh-praxis/kit/design/motion.md`, { usage: { problem: '折叠动效', how: '对照展开状态' } }, { by: 'test' })
  const cat = JSON.parse(readFileSync(join(root, CATALOG), 'utf8'))
  assert.deepEqual(cat.sources[0].grammar_paths, ['dsh-praxis/kit/design/controls.md', 'dsh-praxis/kit/design/motion.md'])
  assert.throws(() => p.materials.curate(`${SRC}@dsh-praxis/kit/design/missing.md`, {}), /does not exist/)
})

test('remove and restore keep curation and history', () => {
  const { root, p } = setup()
  p.materials.curate(BIND, { favorite: true })
  const removed = p.materials.remove(BIND, { by: 'test' })
  assert.equal(removed.state, 'removed')
  assert.equal(JSON.parse(readFileSync(join(root, CATALOG), 'utf8')).sources[0].grammar_paths, undefined)
  assert.equal(p.materials.listBindings().length, 0)
  assert.equal(p.materials.listBindings({ includeRemoved: true }).length, 1)
  const back = p.materials.restore(BIND, { by: 'test' })
  assert.equal(back.state, 'active')
  assert.equal(back.favorite, true)
  assert.deepEqual(p.history().map((h) => h.op), ['restore', 'remove', 'curate'])
})

test('review records the reviewed revision', () => {
  const { p } = setup()
  p.materials.curate(BIND, { description: '新说明。' })
  const b = p.materials.review(BIND, { verdict: 'accurate', by: 'agent', note: 'ok' })
  assert.equal(b.reviews[0].revision, 1)
  assert.throws(() => p.materials.review(BIND, { verdict: 'fine' }), /verdict/)
})

test('capture: a batch is checked whole, written once, deduped by URL, and says what it was collected for', () => {
  const { root, p } = setup()
  const item = (url, title) => ({ url, title, summary: '一份指南。', read_scope: '读了正文', limits: '未运行示例。', revisit_when: '改版时。', tags: ['GUIDE'] })
  assert.throws(() => p.materials.capture([item('https://example.org/a', 'A')]), /needs task/)
  assert.throws(() => p.materials.capture([item('https://example.org/a', 'A'), { url: 'https://x.org' }], { task: '调研' }), /needs title/)
  assert.equal(existsSync(join(root, 'vault/provenance/praxis-captures/catalog.json')), false, 'a refused batch writes nothing')
  const made = p.materials.capture([
    item('https://example.org/new-guide?utm_source=x', 'New Guide'),
    item('https://example.org/new-guide', 'Same Guide'),
    item('https://example.org/apg', 'APG again'),
    item('https://example.org/other', 'Other Guide'),
  ], { task: '技术说明页的交互调研', by: 'test' })
  assert.deepEqual(made.map((m) => [m.id, m.existing]), [
    ['provenance-praxis-captures:new-guide', false], ['provenance-praxis-captures:new-guide', true], [SRC, true], ['provenance-praxis-captures:other-guide', false]])
  assert.ok(existsSync(join(root, 'vault/provenance/praxis-captures/new-guide.md')))
  assert.ok(existsSync(join(root, 'vault/provenance/praxis-captures/README.md')))
  assert.equal(p.source('provenance-praxis-captures:other-guide').captured_for.task, '技术说明页的交互调研')
})

test('consume records versions; stale finds runs whose units or bindings changed', () => {
  const { root, p } = setup()
  const run = p.consume({ title: '讲解页', task_type: 'explainer', units: ['writing/organization/mechanism', 'design/controls'], sources: [SRC, SRC], by: 'test' })
  assert.equal(p.runs()[0].id, run.id)
  assert.deepEqual([run.sources.map((s) => s.id), run.bindings.map((b) => b.id)], [[SRC], [BIND]], 'the binding joining a read source to a read unit is recorded')
  assert.deepEqual(p.stale(), [])
  writeFileSync(join(root, 'dsh-praxis/kit/writing/organization/mechanism.md'), '# 机制讲解\n\n改过了。\n')
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
  assert.equal(p.upkeep().stale[0].run, run.id)
})

test('refresh checks upstream by hash without storing content; keep saves a snapshot; a dead link is a signal', async () => {
  const { root, p } = setup()
  let body = '<html>v1</html>'
  let up = true
  const fetchImpl = async () => (up ? new Response(body, { headers: { 'content-type': 'text/html' } }) : new Response('gone', { status: 404 }))
  const first = await p.materials.refresh(SRC, { fetchImpl, by: 'test' })
  assert.deepEqual([first.reachable, first.changed, first.snapshot, first.check.status], [true, false, undefined, 'ok'], 'the first check is the baseline')
  assert.equal(existsSync(join(root, 'vault/snapshots/local/praxis')), false, 'no content stored')
  body = '<html>v2</html>'
  const second = await p.materials.refresh(SRC, { fetchImpl })
  assert.deepEqual([second.changed, second.bindings], [true, [BIND]])
  assert.deepEqual(p.materials.binding(BIND).signals, ['changed'])
  const kept = await p.materials.refresh(SRC, { fetchImpl, keep: true })
  assert.ok(existsSync(join(root, kept.snapshot.path)))
  assert.equal(p.materials.source(SRC).snapshot.sha256, kept.check.sha256)
  assert.equal((await p.materials.refresh(SRC, { fetchImpl, keep: true })).snapshot, undefined, 'the same bytes are not kept twice')
  up = false
  const dead = await p.materials.refresh(SRC, { fetchImpl })
  assert.deepEqual([dead.reachable, dead.check.error], [false, 'HTTP 404'])
  assert.deepEqual(p.materials.binding(BIND).signals, ['changed', 'unreachable'])
  up = true
  await p.materials.refresh(SRC, { fetchImpl })
  assert.deepEqual(p.materials.binding(BIND).signals, ['changed'], 'a link that answers again is no longer flagged')
})

test('upkeep lists only signals: needs-work, changed sources, stale runs, unbound captures', async () => {
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
  p.materials.capture([{ url: 'https://example.org/new', title: '新来源', summary: '概要', read_scope: '读过', limits: '边界', revisit_when: '修订时' }], { task: '测试', by: 'test' })
  const up = p.upkeep()
  assert.deepEqual(up.bindings.map((b) => [b.id, b.unit, b.signals]), [[BIND, 'design/controls', ['needs_work']]])
  assert.deepEqual(up.unbound.map((s) => s.title), ['新来源'])
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
  const MOVED = `${SRC}@dsh-praxis/kit/design/motion.md`
  p.materials.curate(MOVED, { description: '新挂载。' })
  p.materials.remove(BIND)
  const archive = join(root, 'state.tar.gz')
  mkdirSync(join(root, 'dsh-praxis'), { recursive: true })
  writeFileSync(join(root, 'dsh-praxis/package.json'), '{"version":"0.0.0"}')
  const out = exportState(root, archive)
  assert.ok(out.files >= 2)
  assert.equal(checkArchive(archive).ok, true)
  p.materials.restore(BIND)
  p.materials.curate(BIND, { description: '导出后改过。' })
  p.materials.remove(MOVED)
  const rebuild = rebuildFor(root)
  const blocked = restoreState(root, archive, { rebuild })
  assert.equal(blocked.restored, 0)
  assert.ok(blocked.conflicts.includes('dsh-praxis/data/bindings.json'))
  assert.ok(blocked.conflicts.includes(CATALOG), 'existing source catalogs travel with the state')
  restoreState(root, archive, { force: true, rebuild })
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
  assert.deepEqual(p.artifact(id).versions.map((v) => v.reviews.map((r) => r.verdict)), [['needs-work'], ['accepted']])
  writeFileSync(join(root, 'dsh-praxis/kit/writing/organization/mechanism.md'), '# 机制讲解\n\n改过了。\n')
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
  const catalog = JSON.parse(readFileSync(join(root, CATALOG), 'utf8'))
  catalog.sources[0].supported_claims = [{ claim_id: 'C1', locator: 'Keyboard Interaction', claim: 'Enter 与 Space 切换展开。' }, { claim_id: 'C2', locator: 'Roles', claim_zh: '中文字段名的说法。' }, '只有一句话的说法']
  writeFileSync(join(root, CATALOG), JSON.stringify(catalog))
  p.materials.rebuild()
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
  assert.equal(s.record, undefined, 'the raw record stays out of the tool value')
  // A pipeline is a registered source; an artifact names the one that made it.
  const [pipe] = p.materials.capture([{ locator: 'work/build/README.md', title: '短片管线', summary: '念白、合成、逐帧渲染。', read_scope: '读了 README', limits: '要凭据', revisit_when: '下一条短片时' }], { task: '登记管线' })
  writeFileSync(join(root, 'cut.html'), '<p>cut</p>')
  assert.throws(() => p.consume({ title: '成片', artifacts: [{ path: 'cut.html', made_with: 'no:such' }] }), /unknown pipeline source/)
  const made = p.consume({ title: '成片', artifacts: [{ path: 'cut.html', made_with: pipe.id }] })
  assert.equal(made.artifacts[0].made_with, pipe.id)
  assert.deepEqual(p.artifact(made.artifacts[0].artifact).versions[0].made_with, { id: pipe.id, title: '短片管线' })
  assert.deepEqual(p.source(pipe.id).used_by.map((r) => [r.id, r.read, r.artifacts.map((x) => x.made)]), [[made.id, false, [true]]])
})

test('a project source index is registered by reference, related through its registration, and read like any source', () => {
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
  assert.throws(() => p.materials.registerIndex({ ...reg, status: { 'read-full': 'verified' } }), /blocked needs a mapping/)
  assert.throws(() => p.materials.registerIndex({ ...reg, fields: { ...reg.fields, author: 'x' } }), /unknown author/)
  assert.deepEqual(p.materials.registerIndex(reg, { by: 'test' }), { id: 'proj-research', path: reg.path, created: true, sources: 2 })
  const s = p.source('proj-research:A-01')
  assert.deepEqual([s.url, s.evidence_status, s.excerpts.map((e) => e.claim), s.collection.purpose], ['https://vendor.example/docs', 'verified', ['按 token 计价。'], '为 Proj 专章核对事实'])
  p.materials.curate('proj-research:A-01@dsh-praxis/kit/design/controls.md', { description: '控件页取它的计价说法' }, { expected_revision: 0 })
  assert.deepEqual(JSON.parse(readFileSync(join(root, 'vault/project-indexes.json'), 'utf8')).indexes[0].relations, { 'A-01': ['dsh-praxis/kit/design/controls.md'] })
  assert.deepEqual(JSON.parse(readFileSync(join(root, 'proj/research/sources.json'), 'utf8')), index, 'the project file is not touched')
  p.materials.registerIndex({ ...reg, title: '改名' })
  assert.deepEqual(p.materials.listBindings({ source: 'proj-research:A-01' }).map((b) => b.description), ['控件页取它的计价说法'], 'registering again keeps relations')
  assert.ok(p.resolve({ task_type: 'explainer' }).materials.some((m) => m.source === 'proj-research:A-01'))
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
  assert.deepEqual(up.projects.map((x) => [x.id, x.unregistered]), [['series', ['out/ep02.mp4']]])
  assert.deepEqual(up.artifacts.map((a) => a.project_path), ['notes.txt'])
  assert.deepEqual(p.projectList({ path: 'work/series/out/ep01.mp4' }).map((x) => x.id), ['series'])
  p.saveProject({ id: 'series', expected_revision: series.revision, layout: { final: ['out/*.mp4', '*.txt'] } })
  assert.deepEqual(p.upkeep().artifacts, [], 'widening the layout resolves the misplaced file; nothing was moved')
  assert.ok(existsSync(join(root, 'work/series/notes.txt')))
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
