// Small JSON document store: atomic writes, a cross-process lock, per-record
// revisions checked against expected_revision, and an append-only history.
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync, appendFileSync } from 'node:fs'
import { dirname } from 'node:path'

const LOCK_STALE_MS = 10_000

export class ConflictError extends Error {
  constructor(id, expected, actual, current) {
    super(`revision conflict on ${id}: expected ${expected}, current ${actual}`)
    this.code = 'conflict'
    this.current = current
  }
}

export function readJson(path, fallback) {
  if (!existsSync(path)) return fallback
  return JSON.parse(readFileSync(path, 'utf8'))
}

// Keep the file's own indentation so hand-maintained JSON does not churn.
export function writeJson(path, data, indent) {
  mkdirSync(dirname(path), { recursive: true })
  const tmp = `${path}.${process.pid}.tmp`
  writeFileSync(tmp, JSON.stringify(data, null, indent ?? detectIndent(path)) + '\n')
  renameSync(tmp, path)
}

export function detectIndent(path) {
  if (!existsSync(path)) return 2
  const m = readFileSync(path, 'utf8').match(/^\{\n( +)"/)
  return m ? m[1].length : 2
}

export function withLock(path, fn) {
  const lock = `${path}.lock`
  mkdirSync(dirname(lock), { recursive: true })
  const deadline = Date.now() + LOCK_STALE_MS
  for (;;) {
    try {
      closeSync(openSync(lock, 'wx'))
      break
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
      try {
        if (Date.now() - statSync(lock).mtimeMs > LOCK_STALE_MS) unlinkSync(lock)
      } catch {}
      if (Date.now() > deadline) throw new Error(`lock busy: ${lock}`)
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25)
    }
  }
  try {
    return fn()
  } finally {
    try { unlinkSync(lock) } catch {}
  }
}

/** A collection of records keyed by id inside one JSON file: {schema_version, records: {id: record}}. */
export class Collection {
  constructor(path, historyPath) {
    this.path = path
    this.historyPath = historyPath
  }

  all() {
    return readJson(this.path, { schema_version: '1.0', records: {} }).records
  }

  get(id) {
    return this.all()[id]
  }

  /** Append a history entry that does not change a record (capture, refresh). */
  log(change) {
    if (!this.historyPath) return
    mkdirSync(dirname(this.historyPath), { recursive: true })
    appendFileSync(this.historyPath, JSON.stringify({ at: new Date().toISOString(), ...change }) + '\n')
  }

  /**
   * Apply fn(current) -> next under the lock. expected is the revision the caller read
   * (0 or undefined for a new record). `also(records)` may return further changes
   * [{id, fn, change}] that land in the same write, only once the check has passed.
   * Each history line carries the fields that revision set, so any revision can be replayed.
   * Returns the stored record.
   */
  update(id, expected, fn, change, { also } = {}) {
    return withLock(this.path, () => {
      const doc = readJson(this.path, { schema_version: '1.0', records: {} })
      const current = doc.records[id]
      const actual = current?.revision ?? 0
      if (expected !== undefined && expected !== null && expected !== actual) {
        throw new ConflictError(id, expected, actual, current)
      }
      const lines = []
      const apply = (key, step, note) => {
        const cur = doc.records[key]
        const next = { ...step(cur ? structuredClone(cur) : undefined), revision: (cur?.revision ?? 0) + 1 }
        doc.records[key] = next
        lines.push({ at: new Date().toISOString(), id: key, revision: next.revision, ...note, ...delta(cur, next) })
        return next
      }
      const next = apply(id, fn, change)
      for (const other of also?.(doc.records) ?? []) apply(other.id, other.fn, other.change)
      writeJson(this.path, doc)
      if (this.historyPath) {
        mkdirSync(dirname(this.historyPath), { recursive: true })
        appendFileSync(this.historyPath, lines.map((l) => JSON.stringify(l) + '\n').join(''))
      }
      return next
    })
  }
}

/** The fields a revision set and the ones it dropped. */
function delta(before = {}, after) {
  const set = {}
  for (const [k, v] of Object.entries(after)) if (k !== 'revision' && JSON.stringify(before[k]) !== JSON.stringify(v)) set[k] = v
  const unset = Object.keys(before).filter((k) => k !== 'revision' && !(k in after))
  return { set, ...(unset.length ? { unset } : {}) }
}
