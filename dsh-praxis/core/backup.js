// Export the control plane's persistent state as one archive with a hash manifest,
// and check an archive before restoring it. Plugin code and Kit pages travel with the
// repository; this carries what the control plane itself writes: its own data, captured
// sources and snapshots, and every file holding a source record, since bindings and refreshes edit
// the grammar_paths and snapshot pointers of existing records. Derived indexes are rebuilt on restore.
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { PROJECT_INDEXES } from './materials.js'

export const STATE_PATHS = [
  'dsh-praxis/data',
  'vault/provenance/praxis-captures',
  'vault/intake/praxis-captures.json',
  'vault/snapshots/local/praxis',
]

function files(repo, rel) {
  const full = join(repo, rel)
  if (!existsSync(full)) return []
  if (statSync(full).isFile()) return [rel]
  return readdirSync(full).flatMap((name) => (name.endsWith('.lock') || name.endsWith('.tmp') ? [] : files(repo, `${rel}/${name}`)))
}

const sha = (buf) => createHash('sha256').update(buf).digest('hex')

/**
 * Files holding the source records that curate, remove, restore and refresh write: every catalog or
 * intake the registry projects from, and for project indexes the registration (the project's own
 * index file belongs to the project and travels with it).
 */
function catalogs(repo) {
  const path = join(repo, 'vault/registry.json')
  if (!existsSync(path)) return []
  const rels = JSON.parse(readFileSync(path, 'utf8')).sources.map((s) => (s.kind === 'project-index' ? PROJECT_INDEXES : s.record_path)).filter(Boolean)
  return [...new Set(rels)].filter((rel) => existsSync(join(repo, rel)))
}

function artifactFiles(repo) {
  const path = join(repo, 'dsh-praxis/data/artifacts.json')
  if (!existsSync(path)) return 0
  return Object.values(JSON.parse(readFileSync(path, 'utf8')).records).filter((r) => r.state !== 'removed').length
}

export function exportState(repo, dest) {
  const list = [...new Set([...STATE_PATHS.flatMap((rel) => files(repo, rel)), ...catalogs(repo)])].sort()
  let commit = null
  try { commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim() } catch {}
  const manifest = {
    kind: 'dsh-praxis-state',
    created_at: new Date().toISOString(),
    repository_commit: commit,
    package_version: JSON.parse(readFileSync(join(repo, 'dsh-praxis/package.json'), 'utf8')).version,
    // Artifact files stay in their owners' workspaces; the archive carries their records and hashes only.
    not_included: { artifact_files: artifactFiles(repo) },
    files: list.map((rel) => {
      const buf = readFileSync(join(repo, rel))
      return { path: rel, sha256: sha(buf), size_bytes: buf.length }
    }),
  }
  const stage = mkdtempSync(join(tmpdir(), 'praxis-export-'))
  writeFileSync(join(stage, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  execFileSync('tar', ['-czf', dest, '-C', stage, 'manifest.json', '-C', repo, ...list])
  return { archive: dest, files: list.length, bytes: manifest.files.reduce((n, f) => n + f.size_bytes, 0), not_included: manifest.not_included }
}

/** Unpack into a scratch directory and compare every file with the manifest. */
export function checkArchive(archive) {
  const stage = mkdtempSync(join(tmpdir(), 'praxis-check-'))
  execFileSync('tar', ['-xzf', archive, '-C', stage])
  const manifest = JSON.parse(readFileSync(join(stage, 'manifest.json'), 'utf8'))
  if (manifest.kind !== 'dsh-praxis-state') throw new Error('not a dsh-praxis state archive')
  const problems = []
  for (const f of manifest.files) {
    if (f.path.startsWith('/') || f.path.split('/').includes('..')) problems.push(`unsafe path ${f.path}`)
    const p = join(stage, f.path)
    if (!existsSync(p)) problems.push(`missing ${f.path}`)
    else if (sha(readFileSync(p)) !== f.sha256) problems.push(`hash mismatch ${f.path}`)
  }
  return { ok: problems.length === 0, problems, manifest, unpacked: stage }
}

/**
 * Copy a checked archive into the repository, then rebuild the derived registry and snapshot
 * manifest from the restored records. Files that differ locally are reported and left alone unless forced.
 */
export function restoreState(repo, archive, { force = false, rebuild } = {}) {
  if (typeof rebuild !== 'function') throw new Error('restore needs rebuild: the registry and snapshot manifest are derived from the restored records')
  const check = checkArchive(archive)
  if (!check.ok) throw new Error(`archive check failed: ${check.problems.join('; ')}`)
  const conflicts = check.manifest.files
    .filter((f) => existsSync(join(repo, f.path)) && sha(readFileSync(join(repo, f.path))) !== f.sha256)
    .map((f) => f.path)
  if (conflicts.length && !force) return { restored: 0, conflicts }
  const paths = check.manifest.files.map((f) => f.path)
  for (const rel of paths) {
    mkdirSync(dirname(join(repo, rel)), { recursive: true })
    copyFileSync(join(check.unpacked, rel), join(repo, rel))
  }
  rebuild()
  return { restored: paths.length, conflicts }
}
