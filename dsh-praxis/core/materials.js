// Materials: the roster of sources and their relations to Kit pages and other targets.
// Praxis registers links, not text: a source records where the original is (a URL), what it is
// for, how it was read and which passages back which claims. Sources come from Praxis's own store
// (capture) and from source packs registered by reference (a registry file, or a project's own
// index read through field maps); packs stay where their owner keeps them and are never written.
// The catalog files any roster source, own or a pack's, by form and Kit area with a description
// and its latest review. Relations are bindings: a pack may declare some, and the binding store records
// every relation made, removed or curated through Praxis, so all of a page's sources are read in one place.
// Local work (drafts, project files, distilled notes) is not a source: it is recorded as an
// artifact trace in the task output layer.
import { createHash } from 'node:crypto'
import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { Collection, readJson } from './store.js'
import { pathsFor } from './paths.js'
import { clip } from './kit.js'

const SLUG = /^[A-Za-z0-9][A-Za-z0-9._-]*$/
// Own sources are `praxis:<slug>`; pack sources keep the pack's ids.
export const OWN = 'praxis'
export const STATUSES = ['verified', 'partial', 'unavailable']
export const INDEX_FIELDS = ['id', 'title', 'url', 'summary', 'read_scope', 'status', 'tags']

// Signals that a binding needs someone now. Default states (no curated description, never
// reviewed, disabled) are not signals: the source summary stands in until someone has a reason
// to curate. `changed`: the source's content changed after the binding's last review.
// `unreachable`: the last check found the link gone (404, 410, or a host that no longer resolves).
// A refusal, a rate limit or a timeout says more about the network that checked than about the link.
export const SIGNALS = ['needs_work', 'changed', 'unreachable']
// What kind of thing a source is: the catalog's second level under a Kit area.
export const FORMS = ['standard', 'practice', 'component-library', 'case-library', 'case', 'skill', 'tool', 'article', 'research']
export const VERDICTS = ['accurate', 'revised', 'needs-work']
const GONE = (c) => c.status === 'unreachable' && ([404, 410].includes(c.http) || c.error === 'ENOTFOUND')

// What a check compares: an HTML page by its text, since markup carries per-load tokens and its bytes
// differ on every fetch; anything else by its bytes. An HTML check without a text hash has no basis.
const isHtml = (type) => /html/i.test(type ?? '')
const contentKey = (c) => c.text_sha256 ?? (c.sha256 && !isHtml(c.content_type) ? c.sha256 : undefined)
export function pageText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|template|svg)\b[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function signalsOf(b, state) {
  const last = b.review
  const since = state?.changed.get(b.source)
  // A review records the source version it saw; one recorded before that is placed by time.
  const seen = last && (last.source_version !== undefined ? last.source_version === state?.current.get(b.source) : last.at >= since)
  return [
    last?.verdict === 'needs-work' && 'needs_work',
    since && !seen && 'changed',
    state?.unreachable.has(b.source) && 'unreachable',
  ].filter(Boolean)
}

export function bindingId(sourceId, target) {
  return `${sourceId}@${target}`
}

export class Materials {
  /** `where` is the resolved locations (paths.js); `categories()` lists the Kit areas a source may be filed under. */
  constructor(where, { categories = () => [] } = {}) {
    this.where = where
    this.paths = pathsFor(where)
    this.categories = categories
    const history = join(where.data, 'history.jsonl')
    this.bindings = new Collection(join(where.data, 'bindings.json'), history)
    this.own = new Collection(join(where.data, 'sources.json'), history)
    this.packs = new Collection(join(where.data, 'packs.json'), history)
    this.catalog = new Collection(join(where.data, 'catalog.json'), history)
    this.checksPath = join(where.data, 'checks.jsonl')
  }

  // ---- the roster ----------------------------------------------------------------------------

  /** Every source, own first, then each active pack's; reread when any file behind them changes. */
  roster() {
    const packs = Object.entries(this.packs.all()).map(([id, p]) => ({ id, ...p })).filter((p) => p.state !== 'removed')
    const files = [this.own.path, this.packs.path, this.catalog.path, ...packs.flatMap((p) => [p.path, p.excerpts?.path].filter(Boolean).map((f) => this.paths.absolute(f)))]
    const key = files.map((f) => { try { const st = statSync(f); return `${f}@${st.mtimeMs}/${st.size}` } catch { return f } }).join('|')
    if (this.cache?.key === key) return this.cache.value
    const list = []
    for (const [id, r] of Object.entries(this.own.all())) list.push(ownEntry(id, r))
    for (const p of packs) list.push(...(p.kind === 'registry' ? this.registryEntries(p) : this.indexEntries(p)))
    const catalog = this.catalog.all()
    for (const s of list) {
      const e = catalog[s.id]
      if (e) Object.assign(s, { form: e.form, category: e.category, description: e.description, review: e.review, entry_revision: e.revision })
    }
    const byId = new Map()
    for (const s of list) {
      if (!byId.has(s.id)) byId.set(s.id, s)
      for (const alias of s.aliases) if (!byId.has(alias)) byId.set(alias, s)
    }
    const value = { list, byId, packs: new Map(packs.map((p) => [p.id, p])) }
    this.cache = { key, value }
    return value
  }

  /** A registry pack: records in the Praxis registry format, paths relative to the pack's root. */
  registryEntries(p) {
    const reg = readJson(this.paths.absolute(p.path), { sources: [] })
    const root = this.paths.absolute(p.root ?? dirname(p.path))
    const at = (rel) => (rel ? this.paths.normalize(join(root, rel)) : undefined)
    return reg.sources.map((s) => {
      const url = s.canonical_url ?? (/^https?:/.test(s.original_locator ?? '') ? s.original_locator : undefined)
      return {
        id: s.id, aliases: s.aliases ?? [], pack: p.id, collection: s.collection, kind: s.kind, title: s.title,
        url, locator: url ? undefined : s.original_locator ?? undefined,
        summary: s.summary ?? '', evidence_status: s.evidence_status, tags: s.purpose_tags ?? [],
        limits: s.limitations ?? [], revisit_when: s.revisit_when, card: at(s.local_card),
        read_scope: s.evidence_modality, captured_for: s.captured_for, priority: s.reference_priority, category: undefined,
        excerpts: claims(s.supported_claims), snapshot: s.snapshot_path ? { path: at(s.snapshot_path), sha256: s.snapshot_sha256, status: s.snapshot_status } : undefined,
        declared: (s.grammar_paths ?? []).map((t) => this.paths.normalize(join(root, t.split('#')[0])) + (t.includes('#') ? t.slice(t.indexOf('#')) : '')),
        state: 'active',
      }
    })
  }

  /** A project's own index, read in place through the registration's field and status maps. */
  indexEntries(p) {
    const data = readJson(this.paths.absolute(p.path), [])
    const records = (p.list ? data?.[p.list] : data) ?? []
    const f = p.fields
    const byLocal = new Map()
    if (p.excerpts && existsSync(this.paths.absolute(p.excerpts.path))) {
      const x = p.excerpts
      for (const line of readFileSync(this.paths.absolute(x.path), 'utf8').split('\n')) {
        if (!line.trim()) continue
        const c = JSON.parse(line)
        const list = byLocal.get(String(c[x.source])) ?? byLocal.set(String(c[x.source]), []).get(String(c[x.source]))
        list.push({ id: c[x.id], locator: c[x.locator], claim: c[x.claim] })
      }
    }
    return records.map((r) => {
      const local = String(r[f.id])
      const url = f.url ? r[f.url] || undefined : undefined
      const status = f.status ? r[f.status] : undefined
      return {
        id: `${p.id}:${local}`, aliases: [], pack: p.id, collection: p.id, kind: 'project-index', title: r[f.title],
        url, locator: url ? undefined : `${p.path}#${local}`,
        summary: f.summary ? r[f.summary] ?? '' : '', evidence_status: p.status?.[status] ?? status ?? 'partial',
        tags: f.tags && r[f.tags] ? [r[f.tags]].flat() : [], limits: [p.limits], revisit_when: p.revisit_when, card: undefined,
        read_scope: f.read_scope ? r[f.read_scope] : undefined, captured_for: undefined, priority: undefined, category: undefined,
        excerpts: byLocal.get(local) ?? [], snapshot: undefined, declared: [], state: 'active',
      }
    })
  }

  /** One source as readers and tools see it, with what refresh has observed of it. */
  source(ref) {
    const s = this.roster().byId.get(ref)
    if (!s) return undefined
    const { declared, ...rest } = s
    const signals = s.form ? signalsOf({ source: s.id, review: s.review }, this.sourceState()) : []
    return { ...rest, purpose_tags: s.tags, signals, ...this.observed(s) }
  }

  /** What a source's collection was gathered for: the pack registration's purpose, or its catalog README's lede. */
  collectionOf(s) {
    if (s.pack === undefined) return { id: OWN, title: 'Praxis', purpose: s.captured_for?.task }
    const p = this.roster().packs.get(s.pack)
    if (p.kind !== 'registry') return { id: p.id, title: p.title, path: p.path, purpose: p.purpose }
    const reg = readJson(this.paths.absolute(p.path), { collections: [] })
    const c = reg.collections?.find((x) => x.id === s.collection)
    if (!c) return { id: p.id, title: p.title, purpose: p.purpose }
    if (c.purpose) return { id: c.id, title: c.title, path: c.path, purpose: c.purpose }
    const readme = join(this.paths.absolute(p.root ?? dirname(p.path)), dirname(c.path), 'README.md')
    if (!existsSync(readme)) return { id: c.id, path: c.path }
    const text = readFileSync(readme, 'utf8')
    const title = text.match(/^#\s+(.+)$/m)?.[1]
    const lede = text.split(/\n\s*\n/).map((x) => x.trim()).find((x) => x && !/^[#|>!<-]/.test(x) && !/^\[/.test(x))
    return { id: c.id, title, path: c.path, readme: this.paths.normalize(readme), purpose: lede ? clip(lede.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' '), 240) : undefined }
  }

  search({ query = '', tag, status, category, form, limit = 20 } = {}) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    const filed = category ? this.filedUnder() : undefined
    const hits = []
    for (const s of this.roster().list) {
      if (s.state === 'retired') continue
      if (tag && !s.tags.includes(tag)) continue
      if (status && s.evidence_status !== status) continue
      if (form && s.form !== form) continue
      if (category && !(filed.get(s.id) ?? []).some((c) => c === category || c.startsWith(`${category}/`))) continue
      const hay = [s.id, s.title, s.description ?? '', s.summary, s.url ?? s.locator ?? '', ...s.tags, ...s.aliases].join(' ').toLowerCase()
      const score = terms.reduce((n, t) => n + (hay.includes(t) ? (s.title?.toLowerCase().includes(t) ? 3 : 1) : -100), 0)
      if (!terms.length || score > 0) hits.push({ score, s })
    }
    hits.sort((a, b) => b.score - a.score)
    return hits.slice(0, limit).map(({ s }) => ({
      id: s.id, title: s.title, description: s.description, summary: clip(s.summary ?? '', 160), form: s.form, evidence_status: s.evidence_status, purpose_tags: s.tags, category: s.category,
    }))
  }

  /** Source id → the Kit areas it is filed under: its own category, else the areas of the units it serves. */
  filedUnder() {
    const out = new Map()
    for (const s of this.roster().list) if (s.category) out.set(s.id, [s.category])
    for (const b of this.listBindings()) {
      const m = b.target.match(/^kit\/([^#]+?)(?:\/README)?\.md/)
      if (!m || out.get(b.source)?.includes(m[1])) continue
      out.set(b.source, [...(out.get(b.source) ?? []), m[1]])
    }
    return out
  }

  // ---- bindings --------------------------------------------------------------------------------

  /** Every active binding: relations a pack declares unless removed here, and relations made here. */
  listBindings({ target, source, includeRemoved = false } = {}) {
    const stored = this.bindings.all()
    const { list, byId } = this.roster()
    const state = this.sourceState()
    const out = new Map()
    const want = (t) => !target || matchTarget(t, this.paths.normalize(target))
    for (const s of list) {
      if (s.state === 'retired' || (source && s.id !== source)) continue
      for (const t of s.declared) {
        const id = bindingId(s.id, t)
        if (want(t) && (includeRemoved || stored[id]?.state !== 'removed')) out.set(id, this.compose(id, s, t, stored[id], state))
      }
    }
    for (const [id, rec] of Object.entries(stored)) {
      if (out.has(id) || (rec.state !== 'active' && !(includeRemoved && rec.state === 'removed'))) continue
      if ((source && rec.source !== source) || !want(rec.target)) continue
      const s = byId.get(rec.source)
      if (rec.state === 'active' && (!s || s.state === 'retired')) continue
      out.set(id, this.compose(id, s, rec.target, rec, state))
    }
    return [...out.values()]
  }

  binding(id) {
    const at = id.lastIndexOf('@')
    const sourceId = id.slice(0, at)
    const target = this.paths.normalize(id.slice(at + 1))
    return this.listBindings({ source: sourceId, includeRemoved: true }).find((b) => b.target === target)
  }

  compose(id, s, target, rec = {}, state = this.sourceState()) {
    const b = {
      id,
      source: s?.id ?? rec.source,
      target,
      title: s?.title ?? rec.title,
      description: rec.description ?? s?.description ?? clip(s?.summary ?? '', 160),
      description_curated: rec.description !== undefined,
      usage: rec.usage,
      enabled: rec.enabled ?? true,
      favorite: rec.favorite ?? false,
      priority: rec.priority ?? s?.priority ?? 'normal',
      tags: rec.tags ?? s?.tags ?? [],
      state: rec.state === 'removed' ? 'removed' : 'active',
      declared: !!s?.declared.includes(target),
      review: rec.review,
      revision: rec.revision ?? 0,
      evidence_status: s?.evidence_status,
    }
    b.signals = signalsOf(b, state)
    return b
  }

  /** Curate a binding; a new target makes the relation. */
  curate(id, patch, { expected_revision, by, reason, task, example } = {}) {
    const at = id.lastIndexOf('@')
    const s = this.roster().byId.get(id.slice(0, at))
    if (!s) throw new Error(`unknown source: ${id.slice(0, at)}`)
    const target = this.paths.normalize(id.slice(at + 1))
    if (!existsSync(this.paths.absolute(target))) throw new Error(`target does not exist: ${target}`)
    const allowed = ['description', 'usage', 'enabled', 'favorite', 'priority', 'tags']
    for (const key of Object.keys(patch)) if (!allowed.includes(key)) throw new Error(`not curatable: ${key}`)
    if (patch.description !== undefined && patch.description.length > 240) throw new Error('description over 240 characters')
    if (patch.priority !== undefined && !['preferred', 'normal'].includes(patch.priority)) throw new Error('priority must be preferred or normal')
    if (patch.usage !== undefined && (!patch.usage.problem || !patch.usage.how)) throw new Error('usage needs problem and how')
    const key = bindingId(s.id, target)
    const stored = this.bindings.update(key, expected_revision, (cur = {}) => ({
      ...cur, source: s.id, target, title: s.title, ...patch, state: 'active',
    }), { op: 'curate', by, reason, task, example, fields: Object.keys(patch) })
    return { binding: this.binding(key), stored_revision: stored.revision }
  }

  /** Remove the relation; curation stays so the binding can be restored. */
  remove(id, { expected_revision, by, reason, task } = {}) {
    const b = this.binding(id)
    if (!b || b.state === 'removed') throw new Error(`unknown binding: ${id}`)
    this.bindings.update(b.id, expected_revision, (cur = {}) => ({
      ...cur, source: b.source, target: b.target, title: b.title, state: 'removed',
    }), { op: 'remove', by, reason, task })
    return this.binding(b.id)
  }

  restore(id, { expected_revision, by, reason, task } = {}) {
    const b = this.binding(id)
    if (!b || b.state !== 'removed') throw new Error(`not a removed binding: ${id}`)
    this.bindings.update(b.id, expected_revision, (cur) => ({ ...cur, state: 'active' }), { op: 'restore', by, reason, task })
    return this.binding(b.id)
  }

  /** The latest review replaces the one before; history.jsonl keeps the earlier ones. */
  review(id, { revision, verdict, note, by }) {
    const b = this.binding(id)
    if (!b) throw new Error(`unknown binding: ${id}`)
    if (!VERDICTS.includes(verdict)) throw new Error(`verdict must be ${VERDICTS.join(', ')}`)
    const reviewed = revision ?? b.revision
    this.bindings.update(b.id, undefined, (cur = {}) => ({
      ...cur, source: b.source, target: b.target, title: b.title, state: cur?.state ?? b.state,
      review: { revision: reviewed, source_version: this.source(b.source)?.version ?? null, by, verdict, note, at: new Date().toISOString() },
    }), { op: 'review', by, verdict })
    return this.binding(b.id)
  }

  /** Own sources the catalog cannot place: no form, or neither a Kit area nor a page that binds them. */
  unfiled() {
    const bound = new Set(this.listBindings().map((b) => b.source))
    return this.roster().list.filter((s) => s.pack === undefined && s.state !== 'retired' && (!s.form || (!s.category && !bound.has(s.id))))
      .map((s) => ({ id: s.id, title: s.title, summary: clip(s.summary ?? '', 160), evidence_status: s.evidence_status, form: s.form, category: s.category }))
  }

  // ---- the catalog -----------------------------------------------------------------------------

  /** File a roster source, own or a pack's, by form, Kit area and description. A pack is never written. */
  file(id, patch, { expected_revision, by, reason, task } = {}) {
    const s = this.roster().byId.get(id)
    if (!s) throw new Error(`unknown source: ${id}`)
    for (const key of Object.keys(patch)) if (!['form', 'category', 'description'].includes(key)) throw new Error(`not a catalog field: ${key}`)
    this.checkEntry(patch)
    this.cache = undefined
    this.catalog.update(s.id, expected_revision, (cur = {}) => ({ ...cur, ...patch }), { op: 'file', by, reason, task, fields: Object.keys(patch) })
    return this.source(s.id)
  }

  checkEntry({ form, category, description }) {
    if (form !== undefined && !FORMS.includes(form)) throw new Error(`form must be ${FORMS.join(', ')}`)
    if (category && !this.categories().includes(category)) throw new Error(`category must be a Kit area: ${this.categories().join(', ')}`)
    if (description !== undefined && (!description.trim() || description.length > 240)) throw new Error('description must be 1–240 characters')
  }

  /** Review a catalog entry's description; the review names the entry revision and source version it saw. */
  reviewEntry(id, { revision, verdict, note, by }) {
    const s = this.roster().byId.get(id)
    if (!s?.form) throw new Error(`not in the catalog: ${id}`)
    if (!VERDICTS.includes(verdict)) throw new Error(`verdict must be ${VERDICTS.join(', ')}`)
    this.cache = undefined
    this.catalog.update(s.id, undefined, (cur) => ({
      ...cur, review: { revision: revision ?? cur.revision, source_version: this.source(s.id)?.version ?? null, by, verdict, note, at: new Date().toISOString() },
    }), { op: 'review', by, verdict })
    return this.source(s.id)
  }

  // ---- what refresh has seen -------------------------------------------------------------------

  /** Checks per source, oldest first: status, content hash, a kept snapshot, the member links of a collection. */
  observations() {
    const out = new Map()
    if (!existsSync(this.checksPath)) return out
    for (const line of readFileSync(this.checksPath, 'utf8').split('\n')) {
      if (!line.trim()) continue
      const c = JSON.parse(line)
      ;(out.get(c.source) ?? out.set(c.source, []).get(c.source)).push(c)
    }
    return out
  }

  /** Sources whose content changed (with the time of the latest change), their current content, and sources whose link is gone. */
  sourceState() {
    const changed = new Map()
    const current = new Map()
    const unreachable = new Set()
    for (const [id, list] of this.observations()) {
      let seen
      for (const o of list) {
        const key = contentKey(o)
        if (!key) continue
        if (seen && seen !== key) changed.set(id, o.at)
        seen = key
      }
      if (seen) current.set(id, seen)
      if (GONE(list.at(-1))) unreachable.add(id)
    }
    return { changed, current, unreachable }
  }

  /** The latest kept snapshot (else the one the record names), the latest check, and `version`: the hash a run records. */
  observed(s) {
    const list = this.observations().get(s.id) ?? []
    const kept = list.filter((o) => o.snapshot).at(-1)
    const snapshot = kept ? { path: this.paths.normalize(join(this.where.snapshots, kept.snapshot.path)), sha256: kept.snapshot.sha256, status: 'captured' } : s.snapshot
    const last = list.at(-1)
    const check = last ? { at: last.at, status: last.status, http: last.http, sha256: last.sha256, error: last.error } : undefined
    const version = list.map(contentKey).filter(Boolean).at(-1) ?? snapshot?.sha256 ?? null
    return { snapshot, check, version }
  }

  /**
   * Check a source URL against upstream: whether it answered and the hash of what it served (an HTML
   * page also by the hash of its text), not the content. With `keep`, also save the bytes under the snapshots folder (old versions stay). For a
   * collection (a source with a members pattern), also record the member links the page lists.
   */
  async refresh(sourceId, { keep = false, by, reason, task, fetchImpl = fetch } = {}) {
    const s = this.source(sourceId)
    if (!s) throw new Error(`unknown source: ${sourceId}`)
    if (!s.url?.startsWith('http')) throw new Error('refresh needs an http(s) URL')
    let res
    let bytes
    let error
    try {
      res = await fetchImpl(s.url, { redirect: 'follow' })
      if (res.ok) bytes = Buffer.from(await res.arrayBuffer())
      else error = `HTTP ${res.status}`
    } catch (e) {
      error = e.cause?.code ?? e.message
    }
    const at = new Date().toISOString()
    const sha = bytes && createHash('sha256').update(bytes).digest('hex')
    const contentType = res?.headers.get('content-type') ?? null
    const check = bytes
      ? { source: s.id, at, status: 'ok', http: res.status, sha256: sha, ...(isHtml(contentType) ? { text_sha256: createHash('sha256').update(pageText(bytes.toString('utf8'))).digest('hex') } : {}), size_bytes: bytes.length, content_type: contentType, by }
      : { source: s.id, at, status: 'unreachable', http: res?.status ?? null, error, by }
    // The last comparable check, else (for bytes) the snapshot the record names; the first check is the baseline.
    const before = (this.observations().get(s.id) ?? []).map(contentKey).filter(Boolean).at(-1) ?? (check.text_sha256 ? undefined : s.snapshot?.sha256)
    if (bytes && keep && s.snapshot?.sha256 !== sha) {
      const slug = s.id.slice(s.id.indexOf(':') + 1).replace(/[^A-Za-z0-9._-]/g, '-')
      const name = new URL(s.url).pathname.split('/').filter(Boolean).at(-1)?.replace(/[^A-Za-z0-9._-]/g, '-').replace(/^\.+/, '') || 'index.html'
      let rel = `${slug}/${name}`
      if (existsSync(join(this.where.snapshots, rel))) rel = `${slug}/${sha.slice(0, 12)}-${name}` // an older version stays where it is
      mkdirSync(dirname(join(this.where.snapshots, rel)), { recursive: true })
      writeFileSync(join(this.where.snapshots, rel), bytes)
      check.snapshot = { path: rel, sha256: sha, size_bytes: bytes.length, previous: s.snapshot?.path ?? null }
    }
    if (bytes && s.members) check.members = memberLinks(bytes.toString('utf8'), s.url, s.members.pattern)
    mkdirSync(dirname(this.checksPath), { recursive: true })
    appendFileSync(this.checksPath, JSON.stringify(check) + '\n')
    this.bindings.log({ op: 'refresh', id: s.id, status: check.status, sha256: sha, snapshot: check.snapshot?.path, by, reason, task })
    const changed = !!before && !!contentKey(check) && before !== contentKey(check)
    const { members: listed, ...shown } = check
    return {
      reachable: !!bytes, changed, check: listed ? { ...shown, members: listed.length } : shown,
      snapshot: check.snapshot ? { ...check.snapshot, path: this.paths.normalize(join(this.where.snapshots, check.snapshot.path)) } : undefined,
      bindings: changed || !bytes ? this.listBindings({ source: s.id }).map((b) => b.id) : [],
      members: s.members ? this.members(s.id) : undefined,
    }
  }

  // ---- own sources -----------------------------------------------------------------------------

  /**
   * Register sources in one write. Every item is checked first; an item whose URL is already in the
   * roster returns that source instead. `task` says what they were collected for and stays on each.
   * `form`, `category` (a Kit area) and `description` file it in the catalog;
   * `members` marks a collection whose upstream lists member links matching the pattern;
   * `member_of` names the collection a member came from.
   */
  capture(items, { task, by, reason, session } = {}) {
    if (!task?.trim()) throw new Error('capture needs task: what these sources were collected for')
    if (!Array.isArray(items) || !items.length) throw new Error('capture needs at least one source')
    const { list, byId } = this.roster()
    const byUrl = new Map(list.filter((s) => s.url).map((s) => [normalizeUrl(s.url), s.id]))
    const at = new Date().toISOString()
    const ids = new Set()
    const plan = items.map((input) => {
      const url = input.url?.trim()
      if (!/^https?:\/\//.test(url ?? '')) throw new Error(`capture needs an http(s) url; local work is recorded as an artifact: ${input.title ?? url ?? ''}`)
      for (const field of ['title', 'summary', 'read_scope', 'limits', 'revisit_when', 'form', 'description']) {
        if (!input[field]?.trim()) throw new Error(`capture needs ${field}: ${input.title ?? url}`)
      }
      if (byUrl.has(normalizeUrl(url))) return { id: byUrl.get(normalizeUrl(url)), existing: true }
      const slug = input.slug ?? slugify(input.title, url)
      if (!SLUG.test(slug)) throw new Error(`bad slug: ${slug}`)
      const id = `${OWN}:${slug}`
      if (byId.has(id) || ids.has(id)) throw new Error(`source exists: ${id}`)
      const status = input.evidence_status ?? 'partial'
      if (!STATUSES.includes(status)) throw new Error(`evidence_status must be ${STATUSES.join(', ')}`)
      this.checkEntry(input)
      if (input.members && !input.members.pattern) throw new Error('members needs pattern: a glob over member link URLs')
      if (input.member_of && byId.get(input.member_of)?.members === undefined) throw new Error(`not a collection source: ${input.member_of}`)
      ids.add(id)
      byUrl.set(normalizeUrl(url), id)
      const record = {
        title: input.title.trim(), url, summary: input.summary.trim(),
        read_scope: input.read_scope.trim(), evidence_status: status, limits: input.limits.trim(), revisit_when: input.revisit_when.trim(),
        tags: input.tags ?? [],
        ...(input.members ? { members: { pattern: input.members.pattern } } : {}), ...(input.member_of ? { member_of: input.member_of } : {}),
        excerpts: (input.excerpts ?? []).map((e, i) => ({ id: `${slug}-C${i + 1}`, locator: e.locator, claim: e.claim })),
        captured_for: { task: task.trim(), by, at, ...(session ? { session } : {}) }, state: 'active',
      }
      const entry = { form: input.form, description: input.description.trim(), ...(input.category ? { category: input.category } : {}) }
      return { id, record, entry }
    })
    for (const { id, record, entry } of plan.filter((p) => p.record)) {
      this.own.update(id, 0, () => record, { op: 'capture', by, reason, task })
      this.catalog.update(id, 0, () => entry, { op: 'file', by, reason, task, fields: Object.keys(entry) })
    }
    this.cache = undefined
    return plan.map(({ id, existing }) => {
      const s = this.source(id)
      return { id, title: s.title, url: s.url, existing: !!existing }
    })
  }

  /** Revise an own source's record: what it is, how it was read, whether it is a collection. Filing goes through file(). */
  updateOwn(id, patch, { expected_revision, by, reason, task } = {}) {
    const cur = this.own.get(id)
    if (!cur) throw new Error(`not an own source: ${id}; pack sources are maintained in their pack`)
    const allowed = ['title', 'url', 'summary', 'read_scope', 'evidence_status', 'limits', 'revisit_when', 'tags', 'members', 'member_of', 'excerpts']
    for (const key of Object.keys(patch)) if (!allowed.includes(key)) throw new Error(`not editable: ${key}`)
    if (patch.url !== undefined && !/^https?:\/\//.test(patch.url)) throw new Error('url must be http(s)')
    if (patch.evidence_status && !STATUSES.includes(patch.evidence_status)) throw new Error(`evidence_status must be ${STATUSES.join(', ')}`)
    if (patch.members && !patch.members.pattern) throw new Error('members needs pattern')
    if (patch.member_of && this.roster().byId.get(patch.member_of)?.members === undefined) throw new Error(`not a collection source: ${patch.member_of}`)
    const next = { ...patch }
    if (patch.members) next.members = { ...cur.members, pattern: patch.members.pattern }
    if (patch.excerpts) next.excerpts = patch.excerpts.map((e, i) => ({ id: e.id ?? `${id.slice(id.indexOf(':') + 1)}-C${i + 1}`, locator: e.locator, claim: e.claim }))
    this.cache = undefined
    this.own.update(id, expected_revision, (c) => ({ ...c, ...next }), { op: 'source-update', by, reason, task, fields: Object.keys(patch) })
    return this.source(id)
  }

  /** Retire an own source: it leaves the roster's active lists and its relations stop; the record stays. */
  retire(id, { expected_revision, reason, by, task } = {}) {
    if (!this.own.get(id)) throw new Error(`not an own source: ${id}; pack sources are maintained in their pack`)
    if (!reason?.trim()) throw new Error('retire needs reason')
    this.cache = undefined
    this.own.update(id, expected_revision, (cur) => ({ ...cur, state: 'retired', retired: { reason: reason.trim(), by, at: new Date().toISOString() } }), { op: 'retire', by, reason, task })
    return this.source(id)
  }

  /**
   * A collection against its upstream. `added`: member links the latest check found that the check
   * before it did not, minus those already in the roster or skipped with a reason (the first check is
   * the baseline). `gone`: active members whose link the latest check no longer found. Undefined
   * before the first check that saw members.
   */
  members(id) {
    const s = this.roster().byId.get(id)
    const seen = (this.observations().get(id) ?? []).filter((o) => o.members)
    const [before, latest] = [seen.at(-2), seen.at(-1)]
    if (!s?.members || !latest) return undefined
    const upstream = new Set(latest.members.map(normalizeUrl))
    const earlier = new Set((before?.members ?? latest.members).map(normalizeUrl))
    const roster = this.roster().list.filter((m) => m.member_of === id && m.url)
    const known = new Set([...roster.map((m) => normalizeUrl(m.url)), ...Object.keys(s.members.skipped ?? {}).map(normalizeUrl)])
    return {
      checked_at: latest.at, upstream: latest.members.length, in_roster: roster.length,
      added: latest.members.filter((u) => !earlier.has(normalizeUrl(u)) && !known.has(normalizeUrl(u))),
      gone: roster.filter((m) => m.state !== 'retired' && !upstream.has(normalizeUrl(m.url))).map((m) => ({ id: m.id, title: m.title, url: m.url })),
    }
  }

  /**
   * Every member link the latest check found, each with what the roster did about it: `registered`
   * (the source with that link, active or retired), `skipped` (with the reason) or `open`; `added` marks
   * links new since the check before. Undefined before the first check that saw members.
   */
  ledger(id) {
    const s = this.roster().byId.get(id)
    const seen = (this.observations().get(id) ?? []).filter((o) => o.members)
    const [before, latest] = [seen.at(-2), seen.at(-1)]
    if (!s?.members || !latest) return undefined
    const earlier = new Set((before?.members ?? latest.members).map(normalizeUrl))
    const byUrl = new Map(this.roster().list.filter((m) => m.url).map((m) => [normalizeUrl(m.url), m]))
    const skipped = new Map(Object.entries(s.members.skipped ?? {}).map(([u, reason]) => [normalizeUrl(u), reason]))
    return latest.members.map((url) => {
      const key = normalizeUrl(url)
      const m = byUrl.get(key)
      const entry = m ? { url, state: 'registered', id: m.id, title: m.title, retired: m.state === 'retired' }
        : skipped.has(key) ? { url, state: 'skipped', reason: skipped.get(key) } : { url, state: 'open' }
      return { ...entry, added: !earlier.has(key) }
    })
  }

  /** Decline an upstream member link for a reason, so the collection stops proposing it. */
  skipMember(id, url, { expected_revision, reason, by } = {}) {
    if (!this.own.get(id)?.members) throw new Error(`not a collection source: ${id}`)
    if (!reason?.trim()) throw new Error('skip needs reason')
    this.cache = undefined
    this.own.update(id, expected_revision, (cur) => ({ ...cur, members: { ...cur.members, skipped: { ...cur.members.skipped, [url]: reason.trim() } } }), { op: 'skip-member', by, reason, url })
    return this.members(id)
  }

  /** Own sources that are collections, with their upstream differences when there are any. */
  collections() {
    return this.roster().list.filter((s) => s.members && s.state !== 'retired')
      .map((s) => ({ id: s.id, title: s.title, ...this.members(s.id) }))
      .filter((c) => c.added?.length || c.gone?.length)
  }

  // ---- packs -----------------------------------------------------------------------------------

  /**
   * Register a source pack by reference; the file stays with its owner and is read in place.
   * `format: 'registry'` is a file in the Praxis registry format (paths inside relative to `root`).
   * `format: 'index'` (default) is a project's own list of sources: `fields` maps id, title, url,
   * summary, read_scope, status and tags to its names; `status` maps its status values to verified,
   * partial or unavailable; `excerpts` names a JSON Lines file of claims joined by source id.
   */
  registerPack({ id, format = 'index', path, root, list, title, purpose, limits, revisit_when, fields, status, excerpts }, { by, reason } = {}) {
    for (const [k, v] of Object.entries({ id, path, title, purpose })) if (!v?.trim()) throw new Error(`register_index needs ${k}`)
    if (!SLUG.test(id) || id === OWN) throw new Error(`bad id: ${id}`)
    if (!existsSync(this.paths.absolute(path))) throw new Error(`file not found: ${path}`)
    const data = readJson(this.paths.absolute(path))
    let next
    if (format === 'registry') {
      if (!Array.isArray(data?.sources)) throw new Error(`${path} has no sources list`)
      next = { kind: 'registry', path: this.paths.normalize(path), root: this.paths.normalize(root ?? dirname(this.paths.absolute(path))), title: title.trim(), purpose: purpose.trim() }
    } else if (format === 'index') {
      for (const [k, v] of Object.entries({ limits, revisit_when })) if (!v?.trim()) throw new Error(`register_index needs ${k}`)
      if (!fields?.id || !fields?.title) throw new Error('fields needs id and title')
      const unknown = Object.keys(fields).filter((k) => !INDEX_FIELDS.includes(k))
      if (unknown.length) throw new Error(`fields: unknown ${unknown.join(', ')}; use ${INDEX_FIELDS.join(', ')}`)
      const records = list ? data?.[list] : data
      if (!Array.isArray(records)) throw new Error(`${path}${list ? ` .${list}` : ''} is not a list of records`)
      const seen = new Set()
      for (const r of records) {
        const local = r?.[fields.id]
        if (local === undefined || local === null || !r[fields.title]) throw new Error(`a record in ${path} lacks ${fields.id} or ${fields.title}`)
        if (seen.has(String(local))) throw new Error(`duplicate ${fields.id} in ${path}: ${local}`)
        seen.add(String(local))
        const value = fields.status ? r[fields.status] : undefined
        if (value !== undefined && !STATUSES.includes(status?.[value] ?? value)) throw new Error(`status value ${value} needs a mapping to verified, partial or unavailable`)
      }
      if (excerpts) {
        for (const k of ['path', 'id', 'source', 'locator', 'claim']) if (!excerpts[k]) throw new Error(`excerpts needs ${k}`)
        if (!existsSync(this.paths.absolute(excerpts.path))) throw new Error(`file not found: ${excerpts.path}`)
      }
      next = { kind: 'index', path: this.paths.normalize(path), ...(list ? { list } : {}), title: title.trim(), purpose: purpose.trim(), limits: limits.trim(), revisit_when: revisit_when.trim(),
        fields, ...(status ? { status } : {}), ...(excerpts ? { excerpts: { ...excerpts, path: this.paths.normalize(excerpts.path) } } : {}) }
    } else {
      throw new Error('format must be index or registry')
    }
    const created = !this.packs.get(id)
    this.packs.update(id, undefined, () => ({ ...next, state: 'active' }), { op: 'register-pack', by, reason })
    this.cache = undefined
    return { id, path: next.path, format, created, sources: this.roster().list.filter((s) => s.pack === id).length }
  }

  listPacks() {
    const { list } = this.roster()
    return Object.entries(this.packs.all()).map(([id, p]) => ({ id, ...p, sources: list.filter((s) => s.pack === id).length }))
  }
}

function ownEntry(id, r) {
  return {
    id, aliases: [], pack: undefined, collection: OWN, kind: 'external-url', title: r.title,
    url: r.url, summary: r.summary, evidence_status: r.evidence_status, tags: r.tags ?? [],
    limits: [r.limits], revisit_when: r.revisit_when, card: undefined, read_scope: r.read_scope, captured_for: r.captured_for,
    priority: undefined, excerpts: r.excerpts ?? [], snapshot: undefined, declared: [],
    members: r.members, member_of: r.member_of, state: r.state ?? 'active', retired: r.retired, revision: r.revision,
  }
}

// Catalogs write a claim as {claim}, {claim_zh} or a bare string.
function claims(list = []) {
  return list.map((c) => (typeof c === 'string' ? { claim: c } : { id: c.claim_id, locator: c.locator, claim: c.claim ?? c.claim_zh }))
}

/** Absolute links in an HTML or Markdown page whose URL matches the glob (`*` within a segment, `**` across). */
export function memberLinks(text, pageUrl, pattern) {
  const re = new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*')}$`)
  const out = new Set()
  for (const m of text.matchAll(/href\s*=\s*["']([^"']+)["']|\]\(([^)\s]+)\)/g)) {
    try {
      const u = new URL(m[1] ?? m[2], pageUrl)
      u.hash = ''
      if (re.test(u.href)) out.add(u.href)
    } catch {}
  }
  return [...out].sort()
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

