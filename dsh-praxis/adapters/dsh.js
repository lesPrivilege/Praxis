// DSH plugin (cordis): registers the Praxis tools natively and puts the resident
// Kit entries into the system prompt. Enable with
//   dsh plugin --profile <profile> add link:<path to dsh-praxis>
import { createPraxis } from '../core/index.js'
import { TOOLS, callTool, inputSchema } from './tools.js'
import { createHandler } from './http.js'

export const name = 'praxis'
export const inject = { tools: { required: true }, webServer: { required: false } }

export function apply(ctx, config = {}) {
  const praxis = createPraxis({ root: config.root })

  for (const tool of TOOLS) {
    ctx.tools.register({
      name: tool.name,
      description: tool.description,
      parameters: inputSchema(tool),
      output: {
        schema: {},
        render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
      },
      async execute(args) {
        return await callTool(praxis, tool.name, args, 'dsh')
      },
    })
  }

  // Control plane at http://<dsh host>:<port>/praxis/ when the host has a web server.
  const webServer = ctx.webServer
  if (webServer) {
    const handler = createHandler(praxis, { prefix: '/praxis', caller: 'dsh-ui' })
    ctx.effect(() => webServer.register({ kind: 'prefix', path: '/praxis', handler }))
  }

  if (config.prompt === false) return
  ctx.on('system-prompt/assemble', async (_assembly, _context, next) => {
    const assembled = await next()
    assembled.sections.push({ name: 'praxis:entry', text: entryText(praxis) })
    return assembled
  })
}

// Kept short: it is sent with every request. Everything else is read through the tools.
export function entryText(praxis) {
  const entry = praxis.entry()
  const lines = [
    'Praxis Kit（个人 FDE 工作 Kit）。写作、编排、设计、报告类任务：先用 praxis_resolve（任务类型 + 流水线）取得要读的单元，再用 praxis_unit 读全文；不预读其他单元。遇到值得留下的参考用 praxis_capture 登记、praxis_curate 挂到单元上；交付前用 praxis_consume 记下用了什么。',
    '常驻：',
    ...entry.resident.map((u) => `- ${u.id}：${u.description}`),
    '任务类型：',
    ...entry.task_types.map((t) => `- ${t.id.replace('task/types/', '')}（${t.pipelines.join('/')}）：${t.description}`),
  ]
  return lines.join('\n')
}
