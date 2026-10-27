#!/usr/bin/env node
// MCP server over stdio (newline-delimited JSON-RPC 2.0). Tools are the Praxis operations; resources
// are the progressive catalog itself (entry → unit → source → artifact, links and locators, never an
// original's text); prompts start a task of each type. Implements initialize, ping, tools/*,
// resources/list, resources/templates/list, resources/read, prompts/list and prompts/get.
import { createInterface } from 'node:readline'
import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import * as http from 'node:http'
import { createPraxis, ConflictError } from '../core/index.js'
import { TOOLS, callTool, inputSchema, jsonValue } from './tools.js'

const VERSIONS = ['2026-07-28', '2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05']
// This is Praxis's own process: source checks go through HTTP(S)_PROXY. The DSH plugin leaves the host's network settings alone.
http.setGlobalProxyFromEnv?.()
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const INSTRUCTIONS = 'Praxis：写作、编排、设计与报告的方法 Kit，加一份来源名册（只记链接、定位与用途，不存原件）。顺序：praxis_entry 或 praxis://entry 看入口；praxis_resolve 按任务类型与流水线取得要读的单元与素材，只读列出的单元；素材按 URL 与摘录定位回原件读；新参考用 praxis_capture 成批登记并写明为哪件任务收录，再 praxis_curate 挂到单元上；产物放在已登记项目的约定位置；交付前 praxis_consume 记下读过的单元与来源并登记交付文件。修改带上读到的 revision。按任务类型开工可用 prompts。'
const MIME = { json: 'application/json', md: 'text/markdown' }
const resource = (uri, name, description, mimeType) => ({ uri, name, description, mimeType })

/** The catalog as resources: the entry and every unit listed; sources and artifacts by template. */
export function listResources(praxis) {
  return [
    resource('praxis://entry', 'entry', '入口：常驻单元、各层入口与任务类型', MIME.json),
    ...praxis.units().map((u) => resource(`praxis://unit/${u.id}`, u.title, u.description, MIME.md)),
  ]
}

export const TEMPLATES = [
  { uriTemplate: 'praxis://unit/{id}', name: 'unit', description: 'Kit 单元全文（Markdown）', mimeType: MIME.md },
  { uriTemplate: 'praxis://source/{id}', name: 'source', description: '来源条目：链接与定位、用途、摘录、挂载、谁读过；不含原件全文', mimeType: MIME.json },
  { uriTemplate: 'praxis://artifact/{id}', name: 'artifact', description: '产物：版本、产出它的运行与 review', mimeType: MIME.json },
]

export function readResource(praxis, uri) {
  const m = /^praxis:\/\/(entry|unit|source|artifact)(?:\/(.+))?$/.exec(uri ?? '')
  if (!m) throw new Error(`unknown resource: ${uri}`)
  const [, kind, raw] = m
  const id = raw && decodeURIComponent(raw)
  const value = kind === 'entry' ? praxis.entry() : kind === 'unit' ? praxis.unit(id) : kind === 'source' ? praxis.source(id) : praxis.artifact(id)
  if (!value) throw new Error(`unknown ${kind}: ${id}`)
  if (kind === 'unit') return { uri, mimeType: MIME.md, text: value.body }
  return { uri, mimeType: MIME.json, text: JSON.stringify(jsonValue(value)) }
}

/** One prompt per task type: what to do, in which pipeline, and the order to work in. */
export function listPrompts(praxis) {
  return praxis.taskTypes().map((t) => ({
    name: t.id.replace('task/types/', ''), title: t.title, description: t.description,
    arguments: [{ name: 'brief', description: '这次要做什么：读者、材料、交付', required: true }, { name: 'pipeline', description: t.pipelines.join(' 或 '), required: false }],
  }))
}

export function getPrompt(praxis, name, args = {}) {
  const t = praxis.taskTypes().find((x) => x.id === `task/types/${name}`)
  if (!t) throw new Error(`unknown prompt: ${name}`)
  if (!args.brief?.trim()) throw new Error('prompt needs brief')
  const pipeline = args.pipeline ?? t.pipelines[0]
  const text = [
    `按 Praxis 的「${t.title}」做这件事：${args.brief.trim()}`,
    `1. praxis_resolve {"task_type":"${t.id}","pipeline":"${pipeline}"}，只读列出的单元；素材需要核对或借鉴时按 URL 与摘录定位回原件读。`,
    '2. praxis_projects 查交付目录属于哪个项目，没有就 praxis_project 登记；产物放在布局约定的位置。',
    `3. 完成标准：${t.acceptance.join('；') || t.outcome}`,
    '4. 交付前 praxis_consume：读过的单元与来源、交付的文件；新找到值得留下的参考先 praxis_capture 再 praxis_curate。',
  ].join('\n')
  return { description: t.description, messages: [{ role: 'user', content: { type: 'text', text } }] }
}

export function createServer({ praxis = createPraxis(), write }) {
  let client = 'mcp'
  // One stdio server serves one client connection: that connection is the session a run records.
  const session = { host: 'mcp', id: randomUUID() }
  const reply = (id, result) => write({ jsonrpc: '2.0', id, result })
  const fail = (id, code, message) => write({ jsonrpc: '2.0', id, error: { code, message } })

  return async function handle(message) {
    const { id, method, params } = message
    const isRequest = id !== undefined && id !== null
    try {
      switch (method) {
        case 'initialize': {
          client = `mcp:${params?.clientInfo?.name ?? 'client'}`
          session.client = params?.clientInfo?.name
          const asked = params?.protocolVersion
          return reply(id, {
            protocolVersion: VERSIONS.includes(asked) ? asked : VERSIONS[0],
            capabilities: { tools: { listChanged: false }, resources: { listChanged: false }, prompts: { listChanged: false } },
            serverInfo: { name: 'praxis', version: pkg.version },
            instructions: INSTRUCTIONS,
          })
        }
        case 'ping':
          return reply(id, {})
        case 'tools/list':
          return reply(id, { tools: TOOLS.map((t) => ({ name: t.name, description: t.description, inputSchema: inputSchema(t) })) })
        case 'resources/list':
          return reply(id, { resources: listResources(praxis) })
        case 'resources/templates/list':
          return reply(id, { resourceTemplates: TEMPLATES })
        case 'resources/read':
          return reply(id, { contents: [readResource(praxis, params?.uri)] })
        case 'prompts/list':
          return reply(id, { prompts: listPrompts(praxis) })
        case 'prompts/get':
          return reply(id, getPrompt(praxis, params?.name, params?.arguments))
        case 'tools/call': {
          try {
            const result = await callTool(praxis, params?.name, params?.arguments ?? {}, client, session)
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
