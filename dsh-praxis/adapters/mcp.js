#!/usr/bin/env node
// MCP server over stdio (newline-delimited JSON-RPC 2.0) exposing the Praxis tools.
// Implements the tools subset of the protocol: initialize, ping, tools/list, tools/call.
import { createInterface } from 'node:readline'
import { readFileSync } from 'node:fs'
import { createPraxis, ConflictError } from '../core/index.js'
import { TOOLS, callTool, inputSchema } from './tools.js'

const VERSIONS = ['2026-07-28', '2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05']
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const INSTRUCTIONS = 'Praxis 是个人 FDE 工作 Kit。做写作、编排、设计或报告任务时，先 praxis_entry 或 praxis_resolve，只读结果里列出的单元；遇到值得留下的参考用 praxis_capture 登记、praxis_curate 挂到单元上；交付前用 praxis_consume 记下实际用了什么，并把交付的文件登记为产物；改过再交付就再登记一次，记为新版本。修改带上读到的 revision。'

export function createServer({ praxis = createPraxis(), write }) {
  let client = 'mcp'
  const reply = (id, result) => write({ jsonrpc: '2.0', id, result })
  const fail = (id, code, message) => write({ jsonrpc: '2.0', id, error: { code, message } })

  return async function handle(message) {
    const { id, method, params } = message
    const isRequest = id !== undefined && id !== null
    try {
      switch (method) {
        case 'initialize': {
          client = `mcp:${params?.clientInfo?.name ?? 'client'}`
          const asked = params?.protocolVersion
          return reply(id, {
            protocolVersion: VERSIONS.includes(asked) ? asked : VERSIONS[0],
            capabilities: { tools: { listChanged: false } },
            serverInfo: { name: 'praxis', version: pkg.version },
            instructions: INSTRUCTIONS,
          })
        }
        case 'ping':
          return reply(id, {})
        case 'tools/list':
          return reply(id, { tools: TOOLS.map((t) => ({ name: t.name, description: t.description, inputSchema: inputSchema(t) })) })
        case 'tools/call': {
          try {
            const result = await callTool(praxis, params?.name, params?.arguments ?? {}, client)
            return reply(id, { content: [{ type: 'text', text: JSON.stringify(result) }], isError: false })
          } catch (error) {
            const body = error instanceof ConflictError ? { error: error.message, current: error.current } : { error: error.message }
            return reply(id, { content: [{ type: 'text', text: JSON.stringify(body) }], isError: true })
          }
        }
        default:
          if (method?.startsWith('notifications/')) return
          if (isRequest) return fail(id, -32601, `method not found: ${method}`)
      }
    } catch (error) {
      if (isRequest) fail(id, -32603, error.message)
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('/praxis-mcp')) {
  const handle = createServer({ write: (msg) => process.stdout.write(JSON.stringify(msg) + '\n') })
  const rl = createInterface({ input: process.stdin })
  rl.on('line', (line) => {
    if (!line.trim()) return
    let msg
    try {
      msg = JSON.parse(line)
    } catch {
      process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } }) + '\n')
      return
    }
    for (const m of Array.isArray(msg) ? msg : [msg]) handle(m)
  })
}
