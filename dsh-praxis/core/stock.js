// Stock: local versions of what a source's original held, so a source stays usable after the
// original moves or disappears, and a run can say which version it read (ADR-050). Each version is a
// folder under the data root, stock/<source>/<UTC timestamp>/, with a manifest, written once and never
// changed. `download` fetches through the Host: a GitHub repository as one commit's source archive and
// its README; an HTML page with the images, stylesheets and preview image it references; any other
// file as it is. Nothing downloaded is run or unpacked. `distill` keeps an agent's Markdown summary of
// the original, headed as a distill. The roster itself still holds only links.
import { createHash, randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { pageText } from './materials.js'

export const LIMIT = 50 * 1024 * 1024
const MAX_FILES = 60
const AGENT = { 'User-Agent': 'Mozilla/5.0 (compatible; Praxis stock)' }
const VERSION = /^\d{8}T\d{6}Z$/

const sha = (buf) => createHash('sha256').update(buf).digest('hex')
const isHtml = (type) => /html/i.test(type ?? '')
/** A source ID as a folder name; the manifest keeps the real ID. */
export const folderOf = (id) => id.replace(/[^A-Za-z0-9._-]/g, '_')
const stampOf = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')

/** What a download compares with the next one: the commit, else the page text, else the bytes. */
export const contentOf = (upstream) => upstream?.commit ?? upstream?.text_sha256 ?? upstream?.sha256

/** The key a refresh check of the same URL would carry, for telling whether upstream moved since. */
export const checkKeyOf = (upstream) => upstream?.text_sha256 ?? upstream?.sha256

/** A failure that still observed the original: the caller records the check, then reports the error. */
class Unreachable extends Error {
  constructor(message, check) { super(message); this.check = check }
}

/** Read a body up to `limit` bytes; past it, stop and say so. */
async function capped(res, limit) {
  const declared = Number(res.headers.get('content-length'))
  if (declared > limit) { await res.body?.cancel?.(); return { over: true } }
  const reader = res.body?.getReader()
  if (!reader) return { bytes: Buffer.alloc(0) }
  const chunks = []
  let n = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    n += value.byteLength
    if (n > limit) { await reader.cancel(); return { over: true } }
    chunks.push(Buffer.from(value))
  }
  return { bytes: Buffer.concat(chunks) }
}

/** The preview image, stylesheets and images an HTML page references, as absolute http(s) URLs. */
export function pageAssets(html, base) {
  const out = []
  const add = (raw, role) => {
    try {
      const url = new URL(raw.trim().replace(/&amp;/g, '&'), base)
      if (/^https?:$/.test(url.protocol) && !out.some((x) => x.url === url.href)) out.push({ url: url.href, role })
    } catch {}
  }
  const attr = (tag, name) => tag.match(new RegExp(`\\s${name}\\s*=\\s*["']([^"']+)["']`, 'i'))?.[1]
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    if (/(?:property|name)\s*=\s*["'](?:og:image|twitter:image)(?::src)?["']/i.test(tag) && attr(tag, 'content')) add(attr(tag, 'content'), 'cover')
  }
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) if (/\srel\s*=\s*["'][^"']*stylesheet/i.test(tag) && attr(tag, 'href')) add(attr(tag, 'href'), 'style')
  for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) { const src = attr(tag, 'src'); if (src && !src.startsWith('data:')) add(src, 'image') }
  return out
}

const EXT = { 'text/html': '.html', 'application/pdf': '.pdf', 'image/png': '.png', 'image/jpeg': '.jpg', 'image/gif': '.gif', 'image/webp': '.webp', 'image/svg+xml': '.svg',
  'text/css': '.css', 'text/plain': '.txt', 'text/markdown': '.md', 'application/json': '.json', 'video/mp4': '.mp4', 'audio/mpeg': '.mp3' }
/** A safe file name for a fetched URL: its last path segment, with an extension from its type when it has none. */
function nameFor(url, type) {
  const last = decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).at(-1) ?? '').replace(/[^A-Za-z0-9._-]/g, '-').replace(/^[.-]+/, '').slice(-80)
  const ext = EXT[String(type ?? '').split(';')[0].trim().toLowerCase()] ?? ''
  if (!last) return `file${ext}`
  return extname(last) ? last : `${last}${ext}`
}

/** `github.com/<owner>/<repo>`, optionally `/tree/<ref>`: a repository rather than one of its pages. */
export function githubRepo(url) {
  let u
  try { u = new URL(url) } catch { return undefined }
  if (u.hostname !== 'github.com') return undefined
  const parts = u.pathname.split('/').filter(Boolean)
  if (parts.length === 2) return { owner: parts[0], name: parts[1].replace(/\.git$/, '') }
  if (parts.length >= 4 && parts[2] === 'tree') return { owner: parts[0], name: parts[1], ref: parts[3] }
  return undefined
}

/**
 * @param root  the stock folder in the data root
 * @param now   the clock, for version names
 * @param limit the most one version may hold, in bytes
 */
export function createStock({ root, now = () => new Date(), limit = LIMIT }) {
  /** Every version of a source, oldest first, as their manifests. */
  function list(id) {
    const dir = join(root, folderOf(id))
    if (!existsSync(dir)) return []
    return readdirSync(dir).filter((v) => VERSION.test(v)).sort()
      .map((v) => { try { return JSON.parse(readFileSync(join(dir, v, 'manifest.json'), 'utf8')) } catch { return null } })
      .filter((m) => m?.source === id)
  }

  const pathOf = (m) => join(root, folderOf(m.source), m.version)

  /** A version as tools and the page show it: what it is and where, without the bytes. */
  function brief(m) {
    return {
      version: m.version, at: m.at, kind: m.kind, path: pathOf(m),
      files: m.files.length, bytes: m.files.reduce((n, f) => n + f.bytes, 0),
      ...(m.cover ? { cover: m.cover } : {}), ...(m.missing?.length ? { missing: m.missing.length } : {}), ...(m.changes ? { changes: m.changes } : {}),
      ...(m.upstream?.commit ? { commit: m.upstream.commit } : {}), ...(m.based_on ? { based_on: m.based_on } : {}), ...(m.model ? { model: m.model } : {}),
    }
  }

  /** Write a version: files into a scratch folder, then the folder into place under the version's name. */
  function write(id, fields, files, when = now()) {
    const dir = join(root, folderOf(id))
    let at = when
    while (existsSync(join(dir, stampOf(at)))) at = new Date(at.getTime() + 1000)
    const version = stampOf(at)
    const scratch = join(dir, `.tmp-${randomUUID().slice(0, 8)}`)
    for (const f of files) { mkdirSync(dirname(join(scratch, f.path)), { recursive: true }); writeFileSync(join(scratch, f.path), f.bytes) }
    const manifest = { source: id, version, at: at.toISOString(), ...fields,
      files: files.map((f) => ({ path: f.path, sha256: sha(f.bytes), bytes: f.bytes.length, ...(f.from ? { from: f.from } : {}) })) }
    writeFileSync(join(scratch, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
    renameSync(scratch, join(dir, version))
    return manifest
  }

  const get = (fetchImpl, url, headers = {}) => fetchImpl(url, { redirect: 'follow', headers: { ...AGENT, ...headers } })

  /**
   * The original as a page or a file, with what an HTML page references (all of it, or only its
   * preview image), up to the limit.
   */
  async function page(url, fetchImpl, by, { coverOnly = false } = {}) {
    const at = new Date().toISOString()
    let res
    try { res = await get(fetchImpl, url) } catch (e) {
      throw new Unreachable(`original unreachable: ${e.cause?.code ?? e.message}; nothing stocked`, { at, status: 'unreachable', http: null, error: e.cause?.code ?? e.message, by })
    }
    if (!res.ok) throw new Unreachable(`original unreachable: HTTP ${res.status}; nothing stocked`, { at, status: 'unreachable', http: res.status, error: `HTTP ${res.status}`, by })
    const type = res.headers.get('content-type')
    const got = await capped(res, limit)
    if (got.over) throw new Error(`the original is over ${limit / 1048576} MB; nothing stocked`)
    const final = res.url || url
    const html = isHtml(type)
    const text = html ? got.bytes.toString('utf8') : ''
    const upstream = { url: final, http: res.status, content_type: type, sha256: sha(got.bytes), ...(html ? { text_sha256: sha(pageText(text)) } : {}) }
    const check = { at, status: 'ok', http: res.status, sha256: upstream.sha256, ...(html ? { text_sha256: upstream.text_sha256 } : {}), size_bytes: got.bytes.length, content_type: type, by }
    const files = [{ path: html ? 'index.html' : nameFor(final, type), bytes: got.bytes, from: final }]
    const missing = []
    let cover = !html && /^image\//.test(type ?? '') ? files[0].path : undefined
    if (html) {
      let total = got.bytes.length
      for (const [i, a] of pageAssets(text, final).filter((x) => !coverOnly || x.role === 'cover').slice(0, coverOnly ? 1 : undefined).entries()) {
        if (files.length > MAX_FILES) { missing.push({ from: a.url, reason: `more than ${MAX_FILES} files` }); continue }
        try {
          const r = await get(fetchImpl, a.url)
          if (!r.ok) { missing.push({ from: a.url, reason: `HTTP ${r.status}` }); continue }
          const asset = await capped(r, limit - total)
          if (asset.over) { missing.push({ from: a.url, reason: `over ${limit / 1048576} MB in all` }); continue }
          const path = `assets/${String(i + 1).padStart(2, '0')}-${nameFor(r.url || a.url, r.headers.get('content-type'))}`
          files.push({ path, bytes: asset.bytes, from: r.url || a.url })
          total += asset.bytes.length
          if (a.role === 'cover' && !cover) cover = path
        } catch (e) { missing.push({ from: a.url, reason: e.cause?.code ?? e.message }) }
      }
    }
    return { files, upstream, cover, missing, check }
  }

  /** A repository: one commit's source archive and its README, with the repository page's preview as cover. */
  async function repo(url, { owner, name, ref }, fetchImpl, by) {
    const first = await page(url, fetchImpl, by, { coverOnly: true })
    const api = async (path) => {
      const r = await get(fetchImpl, `https://api.github.com/repos/${owner}/${name}${path}`, { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' })
      if (!r.ok) throw new Error(`GitHub API ${path || '/'}: HTTP ${r.status}`)
      return r.json()
    }
    const branch = ref ?? (await api('')).default_branch
    const commit = (await api(`/commits/${encodeURIComponent(branch)}`)).sha
    const files = []
    const missing = []
    let cover
    const preview = first.files.find((f) => f.path === first.cover)
    if (preview) { cover = `cover${extname(preview.path) || '.png'}`; files.push({ ...preview, path: cover }) }
    try {
      const readme = await api(`/readme?ref=${commit}`)
      files.push({ path: nameFor(`https://x/${readme.name}`, 'text/markdown'), bytes: Buffer.from(readme.content ?? '', readme.encoding === 'base64' ? 'base64' : 'utf8'), from: readme.download_url ?? readme.html_url })
    } catch (e) { missing.push({ from: `https://github.com/${owner}/${name}#readme`, reason: e.message }) }
    const archive = `https://codeload.github.com/${owner}/${name}/tar.gz/${commit}`
    const used = files.reduce((n, f) => n + f.bytes.length, 0)
    const r = await get(fetchImpl, archive)
    if (!r.ok) missing.push({ from: archive, reason: `HTTP ${r.status}` })
    else {
      const got = await capped(r, limit - used)
      if (got.over) missing.push({ from: archive, reason: `over ${limit / 1048576} MB; only the README is kept` })
      else files.push({ path: `repo-${commit.slice(0, 12)}.tar.gz`, bytes: got.bytes, from: archive })
    }
    return { files, upstream: { ...first.upstream, commit }, cover, missing, check: first.check }
  }

  /** Files added, removed and changed since a version, by path and hash. */
  const diff = (before, after) => {
    const was = new Map(before.map((f) => [f.path, f.sha256]))
    const is = new Map(after.map((f) => [f.path, sha(f.bytes)]))
    return {
      added: [...is.keys()].filter((p) => !was.has(p)),
      removed: [...was.keys()].filter((p) => !is.has(p)),
      changed: [...is.keys()].filter((p) => was.has(p) && was.get(p) !== is.get(p)),
    }
  }

  return {
    list,
    brief,

    /** The latest version of each kind, for a material row: when, and the folder to read. */
    latest(id) {
      const all = list(id)
      const out = {}
      for (const kind of ['download', 'distill']) {
        const m = all.filter((x) => x.kind === kind).at(-1)
        if (m) out[kind] = { version: m.version, at: m.at, path: pathOf(m), ...(kind === 'download' && m.cover ? { cover: m.cover } : {}) }
      }
      return Object.keys(out).length ? out : undefined
    },

    /** The latest download's manifest, or undefined. */
    lastDownload(id) {
      return list(id).filter((x) => x.kind === 'download').at(-1)
    },

    /**
     * Fetch the original and keep it as a new version, unless its content equals the latest
     * download's (then `unchanged`). Returns the check the fetch amounts to, for the caller to record.
     */
    async download(source, { by, fetchImpl = fetch } = {}) {
      const plan = githubRepo(source.url)
      const got = plan ? await repo(source.url, plan, fetchImpl, by) : await page(source.url, fetchImpl, by)
      const before = list(source.id).filter((x) => x.kind === 'download').at(-1)
      if (before && contentOf(before.upstream) === contentOf(got.upstream)) return { unchanged: true, manifest: before, check: got.check }
      const manifest = write(source.id, {
        kind: 'download', url: source.url, upstream: got.upstream, by,
        ...(got.cover ? { cover: got.cover } : {}), ...(got.missing.length ? { missing: got.missing } : {}),
        ...(before ? { changes: diff(before.files, got.files) } : {}),
      }, got.files)
      return { manifest, check: got.check }
    },

    /** Keep an agent's summary of the original, headed as a distill, as a new version. */
    distill(source, { text, based_on, model, locators = [], by } = {}) {
      text = String(text ?? '').trim()
      if (!text) throw new Error('distill needs text')
      if (based_on && !list(source.id).some((m) => m.version === based_on && m.kind === 'download')) throw new Error(`no download version ${based_on} for ${source.id}`)
      const head = `> 提炼，不是原件。原件：${source.url ?? source.locator ?? source.id}；依据：${based_on ? `库存版本 ${based_on}` : '原件'}。`
      return write(source.id, { kind: 'distill', url: source.url, ...(based_on ? { based_on } : {}), ...(model ? { model } : {}), ...(locators.length ? { locators } : {}), by },
        [{ path: 'distill.md', bytes: Buffer.from(`${head}\n\n${text}\n`) }])
    },

    /**
     * Keep files obtained earlier, such as a snapshot a pack recorded, as a download version dated
     * when they were taken. What upstream served then is unknown, so the version gives no restock signal.
     */
    adopt(source, { at, files, from, basis }) {
      return write(source.id, { kind: 'download', url: source.url, imported: { from, at_basis: basis } }, files, at)
    },

    /** The absolute path of a file a version's manifest lists, or undefined. */
    file(id, version, path) {
      const m = list(id).find((x) => x.version === version)
      if (!m || !(path === 'manifest.json' || m.files.some((f) => f.path === path))) return undefined
      return join(pathOf(m), path)
    },
  }
}
