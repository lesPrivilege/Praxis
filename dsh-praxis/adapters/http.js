// HTTP surface for the control plane: GET <prefix>/ serves the UI, POST <prefix>/api/<tool>
// calls a tool with a JSON body. Loopback hosts only; writes need a JSON body, so a
// cross-site form post cannot reach them.
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { ConflictError } from '../core/index.js'
import { TOOLS, callTool, inputSchema } from './tools.js'

const UI = new URL('../ui/index.html', import.meta.url)
const LOOPBACK = new Set(['127.0.0.1', 'localhost', '[::1]', '::1'])

export function hostIsLoopback(req) {
  const raw = String(req.headers.host ?? '')
  if (!raw) return true
  const name = raw.startsWith('[') ? raw.slice(0, raw.indexOf(']') + 1) : raw.split(':')[0]
  return LOOPBACK.has(name.toLowerCase())
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' })
  res.end(typeof body === 'string' ? body : JSON.stringify(body))
}

export function createHandler(praxis, { prefix = '', caller = 'ui' } = {}) {
  return async function handle(req, res) {
    if (!hostIsLoopback(req)) return send(res, 403, { error: 'loopback only' })
    const path = String(req.url ?? '').split('?')[0].slice(prefix.length) || '/'
    if (req.method === 'GET' && (path === '/' || path === '/index.html')) {
      return send(res, 200, readFileSync(UI, 'utf8'), 'text/html; charset=utf-8')
    }
    if (req.method === 'GET' && path === '/api') {
      return send(res, 200, TOOLS.map((t) => ({ name: t.name, description: t.description, parameters: inputSchema(t), writes: !!t.writes })))
    }
    const m = path.match(/^\/api\/(praxis_[a-z_]+)$/)
    if (req.method === 'POST' && m) {
      if (!String(req.headers['content-type'] ?? '').startsWith('application/json')) return send(res, 415, { error: 'JSON body required' })
      let body = ''
      for await (const chunk of req) body += chunk
      try {
        const args = body ? JSON.parse(body) : {}
        return send(res, 200, await callTool(praxis, m[1], args, caller))
      } catch (error) {
        if (error instanceof ConflictError) return send(res, 409, { error: error.message, current: error.current })
        return send(res, 400, { error: error.message })
      }
    }
    return send(res, 404, { error: 'not found' })
  }
}

export function serve(praxis, { port = 7878, host = '127.0.0.1' } = {}) {
  const server = createServer(createHandler(praxis, { caller: `ui:${process.env.USER ?? 'user'}` }))
  return new Promise((resolve) => server.listen(port, host, () => resolve(server)))
}
