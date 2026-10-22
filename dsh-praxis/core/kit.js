// Kit units are the Markdown pages of each layer. The index is derived on read;
// the pages are the only editable source.
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, posix, relative } from 'node:path'

// Where each layer's pages live. Design moves here when the Materials data layer does.
export const LAYERS = {
  task: 'dsh-praxis/kit/task',
  writing: 'dsh-praxis/kit/writing',
  publish: 'dsh-praxis/kit/publish',
  design: 'dsh-praxis/kit/design',
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
  constructor(repo) {
    this.repo = repo
    this.units = new Map()
    this.byPath = new Map()
    this.byAlias = new Map()
    for (const [layer, rootRel] of Object.entries(LAYERS)) {
      const root = join(repo, rootRel)
      if (!existsSync(root)) continue
      for (const file of walk(root)) {
        const text = readFileSync(file, 'utf8')
        const path = relative(repo, file).split('\\').join('/')
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
        }
        this.units.set(id, unit)
        this.byPath.set(path, unit)
        for (const alias of unit.aliases) this.byAlias.set(alias, unit)
      }
    }
  }

  list(layer) {
    return [...this.units.values()].filter((u) => !layer || u.layer === layer)
  }

  /** Accept a unit id, a repo path (optionally with #anchor) or a stable grammar ID. */
  find(ref) {
    if (!ref) return undefined
    const bare = ref.split('#')[0]
    return this.units.get(bare) ?? this.byPath.get(bare) ?? this.byAlias.get(bare)
  }

  read(ref) {
    const unit = this.find(ref)
    if (!unit) return undefined
    return { ...unit, body: readFileSync(join(this.repo, unit.path), 'utf8') }
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
    const text = readFileSync(join(this.repo, unit.path), 'utf8')
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
