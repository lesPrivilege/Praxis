// Artifacts: the files a piece of work delivered. The bytes stay where their owner keeps them,
// inside this repository or in another workspace; Praxis keeps the identity, one version per
// distinct content (sha256), the run each version came from, what it was derived from, and
// reviews bound to a version. Status is read from the file each time, never stored.
import { createHash } from 'node:crypto'
import { readFileSync, statSync } from 'node:fs'
import { basename, extname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { Collection } from './store.js'

export const VERDICTS = ['needs-work', 'checked', 'accepted']
// Signals are what needs someone: the record lost its file, a review asked for changes, or the file
// sits outside every project or outside where its project keeps drafts and finals. Later edits
// (status modified) and a changed basis are shown, not signalled: the next delivery records them.
export const ARTIFACT_SIGNALS = ['missing', 'needs_work', 'misplaced']

const MEDIA = {
  html: 'html', htm: 'html', md: 'text', txt: 'text', json: 'text', pdf: 'pdf',
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', svg: 'image',
  mp4: 'video', mov: 'video', webm: 'video', mp3: 'audio', wav: 'audio', m4a: 'audio',
  docx: 'document', doc: 'document', pptx: 'slides', ppt: 'slides', xlsx: 'sheet', xls: 'sheet', csv: 'sheet',
}

export const mediumOf = (path) => MEDIA[extname(path).slice(1).toLowerCase()] ?? 'file'

export class Artifacts {
  constructor(repo, dataDir) {
    this.repo = repo
    this.store = new Collection(join(dataDir, 'artifacts.json'), join(dataDir, 'history.jsonl'))
  }

  /** Repository files are kept repo-relative so records survive moving the checkout; others absolute. */
  normalize(path) {
    const abs = resolve(this.repo, path)
    const rel = relative(this.repo, abs)
    return rel && !rel.startsWith('..') && !isAbsolute(rel) ? rel.split(sep).join('/') : abs
  }

  absolute(path) {
    return isAbsolute(path) ? path : join(this.repo, path)
  }

  /** Content and stat of a regular file, or null. */
  fingerprint(path) {
    const abs = this.absolute(path)
    let st
    try { st = statSync(abs) } catch { return null }
    if (!st.isFile()) return null
    return { sha256: createHash('sha256').update(readFileSync(abs)).digest('hex'), size: st.size, mtime_ms: Math.round(st.mtimeMs) }
  }

  /** current: the file holds the latest version; modified: it holds something unregistered; missing. */
  status(rec) {
    const latest = rec.versions.at(-1)
    let st
    try { st = statSync(this.absolute(rec.path)) } catch { return 'missing' }
    if (!st.isFile()) return 'missing'
    if (st.size === latest.size && Math.round(st.mtimeMs) === latest.mtime_ms) return 'current'
    return this.fingerprint(rec.path)?.sha256 === latest.sha256 ? 'current' : 'modified'
  }

  find(path) {
    const key = this.normalize(path)
    return Object.entries(this.store.all()).find(([, r]) => r.path === key && r.state !== 'removed')
  }

  /**
   * Check a delivery before anything is written: the file exists, a named artifact exists,
   * derived_from points at known versions. Returns what register() needs.
   */
  prepare(input) {
    const item = typeof input === 'string' ? { path: input } : input
    if (!item?.path) throw new Error('artifact needs a path')
    const fp = this.fingerprint(item.path)
    if (!fp) throw new Error(`artifact file not found: ${item.path}`)
    const all = this.store.all()
    if (item.artifact && !all[item.artifact]) throw new Error(`unknown artifact: ${item.artifact}`)
    const derived = (item.derived_from ?? []).map((d) => {
      const ref = typeof d === 'string' ? { artifact: d } : d
      const rec = all[ref.artifact]
      if (!rec) throw new Error(`unknown artifact: ${ref.artifact}`)
      const version = ref.version ?? rec.versions.length
      if (!rec.versions[version - 1]) throw new Error(`${ref.artifact} has no version ${version}`)
      return { artifact: ref.artifact, version }
    })
    return { ...item, path: this.normalize(item.path), fp, derived }
  }

  /**
   * Record one delivered file. Same file, same bytes as its latest version: nothing new.
   * New bytes: the next version. A named artifact at a new path: moved, with the version rule unchanged.
   */
  register(item, { run, by } = {}) {
    const found = item.artifact ? [item.artifact, this.store.get(item.artifact)] : this.find(item.path)
    const at = new Date().toISOString()
    const version = { sha256: item.fp.sha256, size: item.fp.size, mtime_ms: item.fp.mtime_ms, at, run, by, ...(item.derived.length ? { derived_from: item.derived } : {}) }
    if (found) {
      const [id, rec] = found
      const latest = rec.versions.at(-1)
      if (latest.sha256 === item.fp.sha256 && rec.path === item.path) return { id, version: rec.versions.length, path: rec.path, sha256: latest.sha256, created: false }
      const saved = this.store.update(id, undefined, (cur) => ({
        ...cur,
        path: item.path,
        ...(item.title ? { title: item.title } : {}),
        ...(item.description ? { description: item.description } : {}),
        versions: latest.sha256 === item.fp.sha256 ? cur.versions : [...cur.versions, version],
        state: 'active',
      }), { op: 'artifact', by, run })
      return { id, version: saved.versions.length, path: item.path, sha256: item.fp.sha256, created: false }
    }
    const id = artifactId(item.path, at)
    this.store.update(id, 0, () => ({
      title: item.title ?? basename(item.path),
      description: item.description,
      path: item.path,
      medium: mediumOf(item.path),
      created_at: at,
      versions: [version],
      reviews: [],
      state: 'active',
    }), { op: 'artifact', by, run })
    return { id, version: 1, path: item.path, sha256: item.fp.sha256, created: true }
  }

  get(id) {
    const rec = this.store.get(id)
    return rec ? { id, ...rec } : undefined
  }

  /** A review names the version it looked at, so a later version never inherits it. */
  review(id, { version, verdict, note, by }) {
    const rec = this.store.get(id)
    if (!rec) throw new Error(`unknown artifact: ${id}`)
    if (!VERDICTS.includes(verdict)) throw new Error(`verdict must be ${VERDICTS.join(', ')}`)
    if (!Number.isInteger(version) || !rec.versions[version - 1]) throw new Error(`${id} has no version ${version}`)
    const saved = this.store.update(id, undefined, (cur) => ({
      ...cur, reviews: [...cur.reviews, { version, verdict, note, by, at: new Date().toISOString() }],
    }), { op: 'artifact-review', by, verdict, version })
    return { id, ...saved }
  }

  /**
   * Rename, describe, remove or restore, or point at the file's new place. A new place must hold
   * the latest version's bytes; different bytes are a new version and go through consume.
   */
  update(id, { expected_revision, title, description, path, state, by, reason }) {
    const rec = this.store.get(id)
    if (!rec) throw new Error(`unknown artifact: ${id}`)
    if (state !== undefined && !['active', 'removed'].includes(state)) throw new Error('state must be active or removed')
    let moved
    if (path !== undefined) {
      const fp = this.fingerprint(path)
      if (!fp) throw new Error(`file not found: ${path}`)
      const latest = rec.versions.at(-1)
      if (fp.sha256 !== latest.sha256) throw new Error(`the file at ${path} is not version ${rec.versions.length}; record it with praxis_consume as a new version`)
      moved = { path: this.normalize(path), mtime_ms: fp.mtime_ms }
    }
    const saved = this.store.update(id, expected_revision, (cur) => ({
      ...cur,
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(state !== undefined ? { state } : {}),
      ...(moved ? { path: moved.path, versions: cur.versions.map((v, i) => (i === cur.versions.length - 1 ? { ...v, mtime_ms: moved.mtime_ms } : v)) } : {}),
    }), { op: 'artifact-update', by, reason })
    return { id, ...saved }
  }
}

function artifactId(path, at) {
  const stem = basename(path, extname(path)).normalize('NFKD').replace(/[^\x00-\x7f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
  return `${stem || 'artifact'}-${createHash('sha256').update(path + at).digest('hex').slice(0, 6)}`
}
