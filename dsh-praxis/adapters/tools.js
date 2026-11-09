// The one tool table. MCP, the DSH plugin and the CLI all expose these names,
// descriptions and parameters, and call the same core operations. `agent: true` marks the tools a
// worker uses while doing a task (take from the Kit, register what it found, record what it read and
// delivered); a host that keeps every session's context lean shows only those. The rest maintain the
// roster and records and stay on the control plane, the CLI and MCP.

import { FORMS } from '../core/materials.js'

const str = (description) => ({ type: 'string', description })
const bool = (description) => ({ type: 'boolean', description })
const num = (description) => ({ type: 'integer', description })
const list = (description) => ({ type: 'array', items: { type: 'string' }, description })
// A lookup miss is a failed call on every surface: CLI exit 1, MCP isError, DSH tool error, HTTP 400.
const missing = (message) => { throw new Error(message) }
// How a source is filed, written into the tools that file one, so maintenance needs no exploration first.
const FILING = `编目规则：形态看来源本身。规范性文本（WCAG、APG、W3C、MDN）是 standard；一家设计系统或平台的指南是 practice；逐个说明组件的文档是 component-library；收一批作品或样式的站点是 case-library；单件作品或单页是 case；写给 agent 的指令（SKILL.md、design.md）是 skill；库、服务或工具的文档是 tool；文章、博客是 article；论文与研究是 research。category 填会用到它的 Kit 页所在的区域（如 design/interaction）；拿不准就填层（design、writing、publish、task），不自建区域；新的风格、配色、笔触只是新来源，不新增形态或区域。description 写“<何时>时打开；取<什么>。”，一两个短句。条目只写来源本身：description、概要、摘录、边界与何时重访都不提本地项目，也不引别的来源，任何任务拿到都能用；某个项目怎样用了它，记在 praxis_consume 的运行记录里。`
// What local work is recorded, and what is left out as noise.
const LOCAL = `本地产物只登记三类：delivery（真实交付，在已登记项目里）、pipeline（再做同类交付的方法：构建脚本或写明步骤的 README）、example（为示范某种做法预先做的样张）。pipeline 与 example 用 serves 写它服务哪些 Kit 页、何时对照，可以不在项目里；delivery 经 review 接受（accepted）且写了 serves，才作为范例给到任务。过程记录（dogfooding、review 记录、蒸馏笔记、会话纪要）不登记，运行记录就是它们的痕迹。`
const serves = { type: 'array', description: '它服务的 Kit 页：何时对照、看什么', items: { type: 'object', properties: { target: str('Kit 页路径，如 kit/design/interaction/controls.md'), description: str('“<何时>时对照；看<什么>。”') }, required: ['target'] } }

const who = {
  by: str('操作者，人或 agent 的名称；省略时用调用方名称'),
  reason: str('为什么改'),
  task: str('所属任务或运行'),
}

export const TOOLS = [
  {
    name: 'praxis_entry',
    agent: true,
    description: 'Praxis Kit 的入口：常驻单元（Writing、Design 的入口与底线）、各层入口、任务类型和 stream（自撰的持续探索，文件在 streams_dir）。开始一件写作、编排、设计或报告任务时先调用。带 reload 时，宿主运行的是旧代码，重启后再用。',
    parameters: {},
    run: (p) => p.entry(),
  },
  {
    name: 'praxis_resolve',
    agent: true,
    description: '按任务类型和流水线，或指定的 stream，列出这次要读的 Kit 单元（附选用理由）和挂在这些单元上的已启用素材。只读结果里的单元，不默认加载全部。每条素材带 source ID、原件 URL、证据状态、读取范围、摘录（定位与说法）和本地快照路径：需要核对或引用时按定位回原件，读过的来源在 praxis_consume 的 sources 里写上。之后的 exemplars 是服务这些单元的本地 pipeline、example 与已接受的交付（路径与说明）：先用网页素材，要照着做或重复同类交付时再打开范例。',
    parameters: {
      task_type: str('任务类型 ID，如 technical-explainer、work-report'),
      pipeline: str('html 或 video；省略用任务类型的默认流水线'),
      stream: str('stream ID，如 visual-motion-grammar：用户点名一条 stream 时填，可与任务类型同用；结果带上这一页、它取用的单元和挂在它上面的素材'),
      units: list('另外指定的单元 ID、路径或语法 ID'),
      preset: str('预设 ID；省略用该流水线的默认预设'),
    },
    run: (p, a) => p.resolve(a),
  },
  {
    name: 'praxis_unit',
    agent: true,
    description: '读一个 Kit 单元或 stream 的全文。参数可以是单元 ID（writing/organization/mechanism、stream/visual-motion-grammar）、仓库路径或语法 ID（DWG-I-CONTROLS）。',
    parameters: { ref: str('单元 ID、路径或语法 ID') },
    required: ['ref'],
    run: (p, a) => p.unit(a.ref) ?? missing(`unknown unit: ${a.ref}`),
  },
  {
    name: 'praxis_unit_revise',
    description: '修订一个 Kit 单元：给出修订后的整页（从 # 标题开始）、理由和依据的范例（某次运行、review 或产物）。修订存在用户数据里，立即对所有入口生效；包里的原页不动，包升级后原页变了，upkeep 会把这条修订列为冲突。带上读到的 revision（新修订填 0）。',
    parameters: { unit: str('单元 ID 或路径'), body: str('修订后的整页 Markdown'), expected_revision: num('读到的 revision：从未修订过的单元填 0；撤回过的单元填 praxis_upkeep 或上次返回的 revision'), reason: str('为什么改'), example: str('依据：运行 ID、review 或产物'), by: who.by, task: who.task },
    required: ['unit', 'body', 'reason', 'expected_revision'],
    run: (p, a) => p.reviseUnit(a),
    writes: true,
  },
  {
    name: 'praxis_unit_revert',
    description: '撤回一个单元的修订，恢复为包里的原页；修订的全文留在历史里。',
    parameters: { unit: str('单元 ID 或路径'), expected_revision: num('读到的 revision'), ...who },
    required: ['unit'],
    run: (p, a) => p.revertUnit(a),
    writes: true,
  },
  {
    name: 'praxis_revisions',
    description: '列出用户数据里对 Kit 单元的修订：理由、依据、是否与包里更新后的原页冲突。',
    parameters: {},
    run: (p) => p.revisionList(),
  },
  {
    name: 'praxis_units',
    description: '列出某层（task、writing、design、publish、stream）或全部单元的 ID、标题和 description。',
    parameters: { layer: str('task、writing、design、publish 或 stream；省略列出全部') },
    run: (p, a) => p.units(a),
  },
  {
    name: 'praxis_search',
    agent: true,
    description: '在名册的全部来源里按关键词、用途 tag、证据状态、形态或 Kit 分类（层或层下的区域，如 design、design/motion）查找，返回目录级信息：已编目的来源带形态与 description。',
    parameters: { query: str('空格分隔的关键词'), tag: str('用途 tag，如 ARIA'), status: str('verified、partial 或 unavailable'), form: str(`形态：${FORMS.join('、')}`), category: str('Kit 分类：层或区域，如 design/motion'), limit: num('最多返回几条，默认 20') },
    run: (p, a) => p.materials.search(a),
  },
  {
    name: 'praxis_catalog',
    agent: true,
    description: `来源编目：按 Kit 的层与区域，再按形态（${FORMS.join('、')}）排成纲目，每条带 description（何时打开、取什么）。不给 area 与 query 时只返回纲目与各形态的条数；给 area（如 design/interaction）或 query 时返回条目：标题、description、URL、证据状态、所挂页面与信号。找某类做法或范例时先看纲目，再展开一个区域，凭 description 判断要不要深入；praxis_source 给出读取范围与摘录定位，采用前按 URL 回原件读，不以概要代替原件。`,
    parameters: { area: str('Kit 区域，如 design/motion；给出时返回该区域及其子区域的条目'), form: str('只看一种形态'), query: str('空格分隔的关键词') },
    run: (p, a) => p.catalog(a),
  },
  {
    name: 'praxis_file',
    agent: true,
    description: `编目一个来源（自有来源或来源包里的条目）：形态、Kit 分类与 description，240 字以内，同时服务目录浏览、agent 发现与 review；挂载上没写 description 时沿用它。来源包从不被写入，编目记在名册里。带上读到的 entry_revision（首次编目填 0）。${FILING}`,
    parameters: { source: str('来源 ID'), expected_revision: num('读到的 entry_revision；首次编目填 0'), form: str(`形态：${FORMS.join('、')}`), category: str('Kit 分类：层或区域，如 design/interaction'), description: str('何时打开、取什么'), ...who },
    required: ['source'],
    run: (p, a) => {
      const patch = {}
      for (const k of ['form', 'category', 'description']) if (a[k] !== undefined) patch[k] = a[k]
      return p.materials.file(a.source, patch, a)
    },
    writes: true,
  },
  {
    name: 'praxis_source',
    agent: true,
    description: '读一个来源的条目：state（active 或 retired）、出处、编目（形态、Kit 分类、description 与它的 review；review.current 说这条 review 判的是否就是现在的 description）、概要、证据状态、读取范围、限制、摘录与定位、快照、最近一次上游检查；它为什么收录（自有来源的收录任务，或来源包的用途）；挂在哪些页面、经这些页面服务哪些任务类型；哪些运行读过它、交付了什么；集合类来源另列成员账目（上游每条成员链接：已登记、不收录或未处理）与上游新增、下线。不含原件全文。',
    parameters: { id: str('来源 ID 或别名') },
    required: ['id'],
    run: (p, a) => p.source(a.id) ?? missing(`unknown source: ${a.id}`),
  },
  {
    name: 'praxis_bindings',
    description: '列出来源与单元之间的挂载（目录行）：description、启用、收藏、优先级、tag、review 与版本。可按单元路径或来源过滤。',
    parameters: { target: str('目标路径或目录前缀：Kit 页写 kit/…'), source: str('来源 ID'), include_removed: bool('同时列出已删除、可恢复的挂载') },
    run: (p, a) => p.materials.listBindings({ target: a.target, source: a.source, includeRemoved: a.include_removed }),
  },
  {
    name: 'praxis_curate',
    agent: true,
    description: '维护一条挂载：改 description、取用题解、启用、收藏、优先级或 tag；挂载不存在时新建（目标页必须存在；Kit 页写 kit/…，stream 写 praxis_entry 给出的路径），关系记在名册里，不写来源包。description 写这个来源对这一页有什么用，不抄来源概要，也不提本地项目。带上读到的 revision 作为 expected_revision，版本已变会被拒绝并返回当前内容。常规修改直接生效。',
    parameters: {
      binding: str('挂载 ID：<来源 ID>@<目标路径>，Kit 页如 kit/design/controls.md'),
      expected_revision: num('读取时的 revision；新建填 0'),
      description: str('目录行的说明，240 字以内：这一页何时用它、取用什么'),
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
    description: '记录一次 description review：挂载的 description（binding），或来源编目的 description（source）。结论为 accurate、revised 或 needs-work。review 判的是当时那段 description：description 改了，这条 review 就不再 current，needs-work 也不再算信号，等下一次 review。已淘汰的来源不能 review。',
    parameters: { binding: str('挂载 ID'), source: str('来源 ID：review 它的编目'), verdict: str('accurate、revised 或 needs-work'), note: str('说明'), revision: num('看到的 revision（来源用 entry_revision）；与当前不同时拒绝，先读新内容再判断；省略为当前'), by: who.by },
    required: ['verdict'],
    run: (p, a) => (a.binding ? p.materials.review(a.binding, a) : a.source ? p.materials.reviewEntry(a.source, a) : missing('review needs binding or source')),
    writes: true,
  },
  {
    name: 'praxis_capture',
    agent: true,
    description: `登记新来源（一次任务里 explore 或用户指定的来源线得到的网页参考），可一次多条：全部核对后一次写入，同一 URL 已在名册的返回已有条目（existing；那条已淘汰时另有 retired: true，不能再收，要用就另找来源）。名册只记链接、概要与摘录，不存原件；本地文件、项目材料和自己的笔记不是来源，用 praxis_consume 记为产物 trace。task 写这批来源为哪件任务收录：它是收录记录，和读过它的运行一起列在来源的活动里，供人 review 时知道它为什么在名册里，不写进 description 与概要。form（${FORMS.join('、')}）、category（Kit 的层或区域）与 description（何时打开、取什么）把它编进来源编目；之后可用 praxis_curate 挂到具体单元上。${FILING}作品集、组件库这类会随上游增减的集合，用 members 给出成员链接的 URL 模式，refresh 时会对照上游列出新增与下线；从集合里登记的成员用 member_of 指回集合。来源已在项目里有自己的登记文件时，用 praxis_register_index 按引用登记，不逐条复制。`,
    parameters: {
      sources: { type: 'array', description: '要登记的来源', items: { type: 'object', properties: {
        url: str('原 URL（http 或 https）'), title: str('标题'), form: str(`形态：${FORMS.join('、')}`), description: str('何时打开、取什么，240 字以内'),
        summary: str('以自己的话写的概要：是什么、能支持什么判断'),
        read_scope: str('实际读取范围与证据形态：读过文字、看过输出、执行过实现'),
        evidence_status: str('verified、partial 或 unavailable；默认 partial'),
        limits: str('边界：不能证明什么'), revisit_when: str('何时重访'), tags: list('用途 tag'),
        excerpts: { type: 'array', description: '摘录：定位与它支持的说法', items: { type: 'object', properties: { locator: str('定位'), claim: str('支持的说法') }, required: ['locator', 'claim'] } },
        category: str('Kit 分类：层或区域，如 design/motion'), slug: str('可选的稳定 slug'),
        members: { type: 'object', description: '这是一个集合：成员链接的 URL 模式（* 不跨 /，** 跨 /）', properties: { pattern: str('URL glob') }, required: ['pattern'] },
        member_of: str('这条来自哪个集合来源（ID）'),
      }, required: ['url', 'title', 'form', 'description', 'summary', 'read_scope', 'limits', 'revisit_when'] } },
      task: str('这批来源为哪件任务收录'), by: who.by, reason: who.reason,
    },
    required: ['sources', 'task'],
    run: (p, a) => p.materials.capture(a.sources, a),
    writes: true,
  },
  {
    name: 'praxis_register_index',
    description: '按引用接入一个来源包：文件留在原处，Praxis 原地读取、从不写入，条目进入名册，可搜索、挂到单元、在运行里记为读过。format 为 index（默认）时是项目自己的来源索引：条目 ID 为 <登记 ID>:<条目 ID>，fields 把名册字段对到项目字段名，status 把项目的状态值对到 verified、partial、unavailable，excerpts 指向按来源 ID 关联的主张文件（JSON Lines）。format 为 registry 时是 Praxis registry 格式的名册文件，root 是其中相对路径的起点。同一 ID 再登记即更新，已有挂载保留。',
    parameters: {
      id: str('登记 ID，如 jev-research'), format: str('index 或 registry；默认 index'), path: str('文件路径（JSON）'), root: str('registry：文件内相对路径的起点目录'),
      list: str('index：记录列表所在的键；文件本身是列表时省略'),
      title: str('名称'), purpose: str('为什么收录这批来源、服务哪些任务'), limits: str('index：这批来源共同的边界'), revisit_when: str('index：何时重访'),
      fields: { type: 'object', description: '名册字段 → 项目字段名；id 与 title 必填，可选 url、summary、read_scope、status、tags', properties: {
        id: str('条目 ID 字段'), title: str('标题字段'), url: str('URL 字段'), summary: str('概要字段'), read_scope: str('读取范围字段'), status: str('状态字段'), tags: str('分组或用途字段') }, required: ['id', 'title'] },
      status: { type: 'object', description: '项目状态值 → verified、partial 或 unavailable', additionalProperties: { type: 'string' } },
      excerpts: { type: 'object', description: '主张文件', properties: { path: str('JSON Lines 文件路径'), id: str('主张 ID 字段'), source: str('来源 ID 字段'), locator: str('定位字段'), claim: str('说法字段') }, required: ['path', 'id', 'source', 'locator', 'claim'] },
      by: who.by, reason: who.reason,
    },
    required: ['id', 'path', 'title', 'purpose'],
    run: (p, a) => p.materials.registerPack(a, a),
    writes: true,
  },
  {
    name: 'praxis_packs',
    description: '列出按引用接入的来源包：格式、文件、用途与条目数。',
    parameters: {},
    run: (p) => p.materials.listPacks(),
  },
  {
    name: 'praxis_source_update',
    description: '修订一条自有来源的记录：标题、链接、概要、读取范围、证据状态、边界、何时重访、tag、摘录；members 把它标为集合（给出成员链接的 URL 模式），member_of 指明它来自哪个集合。形态、Kit 分类与 description 用 praxis_file 改。写法同 praxis_capture：不提本地项目，不引别的来源。带上读到的 revision。来源包里的条目在来源包自己那里维护。',
    parameters: {
      source: str('来源 ID'), expected_revision: num('读到的 revision'),
      title: str('标题'), url: str('URL'), summary: str('概要'), read_scope: str('读取范围'), evidence_status: str('verified、partial 或 unavailable'),
      limits: str('边界'), revisit_when: str('何时重访'), tags: list('用途 tag'),
      members: { type: 'object', description: '集合：成员链接的 URL 模式', properties: { pattern: str('URL glob') }, required: ['pattern'] }, member_of: str('所属集合来源 ID'),
      excerpts: { type: 'array', description: '摘录', items: { type: 'object', properties: { locator: str('定位'), claim: str('支持的说法') }, required: ['locator', 'claim'] } },
      ...who,
    },
    required: ['source', 'expected_revision'],
    run: (p, a) => {
      const patch = {}
      for (const k of ['title', 'url', 'summary', 'read_scope', 'evidence_status', 'limits', 'revisit_when', 'tags', 'members', 'member_of', 'excerpts']) if (a[k] !== undefined) patch[k] = a[k]
      return p.materials.updateOwn(a.source, patch, a)
    },
    writes: true,
  },
  {
    name: 'praxis_retire',
    description: '淘汰一条自有来源：它离开名册的活动列表，挂载随之停用，记录与历史保留。淘汰是终态：之后仍可读（state 为 retired），不能再编目、挂载、review 或改条目，也不能再淘汰一次。必须写理由，例如上游已下线或已被更好的来源取代。来源包里的条目在来源包自己那里维护。',
    parameters: { source: str('来源 ID'), expected_revision: num('读到的 revision'), ...who },
    required: ['source', 'reason'],
    run: (p, a) => p.materials.retire(a.source, a),
    writes: true,
  },
  {
    name: 'praxis_skip_member',
    description: '集合的上游新增了一条不打算收录的成员链接时调用：写明理由，之后不再提出它。要收录就用 praxis_capture 登记并写 member_of。',
    parameters: { source: str('集合来源 ID'), url: str('成员链接'), expected_revision: num('读到的 revision'), ...who },
    required: ['source', 'url', 'reason'],
    run: (p, a) => p.materials.skipMember(a.source, a.url, a),
    writes: true,
  },
  {
    name: 'praxis_refresh',
    description: '对照上游检查一个来源 URL：记下是否打得开和内容 hash，不存正文；集合类来源另记页面上列出的成员链接，返回与名册的差别（新增 added、下线 gone）。hash 与上次看到的不同就是来源变了，打不开就是链接失效，两者都返回受影响的挂载，供检查说明是否仍适用。keep 为 true 时另存一份快照（旧版本保留），用于原件可能消失、或需要固定版本的来源。',
    parameters: { source: str('来源 ID'), keep: bool('另存一份快照'), ...who },
    required: ['source'],
    run: (p, a) => p.materials.refresh(a.source, a),
    writes: true,
  },
  {
    name: 'praxis_upkeep',
    description: '现在需要人处理的事，通常为空：review 结论为待改（needs_work）或来源在上次 review 后变了（changed）的挂载、编目放不下的自有来源（没有形态，或既无 Kit 分类也无挂载）、有信号而挂载上看不到的编目条目、上游有新增或下线成员的集合、与包里更新后的原页冲突的单元修订、找不到文件、最新版 review 待改或放错位置的产物、宿主运行旧代码时的 reload。未写说明、未 review 是默认状态，不列。',
    parameters: {},
    run: (p) => p.upkeep(),
  },
  {
    name: 'praxis_consume',
    agent: true,
    description: `交付前调用：记录这次工作实际读过的单元和来源（按当前版本），并把交付的文件登记为产物。文件必须在已登记项目的目录里（用 praxis_projects 查，没有就先用 praxis_project 登记），记录带上所属项目。${LOCAL}文件由某条已登记的管线产出时，用 made_with 写上那件 pipeline 产物的 ID。读过的来源与读过的单元之间的挂载随之记下，之后任何一边改了，这次运行会被列为过期。同一文件内容未变不重复登记；内容变了记为新版本；文件挪了位置时用 artifact 指明是哪件产物。只记实际读过、用过的；文件必须已经存在。返回运行记录，其中 artifacts 给出每个文件的产物 ID 与版本。`,
    parameters: {
      title: str('这次工作'), task_type: str('任务类型 ID'), pipeline: str('html 或 video'), preset: str('用的预设 ID'), overrides: { type: 'object', description: '这次对预设的临时改动' },
      units: list('读过的单元'), sources: list('实际读过的来源 ID：resolve 素材里的 source，或 praxis_search、praxis_source 得到的 ID'),
      artifacts: { type: 'array', description: '交付的文件：路径字符串，或带说明的对象。仓库内用仓库路径，仓库外用绝对路径', items: { anyOf: [
        { type: 'string' },
        { type: 'object', properties: { path: str('文件路径'), title: str('产物名称；省略用文件名'), description: str('它是什么、给谁用'), artifact: str('已有产物 ID：文件换了位置或改了名时指明'), made_with: str('产出它的管线：kind 为 pipeline 的产物 ID（在 resolve 的 exemplars 里）'),
          kind: str('delivery（默认）、pipeline 或 example'), serves,
          derived_from: { type: 'array', description: '由哪些产物派生，如 HTML 由 MD 底稿生成', items: { anyOf: [{ type: 'string' }, { type: 'object', properties: { artifact: str('产物 ID'), version: num('版本；省略为最新') }, required: ['artifact'] }] } } }, required: ['path'] },
      ] } },
      note: str('说明'), by: who.by,
    },
    required: ['title'],
    run: (p, a) => p.consume(a),
    writes: true,
  },
  {
    name: 'praxis_projects',
    agent: true,
    description: '项目：一件工作所在的目录，带布局（哪些路径放底稿、中间产物、最终产物）。列出每个项目的布局、登记了多少产物、最终产物路径里还有哪些文件没登记。给 path 时只返回包含它的项目：开工前用它确认产物该放哪里。',
    parameters: { path: str('一个文件或目录的路径'), include_removed: bool('包含已移除的项目') },
    run: (p, a) => p.projectList(a),
  },
  {
    name: 'praxis_project',
    agent: true,
    description: '登记或修改一个项目。新登记填 expected_revision 0；布局从模板开始（standard：draft/** 放底稿，build/** 放中间产物，out/** 放最终产物，evidence/** 放验收回执与留存帧（进 Git），tmp/** 放临时文件（不进 Git）；evidence 里的文件不算错放，tmp 不被检查），layout 里给出的角色替换模板对应的路径模式（相对项目根的 glob）。产物只能登记在已登记项目的目录里，底稿与最终产物应落在布局约定的位置；Praxis 不移动文件。',
    parameters: {
      id: str('项目 ID；新登记可省略，由名称生成'), expected_revision: num('读取时的 revision；新登记填 0'),
      root: str('项目根目录'), title: str('名称'), purpose: str('这个项目做什么'), template: str('布局模板：standard'),
      layout: { type: 'object', description: '按角色给出路径模式，替换模板对应部分', properties: { draft: list('底稿'), build: list('中间产物'), final: list('最终产物'), evidence: list('验收回执与留存帧'), tmp: list('临时文件') } },
      state: str('active 或 removed'), by: who.by, reason: who.reason,
    },
    required: ['expected_revision'],
    run: (p, a) => p.saveProject(a),
    writes: true,
  },
  {
    name: 'praxis_artifacts',
    description: '列出交付过的产物（最近变动在前）：名称、媒介、路径、当前版本、文件状态（current / modified 有未登记改动 / missing 找不到）、basis_changed（产出最新版本的运行所用的单元、挂载、来源或预设之后改过）、所属项目与在项目里的角色（draft、build、final、evidence、tmp）、最新版本的最近一次 review，以及需要处理的信号（missing 记录找不到文件、needs_work 最新版 review 待改、misplaced 交付物不在任何项目里或不在项目约定的底稿、最终产物与 evidence 位置）。kind 为 delivery、pipeline 或 example；pipeline 与 example 不按项目布局检查，serves 写它服务的 Kit 页。',
    parameters: { query: str('名称、说明或路径里的关键词'), medium: str('html、text、image、pdf、video、audio 等'), kind: str('delivery、pipeline 或 example'), signal: str('missing、needs_work、misplaced，或 basis_changed'), project: str('项目 ID'), include_removed: bool('包括已移除的'), limit: num('条数，默认 50') },
    run: (p, a) => p.artifactList(a),
  },
  {
    name: 'praxis_artifact',
    description: '读一件产物：种类与它服务的 Kit 页、每个版本的 hash、时间、产出它的运行（用了哪些单元、挂载、来源，之后哪些改过）、派生关系与产出它的管线，以及最近一次 review（写明针对哪一版）。',
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
    description: `改产物的名称或说明、种类与服务的 Kit 页、移除或恢复，或在文件挪了位置后指向新路径。新路径上的文件必须与最新版本内容相同；内容不同是新版本，用 praxis_consume 登记。带上读到的 revision。${LOCAL}`,
    parameters: { id: str('产物 ID'), expected_revision: num('读取时的 revision'), title: str('名称'), description: str('它是什么、给谁用'), kind: str('delivery、pipeline 或 example'), serves, path: str('文件的新位置'), state: str('active 或 removed'), ...who },
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

/** `session` identifies the host conversation a write came from ({host, id}); consume records it on the run. */
export async function callTool(praxis, name, args = {}, caller, session) {
  const tool = TOOLS.find((t) => t.name === name)
  if (!tool) throw new Error(`unknown tool: ${name}`)
  for (const key of tool.required ?? []) if (args[key] === undefined) throw new Error(`missing ${key}`)
  const a = tool.writes ? { by: caller, ...args, ...(session ? { session } : {}) } : args
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
