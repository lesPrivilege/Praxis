// HTTP surface for the control plane, as two exact routes:
//   GET  /api/praxis       the page
//   POST /api/praxis.call  {tool, args} → the tool's result as JSON
//   GET  /api/praxis.file  ?artifact=<id> → that artifact's file, for drag-out and standalone preview
// Inside DSH they register on the Connection's exact Fetch routes, so DSH's own browser trust and
// session authentication apply on Web and Desktop alike. `serve()` runs the same handler standalone
// on a loopback port for use without DSH.
import { createServer } from 'node:http'
import { readFileSync, statSync } from 'node:fs'
import { basename, extname } from 'node:path'
import { ConflictError } from '../core/index.js'
import { callTool } from './tools.js'

export const PAGE_PATH = '/api/praxis'
export const CALL_PATH = '/api/praxis.call'
export const FILE_PATH = '/api/praxis.file'

const TYPES = { '.html': 'text/html', '.htm': 'text/html', '.md': 'text/markdown', '.txt': 'text/plain', '.json': 'application/json', '.csv': 'text/csv',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg' }


const UI = new URL('../ui/index.html', import.meta.url)
const LOOPBACK = new Set(['127.0.0.1', 'localhost', '[::1]', '::1'])

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } })

/** One Fetch-shaped handler for both routes. Writes need a JSON body, so a cross-site form post cannot reach them. */
export function praxisFetch(praxis, caller = 'ui') {
  return async function fetch(request) {
    const { pathname } = new URL(request.url)
    if (pathname === PAGE_PATH && (request.method === 'GET' || request.method === 'HEAD')) {
      return new Response(request.method === 'HEAD' ? null : readFileSync(UI, 'utf8'), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })
    }
    if (pathname === CALL_PATH && request.method === 'POST') {
      if (!String(request.headers.get('content-type') ?? '').startsWith('application/json')) return json(415, { error: 'JSON body required' })
      try {
        const { tool, args = {} } = await request.json()
        return json(200, await callTool(praxis, tool, args, caller))
      } catch (error) {
        if (error instanceof ConflictError) return json(409, { error: error.message, current: error.current })
        return json(400, { error: error.message })
      }
    }
    if (pathname === FILE_PATH && (request.method === 'GET' || request.method === 'HEAD')) {
      // Only files registered as artifacts are served, by id; the path comes from the record.
      const rec = praxis.artifacts.get(new URL(request.url).searchParams.get('artifact') ?? '')
      const full = rec && praxis.artifacts.absolute(rec.path)
      if (!full || !isFile(full)) return json(404, { error: 'no such artifact file' })
      const type = TYPES[extname(full).toLowerCase()] ?? 'application/octet-stream'
      return new Response(request.method === 'HEAD' ? null : readFileSync(full), { headers: {
        'Content-Type': type.startsWith('text/') ? `${type}; charset=utf-8` : type,
        'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(basename(full))}`,
        // The bytes are the user's own file; they never run with the control plane's origin.
        'Content-Security-Policy': 'sandbox', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store',
      } })
    }
    return json(404, { error: 'not found' })
  }
}

function isFile(path) {
  try { return statSync(path).isFile() } catch { return false }
}

export function hostIsLoopback(req) {
  const raw = String(req.headers.host ?? '')
  if (!raw) return true
  const name = raw.startsWith('[') ? raw.slice(0, raw.indexOf(']') + 1) : raw.split(':')[0]
  return LOOPBACK.has(name.toLowerCase())
}

export function serve(praxis, { port = 7878, host = '127.0.0.1' } = {}) {
  const handle = praxisFetch(praxis, `ui:${process.env.USER ?? 'user'}`)
  const server = createServer(async (req, res) => {
    if (!hostIsLoopback(req)) { res.writeHead(403); return res.end() }
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)
    if (url.pathname === '/') url.pathname = PAGE_PATH
    const chunks = []
    if (req.method === 'POST') for await (const chunk of req) chunks.push(chunk)
    const headers = Object.entries(req.headers).filter(([, v]) => typeof v === 'string')
    const response = await handle(new Request(url, { method: req.method, headers, body: chunks.length ? Buffer.concat(chunks) : undefined }))
    res.writeHead(response.status, Object.fromEntries(response.headers))
    res.end(Buffer.from(await response.arrayBuffer()))
  })
  return new Promise((resolve) => server.listen(port, host, () => resolve(server)))
}
