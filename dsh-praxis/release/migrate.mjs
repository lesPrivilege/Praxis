#!/usr/bin/env node
// Copy this repository's Praxis data into a data root of its own, and check that the copy answers as
// the original does (ADR-050, steps 4 and 5). The old data root is only read.
//
//   node release/migrate.mjs <old data root> <new data root>
//
// The copy is the old data root file for file, with four changes:
// - settings.json names `base` absolutely, so pack files and project paths resolve as before;
// - a registry pack that names Kit pages by the old package's path gets `kit`, that path, so its
//   relations still reach this package's Kit wherever the package is installed;
// - stream bindings are renamed: a binding names a stream page by its path, and that path moves with
//   the data root. bindings.json and the bindings each run recorded follow it; history.jsonl keeps the
//   names it was written with;
// - stock: a download version for each source whose pack record names a snapshot file that is there
//   with the recorded sha256, dated by the record's reviewed_at, since the snapshot's own time was not kept.
// Then resolve runs for every task type and pipeline, every stream, and each pair of them, on both data
// roots; the answers must match apart from stock and the stream pages' own paths. Prints a JSON report
// and exits 1 on a mismatch.
import { createHash } from 'node:crypto'
import { cpSync, existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'
import { createPraxis } from '../core/index.js'
import { locate, pathsFor } from '../core/paths.js'
import { readJson, writeJson } from '../core/store.js'

const [from, to] = process.argv.slice(2).map((p) => p && resolve(p))
if (!from || !to) { console.error('usage: node release/migrate.mjs <old data root> <new data root>'); process.exit(2) }
if (existsSync(to) && readdirSync(to).length) { console.error(`${to} is not empty; the copy goes into a new folder`); process.exit(2) }

// 1. The files, and settings that keep relative paths meaning what they meant.
const old = locate({ data: from })
cpSync(from, to, { recursive: true })
const { snapshots: _, ...settings } = readJson(join(to, 'settings.json'), {})
if (old.base) settings.base = old.base
writeJson(join(to, 'settings.json'), settings)
const now = locate({ data: to })

// Packs that relate their sources to Kit pages by the path the package had inside this repository.
const kitWas = old.base ? relative(old.base, old.kit).split(sep).join('/') : undefined
let packsKit = 0
const packs = readJson(join(to, 'packs.json'), null)
if (packs && kitWas && !kitWas.startsWith('..')) {
  for (const [id, p] of Object.entries(packs.records)) {
    if (p.kind !== 'registry' || p.kit) continue
    const reg = readJson(pathsFor(old).absolute(p.path), { sources: [] })
    const root = pathsFor(old).absolute(p.root ?? dirname(p.path))
    if (reg.sources.some((r) => (r.grammar_paths ?? []).some((t) => pathsFor(old).normalize(join(root, t)).startsWith('kit/')))) { packs.records[id] = { ...p, kit: kitWas }; packsKit++ }
  }
  writeJson(join(to, 'packs.json'), packs)
}

// 2. Stream pages are named by their path, which moved with the data root.
const was = pathsFor(old).normalize(join(from, 'streams'))
const is = pathsFor(now).normalize(join(to, 'streams'))
const rename = (target) => (target?.startsWith(`${was}/`) ? `${is}${target.slice(was.length)}` : target)
const renameId = (id) => { const at = id.lastIndexOf('@'); return at < 0 ? id : `${id.slice(0, at)}@${rename(id.slice(at + 1))}` }
let bindingsRenamed = 0
const bindings = readJson(join(to, 'bindings.json'), null)
if (bindings && was !== is) {
  const records = {}
  for (const [id, rec] of Object.entries(bindings.records)) {
    const next = renameId(id)
    if (next !== id) bindingsRenamed++
    records[next] = rec.target ? { ...rec, target: rename(rec.target) } : rec
  }
  writeJson(join(to, 'bindings.json'), { ...bindings, records })
}
let runsRenamed = 0
const runs = join(to, 'runs')
for (const f of was !== is && existsSync(runs) ? readdirSync(runs).filter((x) => x.endsWith('.json')) : []) {
  const run = readJson(join(runs, f))
  const next = (run.bindings ?? []).map((b) => ({ ...b, id: renameId(b.id) }))
  if (next.some((b, i) => b.id !== run.bindings[i].id)) { runsRenamed++; writeJson(join(runs, f), { ...run, bindings: next }) }
}

// 3. Snapshots the packs recorded become download versions in stock.
const praxis = createPraxis({ data: to })
const reviewed = new Map()
for (const pack of praxis.materials.roster().packs.values()) {
  if (pack.kind !== 'registry') continue
  for (const r of readJson(praxis.materials.paths.absolute(pack.path), { sources: [] }).sources) reviewed.set(r.id, r.reviewed_at)
}
const imported = []
const skipped = []
for (const s of praxis.materials.roster().list) {
  if (!s.snapshot?.path || s.state === 'retired') continue
  if (praxis.stock.list(s.id).some((m) => m.imported?.from === s.snapshot.path)) continue
  const file = praxis.materials.paths.absolute(s.snapshot.path)
  if (!existsSync(file)) { skipped.push({ id: s.id, why: 'snapshot file missing', path: s.snapshot.path }); continue }
  const bytes = readFileSync(file)
  if (s.snapshot.sha256 && createHash('sha256').update(bytes).digest('hex') !== s.snapshot.sha256) { skipped.push({ id: s.id, why: 'file differs from the recorded sha256', path: s.snapshot.path }); continue }
  const day = reviewed.get(s.id)
  const at = /^\d{4}-\d{2}-\d{2}/.test(day ?? '') ? new Date(`${day.slice(0, 10)}T00:00:00Z`) : new Date()
  const m = praxis.stock.adopt(s, { at, files: [{ path: basename(file), bytes, from: s.url ?? s.locator }], from: s.snapshot.path, basis: day ? 'reviewed_at' : 'migration' })
  imported.push({ id: s.id, version: m.version })
}

// 4. The same questions on both data roots.
const before = createPraxis({ data: from })
const after = createPraxis({ data: to })
const types = before.taskTypes()
const streams = before.entry().streams.map((x) => x.id)
const asks = [
  ...types.flatMap((t) => t.pipelines.map((pipeline) => ({ task_type: t.id, pipeline }))),
  ...streams.map((stream) => ({ stream })),
  ...types.flatMap((t) => streams.map((stream) => ({ task_type: t.id, stream }))),
]
// What may differ: stock, which only the copy has, and the stream pages' own paths.
const comparable = (r) => JSON.stringify({ ...r,
  stream: r.stream && { ...r.stream, path: undefined },
  units: r.units.map((u) => (u.id.startsWith('stream/') ? { ...u, path: undefined } : u)),
  materials: r.materials.map(({ stock, ...m }) => m),
})
const mismatches = asks.filter((a) => comparable(before.resolve(a)) !== comparable(after.resolve(a)))
// And the relations, runs that went stale, and what upkeep lists.
const count = (p) => ({ bindings: p.materials.listBindings().length, declared: p.materials.listBindings().filter((b) => b.declared).length, stale: p.stale().length,
  upkeep: Object.fromEntries(Object.entries(p.upkeep()).map(([k, v]) => [k, Array.isArray(v) ? v.length : v])) })
const counts = { before: count(before), after: count(after) }
if (JSON.stringify(counts.before) !== JSON.stringify(counts.after)) mismatches.push({ counts })

const report = {
  from, to, base: now.base, packs_kit: packsKit ? kitWas : undefined, streams: { from: was, to: is, bindings_renamed: bindingsRenamed, runs_renamed: runsRenamed },
  stock: { imported: imported.length, skipped },
  parity: { asked: asks.length, mismatches },
}
console.log(JSON.stringify(report, null, 1))
process.exit(mismatches.length ? 1 : 0)
