// dsh-praxis core: one set of operations shared by the DSH plugin, the MCP server,
// the CLI and the control plane UI.
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Kit, LAYERS, clip } from './kit.js'
import { Materials } from './materials.js'
import { Artifacts } from './artifacts.js'
import { DELIVERED, Projects, TEMPLATES } from './projects.js'
import { Collection, readJson } from './store.js'
import { PRESET_FIELDS, presetId, validatePreset } from './presets.js'

export { ConflictError } from './store.js'

// The server code this process loaded. A long-running host (DSH, the MCP server, the control plane)
// keeps running it after the files change; reload() says so, so an agent does not test old code.
const PACKAGE = join(dirname(fileURLToPath(import.meta.url)), '..')
const codeStamp = () => Math.max(...['core', 'adapters'].flatMap((d) => readdirSync(join(PACKAGE, d))
  .filter((f) => f.endsWith('.js')).map((f) => statSync(join(PACKAGE, d, f)).mtimeMs)))
const LOADED = { at: new Date().toISOString(), stamp: codeStamp() }

/** The repository root: explicit, PRAXIS_ROOT, or the checkout this package lives in. */
export function findRoot(explicit) {
  const start = explicit ?? process.env.PRAXIS_ROOT ?? join(dirname(fileURLToPath(import.meta.url)), '..', '..')
  const root = resolve(start)
  if (!existsSync(join(root, 'dsh-praxis', 'layers.md'))) throw new Error(`not a Praxis checkout: ${root}`)
  return root
}

export function createPraxis(options = {}) {
  const repo = findRoot(options.root)
  const dataDir = join(repo, 'dsh-praxis', 'data')
  const materials = new Materials(repo, dataDir, { rebuild: options.rebuild })
  const kit = () => new Kit(repo)
  const presets = new Collection(join(dataDir, 'presets.json'), join(dataDir, 'history.jsonl'))
  const artifacts = new Artifacts(repo, dataDir)
  const projects = new Projects(repo, dataDir)

  return {
    repo,
    layers: LAYERS,
    materials,
    artifacts,
    projects,
    kit,

    /** Resident entries plus the routes into each layer: what every task starts with. */
    entry() {
      const k = kit()
      return {
        resident: k.list().filter((u) => u.resident).map(brief),
        layers: Object.keys(LAYERS).map((layer) => ({ layer, entry: brief(k.find(layer)) })),
        task_types: k.taskTypes().map((t) => ({ id: t.id, title: t.title, description: t.description, pipelines: t.pipelines })),
        reload: this.reload(),
      }
    },

    /** Set when the package's server code changed after this process loaded it: restart the host. */
    reload() {
      const stamp = codeStamp()
      return stamp > LOADED.stamp ? { loaded_at: LOADED.at, changed_at: new Date(stamp).toISOString() } : undefined
    },

    units({ layer } = {}) {
      const k = kit()
      const updated = k.updatedAt()
      return k.list(layer).map((u) => ({ ...brief(u), updated_at: updated.get(u.path) ?? null }))
    },

    unit(ref) {
      return kit().read(ref)
    },

    taskTypes() {
      return kit().taskTypes()
    },

    /**
     * What to read for a task: resident units, then the units the task type lists
     * (filtered by pipeline), then enabled bindings on those units as material rows.
     */
    resolve({ task_type, pipeline, units = [], preset, materials_limit = 12 } = {}) {
      const k = kit()
      const { picked, type, pipeline: chosen } = pick(k, { task_type, pipeline, units })
      pipeline = chosen
      const targets = new Set([...picked.values()].map((u) => u.path))
      const rows = materials.listBindings()
        .filter((b) => b.enabled && targets.has(b.target.split('#')[0]))
        .sort((a, b) => Number(b.priority === 'preferred') - Number(a.priority === 'preferred') || Number(b.favorite) - Number(a.favorite))
        .slice(0, materials_limit)
        .map((b) => material(b, materials.source(b.source)))
      const chosenPreset = preset ? this.preset(preset)
        : Object.entries(presets.all()).map(([id, p]) => ({ id, ...p })).find((p) => p.pipeline === pipeline && p.default && p.state !== 'removed')
      if (preset && !chosenPreset) throw new Error(`unknown preset: ${preset}`)
      return {
        preset: chosenPreset ? { id: chosenPreset.id, title: chosenPreset.title, values: chosenPreset.values, revision: chosenPreset.revision } : undefined,
        task_type: type ? { id: type.id, title: type.title, outcome: type.outcome, acceptance: type.acceptance, version: type.version } : undefined,
        pipeline,
        units: [...picked.values()],
        materials: rows,
      }
    },

    /**
     * One source as a reader deciding whether to use or keep it needs it: the record, what its
     * collection was gathered for, the pages it serves and the task types that reach them, and the
     * runs that read it with what they delivered.
     */
    source(ref) {
      const found = materials.source(ref)
      if (!found) return undefined
      const { record, ...s } = found
      const k = kit()
      const units = new Map(k.list().map((u) => [u.path, u]))
      const reach = servedBy(k)
      const relations = materials.listBindings({ source: s.id }).map((b) => {
        const u = units.get(b.target.split('#')[0])
        return { binding: b.id, target: b.target, unit: u?.id, description: b.description, description_curated: b.description_curated, enabled: b.enabled, signals: b.signals }
      })
      const types = new Map()
      for (const r of relations) for (const t of reach.get(r.unit) ?? []) types.set(t.id, t)
      const used_by = this.runs({ limit: 1000 }).filter((r) => r.sources.some((x) => x.id === s.id))
        .map((r) => ({ id: r.id, title: r.title, at: r.at, by: r.by, artifacts: r.artifacts.map((a) => ({ artifact: a.artifact, version: a.version, path: a.path })) }))
      return { ...s, collection: collectionOf(repo, materials.registry(), s), relations, serves: [...types.values()], used_by }
    },

    /**
     * Record that a piece of work read these units and sources at their current versions and
     * delivered these files. The bindings recorded are those joining a read source to a read unit,
     * so a later change to either marks the run stale. Each file is registered as an artifact version
     * (see artifacts.js); everything is checked before anything is written. Returns the run record.
     */
    consume({ title, task_type, pipeline, preset, overrides, units = [], sources = [], artifacts = [], by, note }) {
      if (!title?.trim()) throw new Error('consume needs a title')
      const k = kit()
      const unitRefs = units.map((ref) => {
        const u = k.find(ref)
        if (!u) throw new Error(`unknown unit: ${ref}`)
        return { id: u.id, path: u.path, version: u.version }
      })
      const read = new Map()
      for (const ref of sources) {
        const s = materials.source(ref)
        if (!s) throw new Error(`unknown source: ${ref}`)
        read.set(s.id, { id: s.id, snapshot: s.snapshot?.sha256 ?? null })
      }
      const sourceRefs = [...read.values()]
      const unitPaths = new Set(unitRefs.map((u) => u.path))
      const bindingRefs = materials.listBindings()
        .filter((b) => read.has(b.source) && unitPaths.has(b.target.split('#')[0]))
        .map((b) => ({ id: b.id, revision: b.revision }))
      // A delivered file is recorded with its project: the location is part of the record.
      const delivered = artifacts.map((a) => {
        const item = this.artifacts.prepare(a)
        const home = projects.of(item.path)
        if (!home) throw new Error(`${item.path} is not inside a registered project; register its folder with praxis_project first`)
        return { ...item, project: home.project.id }
      })
      const presetRef = preset ? (() => { const p = this.preset(preset); if (!p) throw new Error(`unknown preset: ${preset}`); return { id: p.id, revision: p.revision, values: p.values } })() : undefined
      const at = new Date().toISOString()
      const id = `${at.slice(0, 10)}-${createHash('sha256').update(at + title).digest('hex').slice(0, 8)}`
      const artifactRefs = delivered.map((item) => {
        const { id: artifact, version, path, sha256 } = this.artifacts.register(item, { run: id, by })
        return { artifact, version, path, sha256, project: item.project }
      })
      const run = { id, title: title.trim(), at, by, task_type, pipeline, preset: presetRef, overrides, units: unitRefs, bindings: bindingRefs, sources: sourceRefs, artifacts: artifactRefs, note }
      const path = join(dataDir, 'runs', `${id}.json`)
      mkdirSync(dirname(path), { recursive: true })
      writeFileSync(path, JSON.stringify(run, null, 2) + '\n')
      materials.bindings.log({ op: 'consume', id, by, title: run.title })
      return run
    },

    /**
     * Delivered files, latest change first. Each row carries its live status (current, modified:
     * unregistered bytes, missing), whether the run behind the latest version used something that has
     * changed since (basis_changed), and its signals: missing, needs_work (latest version's last verdict).
     */
    artifactList({ query, medium, signal, project, include_removed = false, limit = 50 } = {}) {
      const staleRuns = new Set(this.stale().map((r) => r.run))
      const terms = (query ?? '').toLowerCase().split(/\s+/).filter(Boolean)
      return Object.entries(artifacts.store.all())
        .map(([id, rec]) => summarize(id, rec, artifacts, staleRuns, projects))
        .filter((a) => (include_removed || a.state !== 'removed') && (!medium || a.medium === medium) && (!project || a.project?.id === project) && (!signal || a.signals.includes(signal) || (signal === 'basis_changed' && a.basis_changed))
          && terms.every((t) => `${a.title} ${a.description ?? ''} ${a.path}`.toLowerCase().includes(t)))
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
        .slice(0, limit)
    },

    /** One artifact with every version, the run behind it and what that run used, and its reviews. */
    artifact(id) {
      const rec = artifacts.get(id)
      if (!rec) return undefined
      const stale = new Map(this.stale().map((r) => [r.run, r]))
      const runs = new Map(this.runs({ limit: 1000 }).map((r) => [r.id, r]))
      const head = summarize(id, rec, artifacts, new Set(stale.keys()), projects)
      return {
        ...head,
        versions: rec.versions.map((v, i) => {
          const run = runs.get(v.run)
          return {
            version: i + 1, sha256: v.sha256, size: v.size, at: v.at, by: v.by, derived_from: v.derived_from ?? [],
            run: run ? { id: run.id, title: run.title, at: run.at, task_type: run.task_type, pipeline: run.pipeline,
              units: run.units.map((u) => u.id), bindings: run.bindings.map((b) => b.id), sources: run.sources.map((s) => ({ id: s.id, title: materials.source(s.id)?.title ?? s.id })),
              changed: stale.get(run.id) ?? null } : null,
            reviews: rec.reviews.filter((r) => r.version === i + 1),
          }
        }),
      }
    },

    /**
     * Projects with their layout, how many artifacts each holds, and the files in its final paths
     * that no artifact records. With `path`, only the project holding that path.
     */
    projectList({ path, include_removed = false } = {}) {
      const list = path ? [projects.of(projects.normalize(path))?.project].filter(Boolean) : projects.list({ include_removed })
      const records = Object.values(artifacts.store.all()).filter((r) => r.state !== 'removed')
      return list.map((p) => {
        const held = records.map((r) => projects.of(r.path)).filter((h) => h?.project.id === p.id).map((h) => h.path)
        const registered = new Set(held)
        return { ...p, absolute: projects.absolute(p.root), artifacts: held.length, unregistered: p.state === 'removed' ? [] : projects.finals(p).filter((f) => !registered.has(f)) }
      })
    },

    saveProject(args) {
      const { id } = projects.save(args)
      return this.projectList({ include_removed: true }).find((p) => p.id === id)
    },

    projectTemplates() {
      return TEMPLATES
    },

    reviewArtifact(args) {
      artifacts.review(args.id, args)
      return this.artifact(args.id)
    },

    updateArtifact(args) {
      artifacts.update(args.id, args)
      return this.artifact(args.id)
    },

    presetFields() {
      return PRESET_FIELDS
    },

    presets({ pipeline, includeRemoved = false } = {}) {
      return Object.entries(presets.all())
        .map(([id, p]) => ({ id, ...p }))
        .filter((p) => (!pipeline || p.pipeline === pipeline) && (includeRemoved || p.state !== 'removed'))
    },

    preset(id) {
      const p = presets.get(id)
      return p ? { id, ...p } : undefined
    },

    /** Create (no id) or update a preset; updates must carry the revision they read. */
    savePreset({ id, pipeline, title, description, values, tags, default: isDefault, expected_revision, by, reason, task }) {
      const current = id ? presets.get(id) : undefined
      if (id && !current) throw new Error(`unknown preset: ${id}`)
      const next = { pipeline: pipeline ?? current?.pipeline, title: title ?? current?.title, description: description ?? current?.description,
        values: values ?? current?.values ?? {}, tags: tags ?? current?.tags ?? [], default: isDefault ?? current?.default ?? false }
      validatePreset(next)
      const key = id ?? presetId(next.pipeline, next.title)
      if (!id && presets.get(key)) throw new Error(`preset exists: ${key}`)
      // The old default is cleared in the same write, so a refused save leaves every preset as it was.
      const also = (records) => (next.default ? Object.entries(records) : [])
        .filter(([other, p]) => other !== key && p.pipeline === next.pipeline && p.default)
        .map(([other]) => ({ id: other, fn: (cur) => ({ ...cur, default: false }), change: { op: 'preset-default-off', by } }))
      const saved = presets.update(key, id ? expected_revision : 0, (cur = {}) => ({ ...cur, ...next, state: 'active' }), { op: 'preset', by, reason, task }, { also })
      return { id: key, ...saved }
    },

    removePreset({ id, expected_revision, by, reason }) {
      if (!presets.get(id)) throw new Error(`unknown preset: ${id}`)
      const saved = presets.update(id, expected_revision, (cur) => ({ ...cur, state: 'removed', default: false }), { op: 'preset-remove', by, reason })
      return { id, ...saved }
    },

    runs({ limit = 20 } = {}) {
      const dir = join(dataDir, 'runs')
      if (!existsSync(dir)) return []
      return readdirSync(dir).filter((f) => f.endsWith('.json')).sort().reverse().slice(0, limit)
        .map((f) => readJson(join(dir, f)))
    },

    /** Runs whose recorded unit, binding, source snapshot or preset versions are older than the current ones. */
    stale() {
      const k = kit()
      const snapshots = new Map()
      const snapshotOf = (id) => {
        if (!snapshots.has(id)) snapshots.set(id, materials.source(id)?.snapshot?.sha256 ?? null)
        return snapshots.get(id)
      }
      return this.runs({ limit: 1000 }).map((run) => {
        const units = run.units.filter((u) => k.find(u.id)?.version !== u.version).map((u) => u.id)
        const bindings = run.bindings.filter((b) => (materials.binding(b.id)?.revision ?? -1) !== b.revision).map((b) => b.id)
        const sources = (run.sources ?? []).filter((s) => snapshotOf(s.id) !== s.snapshot).map((s) => s.id)
        const preset = run.preset && presets.get(run.preset.id)?.revision !== run.preset.revision ? run.preset.id : undefined
        return { run: run.id, title: run.title, units, bindings, sources, preset }
      }).filter((r) => r.units.length || r.bindings.length || r.sources.length || r.preset)
    },

    /**
     * What needs someone now, across the Kit and outside targets: bindings with a signal, runs whose
     * units or bindings changed after delivery, captured sources no unit binds yet, artifacts with a
     * signal, and reload when this process runs older code than the files. Usually empty.
     */
    upkeep() {
      const units = new Map(kit().list().map((u) => [u.path, u.id]))
      return {
        bindings: materials.listBindings().filter((b) => b.signals.length)
          .map((b) => ({ id: b.id, title: b.title, target: b.target, unit: units.get(b.target.split('#')[0]) ?? null, signals: b.signals, revision: b.revision })),
        stale: this.stale(),
        unbound: materials.unboundCaptures(),
        artifacts: this.artifactList({ limit: 1000 }).filter((a) => a.signals.length),
        projects: this.projectList().filter((p) => p.unregistered.length)
          .map((p) => ({ id: p.id, title: p.title, root: p.root, unregistered: p.unregistered.slice(0, 20), unregistered_count: p.unregistered.length })),
        reload: this.reload(),
      }
    },

    /** Newest first; with `id`, every revision of one binding, preset or source with the fields it set. */
    history({ limit = 50, id } = {}) {
      const path = join(dataDir, 'history.jsonl')
      if (!existsSync(path)) return []
      const all = readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l))
      return (id ? all.filter((h) => h.id === id) : all).slice(-limit).reverse()
    },
  }
}

/** The units a task reads: resident ones, the pipeline entry, what the task type lists, then any named. */
function pick(k, { task_type, pipeline, units = [] }) {
  const picked = new Map()
  const add = (unit, reason) => {
    if (!unit) return
    const seen = picked.get(unit.id)
    if (seen) seen.reasons.push(reason)
    else picked.set(unit.id, { id: unit.id, title: unit.title, description: clip(unit.description, 100), path: unit.path, version: unit.version, reasons: [reason] })
  }
  for (const u of k.list().filter((u) => u.resident)) add(u, '常驻')
  let type
  if (task_type) {
    type = k.taskType(task_type)
    if (!type) throw new Error(`unknown task type: ${task_type}`)
    const chosen = pipeline ?? type.pipelines[0]
    if (pipeline && !type.pipelines.includes(pipeline)) throw new Error(`${type.id} has no ${pipeline} pipeline`)
    add(k.find(`publish/${chosen}`), `流水线 ${chosen}`)
    for (const layer of ['writing', 'design', 'publish']) {
      for (const item of type[layer]) {
        if (item.when && item.when !== chosen) continue
        add(k.find(item.unit), `任务类型 ${type.title} 列出${item.when ? `（${item.when}）` : ''}`)
      }
    }
    pipeline = chosen
  }
  for (const ref of units) {
    const u = k.find(ref)
    if (!u) throw new Error(`unknown unit: ${ref}`)
    add(u, '本次指定')
  }
  return { picked, type, pipeline }
}

/** Unit id → the task types whose resolve reaches it, over every pipeline each type has. */
function servedBy(k) {
  const out = new Map()
  for (const t of k.taskTypes()) {
    for (const pipeline of t.pipelines) {
      for (const id of pick(k, { task_type: t.id, pipeline }).picked.keys()) {
        if (!out.has(id)) out.set(id, new Map())
        out.get(id).set(t.id, { id: t.id, title: t.title })
      }
    }
  }
  return new Map([...out].map(([id, types]) => [id, [...types.values()]]))
}

// A material row carries what an agent needs to reach the original: the URL or locator, the
// passages the record vouches for with their locators, how it was read, and any local snapshot.
// The source ID is what consume takes once the agent has read it.
function material(b, s) {
  const excerpts = s?.excerpts ?? []
  return {
    binding: b.id, source: b.source, title: b.title, description: clip(b.description, 100),
    url: s?.url, evidence_status: s?.evidence_status, read_scope: s?.read_scope ? clip(s.read_scope, 100) : undefined,
    excerpts: excerpts.slice(0, 4).map((e) => ({ locator: e.locator, claim: clip(e.claim, 120) })),
    more_excerpts: excerpts.length > 4 ? excerpts.length - 4 : undefined,
    snapshot: s?.snapshot?.path, card: s?.card, priority: b.priority, favorite: b.favorite,
  }
}

/** The collection a source came in with, and what it was gathered for: a registration's purpose or the catalog README's lede. */
function collectionOf(repo, registry, s) {
  const c = registry.collections.find((x) => x.id === s.collection)
  if (!c) return undefined
  if (c.purpose) return { id: c.id, title: c.title, path: c.path, purpose: c.purpose }
  const readme = join(repo, dirname(c.path), 'README.md')
  if (!existsSync(readme)) return { id: c.id, path: c.path }
  const text = readFileSync(readme, 'utf8')
  const title = text.match(/^#\s+(.+)$/m)?.[1]
  const lede = text.split(/\n\s*\n/).map((p) => p.trim()).find((p) => p && !/^[#|>!<-]/.test(p) && !/^\[/.test(p))
  return { id: c.id, title, path: c.path, readme: relative(repo, readme), purpose: lede ? clip(lede.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' '), 240) : undefined }
}

function summarize(id, rec, artifacts, staleRuns, projects) {
  const latest = rec.versions.at(-1)
  const status = artifacts.status(rec)
  const review = rec.reviews.filter((r) => r.version === rec.versions.length).at(-1) ?? null
  const home = projects.of(rec.path)
  const role = home ? projects.role(home.project, home.path) : undefined
  const signals = [status === 'missing' && 'missing', review?.verdict === 'needs-work' && 'needs_work', !DELIVERED.includes(role) && 'misplaced'].filter(Boolean)
  return {
    id, title: rec.title, description: rec.description, medium: rec.medium, path: rec.path, absolute: artifacts.absolute(rec.path),
    project: home ? { id: home.project.id, title: home.project.title } : undefined, project_path: home?.path, role,
    version: rec.versions.length, sha256: latest.sha256, status, basis_changed: !!latest.run && staleRuns.has(latest.run), review, signals, state: rec.state,
    created_at: rec.created_at, updated_at: rec.reviews.at(-1)?.at > latest.at ? rec.reviews.at(-1).at : latest.at, revision: rec.revision,
  }
}

function brief(u) {
  if (!u) return undefined
  return { id: u.id, layer: u.layer, title: u.title, description: u.description, path: u.path, resident: u.resident, version: u.version }
}
