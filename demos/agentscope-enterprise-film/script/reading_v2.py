"""Progressive companion: chapter answers, always-visible mechanisms, expandable detail and questions."""
import html,json,re
from pathlib import Path
R=Path(__file__).resolve().parents[1]
CAT=json.loads((R.parents[1]/'vault/provenance/agentscope-enterprise-20261012/catalog.json').read_text())
SOURCES={s['slug']:s for s in CAT['sources']}

# Reader paragraphs follow the content patch, rather than a second copy of the script.
# The introductory body gives the role; visible depth gives implementation conditions.
BODY_EDITS={
 'whole': [
  '合同助手接到任务后，需要读取材料、查规则、形成意见，必要时等待审批，再把文件和结果交回业务应用。AgentScope 把推理与工具循环，接到托管会话、执行环境和前端事件。',
  '模型与提示词决定推理输入，工具连接业务动作，Service 管理请求和状态，Workspace 提供执行环境。一个功能跨越哪些职责，决定它需要哪些接口与控制。'],
 'agent': ['Agent 执行推理与行动循环。配置说明它能使用什么，AgentState 保存这次工作到了哪里；新消息开始回复，确认事件或外部结果续接暂停中的回复。'],
 'events': ['Event 把运行过程送到界面。reply_id 标识回复，block_id 或 tool_call_id 标识内部对象；start、delta、end 记录生成过程，Msg.append_event 把事件应用回完整消息。'],
 'tools': ['Toolkit 把 Python 函数、MCP 工具和工具组收成可调用集合。模型读取名称、说明和参数 Schema，运行时再次校验工具是否激活以及输入是否合法。业务工具可以按查询、保存候选和发布文件分别定义动作与授权。'],
 'hitl': ['ASK 将工具调用改为 ASKING，并发出 RequireUserConfirmEvent。当前事件流结束，reply 尚未完成；调用方保存状态并展示实际工具、参数与作用对象，随后用确认事件续接。',
  '外部执行走另一条交接：external 工具发出执行请求，外部完成后带回结果。输入确认、执行结果和最终消息分别关联原调用。'],
 'compression': ['长任务同时面对历史积累和大型工具返回。历史压缩把较早消息收成摘要，近期消息继续保留；单个工具结果截短则限制本次返回占用的输入空间。'],
 'offload': ['offload 保存被移出模型输入的原始内容。摘要支持下一轮推理，外部保存的消息和工具结果提供细节回查，两者由引用关联。'],
 'structured': ['结构化输出通过临时生成工具与 Schema 校验形成结果，最终保存在 Msg.structured_output。字段、类型与结构可以被程序消费，风险是否成立、引用是否准确仍由业务核对。'],
 'sessions': ['Storage 保存 Agent、Session、消息和配置；Message Bus 协调运行锁、收件队列、唤醒和事件回放。锁协调执行所有权，回放补回观察者漏掉的进展。',
  '运行中的持久快照可能落后于 worker 的实时状态。删除 Session 需要取消运行、等待锁释放并清理消息与工作区；清空页面不会完成这些动作。'],
 'background': ['耗时工具可以与页面连接分开执行。长工具先返回后台占位，完成结果沿原会话身份送回，Agent 再使用结果继续工作。',
  'CPU 密集的文档解析需要进程执行，避免阻塞 API 事件循环。观察断开、取消请求和实际任务退出分别记录。'],
 'workspace': ['Workspace 组织目录、文件、终端、MCP 连接和 skills。服务用隔离策略分配 workspace ID；实际目录与执行环境由所选后端决定。',
  '共享粒度改变后续任务能访问的材料，资源授权再判断谁可以读取或修改。生命周期还要定义连接、缓存、执行环境和文件何时清理。'],
 'sandbox': ['权限判定决定调用能否进入执行，沙箱后端提供运行环境。Workspace 接口把文件和终端操作交给所选后端，工具路径还要与后端文件映射一致。'],
 'java-03-execution-targets': ['Managed 把 Agent 定义、运行时和会话交给 Service；External 保留应用自己的进程和部署；Hosted 由 Runtime Host 在指定机器上启动 Coding Agent 提供方。',
  '三种目标进入同一 Session/Turn 观察面，动作、文件和恢复能力仍由目标决定。运行所有权影响谁保存状态、持有进程以及处理退出。'],
 'java-04-session-turn-idempotency': ['Session 选定 Agent、Team 或 Workflow，Turn 承载一次提交的工作。应用把业务对象与 Session、Turn 关联；任务等待审批或前一项尚未结束时，后续 Turn 可能继续排队。',
  'Managed 在同一 Session 保留上下文；Team 和 Workflow 的每个 Turn 启动独立协作或流程。'],
 'java-05-snapshot-sse-cursor': ['页面打开或丢失本地状态时，先读取目标资源的 Snapshot，再用 as_of 连接 SSE；事件只补快照之后的变化。已经成功应用的事件游标用于重连。',
  '游标过期返回 410 cursor_expired，界面重新加载快照，从新的 as_of 继续观察。重投任务会创建额外工作，无法修复观察断线。'],
 'java-06-interaction-capabilities': ['Service 把任务指导、背景注入、动作答复和继续执行分开。steer 影响后续步骤，inject 添加背景，Turn 的 /actions 按 request_id 和 payload 回答 required action，resume 继续原任务。',
  '前端读取 Turn 的 /capabilities 和 available_commands，再结合当前任务状态展示控件。Hosted 目标按提供方能力处理交互。'],
 'java-07-files-artifacts': ['Session file 提供任务材料，Artifact 登记明确交付的结果，Environment 提供工具读写的工作目录。应用上传材料取得 file_id，再作为结构化任务输入；工作目录中的文件还需要明确发布才能进入交付记录。',
  'Team 与 Workflow 成员不自动共享文件系统。跨成员传递使用可访问的文件或 Artifact，并核对内容、版本和业务接受标准。'],
 'java-09-recovery-capabilities': ['恢复观察、恢复工作状态和核对外部副作用分别处理。会话日志、checkpoint、Workspace 和 sandbox 状态各有保存后端，运行所有权决定哪个实例能继续写入。',
  '共享后端与隔离策略分别配置；改变隔离范围不会自动迁移既有数据。恢复材料需要沿原工作身份对齐。'],
 'java-webhook': ['Webhook 的至少一次投递允许同一事件重试。接收方按事件身份合并通知并保存处理结果；接收确认说明通知处理到了相应阶段，业务事务另有结果。']}
READER_ITEMS={
 'events':[('对象身份','reply_id、block_id 与 tool_call_id 定位对象。'),('内容更新','delta 更新进展，end 可交回累积内容。'),('动作交接','确认与外部执行事件关联待处理调用。'),('回复终态','目标 reply 结束后保存完整消息。')],
 'sessions':[('运行锁','取得同一 Session 的锁后再加载状态。'),('回放与 live','先写 replay log，再发送 live 事件。'),('持久提交','消息、AgentState 与游标写完后释放锁。'),('重新观察','先 live 订阅再回放，按 entry ID 去重。')],
 'background':[('等待阈值','普通工具默认等待 10 秒。'),('后台 watcher','超时先返占位，底层 task 继续。'),('结果回送','HintBlock 进入原会话 inbox，并唤醒执行。'),('退出行为','页面断开不中止；进程退出不保留 watcher。')],
 'workspace':[('分配策略','per_agent、per_session、per_user 分配绑定。'),('Local 目录','host path 为 basedir/agent_id。'),('MCP live state','按 agent_id 与 session_id 分区。'),('skills','按 agent 分区保存与发现。')],
 'java-07-files-artifacts':[('Session file','Managed 上传上限 16 MiB，绑定当前 Session。'),('输入能力','file_input 决定目标能否消费该文件。'),('Artifact 发布','引用真实 file_id 或可访问 HTTPS 资源。'),('内容取得','读取交付记录，按权限下载并核对版本。')]}

def load_scenes():
 baseline=json.loads((R/'script/beats.json').read_text())['scenes']
 patches=json.loads((R/'script/content-v2.json').read_text())['scenes']
 if [s['id'] for s in baseline] != [s['id'] for s in patches]:
  raise ValueError('Content patch must map all baseline scenes in order')
 result=[]
 for original,patch in zip(baseline,patches):
  s=dict(original)
  for key in ('title','lead','items','pm'):
   if key in patch:s[key]=patch[key]
  paragraphs=BODY_EDITS.get(s['id'],s['essay'].split('\n\n'))
  if s['id']=='scheduling':
   paragraphs=[paragraphs[0], '同一批并发安全调用汇合结果后进入下一轮推理。生成文件后才能发布文件的依赖，由编排或后续推理轮表达；调度器不会自动从动作名称推断业务依赖。']
  elif s['id']=='deployment':
   paragraphs=[paragraphs[0], '上线配置同时核对运行锁、状态后端、工作区和定时调度的所有权。它们分别影响接管、恢复、文件访问与触发次数。']
  elif s['id']=='observability':
   paragraphs=[paragraphs[0], '前端事件、消息记录与 trace 分别保存进展、工作内容和调用诊断。用户可见内容、运维诊断、敏感资料处理与保留期限各有范围；耗时与用量用于判断成本和等待。']
  additions=patch.get('essay_additions',[])
  s['body_paragraphs']=list(paragraphs)
  s['depth_paragraphs']=list(additions)
  s['essay']='\n\n'.join(paragraphs+additions)
  if s['id'] in READER_ITEMS:
   s['items']=[{'label':label,'detail':detail} for label,detail in READER_ITEMS[s['id']]]
  s['evidence']=[]
  for sid in patch['source_ids']:
   if sid not in SOURCES:raise ValueError('Unknown source ID '+sid)
   source=SOURCES[sid]
   if not (R.parents[1]/source['snapshot_path']).is_file():raise ValueError('Missing source snapshot '+sid)
   s['evidence'].append({'id':sid,'url':source['url'],'title':source['title'],'version':source.get('version')})
  result.append(s)
 return result
SCENES=load_scenes()
CHAPTERS={
'01':('项目全貌','AgentScope 将推理循环接到会话、执行环境和业务交付。','Python 2.0 与 Java Harness/Service 是两条完整实现路径。旧 Runtime 与 Studio 的职责已归入 Python 2.0。'),
'02':('Agent 内核','一次回复由状态检查、模型调用与工具反馈推进。','消息保存完整记录，事件提供实时增量。合法参数、执行权限和运行环境分别约束调用。'),
'03':('上下文与协作','长任务靠可见上下文、可回查材料与明确分工继续。','压缩、offload、memory 与 RAG 处理不同的信息需要；计划、verifier 和 team 组织工作。'),
'04':('Python 服务','Agent Service 管理一次循环之外的身份、状态与资源。','持久存储与消息总线分开；请求提交、后台运行和多个观察者之间保留会话身份。'),
'05':('Java 企业接入','统一 Session 接口组织不同执行目标，具体能力由目标决定。','Harness 支持持续工作，Service 把 Session、Turn、动作、权限和文件交付接入应用。'),
'06':('从机制到方案','业务闭环同时核对输入、动作、执行状态与交付记录。','外部结果不因聊天取消或进程恢复而撤回。相同任务身份连接重试、回放和副作用核对。')}
QUESTIONS=[
('模型为何反复调用工具？','react'),('确认之后怎样继续同一项工作？','hitl'),('长对话被压缩，细节还能找回吗？','offload'),('上下文、长期记忆与知识库怎样分工？','memory'),('用户刷新页面会重跑任务吗？','java-05-snapshot-sse-cursor'),('同一提交超时，如何避免创建两项任务？','java-04-session-turn-idempotency'),('沙箱与工具权限怎样分工？','sandbox'),('几个会话能看见同一批文件吗？','workspace'),('如何确定任务还在后台运行？','sessions'),('Agent 生成文件后，应用怎样取得？','java-07-files-artifacts'),('同一接口能控制所有 Agent 吗？','java-06-interaction-capabilities'),('任务取消后，外部动作怎样核对？','interrupt')]
def esc(s):return html.escape(str(s))
def source_title(ref):
 u=ref['url']; parts=u.split('/')
 if u.startswith('https://raw.githubusercontent.com/'):
  return '/'.join(parts[-3:])
 name=parts[-1].replace('.md','').replace('_',' ')
 if name in ['overview','index']:name=parts[-2]+' / '+name
 return name
head='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AgentScope · 企业工作机制</title><style>
:root{--paper:#f3f1eb;--ink:#152b32;--muted:#546c73;--accent:#006d77;--line:#c1c9c6;--sand:#e9e4d9}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:18px/1.8 "PingFang SC",sans-serif}main{max-width:1120px;margin:auto;padding:48px 28px 100px}h1{font:700 54px/1.25 "Songti SC",serif;max-width:850px;text-wrap:balance;margin:14px 0 24px}h1 span{display:block;text-wrap:balance}h2{font:700 36px/1.3 "Songti SC",serif;margin:0 0 12px}h3{font-size:25px;line-height:1.4;margin:0 0 14px}a{color:var(--accent);text-underline-offset:4px}.eyebrow{font-size:15px;letter-spacing:.14em;color:var(--muted)}.answer{font-size:24px;line-height:1.65}.chapter{margin-top:80px}.chapter-head{border-top:2px solid var(--ink);padding-top:24px}.chapter-no{font:16px Menlo,monospace;color:var(--accent)}.outline{display:grid;grid-template-columns:1fr 1fr;gap:0 35px;margin:35px 0}.outline a{border-top:1px solid var(--line);padding:14px 0;text-decoration:none;line-height:1.6}.outline b{display:block}.outline span{color:var(--muted);font-size:16px}.toolbar{display:flex;flex-wrap:wrap;gap:16px;align-items:center;margin:22px 0}button{font:inherit;background:none;border:1px solid var(--accent);padding:7px 14px;color:var(--accent);cursor:pointer}button:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #b85c39;outline-offset:4px}.module{margin:35px 0 55px;padding-left:30px;border-left:2px solid var(--line)}.module p,.mechanism .work{overflow-wrap:anywhere}.principle{font-size:20px;margin:14px 0}.lead{color:var(--muted);font-size:17px}.mechanism{list-style:none;padding:0;margin:20px 0}.mechanism li{display:grid;grid-template-columns:240px 1fr;gap:20px;border-top:1px solid var(--line);padding:12px 0}.mechanism .name{font-weight:600}.mechanism .work{color:var(--muted)}.condition{background:var(--sand);padding:12px 18px;border-left:4px solid #b85c39;margin:20px 0}.detail{padding:18px 22px;background:#e4ece8;margin:20px 0}.detail summary{cursor:pointer;font-weight:550}.source{font-size:14px;margin-top:22px;color:var(--muted)}.source a{margin-right:15px;overflow-wrap:anywhere}nav.questions a{display:block;margin:10px 0}.glossary{font-size:16px;color:var(--muted);border-top:1px solid var(--line);padding-top:18px}.detail p{margin:14px 0;overflow-wrap:anywhere}.deep-mechanism{margin:24px 0;padding:18px 24px;border:1px solid var(--line)}.deep-mechanism h4{margin:0 0 14px;font-size:20px}.deep-mechanism dl{margin:0}.deep-mechanism dt{font-weight:650;margin-top:18px}.deep-mechanism dd{margin:4px 0 15px}.static-diagram{margin:28px 0;border-top:1px solid var(--line);padding-top:15px}.static-diagram svg{width:100%;height:auto;display:block}footer{margin-top:80px;border-top:2px solid var(--ink);padding-top:25px}.nojs-note{display:none}
@media(max-width:680px){main{padding:28px 20px 60px}h1{font-size:38px}h2{font-size:30px}.answer{font-size:21px}.outline{grid-template-columns:1fr}.module{padding-left:16px}.mechanism li{grid-template-columns:1fr;gap:2px}.chapter{margin-top:58px}.toolbar{gap:10px}}
@media print{main{max-width:none;padding:0}.toolbar,.video-link{display:none}.detail{display:block}.detail>p{display:block!important}.module{break-inside:avoid-page}a{color:inherit}.outline{grid-template-columns:1fr 1fr}h1{font-size:34px}}
</style></head><body><main><header><div class="eyebrow">AGENTSCOPE / ENTERPRISE</div><h1><span>从一次请求，</span><span>到持续运行的企业工作</span></h1><p class="answer">AgentScope 将模型推理、工具执行与上下文，接到会话、权限、状态恢复和结果交付。</p><p class="lead">Python 文档 2.0.9 / 源码 2.0.10dev · Java Harness v2 / Service 2.1.0-BETA1</p><p class="video-link"><a href="cut2/film/index.html">观看讲解</a></p><p class="glossary">agent 负责推理与行动；tool 承担可执行动作；skill 提供任务指导和资源。session 关联持续工作，run 记录一次执行，Java Turn 承载一项提交任务；checkpoint 保存工作状态，Artifact 登记供应用取得的交付物。</p></header>'''
def render():
 a=[head,'<nav class="outline" aria-label="章节目录">']
 for no,(title,answer,lead) in CHAPTERS.items():a.append(f'<a href="#chapter-{no}"><b>{no} · {esc(title)}</b><span>{esc(answer)}</span></a>')
 a+=['</nav>','<div class="toolbar"><button id="expand-all" type="button">展开来源定位</button><button id="collapse-all" type="button">收起来源定位</button><a href="#questions">按问题查阅</a></div>']
 for no,(title,answer,lead) in CHAPTERS.items():
  a.append(f'<section class="chapter" id="chapter-{no}"><div class="chapter-head"><div class="chapter-no">{no}</div><h2>{esc(title)}</h2><p class="answer">{esc(answer)}</p><p class="lead">{esc(lead)}</p></div>')
  for s in [s for s in SCENES if s['chapter'][0]==no]:
   ps=s['body_paragraphs']
   a.append(f'<article class="module" id="{esc(s["id"])}"><h3>{esc(s["title"])}</h3><p class="lead">{esc(s["lead"])}</p><p class="principle">{esc(ps[0])}</p><ul class="mechanism">')
   for it in s['items']:a.append(f'<li><span class="name">{esc(it["label"])}</span><span class="work">{esc(it["detail"])}</span></li>')
   a.append(f'</ul><p class="condition">{esc(s["pm"])}</p>')
   a.extend('<p>'+esc(paragraph)+'</p>' for paragraph in ps[1:])
   if s['depth_paragraphs']:
    a.append('<div class="deep-mechanism"><h4>实现与条件</h4>')
    a.extend('<p>'+esc(paragraph)+'</p>' for paragraph in s['depth_paragraphs'])
    a.append('</div>')
   a.append('<details class="detail"><summary>来源定位</summary>'+''.join('<p data-source-id="'+esc(e['id'])+'"><a href="'+esc(e['url'])+'">'+esc(source_title(e))+'</a>'+(' · '+esc(e['version']) if e.get('version') else '')+'</p>' for e in s['evidence'])+'</details>')
   a.append('<p class="source">'+''.join(f'<a href="{esc(e["url"])}">{esc(source_title(e))}</a>' for e in s['evidence'])+'</p></article>')
  a.append('</section>')
 a.append('<footer id="questions"><h2>常见追问</h2><nav class="questions" aria-label="按问题查阅">')
 a+=['<a href="#'+sid+'">'+esc(q)+'</a>' for q,sid in QUESTIONS]
 a+=['</nav></footer></main><script>const ds=[...document.querySelectorAll("details.detail")];document.getElementById("expand-all").onclick=()=>ds.forEach(d=>d.open=true);document.getElementById("collapse-all").onclick=()=>ds.forEach(d=>d.open=false);let openBeforePrint=[];addEventListener("beforeprint",()=>{openBeforePrint=ds.map(d=>d.open);ds.forEach(d=>d.open=true)});addEventListener("afterprint",()=>ds.forEach((d,i)=>d.open=openBeforePrint[i]));</script></body></html>']
 return '\n'.join(a)

if __name__=='__main__':
 (R/'reading-v2.html').write_text(render())
 print(len(SCENES),'modules;',sum(bool(s['depth_paragraphs']) for s in SCENES),'visible detail groups;',len({e['id'] for s in SCENES for e in s['evidence']}),'source IDs')
