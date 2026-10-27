// Where Praxis reads and writes, resolved in one place. The package holds the code and the Kit;
// the data root holds everything Praxis writes (roster, bindings, presets, projects, artifacts,
// runs, history, checks). The DSH plugin, the MCP server and the CLI resolve the same data root.
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readJson } from './store.js'

export const PACKAGE = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * The data root: explicit, PRAXIS_DATA, the package's own data folder when it has one (a checkout
 * that keeps its data beside the code), else the plugin folder in the DSH home ($DSH_HOME/dsh-praxis).
 * settings.json in the data root may name `base`, the folder relative paths are written against
 * (a repository), and `snapshots`, where kept originals go; both relative to the data root.
 */
export function locate({ data, package: pkg = PACKAGE } = {}) {
  const root = resolve(data ?? process.env.PRAXIS_DATA ?? (existsSync(join(pkg, 'data')) ? join(pkg, 'data')
    : join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'dsh-praxis')))
  const settings = readJson(join(root, 'settings.json'), {})
  return {
    package: pkg,
    kit: join(pkg, 'kit'),
    data: root,
    base: settings.base !== undefined ? resolve(root, settings.base) : undefined,
    snapshots: resolve(root, settings.snapshots ?? 'snapshots'),
  }
}

const inside = (dir, abs) => {
  const rel = relative(dir, abs)
  return !rel.startsWith('..') && !isAbsolute(rel) ? rel.split(sep).join('/') : undefined
}

/**
 * Paths as records keep them: a file in the package's Kit as `kit/…`; one under the base folder
 * relative to it; anything else absolute. A relative input is read against the base (or the
 * working directory without one); `kit/…` always names the package's Kit.
 */
export function pathsFor({ package: pkg, base }) {
  const absolute = (path) => {
    if (isAbsolute(path)) return path
    if (path === 'kit' || path.startsWith('kit/')) return join(pkg, path)
    return resolve(base ?? process.cwd(), path)
  }
  const normalize = (path) => {
    const [file, anchor] = splitAnchor(path)
    const abs = absolute(file)
    const inKit = inside(join(pkg, 'kit'), abs)
    const rel = inKit !== undefined ? (inKit ? `kit/${inKit}` : 'kit') : base ? inside(base, abs) : undefined
    return (rel ?? abs) + (anchor ? `#${anchor}` : '')
  }
  return { absolute: (path) => absolute(splitAnchor(path)[0]), normalize }
}

function splitAnchor(path) {
  const at = path.indexOf('#')
  return at < 0 ? [path, ''] : [path.slice(0, at), path.slice(at + 1)]
}
