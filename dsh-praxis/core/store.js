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

// Rewrite a JSON file in its own formatting: parts whose data did not change are copied from the old
// text, so a hand-formatted catalog (inline arrays, its own indentation) changes only where its data did.
export function writeJson(path, data, indent) {
  mkdirSync(dirname(path), { recursive: true })
  const text = existsSync(path) ? patchJson(readFileSync(path, 'utf8'), data, indent) : JSON.stringify(data, null, indent ?? 2)
  const tmp = `${path}.${process.pid}.tmp`
  writeFileSync(tmp, text + '\n')
  renameSync(tmp, path)
}

/**
 * Serialize `value` reusing `text`, the file's current JSON. An unchanged value keeps its old text. A
 * container whose old children are still there in order keeps its text too, with only changed values
 * replaced and new children appended with its own separator; otherwise it is laid out again, inline
 * if it was inline. New parts follow their parent's style and the file's indent unit (or `indent`).
 */
export function patchJson(text, value, indent) {
  const unit = indent !== undefined ? ' '.repeat(indent) : (text.match(/\n([ \t]+)\S/)?.[1] ?? '  ')
  const slice = (n) => text.slice(n.start, n.end)
  const same = (n, v) => (n.json ??= JSON.stringify(JSON.parse(slice(n)))) === JSON.stringify(v)
  const padAt = (pos) => text.slice(text.lastIndexOf('\n', pos - 1) + 1, pos).match(/^[ \t]*/)[0]
  const emit = (v, node, pad, flat) => {
    if (node && v !== undefined && same(node, v)) return slice(node)
    if (v === null || typeof v !== 'object') return JSON.stringify(v)
    const object = !Array.isArray(v)
    const old = node?.type === (object ? 'object' : 'array') ? node : undefined
    const inline = old ? !slice(old).includes('\n') : flat
    const kids = old ? (object ? old.entries : old.items) : []
    const valueOf = (c) => (object ? c.node : c)
    const startOf = (c) => (object ? c.keyStart : c.start)
    const inner = kids.length ? padAt(startOf(kids[0])) : pad + unit
    const entries = object ? Object.entries(v).filter(([, x]) => x !== undefined) : v.map((x, i) => [i, x])
    const render = ([k, x], oldValue) => (object ? `${JSON.stringify(k)}: ` : '') + emit(x, oldValue, inner, inline)
    if (kids.length && kids.length <= entries.length && (!object || kids.every((c, i) => entries[i][0] === c.key))) {
      let out = ''
      let at = old.start
      kids.forEach((c, i) => {
        out += text.slice(at, valueOf(c).start) + emit(entries[i][1], valueOf(c), inner, inline)
        at = valueOf(c).end
      })
      const sep = kids.length > 1 ? text.slice(valueOf(kids.at(-2)).end, startOf(kids.at(-1))) : inline ? ', ' : `,\n${inner}`
      for (const e of entries.slice(kids.length)) out += sep + render(e)
      return out + text.slice(at, old.end)
    }
    const used = new Set()
    const parts = entries.map(([k, x], i) => {
      if (object) return render([k, x], kids.find((c) => c.key === k)?.node)
      const j = kids.findIndex((n, m) => !used.has(m) && same(n, x))
      if (j >= 0) { used.add(j); return slice(kids[j]) }
      return render([k, x], kids[i] && !used.has(i) ? kids[i] : undefined)
    })
    const [open, close] = object ? ['{', '}'] : ['[', ']']
    if (!parts.length) return open + close
    if (inline) return open + parts.join(', ') + close
    return `${open}\n${parts.map((p) => inner + p).join(',\n')}\n${old ? padAt(old.end - 1) : pad}${close}`
  }
  return emit(value, parseSpans(text), '', false)
}

/** Parse JSON keeping where each value starts and ends, and where each key starts. */
function parseSpans(text) {
  let i = 0
  const ws = () => { while (i < text.length && ' \t\n\r'.includes(text[i])) i++ }
  const string = () => {
    const start = i++
    while (text[i] !== '"') i += text[i] === '\\' ? 2 : 1
    i++
    return JSON.parse(text.slice(start, i))
  }
  const value = () => {
    ws()
    const start = i
    if (text[i] === '{' || text[i] === '[') {
      const object = text[i++] === '{'
      const children = []
      ws()
      while (text[i] !== (object ? '}' : ']')) {
        if (object) {
          ws()
          const keyStart = i
          const key = string()
          ws()
          i++
          children.push({ key, keyStart, node: value() })
        } else children.push(value())
        ws()
        if (text[i] === ',') i++
        ws()
      }
      i++
      return object ? { type: 'object', start, end: i, entries: children } : { type: 'array', start, end: i, items: children }
    }
    if (text[i] === '"') string()
    else while (i < text.length && !' \t\n\r,]}'.includes(text[i])) i++
    return { type: 'value', start, end: i }
  }
  return value()
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
