// DSH plugin (cordis): registers the worker's Praxis tools natively, adds a short entry section to
// agent sessions' system prompt (the root of the progressive catalog), registers a /praxis command,
// and serves the Praxis page's data on three exact Connection routes (call, file, ask). Enable with
//   dsh plugin --profile <profile> add link:<path to dsh-praxis>
import { createPraxis } from '../core/index.js'
import { TOOLS, callTool, inputSchema } from './tools.js'
import { ASK_PATH, CALL_PATH, FILE_PATH, praxisFetch } from './http.js'
import { createAsks } from './ask.js'

export const name = 'praxis'
export const inject = { tools: { required: true }, connection: { required: false }, systemPrompt: { required: false }, commands: { required: false } }

export function apply(ctx, config = {}) {
  const praxis = createPraxis({ data: config.data })

  // Only the tools a worker uses during a task; maintenance stays on the Praxis page, CLI and MCP,
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

  // The Praxis page reads through DSH's authenticated /api channel, on Web and Desktop alike.
  const connection = ctx.connection
  if (connection) {
    // Capture requests run as agent sessions the Host creates, like scheduled tasks.
    const fetch = praxisFetch(praxis, 'dsh-ui', createAsks(ctx, praxis))
    ctx.effect(() => connection.fetch.register({ path: CALL_PATH, methods: ['POST'], requestBody: 'buffered', fetch }), 'dsh-praxis: call route')
    ctx.effect(() => connection.fetch.register({ path: FILE_PATH, methods: ['GET', 'HEAD'], requestBody: 'buffered', fetch }), 'dsh-praxis: file route')
    ctx.effect(() => connection.fetch.register({ path: ASK_PATH, methods: ['GET', 'POST'], requestBody: 'buffered', fetch }), 'dsh-praxis: capture route')
  }

  // `/praxis` alone opens the Praxis page (the client decorates the same name); with any text it
  // answers in the session view with what Praxis offers and what needs someone now. Not sent to the model.
  const commands = ctx.commands
  if (commands) {
    ctx.effect(() => commands.register({
      name: 'praxis',
      description: 'Open Praxis; with text, list task types and what needs attention',
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
    'Praxis Kit：写作、编排、设计与报告的方法，加一份来源名册。做这类任务时先 praxis_resolve（任务类型 + 流水线），只读结果列出的单元（praxis_unit 读全文）；素材是挂在这些单元上的全部来源，每个一行：description 是索引，用来判断要不要打开，靠后的行只到 description，要用时 praxis_source 取摘录；原件失效时读素材 stock 给的本地版本，praxis_stock 可以再备一版；要采用一个来源，按 URL 与摘录定位回原件读，consume 只记真正读过原件的来源。用户点名一条 stream 时，resolve 带上 stream。要找外部参考，先 praxis_catalog、praxis_search，名册不够或要核实时才上网；值得留下的新参考用 praxis_capture 成批登记、写明为哪件任务收录，再用 praxis_curate 挂到单元上。产物放在已登记项目的约定位置（praxis_projects 查，没有就 praxis_project 登记）；交付前用 praxis_consume 记下实际读过的单元和来源（可给每个来源写一句这次用它做什么），并登记交付的文件。',
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
    ['sources on Kit pages', up.bindings.length], ['not catalogued', up.unfiled.length], ['catalog entries', up.sources.length], ['collections changed', up.collections.length],
    ['revision conflicts', up.revisions.length], ['artifacts', up.artifacts.length],
  ].filter(([, n]) => n)
  return [
    `Task types: ${entry.task_types.map((t) => t.id.replace('task/types/', '')).join(', ')}`,
    counts.length ? `Needs attention: ${counts.map(([k, n]) => `${n} ${k}`).join(', ')}. Open the Log in Praxis: /praxis` : 'Nothing needs attention',
    ...(up.reload ? ['Plugin code changed; restart DSH to load it'] : []),
  ].join('\n')
}
