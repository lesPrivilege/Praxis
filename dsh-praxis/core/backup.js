// Export everything Praxis writes as one archive with a hash manifest, and check an archive before
// restoring it. That is the data root: roster, bindings, packs, presets, projects, artifacts, runs,
// checks, history and stock. Plugin code and the Kit travel with the package; pack files and artifact
// files stay with their owners.
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { PACKAGE } from './paths.js'

const sha = (buf) => createHash('sha256').update(buf).digest('hex')

function files(dir, prefix = '') {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    if (name.endsWith('.lock') || name.endsWith('.tmp') || name === '.DS_Store') return []
    const full = join(dir, name)
    return statSync(full).isDirectory() ? files(full, `${prefix}${name}/`) : [`${prefix}${name}`]
  })
}

/** The archive's one root, `data/`. */
const roots = (where) => ({ data: where.data })

export function exportState(where, dest) {
  const list = Object.entries(roots(where)).flatMap(([name, dir]) => files(dir).map((rel) => ({ name, rel, abs: join(dir, rel) })))
  const manifest = {
    kind: 'dsh-praxis-state',
    created_at: new Date().toISOString(),
    package_version: JSON.parse(readFileSync(join(PACKAGE, 'package.json'), 'utf8')).version,
    files: list.map(({ name, rel, abs }) => {
      const buf = readFileSync(abs)
      return { path: `${name}/${rel}`, sha256: sha(buf), size_bytes: buf.length }
    }),
  }
  const stage = mkdtempSync(join(tmpdir(), 'praxis-export-'))
  writeFileSync(join(stage, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  for (const { name, rel, abs } of list) {
    mkdirSync(dirname(join(stage, name, rel)), { recursive: true })
    copyFileSync(abs, join(stage, name, rel))
  }
  execFileSync('tar', ['-czf', dest, '-C', stage, 'manifest.json', ...Object.keys(roots(where)).filter((n) => existsSync(join(stage, n)))])
  return { archive: dest, files: list.length, bytes: manifest.files.reduce((n, f) => n + f.size_bytes, 0) }
}

/** Unpack into a scratch directory and compare every file with the manifest. */
export function checkArchive(archive) {
  const stage = mkdtempSync(join(tmpdir(), 'praxis-check-'))
  execFileSync('tar', ['-xzf', archive, '-C', stage])
  const manifest = JSON.parse(readFileSync(join(stage, 'manifest.json'), 'utf8'))
  if (manifest.kind !== 'dsh-praxis-state') throw new Error('not a dsh-praxis state archive')
  const problems = []
  for (const f of manifest.files) {
    if (f.path.startsWith('/') || f.path.split('/').includes('..') || !/^data\//.test(f.path)) problems.push(`unsafe path ${f.path}`)
    const p = join(stage, f.path)
    if (!existsSync(p)) problems.push(`missing ${f.path}`)
    else if (sha(readFileSync(p)) !== f.sha256) problems.push(`hash mismatch ${f.path}`)
  }
  return { ok: problems.length === 0, problems, manifest, unpacked: stage }
}

/** Copy a checked archive back. Files that differ locally are reported and left alone unless forced. */
export function restoreState(where, archive, { force = false } = {}) {
  const check = checkArchive(archive)
  if (!check.ok) throw new Error(`archive check failed: ${check.problems.join('; ')}`)
  const dirs = { data: where.data }
  const target = (path) => join(dirs[path.slice(0, path.indexOf('/'))], path.slice(path.indexOf('/') + 1))
  const conflicts = check.manifest.files
    .filter((f) => existsSync(target(f.path)) && sha(readFileSync(target(f.path))) !== f.sha256)
    .map((f) => f.path)
  if (conflicts.length && !force) return { restored: 0, conflicts }
  for (const f of check.manifest.files) {
    mkdirSync(dirname(target(f.path)), { recursive: true })
    copyFileSync(join(check.unpacked, f.path), target(f.path))
  }
  return { restored: check.manifest.files.length, conflicts }
}
