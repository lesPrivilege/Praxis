import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { createPraxis, ConflictError } from './index.js'
import { exportState, checkArchive, restoreState } from './backup.js'

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
        sources.push({ id: `${ns}:${s.slug}`, title: s.title, canonical_url: s.url, evidence_status: s.status, summary: s.summary_zh,
          purpose_tags: s.purpose_tags ?? [], local_card: s.card_path, record_path: rel, limitations: [s.limits], revisit_when: s.revisit_trigger,
          ...(s.grammar_paths ? { grammar_paths: s.grammar_paths } : {}) })
      }
    }
    writeFileSync(join(root, 'vault/registry.json'), JSON.stringify({ sources }, null, 2) + '\n')
  }
}

function setup() {
  const root = fixture()
  const rebuild = rebuildFor(root)
  rebuild()
  return { root, p: createPraxis({ root, rebuild }) }
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

test('capture writes catalog, card and registry entry, and dedupes by URL', () => {
  const { root, p } = setup()
  const input = { url: 'https://example.org/new-guide?utm_source=x', title: 'New Guide', summary: '一份指南。', read_scope: '读了正文', limits: '未运行示例。', revisit_when: '改版时。', tags: ['GUIDE'] }
  const made = p.materials.capture(input, { by: 'test' })
  assert.equal(made.existing, false)
  assert.equal(made.source.id, 'provenance-praxis-captures:new-guide')
  assert.ok(existsSync(join(root, 'vault/provenance/praxis-captures/new-guide.md')))
  assert.ok(existsSync(join(root, 'vault/provenance/praxis-captures/README.md')))
  assert.equal(p.materials.capture({ ...input, url: 'https://example.org/new-guide' }).existing, true)
  assert.equal(p.materials.capture({ ...input, url: 'https://example.org/apg' }).source.id, SRC)
  assert.throws(() => p.materials.capture({ url: 'https://x.org' }), /needs title/)
})

test('consume records versions; stale finds runs whose units or bindings changed', () => {
  const { root, p } = setup()
  const run = p.consume({ title: '讲解页', task_type: 'explainer', units: ['writing/organization/mechanism'], bindings: [BIND], by: 'test' })
  assert.equal(p.runs()[0].id, run.id)
  assert.deepEqual(p.stale(), [])
  writeFileSync(join(root, 'dsh-praxis/kit/writing/organization/mechanism.md'), '# 机制讲解\n\n改过了。\n')
  p.materials.curate(BIND, { favorite: true })
  const [stale] = p.stale()
  assert.deepEqual(stale.units, ['writing/organization/mechanism'])
  assert.deepEqual(stale.bindings, [BIND])
})

test('refresh saves a versioned snapshot and skips unchanged bytes', async () => {
  const { root, p } = setup()
  let body = '<html>v1</html>'
  const fetchImpl = async () => new Response(body, { headers: { 'content-type': 'text/html' } })
  const first = await p.materials.refresh(SRC, { fetchImpl, by: 'test' })
  assert.equal(first.changed, true)
  assert.ok(existsSync(join(root, first.snapshot.path)))
  assert.equal((await p.materials.refresh(SRC, { fetchImpl })).changed, false)
  body = '<html>v2</html>'
  const second = await p.materials.refresh(SRC, { fetchImpl })
  assert.equal(second.snapshot.previous, first.snapshot.path)
  const intake = JSON.parse(readFileSync(join(root, 'vault/intake/praxis-captures.json'), 'utf8'))
  assert.equal(intake.source_snapshots.length, 2)
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

test('export, check and restore the control plane state', () => {
  const { root, p } = setup()
  p.materials.curate(BIND, { favorite: true, description: '导出前。' })
  const archive = join(root, 'state.tar.gz')
  mkdirSync(join(root, 'dsh-praxis'), { recursive: true })
  writeFileSync(join(root, 'dsh-praxis/package.json'), '{"version":"0.0.0"}')
  const out = exportState(root, archive)
  assert.ok(out.files >= 2)
  assert.equal(checkArchive(archive).ok, true)
  p.materials.curate(BIND, { description: '导出后改过。' })
  const blocked = restoreState(root, archive)
  assert.equal(blocked.restored, 0)
  assert.ok(blocked.conflicts.includes('dsh-praxis/data/bindings.json'))
  restoreState(root, archive, { force: true })
  assert.equal(p.materials.binding(BIND).description, '导出前。')
})
