// Materials: sources come from the vault catalogs and from project source indexes registered by
// reference (all listed through the derived registry); relations from each source's grammar_paths,
// kept on the source's own record (for a project index, in its registration); and curation
// (enable, favorite, description, usage, tags, reviews) from the binding store.
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { Collection, readJson, withLock, writeJson } from './store.js'
import { clip } from './kit.js'

export const CAPTURE_CATALOG = 'vault/provenance/praxis-captures/catalog.json'
export const CAPTURE_INTAKE = 'vault/intake/praxis-captures.json'
export const PROJECT_INDEXES = 'vault/project-indexes.json'

const SLUG = /^[A-Za-z0-9][A-Za-z0-9._-]*$/

// Signals that a binding needs someone now. Default states (no curated description, never
// reviewed, disabled) are not signals: the source summary stands in until someone has a reason
// to curate. `changed`: the source got a new snapshot after the binding's last review.
export const SIGNALS = ['needs_work', 'changed']

export function signalsOf(b, changedAt) {
  const last = b.reviews.at(-1)
  const since = changedAt?.get(b.source)
  return [
    last?.verdict === 'needs-work' && 'needs_work',
    since && !(last?.at > since) && 'changed',
  ].filter(Boolean)
}

export function bindingId(sourceId, target) {
  return `${sourceId}@${target}`
}

export class Materials {
  constructor(repo, dataDir, { rebuild } = {}) {
    this.repo = repo
    if (rebuild) this.rebuild = rebuild
    this.bindings = new Collection(join(dataDir, 'bindings.json'), join(dataDir, 'history.jsonl'))
  }

  registry() {
    return readJson(join(this.repo, 'vault/registry.json'), { sources: [] })
  }

  /** Registry records by id and alias. Reread each call so edits by other agents show up. */
  index() {
    const byId = new Map()
    for (const source of this.registry().sources) {
      byId.set(source.id, source)
      for (const alias of source.aliases ?? []) if (!byId.has(alias)) byId.set(alias, source)
    }
    return byId
  }

  /** The catalog record a registry entry was projected from. */
  record(source, cache) {
    if (!source?.record_path?.endsWith('catalog.json')) return undefined
    let catalog = cache?.get(source.record_path)
    if (!catalog) {
      catalog = readJson(join(this.repo, source.record_path), { sources: [] })
      cache?.set(source.record_path, catalog)
    }
    const slug = source.id.slice(source.id.indexOf(':') + 1)
    return (catalog.sources ?? []).find((s) => s.slug === slug)
  }

  source(ref) {
    const base = this.index().get(ref)
    if (!base) return undefined
    const record = this.record(base) ?? {}
    return {
      id: base.id,
      aliases: base.aliases ?? [],
      title: base.title,
      kind: base.kind,
      url: base.canonical_url ?? record.url,
      collection: base.collection,
      summary: base.summary,
      evidence_status: base.evidence_status,
      purpose_tags: base.purpose_tags ?? [],
      limits: base.limitations ?? [],
      revisit_when: base.revisit_when,
      card: base.local_card,
      record_path: base.record_path,
      reference_priority: record.reference_priority,
      reference_status: record.reference_status,
      read_scope: base.evidence_modality ?? record.evidence_modality,
      captured_for: base.captured_for ?? record.captured_for,
      excerpts: (base.supported_claims ?? record.supported_claims ?? []).map((c) => ({ id: c.claim_id, locator: c.locator, claim: c.claim })),
      snapshot: record.snapshot_path
        ? { path: record.snapshot_path, sha256: record.snapshot_sha256, status: record.snapshot_status }
        : undefined,
      record,
    }
  }

  search({ query = '', tag, status, limit = 20 } = {}) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    const hits = []
    for (const s of this.registry().sources) {
      if (tag && !(s.purpose_tags ?? []).includes(tag)) continue
      if (status && s.evidence_status !== status) continue
      const hay = [s.id, s.title, s.summary, ...(s.purpose_tags ?? []), ...(s.aliases ?? [])].join(' ').toLowerCase()
      const score = terms.reduce((n, t) => n + (hay.includes(t) ? (s.title?.toLowerCase().includes(t) ? 3 : 1) : -100), 0)
      if (!terms.length || score > 0) hits.push({ score, s })
    }
    hits.sort((a, b) => b.score - a.score)
    return hits.slice(0, limit).map(({ s }) => ({
      id: s.id, title: s.title, summary: clip(s.summary ?? '', 160), evidence_status: s.evidence_status,
      purpose_tags: s.purpose_tags ?? [], grammar_paths: s.grammar_paths ?? [],
    }))
  }

  /** Every binding: active ones from grammar_paths, removed ones kept in the store. */
  listBindings({ target, source, includeRemoved = false } = {}) {
    const stored = this.bindings.all()
    const cache = new Map()
    const out = new Map()
    for (const s of this.registry().sources) {
      if (source && s.id !== source) continue
      for (const t of s.grammar_paths ?? []) {
        if (target && !matchTarget(t, target)) continue
        const id = bindingId(s.id, t)
        out.set(id, this.compose(id, s, t, stored[id], cache))
      }
    }
    if (includeRemoved) {
      for (const [id, rec] of Object.entries(stored)) {
        if (out.has(id) || rec.state !== 'removed') continue
        if (target && !matchTarget(rec.target, target)) continue
        if (source && rec.source !== source) continue
        out.set(id, this.compose(id, this.index().get(rec.source), rec.target, rec, cache))
      }
    }
    return [...out.values()]
  }

  binding(id) {
    const at = id.lastIndexOf('@')
    const [sourceId, target] = [id.slice(0, at), id.slice(at + 1)]
    const s = this.index().get(sourceId)
    const rec = this.bindings.get(id)
    if (!s && !rec) return undefined
    const active = (s?.grammar_paths ?? []).includes(target)
    if (!active && !rec) return undefined
    return this.compose(id, s, target, rec)
  }

  compose(id, s, target, rec = {}, cache) {
    const active = (s?.grammar_paths ?? []).includes(target)
    const changed = cache ? (cache.changed ??= this.changedSources()) : this.changedSources()
    const b = {
      id,
      source: s?.id ?? rec.source,
      target,
      title: s?.title ?? rec.title,
      description: rec.description ?? clip(s?.summary ?? '', 160),
      description_curated: rec.description !== undefined,
      usage: rec.usage,
      enabled: rec.enabled ?? true,
      favorite: rec.favorite ?? false,
      priority: rec.priority ?? this.record(s, cache)?.reference_priority ?? 'normal',
      tags: rec.tags ?? s?.purpose_tags ?? [],
      state: active ? 'active' : 'removed',
      reviews: rec.reviews ?? [],
      revision: rec.revision ?? 0,
      evidence_status: s?.evidence_status,
    }
    b.signals = signalsOf(b, changed)
    return b
  }

  /** Sources whose refresh found new content, with the time of the latest such snapshot. */
  changedSources() {
    const intake = readJson(join(this.repo, CAPTURE_INTAKE), { source_snapshots: [] })
    const out = new Map()
    for (const snap of intake.source_snapshots ?? []) {
      if (snap.previous && !(out.get(snap.source_id) > snap.captured_at)) out.set(snap.source_id, snap.captured_at)
    }
    return out
  }

  /** Sources captured through the control plane that no unit binds yet. */
  unboundCaptures() {
    return this.registry().sources
      .filter((s) => s.record_path === CAPTURE_CATALOG && !(s.grammar_paths ?? []).length)
      .map((s) => ({ id: s.id, title: s.title, summary: clip(s.summary ?? '', 160), evidence_status: s.evidence_status, purpose_tags: s.purpose_tags ?? [] }))
  }

  /** Curate a binding. Creating one (a new target) also adds the target to the source's grammar_paths. */
  curate(id, patch, { expected_revision, by, reason, task, example } = {}) {
    const at = id.lastIndexOf('@')
    const sourceId = id.slice(0, at)
    const target = id.slice(at + 1)
    const s = this.index().get(sourceId)
    if (!s) throw new Error(`unknown source: ${sourceId}`)
    if (!existsSync(join(this.repo, target.split('#')[0]))) throw new Error(`target does not exist: ${target}`)
    const allowed = ['description', 'usage', 'enabled', 'favorite', 'priority', 'tags']
    for (const key of Object.keys(patch)) if (!allowed.includes(key)) throw new Error(`not curatable: ${key}`)
    if (patch.description !== undefined && patch.description.length > 240) throw new Error('description over 240 characters')
    if (patch.priority !== undefined && !['preferred', 'normal'].includes(patch.priority)) throw new Error('priority must be preferred or normal')
    if (patch.usage !== undefined && (!patch.usage.problem || !patch.usage.how)) throw new Error('usage needs problem and how')
    this.relationFile(s)
    const stored = this.bindings.update(id, expected_revision, (cur = {}) => ({
      ...cur, source: s.id, target, title: s.title, ...patch, state: 'active',
    }), { op: 'curate', by, reason, task, example, fields: Object.keys(patch) })
    this.setRelation(s, target, true)
    return { binding: this.binding(id), stored_revision: stored.revision }
  }

  /** Delete = remove the relation; curation stays in the store so the binding can be restored. */
  remove(id, { expected_revision, by, reason, task } = {}) {
    const b = this.binding(id)
    if (!b) throw new Error(`unknown binding: ${id}`)
    this.bindings.update(id, expected_revision, (cur = {}) => ({
      ...cur, source: b.source, target: b.target, title: b.title, state: 'removed',
    }), { op: 'remove', by, reason, task })
    this.setRelation(this.index().get(b.source), b.target, false)
    return this.binding(id)
  }

  restore(id, { expected_revision, by, reason, task } = {}) {
    const rec = this.bindings.get(id)
    if (!rec || rec.state !== 'removed') throw new Error(`not a removed binding: ${id}`)
    this.bindings.update(id, expected_revision, (cur) => ({ ...cur, state: 'active' }), { op: 'restore', by, reason, task })
    this.setRelation(this.index().get(rec.source), rec.target, true)
    return this.binding(id)
  }

  review(id, { revision, verdict, note, by }) {
    const b = this.binding(id)
    if (!b) throw new Error(`unknown binding: ${id}`)
    if (!['accurate', 'revised', 'needs-work'].includes(verdict)) throw new Error('verdict must be accurate, revised or needs-work')
    const reviewed = revision ?? b.revision
    this.bindings.update(id, undefined, (cur = {}) => ({
      ...cur, source: b.source, target: b.target, title: b.title,
      reviews: [...(cur.reviews ?? []), { revision: reviewed, by, verdict, note, at: new Date().toISOString() }],
    }), { op: 'review', by, verdict })
    return this.binding(id)
  }

  /** The file that holds a source's relations; refuses a source whose record cannot be found there. */
  relationFile(s) {
    const file = s.kind === 'project-index' ? PROJECT_INDEXES : s.record_path
    if (!editRelations(readJson(join(this.repo, file), {}), s, (list) => list)) throw new Error(`no record for ${s.id} in ${file}`)
    return file
  }

  /** Add or drop one target on the source's own record, then refresh the derived registry entry. */
  setRelation(s, target, present) {
    const path = join(this.repo, this.relationFile(s))
    withLock(path, () => {
      const data = readJson(path)
      let changed = false
      editRelations(data, s, (list) => {
        if (present === list.includes(target)) return list
        changed = true
        return present ? [...list, target] : list.filter((t) => t !== target)
      })
      if (changed) writeJson(path, data)
    })
    this.rebuild()
  }

  // The registry and the snapshot manifest are derived; their builders own the format.
  rebuild({ snapshots = false } = {}) {
    execFileSync('python3', ['scripts/build_registry.py'], { cwd: this.repo, stdio: 'ignore' })
    if (snapshots) execFileSync('python3', ['scripts/build_snapshot_manifest.py'], { cwd: this.repo, stdio: 'ignore' })
  }

  /**
   * Register new sources in the capture catalog in one write. Every item is checked first; an item
   * whose URL is already registered returns that source instead. `task` says what the sources were
   * collected for and stays on each record, so a reviewer can see why it is in the roster.
   */
  capture(items, { task, by, reason } = {}) {
    if (!task?.trim()) throw new Error('capture needs task: what these sources were collected for')
    if (!Array.isArray(items) || !items.length) throw new Error('capture needs at least one source')
    const catalogPath = join(this.repo, CAPTURE_CATALOG)
    const byUrl = new Map(this.registry().sources.filter((s) => s.canonical_url).map((s) => [normalizeUrl(s.canonical_url), s.id]))
    const slugs = new Set(readJson(catalogPath, captureCatalog()).sources.map((s) => s.slug))
    const at = new Date().toISOString()
    const plan = items.map((input) => {
      const url = input.url?.trim()
      const locator = input.locator?.trim()
      if (!url && !locator) throw new Error('capture needs url or locator')
      for (const field of ['title', 'summary', 'read_scope', 'limits', 'revisit_when']) {
        if (!input[field]?.trim()) throw new Error(`capture needs ${field}: ${input.title ?? url ?? locator}`)
      }
      if (url && byUrl.has(normalizeUrl(url))) return { id: byUrl.get(normalizeUrl(url)), existing: true }
      const slug = input.slug ?? slugify(input.title, url ?? locator)
      if (!SLUG.test(slug)) throw new Error(`bad slug: ${slug}`)
      if (slugs.has(slug)) throw new Error(`slug exists: ${slug}`)
      const status = input.evidence_status ?? 'partial'
      if (!['verified', 'partial', 'unavailable'].includes(status)) throw new Error('evidence_status must be verified, partial or unavailable')
      const id = `provenance-praxis-captures:${slug}`
      slugs.add(slug)
      if (url) byUrl.set(normalizeUrl(url), id)
      const record = {
        slug,
        url: url ?? locator,
        original_url: url ?? null,
        title: input.title.trim(),
        status,
        summary_zh: input.summary.trim(),
        limits: input.limits.trim(),
        revisit_trigger: input.revisit_when.trim(),
        card_path: `${dirname(CAPTURE_CATALOG)}/${slug}.md`,
        purpose_tags: input.tags ?? [],
        evidence_modality: input.read_scope.trim(),
        captured_for: { task: task.trim(), by, at },
        history_record: `${dirname(CAPTURE_CATALOG)}/CHANGELOG.md`,
        ...(input.excerpts?.length ? { supported_claims: input.excerpts.map((e, i) => ({ claim_id: `${slug}-C${i + 1}`, locator: e.locator, claim: e.claim })) } : {}),
      }
      return { id, record, input }
    })
    const fresh = plan.filter((p) => p.record)
    if (fresh.length) {
      withLock(catalogPath, () => {
        const catalog = readJson(catalogPath, captureCatalog())
        for (const { record } of fresh) if (catalog.sources.some((s) => s.slug === record.slug)) throw new Error(`slug exists: ${record.slug}`)
        catalog.sources.push(...fresh.map((p) => p.record))
        catalog.as_of = at.slice(0, 10)
        writeJson(catalogPath, catalog, 2)
      })
      for (const { record, input } of fresh) writeCard(join(this.repo, record.card_path), record, input)
      ensureCaptureDocs(this.repo)
      this.rebuild()
      for (const { id } of fresh) this.bindings.log({ op: 'capture', id, by, reason, task })
    }
    return plan.map(({ id, existing }) => {
      const s = this.source(id)
      return { id, title: s.title, url: s.url, existing: !!existing }
    })
  }

  /**
   * Register a project's own source index by reference: the file stays in the project and is read in
   * place. `fields` maps registry fields (id, title, url, summary, read_scope, status, tags) to the
   * project's names; `status` maps its status values to verified, partial or unavailable; `excerpts`
   * names a JSON Lines file of claims joined by source id. Registering the same id again updates the
   * registration and keeps its relations.
   */
  registerIndex({ id, path, list, title, purpose, limits, revisit_when, fields, status, excerpts }, { by, reason } = {}) {
    for (const [k, v] of Object.entries({ id, path, title, purpose, limits, revisit_when })) if (!v?.trim()) throw new Error(`register_index needs ${k}`)
    if (!SLUG.test(id)) throw new Error(`bad id: ${id}`)
    if (!fields?.id || !fields?.title) throw new Error('fields needs id and title')
    const unknown = Object.keys(fields).filter((k) => !INDEX_FIELDS.includes(k))
    if (unknown.length) throw new Error(`fields: unknown ${unknown.join(', ')}; use ${INDEX_FIELDS.join(', ')}`)
    if (!existsSync(join(this.repo, path))) throw new Error(`file not found: ${path}`)
    const data = readJson(join(this.repo, path))
    const records = list ? data?.[list] : data
    if (!Array.isArray(records)) throw new Error(`${path}${list ? ` .${list}` : ''} is not a list of records`)
    const seen = new Set()
    for (const r of records) {
      const local = r?.[fields.id]
      if (local === undefined || local === null || !r[fields.title]) throw new Error(`a record in ${path} lacks ${fields.id} or ${fields.title}`)
      if (seen.has(String(local))) throw new Error(`duplicate ${fields.id} in ${path}: ${local}`)
      seen.add(String(local))
      const value = fields.status ? r[fields.status] : undefined
      if (value !== undefined && !['verified', 'partial', 'unavailable'].includes(status?.[value] ?? value)) throw new Error(`status value ${value} needs a mapping to verified, partial or unavailable`)
    }
    if (excerpts) {
      for (const k of ['path', 'id', 'source', 'locator', 'claim']) if (!excerpts[k]) throw new Error(`excerpts needs ${k}`)
      if (!existsSync(join(this.repo, excerpts.path))) throw new Error(`file not found: ${excerpts.path}`)
    }
    const regPath = join(this.repo, PROJECT_INDEXES)
    let created
    withLock(regPath, () => {
      const reg = readJson(regPath, { indexes: [] })
      const cur = reg.indexes.find((r) => r.id === id)
      const next = { id, title: title.trim(), path, ...(list ? { list } : {}), purpose: purpose.trim(), limits: limits.trim(), revisit_when: revisit_when.trim(),
        fields, ...(status ? { status } : {}), ...(excerpts ? { excerpts } : {}), relations: cur?.relations ?? {} }
      created = !cur
      reg.indexes = cur ? reg.indexes.map((r) => (r.id === id ? next : r)) : [...reg.indexes, next]
      writeJson(regPath, reg)
    })
    this.rebuild()
    this.bindings.log({ op: 'register-index', id, path, by, reason })
    return { id, path, created, sources: records.length }
  }

  /**
   * Save the current bytes of a source URL as a new versioned snapshot. The catalog record
   * points at the latest version; every version is registered in the capture intake.
   */
  async refresh(sourceId, { by, reason, task, fetchImpl = fetch } = {}) {
    const s = this.source(sourceId)
    if (!s) throw new Error(`unknown source: ${sourceId}`)
    if (!s.url?.startsWith('http')) throw new Error('refresh needs an http(s) URL')
    const res = await fetchImpl(s.url, { redirect: 'follow' })
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
    const bytes = Buffer.from(await res.arrayBuffer())
    const sha = createHash('sha256').update(bytes).digest('hex')
    const previous = s.snapshot
    if (previous?.sha256 === sha) return { changed: false, snapshot: previous }
    const ext = extFor(res.headers.get('content-type') ?? '')
    const slug = s.id.slice(s.id.indexOf(':') + 1)
    const ns = s.id.slice(0, s.id.indexOf(':'))
    const date = new Date().toISOString().slice(0, 10)
    const rel = `vault/snapshots/local/praxis/${ns}/${slug}/${date}-${sha.slice(0, 12)}${ext}`
    mkdirSync(dirname(join(this.repo, rel)), { recursive: true })
    writeFileSync(join(this.repo, rel), bytes)
    const snapshot = { path: rel, sha256: sha, status: 'captured', size_bytes: bytes.length, previous: previous?.path ?? null }
    const intakePath = join(this.repo, CAPTURE_INTAKE)
    withLock(intakePath, () => {
      const intake = readJson(intakePath, captureIntake())
      intake.source_snapshots.push({
        source_id: s.id, snapshot_path: rel, sha256: sha, size_bytes: bytes.length,
        original_path: s.url, source_mtime: null, captured_at: new Date().toISOString(),
        content_type: res.headers.get('content-type'), previous: previous?.path ?? null, by,
      })
      writeJson(intakePath, intake, 1)
    })
    const catalogPath = join(this.repo, s.record_path)
    withLock(catalogPath, () => {
      const catalog = readJson(catalogPath)
      const rec = catalog.sources.find((x) => x.slug === slug)
      Object.assign(rec, { snapshot_path: rel, snapshot_sha256: sha, snapshot_size_bytes: bytes.length, snapshot_status: 'captured' })
      writeJson(catalogPath, catalog)
    })
    this.rebuild({ snapshots: true })
    this.bindings.log({ op: 'refresh', id: s.id, snapshot: rel, by, reason, task })
    return { changed: true, snapshot, bindings: this.listBindings({ source: s.id }).map((b) => b.id) }
  }
}

export const INDEX_FIELDS = ['id', 'title', 'url', 'summary', 'read_scope', 'status', 'tags']

/**
 * Apply fn to the relation list a source keeps: on its record in a catalog, a references catalog,
 * a reading-list intake or a package intake; for a project index, in the registration. Returns
 * false when the file holds no record for the source.
 */
function editRelations(data, s, fn) {
  if (s.kind === 'project-index') {
    const reg = data.indexes?.find((r) => r.id === s.collection)
    if (!reg) return false
    const local = s.id.slice(s.collection.length + 1)
    const next = fn(reg.relations?.[local] ?? [])
    reg.relations = { ...reg.relations }
    if (next.length) reg.relations[local] = next
    else delete reg.relations[local]
    return true
  }
  const slug = s.id.slice(s.id.indexOf(':') + 1)
  const rec = data.resources?.find((r) => r.id === s.id)
    ?? data.explicit_url_identities?.find((r) => r.source_id === s.id)
    ?? (data.id === s.id ? data : undefined)
    ?? data.sources?.find((r) => r.slug === slug)
  if (!rec) return false
  const next = fn(rec.grammar_paths ?? [])
  if (next.length) rec.grammar_paths = next
  else delete rec.grammar_paths
  return true
}

function matchTarget(t, target) {
  return t === target || t.split('#')[0] === target || t.startsWith(target.replace(/\/?$/, '/'))
}

export function normalizeUrl(url) {
  try {
    const u = new URL(url)
    u.hash = ''
    for (const k of [...u.searchParams.keys()]) if (k.startsWith('utm_')) u.searchParams.delete(k)
    return `${u.protocol}//${u.host.toLowerCase()}${u.pathname.replace(/\/$/, '')}${u.search}`
  } catch {
    return url
  }
}

function slugify(title, fallback) {
  const ascii = title.normalize('NFKD').replace(/[^\x00-\x7f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (ascii.length >= 3) return ascii.slice(0, 60).replace(/-$/, '')
  return 'src-' + createHash('sha256').update(fallback).digest('hex').slice(0, 10)
}

function extFor(type) {
  if (type.includes('html')) return '.html'
  if (type.includes('json')) return '.json'
  if (type.includes('pdf')) return '.pdf'
  if (type.includes('png')) return '.png'
  if (type.includes('jpeg')) return '.jpg'
  if (type.includes('svg')) return '.svg'
  return '.txt'
}

function captureCatalog() {
  return {
    schema_version: '1.0',
    cards: 'maintained',
    catalog_id: 'praxis-captures',
    origin: 'dsh-praxis capture',
    as_of: null,
    history_record: 'vault/provenance/praxis-captures/CHANGELOG.md',
    registry_extensions: true,
    sources: [],
    occurrences: [],
  }
}

function captureIntake() {
  return {
    schema_version: '1.0',
    id: 'praxis-captures',
    kind: 'capture-snapshots',
    title: 'dsh-praxis 刷新得到的来源快照',
    note: '每次 refresh 新增一个版本；旧版本保留，供历史消费回查。',
    source_snapshots: [],
  }
}

function writeCard(path, r, input) {
  mkdirSync(dirname(path), { recursive: true })
  const claims = (r.supported_claims ?? []).map((c) => `- ${c.claim}（${c.locator}）`).join('\n')
  writeFileSync(path, `# ${r.title}

${r.url ? `原件：<${r.url}>` : ''}

## 是什么

${r.summary_zh}

读取范围：${r.evidence_modality}。证据状态：${r.status}。
${claims ? `\n## 支持的说法\n\n${claims}\n` : ''}
## 边界

${r.limits}

## 何时重访

${r.revisit_trigger}
${input.usage_note ? `\n## 本 Kit 取用什么\n\n${input.usage_note}\n` : ''}`)
}

function ensureCaptureDocs(repo) {
  const dir = join(repo, dirname(CAPTURE_CATALOG))
  const readme = join(dir, 'README.md')
  if (!existsSync(readme)) {
    writeFileSync(readme, `# dsh-praxis 收录

agent 或控制面用 capture 登记的来源：一条记录一张来源卡，卡片由 dsh-praxis 写出，之后按普通维护卡片对待。登记在 [catalog](catalog.json)，修订经过在 [CHANGELOG](CHANGELOG.md)，快照版本在 [刷新登记](../../intake/praxis-captures.json)。
`)
  }
  const log = join(dir, 'CHANGELOG.md')
  if (!existsSync(log)) writeFileSync(log, '# 修订记录\n\n逐条操作记录在 dsh-praxis/data/history.jsonl。\n')
}
