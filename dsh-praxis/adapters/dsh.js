// DSH plugin (cordis): registers the worker's Praxis tools natively, adds a short entry section to
// agent sessions' system prompt (the root of the progressive catalog), registers a /praxis command,
// and serves the control plane on three exact Connection routes. Enable with
//   dsh plugin --profile <profile> add link:<path to dsh-praxis>
import { createPraxis } from '../core/index.js'
import { TOOLS, callTool, inputSchema } from './tools.js'
import { CALL_PATH, FILE_PATH, PAGE_PATH, praxisFetch } from './http.js'

export const name = 'praxis'
export const inject = { tools: { required: true }, connection: { required: false }, systemPrompt: { required: false }, commands: { required: false } }

export function apply(ctx, config = {}) {
  const praxis = createPraxis({ data: config.data })

  // Only the tools a worker uses during a task; maintenance stays on the control plane, CLI and MCP,
  // so every session carries a short schema.
  for (const tool of TOOLS.filter((t) => t.agent)) {
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
      // A run records the session it came from, so what the agent read can be found in that transcript.
      execute: (args, exec) => callTool(praxis, tool.name, args, 'dsh', exec?.agent?.session?.id ? { host: 'dsh', id: exec.agent.session.id } : undefined),
    })
  }

  // The control plane rides DSH's authenticated /api channel, on Web and Desktop alike.
  const connection = ctx.connection
  if (connection) {
    const fetch = praxisFetch(praxis, 'dsh-ui')
    ctx.effect(() => connection.fetch.register({ path: PAGE_PATH, methods: ['GET', 'HEAD'], requestBody: 'buffered', fetch }), 'dsh-praxis: page route')
    ctx.effect(() => connection.fetch.register({ path: CALL_PATH, methods: ['POST'], requestBody: 'buffered', fetch }), 'dsh-praxis: call route')
    ctx.effect(() => connection.fetch.register({ path: FILE_PATH, methods: ['GET', 'HEAD'], requestBody: 'buffered', fetch }), 'dsh-praxis: file route')
  }

  // `/praxis` alone opens the control plane (the client decorates the same name); with any text it
  // answers in the session view with what Praxis offers and what needs someone now. Not sent to the model.
  const commands = ctx.commands
  if (commands) {
    ctx.effect(() => commands.register({
      name: 'praxis',
      description: 'Praxis：打开控制面；带文字时列出任务类型与待处理事项',
      input: { hint: '[status]' },
      handler: () => ({ kind: 'success', text: statusText(praxis) }),
    }), 'dsh-praxis: command')
  }

  const systemPrompt = ctx.systemPrompt
  if (config.prompt === false || !systemPrompt) return
  // Read at each assembly, so Kit edits reach the next request without a restart; agent sessions only.
  ctx.effect(() => systemPrompt.section({ name: 'praxis:entry', order: 9000, interpolate: false, text: (context) => (context && context.agent === undefined ? '' : entryText(praxis)) }), 'dsh-praxis: prompt section')
}

// Kept short: it is sent with every request. Everything else is read through the tools, level by level.
export function entryText(praxis) {
  const entry = praxis.entry()
  const lines = [
    'Praxis Kit：写作、编排、设计与报告的方法，加一份来源名册。做这类任务时先 praxis_resolve（任务类型 + 流水线），只读结果列出的单元（praxis_unit 读全文）；素材是挂在这些单元上的来源，带原件 URL 与摘录定位，需要核对、引用或借鉴时按定位回原件读。值得留下的新参考用 praxis_capture 成批登记、写明为哪件任务收录，再用 praxis_curate 挂到单元上。产物放在已登记项目的约定位置（praxis_projects 查，没有就 praxis_project 登记）；交付前用 praxis_consume 记下实际读过的单元和来源，并登记交付的文件。',
    '常驻：',
    ...entry.resident.map((u) => `- ${u.id}：${u.description}`),
    '任务类型：',
    ...entry.task_types.map((t) => `- ${t.id.replace('task/types/', '')}（${t.pipelines.join('/')}）：${t.description}`),
  ]
  return lines.join('\n')
}

/** For a person in the session view: the task types, then what upkeep lists. */
export function statusText(praxis) {
  const entry = praxis.entry()
  const up = praxis.upkeep()
  const counts = [
    ['挂载', up.bindings.length], ['编目放不下的来源', up.unfiled.length], ['编目条目', up.sources.length], ['集合有变化', up.collections.length],
    ['单元修订冲突', up.revisions.length], ['产物', up.artifacts.length],
  ].filter(([, n]) => n)
  return [
    `任务类型：${entry.task_types.map((t) => t.id.replace('task/types/', '')).join('、')}`,
    counts.length ? `待处理：${counts.map(([k, n]) => `${k} ${n}`).join('，')}。在控制面里处理：/praxis` : '待处理：无',
    ...(up.reload ? ['插件代码已更新，重启 DSH 后生效。'] : []),
  ].join('\n')
}
