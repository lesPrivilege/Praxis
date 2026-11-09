// HTTP surface for the Praxis page in DSH, as three exact routes on DSH's authenticated
// Connection channel (Web and Desktop alike):
//   POST /api/praxis.call  {tool, args} → the tool's result as JSON
//   GET  /api/praxis.file  ?artifact=<id> → that artifact's file; ?source=<id>&version=<v>&file=<path> → a stocked file
//   GET  /api/praxis.ask   recent requests; POST {text} hands links or a conversation to an agent, POST {distill: <source id>} asks for a distill
import { readFileSync, statSync } from 'node:fs'
import { basename, extname } from 'node:path'
import { ConflictError } from '../core/index.js'
import { callTool } from './tools.js'

export const CALL_PATH = '/api/praxis.call'
export const FILE_PATH = '/api/praxis.file'
export const ASK_PATH = '/api/praxis.ask'

const TYPES = { '.html': 'text/html', '.htm': 'text/html', '.md': 'text/markdown', '.txt': 'text/plain', '.json': 'application/json', '.csv': 'text/csv',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.css': 'text/css', '.gz': 'application/gzip', '.webm': 'video/webm', '.ogg': 'audio/ogg' }
// Types a browser shows without running anything in the page's origin; the rest are served sandboxed.
const INERT = /^(image\/(png|jpeg|gif|webp)|application\/pdf|video\/|audio\/)/


const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } })

/** One Fetch-shaped handler for both routes. Writes need a JSON body, so a cross-site form post cannot reach them. */
export function praxisFetch(praxis, caller = 'ui', asks) {
  return async function fetch(request) {
    const { pathname } = new URL(request.url)
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
    if (pathname === ASK_PATH) {
      // Outside DSH there is no agent to hand the links to; the page then says where to paste them.
      if (!asks?.available()) return json(request.method === 'GET' ? 200 : 501, request.method === 'GET' ? { available: false, asks: [] } : { error: 'capture requests need DSH' })
      if (request.method === 'GET') return json(200, { available: true, asks: asks.list() })
      if (request.method !== 'POST') return json(405, { error: 'GET or POST' })
      if (!String(request.headers.get('content-type') ?? '').startsWith('application/json')) return json(415, { error: 'JSON body required' })
      try { const body = await request.json(); return json(200, body.distill ? await asks.distill(body.distill) : await asks.start(body.text)) } catch (error) { return json(400, { error: error.message }) }
    }
    if (pathname === FILE_PATH && (request.method === 'GET' || request.method === 'HEAD')) {
      // Only registered files are served: an artifact by id, or a file a stock version's manifest lists.
      const q = new URL(request.url).searchParams
      const full = q.has('source') ? praxis.stock.file(q.get('source'), q.get('version') ?? '', q.get('file') ?? '')
        : (() => { const rec = praxis.artifacts.get(q.get('artifact') ?? ''); return rec && praxis.artifacts.absolute(rec.path) })()
      if (!full || !isFile(full)) return json(404, { error: 'no such file' })
      const type = TYPES[extname(full).toLowerCase()] ?? 'application/octet-stream'
      return new Response(request.method === 'HEAD' ? null : readFileSync(full), { headers: {
        'Content-Type': type.startsWith('text/') ? `${type}; charset=utf-8` : type,
        'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(basename(full))}`,
        // The bytes are someone's file or a fetched original; they never run with the control plane's origin.
        ...(INERT.test(type) ? {} : { 'Content-Security-Policy': 'sandbox' }), 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store',
      } })
    }
    return json(404, { error: 'not found' })
  }
}

function isFile(path) {
  try { return statSync(path).isFile() } catch { return false }
}
