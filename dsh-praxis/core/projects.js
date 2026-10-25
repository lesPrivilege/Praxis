// Projects: the directory a piece of work lives in, with a layout that says which paths hold its
// drafts, intermediate builds and final products. A delivered file belongs to the project whose
// root holds it; the layout tells whether it sits where that project keeps drafts or finals.
// Praxis records and checks; it never moves files.
import { existsSync, globSync, statSync } from 'node:fs'
import { basename, isAbsolute, join, matchesGlob, relative, resolve, sep } from 'node:path'
import { Collection } from './store.js'

export const ROLES = ['draft', 'build', 'final']
// Where artifacts belong: drafts and final products. Builds are intermediate and never registered.
export const DELIVERED = ['draft', 'final']
export const TEMPLATES = {
  standard: { draft: ['draft/**'], build: ['build/**'], final: ['out/**'] },
}
const SLUG = /^[a-z0-9][a-z0-9-]*$/
const SKIP = new Set(['node_modules', '.git', '__pycache__'])

export class Projects {
  constructor(repo, dataDir) {
    this.repo = repo
    this.store = new Collection(join(dataDir, 'projects.json'), join(dataDir, 'history.jsonl'))
  }

  /** Repository folders are kept repo-relative ('' is the repository itself); others absolute. */
  normalize(path) {
    const abs = resolve(this.repo, path)
    const rel = relative(this.repo, abs)
    return !rel.startsWith('..') && !isAbsolute(rel) ? rel.split(sep).join('/') : abs
  }

  absolute(root) {
    return isAbsolute(root) ? root : join(this.repo, root)
  }

  list({ include_removed = false } = {}) {
    return Object.entries(this.store.all()).map(([id, p]) => ({ id, ...p }))
      .filter((p) => include_removed || p.state !== 'removed')
  }

  get(id) {
    const p = this.store.get(id)
    return p ? { id, ...p } : undefined
  }

  /** The project holding a (normalized) path, the deepest when projects nest, with the path inside it. */
  of(path) {
    const abs = this.absolute(path)
    let best
    for (const p of this.list()) {
      const rel = relative(this.absolute(p.root), abs)
      if (rel.startsWith('..') || isAbsolute(rel)) continue
      if (!best || p.root.length > best.project.root.length) best = { project: p, path: rel.split(sep).join('/') }
    }
    return best
  }

  /** draft, build or final, by the first matching pattern in that order; undefined when none matches. */
  role(project, path) {
    return ROLES.find((r) => (project.layout[r] ?? []).some((g) => matchesGlob(path, g)))
  }

  /** Files in the project's final paths, relative to its root. README files describe folders and are skipped. */
  finals(project) {
    const root = this.absolute(project.root)
    const out = new Set()
    for (const g of project.layout.final ?? []) {
      for (const rel of globSync(g, { cwd: root, exclude: (name) => SKIP.has(basename(name)) })) {
        if (basename(rel) !== 'README.md' && statSync(join(root, rel)).isFile()) out.add(rel.split(sep).join('/'))
      }
    }
    return [...out].sort()
  }

  /**
   * Register a project, or change one with the revision read. A layout starts from a template and
   * any role given replaces the template's patterns for that role; patterns are globs relative to the root.
   */
  save({ id, expected_revision, root, title, purpose, template, layout, state, by, reason }) {
    const current = id ? this.store.get(id) : undefined
    if (id && !current && expected_revision !== 0) throw new Error(`unknown project: ${id}; register it with expected_revision 0`)
    const nextRoot = root !== undefined ? this.normalize(root) : current?.root
    if (nextRoot === undefined) throw new Error('project needs root')
    if (!existsSync(this.absolute(nextRoot)) || !statSync(this.absolute(nextRoot)).isDirectory()) throw new Error(`not a directory: ${root}`)
    if (template !== undefined && !TEMPLATES[template]) throw new Error(`template must be ${Object.keys(TEMPLATES).join(', ')}`)
    const base = template ? TEMPLATES[template] : current?.layout ?? TEMPLATES.standard
    const nextLayout = { ...base, ...layout }
    for (const [r, globs] of Object.entries(nextLayout)) {
      if (!ROLES.includes(r)) throw new Error(`layout role must be ${ROLES.join(', ')}`)
      if (!Array.isArray(globs) || globs.some((g) => typeof g !== 'string' || !g.trim() || isAbsolute(g) || g.split('/').includes('..'))) {
        throw new Error(`layout.${r} must be a list of patterns relative to the root`)
      }
    }
    const next = { root: nextRoot, title: title ?? current?.title, purpose: purpose ?? current?.purpose, layout: nextLayout, state: state ?? current?.state ?? 'active' }
    if (!next.title?.trim() || !next.purpose?.trim()) throw new Error('project needs title and purpose')
    if (!['active', 'removed'].includes(next.state)) throw new Error('state must be active or removed')
    const key = id ?? slug(next.title, nextRoot)
    if (!SLUG.test(key)) throw new Error(`bad project id: ${key}`)
    const clash = this.list().find((p) => p.id !== key && p.root === nextRoot)
    if (clash && next.state === 'active') throw new Error(`${clash.id} already has this root`)
    const saved = this.store.update(key, id ? expected_revision : 0, (cur = {}) => ({ ...cur, ...next }), { op: 'project', by, reason })
    return { id: key, ...saved }
  }
}

function slug(title, root) {
  const ascii = title.normalize('NFKD').replace(/[^\x00-\x7f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return ascii.length >= 3 ? ascii.slice(0, 40).replace(/-$/, '') : basename(root).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
