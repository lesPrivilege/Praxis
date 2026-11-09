// Kit units are the Markdown pages of each layer. The index is derived on read;
// the pages are the only editable source.
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, posix, relative } from 'node:path'

// Where each layer's pages live, relative to the package.
export const LAYERS = {
  task: 'kit/task',
  writing: 'kit/writing',
  publish: 'kit/publish',
  design: 'kit/design',
}

// Units whose description is in context for every task (see layers.md).
export const RESIDENT = ['writing', 'writing/evidence', 'design', 'design/foundations/grammar']

const ID_LINE = /(?:语法 ID|稳定 ID|ID)\s*[:：]\s*`([A-Z][A-Z0-9-]+)`/g

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      if (name !== 'src' && name !== 'node_modules') out.push(...walk(path))
    } else if (name.endsWith('.md')) {
      out.push(path)
    }
  }
  return out
}

export function plain(markdown) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function clip(text, max = 240) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const stop = Math.max(cut.lastIndexOf('。'), cut.lastIndexOf('；'), cut.lastIndexOf('. '))
  return stop > max / 3 ? cut.slice(0, stop + 1) : cut.slice(0, max - 1) + '…'
}

/** First prose paragraph after the H1: the page's own entry description. */
export function describe(text) {
  const body = text.replace(/^---\n[\s\S]*?\n---\n/, '').split('\n')
  let seenTitle = false
  const para = []
  for (const line of body) {
    if (!seenTitle) {
      if (line.startsWith('# ')) seenTitle = true
      continue
    }
    const trimmed = line.trim()
    if (!trimmed) {
      if (para.length) break
      continue
    }
    if (/^(#|\||[-*] |\d+\. |```|<|kind:|id:|语法 ID|稳定 ID|ID[:：]|取用[:：])/.test(trimmed)) {
      if (para.length) break
      continue
    }
    para.push(trimmed)
  }
  return clip(plain(para.join(' ')))
}

export function unitId(layer, root, file) {
  const rel = relative(root, file).split('\\').join('/').replace(/\.md$/, '')
  if (rel === 'README') return layer
  return posix.join(layer, rel.replace(/\/README$/, ''))
}

export class Kit {
  /**
   * Units are read from the package's Kit; a unit's path is package-relative (`kit/…`). A page in the
   * overlay folder (same relative path) replaces the package's page: revisions a user or agent made
   * live in their data, and a package upgrade never overwrites them. `streams` is the data root's
   * folder of authored pages ({ dir, path: file → record path }); they read as units of layer `stream`.
   * A page in the overlay that the package does not have is a page a user or agent added (`added`);
   * a folder with a README there is a new area, at any depth. `removed` lists the paths taken out of
   * the Kit, package pages or added ones; they are not units.
   */
  constructor(pkg, overlay, streams, removed = new Set()) {
    this.pkg = pkg
    this.overlay = overlay
    this.streamFiles = new Map()
    this.units = new Map()
    this.byPath = new Map()
    this.byAlias = new Map()
    for (const [layer, rootRel] of Object.entries(LAYERS)) {
      const root = join(pkg, rootRel)
      const files = new Map()
      for (const [base, added] of [[pkg, false], [overlay, true]]) {
        const dir = base && join(base, rootRel)
        if (!dir || !existsSync(dir)) continue
        for (const file of walk(dir)) {
          const path = relative(base, file).split('\\').join('/')
          if (!files.has(path)) files.set(path, { file: join(pkg, path), added })
        }
      }
      for (const [path, { file, added }] of files) {
        if (removed.has(path)) continue
        const text = this.text(path)
        const id = unitId(layer, root, file)
        const aliases = [...text.matchAll(ID_LINE)].map((m) => m[1])
        const unit = {
          id,
          layer,
          title: (text.match(/^# (.+)$/m)?.[1] ?? id).trim(),
          description: describe(text),
          path,
          resident: RESIDENT.includes(id),
          aliases: [...new Set(aliases)],
          version: createHash('sha256').update(text).digest('hex').slice(0, 12),
          ...(this.revised(path) ? { overlay: true } : {}),
          ...(added ? { added: true } : {}),
        }
        this.units.set(id, unit)
        this.byPath.set(path, unit)
        for (const alias of unit.aliases) this.byAlias.set(alias, unit)
      }
    }
    for (const name of streams && existsSync(streams.dir) ? readdirSync(streams.dir).sort() : []) {
      if (!name.endsWith('.md') || name === 'README.md') continue
      const file = join(streams.dir, name)
      const text = readFileSync(file, 'utf8')
      const id = `stream/${name.replace(/\.md$/, '')}`
      const path = streams.path(file)
      const unit = { id, layer: 'stream', title: (text.match(/^# (.+)$/m)?.[1] ?? id).trim(), description: describe(text), path, resident: false, aliases: [], version: createHash('sha256').update(text).digest('hex').slice(0, 12) }
      this.streamFiles.set(path, file)
      this.units.set(id, unit)
      this.byPath.set(path, unit)
    }
  }

  /** A page's text: a stream's file, the overlay's revision when there is one, else the package's page. */
  text(path) {
    return readFileSync(this.streamFiles.get(path) ?? this.revised(path) ?? join(this.pkg, path), 'utf8')
  }

  /** The Kit units a stream page names by path (`kit/….md`). */
  draws(unit) {
    return [...new Set(this.text(unit.path).match(/\bkit\/[\w./-]+\.md/g) ?? [])].map((path) => this.find(path)).filter(Boolean)
  }

  /** The package's own page, whatever the overlay holds. */
  packaged(path) {
    return readFileSync(join(this.pkg, path), 'utf8')
  }

  revised(path) {
    const file = this.overlay && join(this.overlay, path)
    return file && existsSync(file) ? file : undefined
  }

  /** The Kit's areas: each layer and each folder with a README, by unit id (`design`, `design/composition`). */
  areas() {
    return this.list().filter((u) => u.path.endsWith('/README.md')).map((u) => u.id).sort()
  }

  list(layer) {
    return [...this.units.values()].filter((u) => !layer || u.layer === layer)
  }

  /** Last commit time per unit path, from one git log pass; empty outside a git checkout. */
  updatedAt() {
    if (this.updated) return this.updated
    this.updated = new Map()
    try {
      const out = execFileSync('git', ['log', '--relative', '--format=%x00%cI', '--name-only', '--', ...Object.values(LAYERS)], { cwd: this.pkg, encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] })
      let at = null
      for (const line of out.split('\n')) {
        if (line.startsWith('\0')) at = line.slice(1)
        else if (line && !this.updated.has(line)) this.updated.set(line, at)
      }
    } catch {}
    return this.updated
  }

  /** Accept a unit id, a package path `kit/…` (optionally with #anchor) or a stable grammar ID. */
  find(ref) {
    if (!ref) return undefined
    const bare = ref.split('#')[0]
    return this.units.get(bare) ?? this.byPath.get(bare) ?? this.byAlias.get(bare)
  }

  read(ref) {
    const unit = this.find(ref)
    if (!unit) return undefined
    return { ...unit, body: this.text(unit.path) }
  }

  /** Task types are the pages under task/types; their table rows name the units to read. */
  taskTypes() {
    return this.list('task')
      .filter((u) => u.id.startsWith('task/types/') && u.id !== 'task/types')
      .map((u) => this.taskType(u.id))
  }

  taskType(ref) {
    const unit = this.find(ref) ?? this.find(`task/types/${ref}`)
    if (!unit || !unit.id.startsWith('task/types/')) return undefined
    const text = this.text(unit.path)
    const rows = {}
    for (const m of text.matchAll(/^\| *([^|]+?) *\| *(.+?) *\|$/gm)) rows[m[1]] = m[2]
    const linked = (cell) => {
      const out = []
      for (const m of (cell ?? '').matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
        const target = posix.normalize(posix.join(posix.dirname(unit.path), m[2].split('#')[0]))
        const hit = this.byPath.get(target)
        if (hit) out.push({ unit: hit.id, label: m[1], when: conditionFor(cell, m.index) })
      }
      return out
    }
    const acceptance = (text.split(/^## 验收\s*$/m)[1] ?? '')
      .split(/^## /m)[0]
      .split('\n')
      .filter((l) => l.startsWith('- '))
      .map((l) => plain(l.slice(2)))
    return {
      id: unit.id,
      title: unit.title,
      description: unit.description,
      reader: plain(rows['读者'] ?? ''),
      outcome: plain(rows['结果'] ?? ''),
      pipelines: [...new Set(((rows['默认流水线'] ?? '').match(/\b(html|video)\b/g) ?? []))],
      pipeline_note: plain(rows['默认流水线'] ?? ''),
      writing: linked(rows['Writing']),
      design: linked(rows['Design']),
      publish: linked(rows['Publish']),
      materials: plain(rows['素材'] ?? ''),
      acceptance,
      path: unit.path,
      version: unit.version,
    }
  }
}

// A link written after "html：" or "video 另加" applies to that pipeline only.
function conditionFor(cell, index) {
  const before = cell.slice(0, index)
  const marks = [...before.matchAll(/(html|video)[^；;，,]*?(?:：|另加|时)/g)]
  if (!marks.length) return undefined
  const last = marks[marks.length - 1]
  const separator = before.slice(last.index).search(/；|;/)
  return separator === -1 ? last[1] : undefined
}
