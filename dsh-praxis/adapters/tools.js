// The one tool table. MCP, the DSH plugin and the CLI all expose these names,
// descriptions and parameters, and call the same core operations.

const str = (description) => ({ type: 'string', description })
const bool = (description) => ({ type: 'boolean', description })
const num = (description) => ({ type: 'integer', description })
const list = (description) => ({ type: 'array', items: { type: 'string' }, description })
// A lookup miss is a failed call on every surface: CLI exit 1, MCP isError, DSH tool error, HTTP 400.
const missing = (message) => { throw new Error(message) }
const who = {
  by: str('操作者，人或 agent 的名称；省略时用调用方名称'),
  reason: str('为什么改'),
  task: str('所属任务或运行'),
}

export const TOOLS = [
  {
    name: 'praxis_entry',
    description: 'Praxis Kit 的入口：常驻单元（Writing、Design 的入口与底线）、各层入口和任务类型。开始一件写作、编排、设计或报告任务时先调用。带 reload 时，宿主运行的是旧代码，重启后再用。',
    parameters: {},
    run: (p) => p.entry(),
  },
  {
    name: 'praxis_resolve',
    description: '按任务类型和流水线列出这次要读的 Kit 单元（附选用理由）和挂在这些单元上的已启用素材。只读结果里的单元，不默认加载全部。',
    parameters: {
      task_type: str('任务类型 ID，如 technical-explainer、work-report'),
      pipeline: str('html 或 video；省略用任务类型的默认流水线'),
      units: list('另外指定的单元 ID、路径或语法 ID'),
      preset: str('预设 ID；省略用该流水线的默认预设'),
    },
    run: (p, a) => p.resolve(a),
  },
  {
    name: 'praxis_unit',
    description: '读一个 Kit 单元的全文。参数可以是单元 ID（writing/organization/mechanism）、仓库路径或语法 ID（DWG-I-CONTROLS）。',
    parameters: { ref: str('单元 ID、路径或语法 ID') },
    required: ['ref'],
    run: (p, a) => p.unit(a.ref) ?? missing(`unknown unit: ${a.ref}`),
  },
  {
    name: 'praxis_units',
    description: '列出某层（task、writing、design、publish）或全部 Kit 单元的 ID、标题和 description。',
    parameters: { layer: str('task、writing、design 或 publish；省略列出全部') },
    run: (p, a) => p.units(a),
  },
  {
    name: 'praxis_search',
    description: '在全部来源里按关键词、用途 tag 或证据状态查找，返回目录级信息（标题、短摘要、挂载位置）。',
    parameters: { query: str('空格分隔的关键词'), tag: str('用途 tag，如 ARIA'), status: str('verified、partial 或 unavailable'), limit: num('最多返回几条，默认 20') },
    run: (p, a) => p.materials.search(a),
  },
  {
    name: 'praxis_source',
    description: '读一个来源的条目：出处、概要、证据状态、限制、摘录与定位、快照；不含原件全文。',
    parameters: { id: str('来源 ID 或别名') },
    required: ['id'],
    run: (p, a) => {
      const s = p.materials.source(a.id)
      if (!s) missing(`unknown source: ${a.id}`)
      const { record, ...rest } = s
      return rest
    },
  },
  {
    name: 'praxis_bindings',
    description: '列出来源与单元之间的挂载（目录行）：description、启用、收藏、优先级、tag、review 与版本。可按单元路径或来源过滤。',
    parameters: { target: str('单元的仓库路径或目录前缀'), source: str('来源 ID'), include_removed: bool('同时列出已删除、可恢复的挂载') },
    run: (p, a) => p.materials.listBindings({ target: a.target, source: a.source, includeRemoved: a.include_removed }),
  },
  {
    name: 'praxis_curate',
    description: '维护一条挂载：改 description、取用题解、启用、收藏、优先级或 tag；挂载不存在时新建（目标页必须存在）。带上读到的 revision 作为 expected_revision，版本已变会被拒绝并返回当前内容。常规修改直接生效。',
    parameters: {
      binding: str('挂载 ID：<来源 ID>@<单元路径>'),
      expected_revision: num('读取时的 revision；新建填 0'),
      description: str('目录行的说明，240 字以内：何时用、取用什么'),
      usage: { type: 'object', description: '取用题解', properties: { problem: str('适用的问题'), how: str('怎样取用'), conditions: str('条件'), limits: str('不适用或易误用的情形'), examples: list('例子') }, required: ['problem', 'how'] },
      enabled: bool('进入任务默认可选范围'),
      favorite: bool('个人收藏'),
      priority: str('preferred 或 normal'),
      tags: list('tag'),
      ...who,
      example: str('依据的操作范例'),
    },
    required: ['binding'],
    run: (p, a) => {
      const patch = {}
      for (const k of ['description', 'usage', 'enabled', 'favorite', 'priority', 'tags']) if (a[k] !== undefined) patch[k] = a[k]
      return p.materials.curate(a.binding, patch, a)
    },
    writes: true,
  },
  {
    name: 'praxis_remove',
    description: '删除一条挂载：从目录和任务取用里移除，题解与历史保留，可用 praxis_restore 恢复。',
    parameters: { binding: str('挂载 ID'), expected_revision: num('读取时的 revision'), ...who },
    required: ['binding'],
    run: (p, a) => p.materials.remove(a.binding, a),
    writes: true,
  },
  {
    name: 'praxis_restore',
    description: '恢复一条已删除的挂载。',
    parameters: { binding: str('挂载 ID'), expected_revision: num('读取时的 revision'), ...who },
    required: ['binding'],
    run: (p, a) => p.materials.restore(a.binding, a),
    writes: true,
  },
  {
    name: 'praxis_review',
    description: '记录一次 description review：针对当前或指定 revision，结论为 accurate、revised 或 needs-work。',
    parameters: { binding: str('挂载 ID'), verdict: str('accurate、revised 或 needs-work'), note: str('说明'), revision: num('被检查的 revision；省略为当前'), by: who.by },
    required: ['binding', 'verdict'],
    run: (p, a) => p.materials.review(a.binding, a),
    writes: true,
  },
  {
    name: 'praxis_capture',
    description: '登记一个新来源（explore 或 RSI 中遇到的参考）。同一 URL 已登记时返回已有条目。写出 catalog 记录与来源卡；之后用 praxis_curate 把它挂到单元上。',
    parameters: {
      url: str('原 URL'), locator: str('非 URL 来源的定位'), title: str('标题'),
      summary: str('以自己的话写的概要：是什么、能支持什么判断'),
      read_scope: str('实际读取范围与证据形态：读过文字、看过输出、执行过实现'),
      evidence_status: str('verified、partial 或 unavailable；默认 partial'),
      limits: str('边界：不能证明什么'), revisit_when: str('何时重访'), tags: list('用途 tag'),
      excerpts: { type: 'array', description: '摘录：定位与它支持的说法', items: { type: 'object', properties: { locator: str('定位'), claim: str('支持的说法') }, required: ['locator', 'claim'] } },
      usage_note: str('本 Kit 取用什么（写进来源卡）'), slug: str('可选的稳定 slug'), ...who,
    },
    required: ['title', 'summary', 'read_scope', 'limits', 'revisit_when'],
    run: (p, a) => p.materials.capture(a, a),
    writes: true,
  },
  {
    name: 'praxis_refresh',
    description: '重新取得来源 URL 的当前内容，字节变了就存为新版本快照（旧版本保留），返回受影响的挂载，供检查题解是否仍适用。',
    parameters: { source: str('来源 ID'), ...who },
    required: ['source'],
    run: (p, a) => p.materials.refresh(a.source, a),
    writes: true,
  },
  {
    name: 'praxis_upkeep',
    description: '现在需要人处理的事，通常为空：review 结论为待改（needs_work）或来源在上次 review 后变了（changed）的挂载、交付后所用单元、挂载、来源或预设又改过的运行、新登记还没挂到单元的来源、找不到文件或最新版 review 待改的产物、宿主运行旧代码时的 reload。未写说明、未 review 是默认状态，不列。',
    parameters: {},
    run: (p) => p.upkeep(),
  },
  {
    name: 'praxis_consume',
    description: '交付前调用：记录这次工作实际读过的单元、用过的挂载和来源（按当前版本），并把交付的文件登记为产物。同一文件内容未变不重复登记；内容变了记为新版本；文件挪了位置时用 artifact 指明是哪件产物。只记实际读过、用过的；文件必须已经存在。返回运行记录，其中 artifacts 给出每个文件的产物 ID 与版本。',
    parameters: {
      title: str('这次工作'), task_type: str('任务类型 ID'), pipeline: str('html 或 video'), preset: str('用的预设 ID'), overrides: { type: 'object', description: '这次对预设的临时改动' },
      units: list('读过的单元'), bindings: list('用过的挂载 ID'), sources: list('用过的来源 ID'),
      artifacts: { type: 'array', description: '交付的文件：路径字符串，或带说明的对象。仓库内用仓库路径，仓库外用绝对路径', items: { anyOf: [
        { type: 'string' },
        { type: 'object', properties: { path: str('文件路径'), title: str('产物名称；省略用文件名'), description: str('它是什么、给谁用'), artifact: str('已有产物 ID：文件换了位置或改了名时指明'),
          derived_from: { type: 'array', description: '由哪些产物派生，如 HTML 由 MD 底稿生成', items: { anyOf: [{ type: 'string' }, { type: 'object', properties: { artifact: str('产物 ID'), version: num('版本；省略为最新') }, required: ['artifact'] }] } } }, required: ['path'] },
      ] } },
      note: str('说明'), by: who.by,
    },
    required: ['title'],
    run: (p, a) => p.consume(a),
    writes: true,
  },
  {
    name: 'praxis_artifacts',
    description: '列出交付过的产物（最近变动在前）：名称、媒介、路径、当前版本、文件状态（current / modified 有未登记改动 / missing 找不到）、basis_changed（产出最新版本的运行所用的单元、挂载、来源或预设之后改过）、最新版本的最近一次 review，以及需要处理的信号（missing 记录找不到文件、needs_work 最新版 review 待改）。',
    parameters: { query: str('名称、说明或路径里的关键词'), medium: str('html、text、image、pdf、video、audio 等'), signal: str('missing、needs_work，或 basis_changed'), include_removed: bool('包括已移除的'), limit: num('条数，默认 50') },
    run: (p, a) => p.artifactList(a),
  },
  {
    name: 'praxis_artifact',
    description: '读一件产物：每个版本的 hash、时间、产出它的运行（用了哪些单元、挂载、来源，之后哪些改过）、派生关系，以及针对各版本的 review。',
    parameters: { id: str('产物 ID') },
    required: ['id'],
    run: (p, a) => p.artifact(a.id) ?? missing(`unknown artifact: ${a.id}`),
  },
  {
    name: 'praxis_artifact_review',
    description: '对产物的某一版本记录 review。必须写明看的是哪一版；新版本不继承旧版本的结论。verdict：needs-work 待改、checked 已按验收项核对、accepted 主人接受。',
    parameters: { id: str('产物 ID'), version: num('被 review 的版本'), verdict: str('needs-work、checked 或 accepted'), note: str('意见'), by: who.by },
    required: ['id', 'version', 'verdict'],
    run: (p, a) => p.reviewArtifact(a),
    writes: true,
  },
  {
    name: 'praxis_artifact_update',
    description: '改产物的名称或说明、移除或恢复，或在文件挪了位置后指向新路径。新路径上的文件必须与最新版本内容相同；内容不同是新版本，用 praxis_consume 登记。带上读到的 revision。',
    parameters: { id: str('产物 ID'), expected_revision: num('读取时的 revision'), title: str('名称'), description: str('它是什么、给谁用'), path: str('文件的新位置'), state: str('active 或 removed'), ...who },
    required: ['id'],
    run: (p, a) => p.updateArtifact(a),
    writes: true,
  },
  {
    name: 'praxis_presets',
    description: '列出预设（流水线的默认配置：TTS provider 与音色、画幅、风格、方向、模板等）和每条流水线可填的字段。',
    parameters: { pipeline: str('html 或 video'), include_removed: bool('包括已删除的') },
    run: (p, a) => ({ fields: p.presetFields(), presets: p.presets({ pipeline: a.pipeline, includeRemoved: a.include_removed }) }),
  },
  {
    name: 'praxis_preset_save',
    description: '新建或修改一个预设。新建不传 id；修改传 id 和读到的 revision。只记密钥所在的环境变量名，不记密钥。default 设为 true 时成为该流水线的默认预设。',
    parameters: {
      id: str('预设 ID；新建时省略'), expected_revision: num('修改时读到的 revision'),
      pipeline: str('html 或 video'), title: str('名称'), description: str('什么时候用'),
      values: { type: 'object', description: '字段值，字段见 praxis_presets 的 fields' },
      tags: list('tag'), default: bool('设为该流水线的默认预设'), ...who,
    },
    run: (p, a) => p.savePreset(a),
    writes: true,
  },
  {
    name: 'praxis_preset_remove',
    description: '删除一个预设（保留记录，旧运行记录仍能查到它的值）。',
    parameters: { id: str('预设 ID'), expected_revision: num('读到的 revision'), ...who },
    required: ['id'],
    run: (p, a) => p.removePreset(a),
    writes: true,
  },
  {
    name: 'praxis_runs',
    description: '最近的运行记录：每次工作用了哪些单元、挂载、来源和产物。',
    parameters: { limit: num('条数，默认 20') },
    run: (p, a) => p.runs(a),
  },
  {
    name: 'praxis_stale',
    description: '列出所用单元、挂载、来源快照或预设在之后改过的运行记录，用来判断哪些交付可能要重看。',
    parameters: {},
    run: (p) => p.stale(),
  },
  {
    name: 'praxis_history',
    description: '最近的维护记录：谁在什么任务里改了什么、为什么；每条带这一版写下的字段值（set），按 id 过滤可回查一条挂载或预设的每个版本。',
    parameters: { limit: num('条数，默认 50'), id: str('只看这条挂载、预设或来源的记录') },
    run: (p, a) => p.history(a),
  },
]

export function inputSchema(tool) {
  return { type: 'object', properties: tool.parameters, ...(tool.required ? { required: tool.required } : {}), additionalProperties: false }
}

export async function callTool(praxis, name, args = {}, caller) {
  const tool = TOOLS.find((t) => t.name === name)
  if (!tool) throw new Error(`unknown tool: ${name}`)
  for (const key of tool.required ?? []) if (args[key] === undefined) throw new Error(`missing ${key}`)
  const a = tool.writes ? { by: caller, ...args } : args
  return jsonValue(await tool.run(praxis, a), name)
}

/**
 * Every surface receives the same JSON value. DSH checks tool values losslessly and refuses
 * `undefined`; JSON.stringify drops it. An absent optional field is therefore omitted here, and
 * anything else JSON cannot hold (NaN, functions, class instances, holes) is an error, not a guess.
 */
export function jsonValue(value, at = 'value') {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value
  if (typeof value === 'number') {
    if (Number.isFinite(value)) return value
    throw new Error(`${at} is not a finite number`)
  }
  if (Array.isArray(value)) return value.map((v, i) => jsonValue(v, `${at}[${i}]`))
  const proto = value && typeof value === 'object' ? Object.getPrototypeOf(value) : undefined
  if (proto === Object.prototype || proto === null) {
    const out = {}
    for (const [k, v] of Object.entries(value)) if (v !== undefined) out[k] = jsonValue(v, `${at}.${k}`)
    return out
  }
  throw new Error(`${at} is not JSON (${value === undefined ? 'undefined' : typeof value})`)
}
