// DSH plugin (cordis): registers the Praxis tools natively, adds the resident Kit entries as a
// system-prompt section, and serves the control plane on two exact Connection routes. Enable with
//   dsh plugin --profile <profile> add link:<path to dsh-praxis>
import { createPraxis } from '../core/index.js'
import { TOOLS, callTool, inputSchema } from './tools.js'
import { CALL_PATH, PAGE_PATH, praxisFetch } from './http.js'

export const name = 'praxis'
export const inject = { tools: { required: true }, connection: { required: false }, systemPrompt: { required: false } }

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
      // Reads may run beside each other; writes keep the default serial order.
      ...(tool.writes ? {} : { isConcurrencySafe: () => true }),
      async execute(args) {
        const value = await callTool(praxis, tool.name, args, 'dsh')
        // A lookup miss is a tool error, not a successful value.
        if (value && typeof value === 'object' && Object.keys(value).length === 1 && typeof value.error === 'string') throw new Error(value.error)
        return value
      },
    })
  }

  // The control plane rides DSH's authenticated /api channel, on Web and Desktop alike.
  const connection = ctx.connection
  if (connection) {
    const fetch = praxisFetch(praxis, 'dsh-ui')
    ctx.effect(() => connection.fetch.register({ path: PAGE_PATH, methods: ['GET', 'HEAD'], requestBody: 'buffered', fetch }), 'dsh-praxis: page route')
    ctx.effect(() => connection.fetch.register({ path: CALL_PATH, methods: ['POST'], requestBody: 'buffered', fetch }), 'dsh-praxis: call route')
  }

  const systemPrompt = ctx.systemPrompt
  if (config.prompt === false || !systemPrompt) return
  // Read at each assembly, so Kit edits reach the next request without a restart.
  ctx.effect(() => systemPrompt.section({ name: 'praxis:entry', order: 9000, interpolate: false, text: () => entryText(praxis) }), 'dsh-praxis: prompt section')
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
