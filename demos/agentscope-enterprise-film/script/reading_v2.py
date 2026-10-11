"""Progressive companion: chapter answers, always-visible mechanisms, expandable detail and questions."""
import html,json,re
from pathlib import Path
R=Path(__file__).resolve().parents[1]
SCENES=json.loads((R/'script/beats.json').read_text())['scenes']
DEPTH=json.loads((R/'script/depth-v2.json').read_text())
CAT=json.loads((R.parents[1]/'vault/provenance/agentscope-enterprise-20261012/catalog.json').read_text())
SOURCES={s['slug']:s for s in CAT['sources']}
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
 u=ref['url'];name=u.split('/')[-1].replace('.md','').replace('_',' ')
 if name in ['overview','index']:name=u.split('/')[-2]+' / '+name
 return name
head='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AgentScope · 企业工作机制</title><style>
:root{--paper:#f3f1eb;--ink:#152b32;--muted:#546c73;--accent:#006d77;--line:#c1c9c6;--sand:#e9e4d9}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:18px/1.8 "PingFang SC",sans-serif}main{max-width:1120px;margin:auto;padding:48px 28px 100px}h1{font:700 54px/1.25 "Songti SC",serif;max-width:850px;margin:14px 0 24px}h2{font:700 36px/1.3 "Songti SC",serif;margin:0 0 12px}h3{font-size:25px;line-height:1.4;margin:0 0 14px}a{color:var(--accent);text-underline-offset:4px}.eyebrow{font-size:15px;letter-spacing:.14em;color:var(--muted)}.answer{font-size:24px;line-height:1.65}.chapter{margin-top:80px}.chapter-head{border-top:2px solid var(--ink);padding-top:24px}.chapter-no{font:16px Menlo,monospace;color:var(--accent)}.outline{display:grid;grid-template-columns:1fr 1fr;gap:0 35px;margin:35px 0}.outline a{border-top:1px solid var(--line);padding:14px 0;text-decoration:none;line-height:1.6}.outline b{display:block}.outline span{color:var(--muted);font-size:16px}.toolbar{display:flex;flex-wrap:wrap;gap:16px;align-items:center;margin:22px 0}button{font:inherit;background:none;border:1px solid var(--accent);padding:7px 14px;color:var(--accent);cursor:pointer}button:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #b85c39;outline-offset:4px}.module{margin:35px 0 55px;padding-left:30px;border-left:2px solid var(--line)}.principle{font-size:20px;margin:14px 0}.lead{color:var(--muted);font-size:17px}.mechanism{list-style:none;padding:0;margin:20px 0}.mechanism li{display:grid;grid-template-columns:240px 1fr;gap:20px;border-top:1px solid var(--line);padding:12px 0}.mechanism .name{font-weight:600}.mechanism .work{color:var(--muted)}.condition{background:var(--sand);padding:12px 18px;border-left:4px solid #b85c39;margin:20px 0}.detail{padding:18px 22px;background:#e4ece8;margin:20px 0}.detail summary{cursor:pointer;font-weight:550}.source{font-size:14px;margin-top:22px;color:var(--muted)}.source a{margin-right:15px;overflow-wrap:anywhere}nav.questions a{display:block;margin:10px 0}.glossary{font-size:16px;color:var(--muted);border-top:1px solid var(--line);padding-top:18px}.detail p{margin:14px 0;overflow-wrap:anywhere}.deep-mechanism{margin:24px 0;padding:18px 24px;border:1px solid var(--line)}.deep-mechanism h4{margin:0 0 14px;font-size:20px}.deep-mechanism dl{margin:0}.deep-mechanism dt{font-weight:650;margin-top:18px}.deep-mechanism dd{margin:4px 0 15px}.static-diagram{margin:28px 0;border-top:1px solid var(--line);padding-top:15px}.static-diagram svg{width:100%;height:auto;display:block}footer{margin-top:80px;border-top:2px solid var(--ink);padding-top:25px}.nojs-note{display:none}
@media(max-width:680px){main{padding:28px 20px 60px}h1{font-size:38px}h2{font-size:30px}.answer{font-size:21px}.outline{grid-template-columns:1fr}.module{padding-left:16px}.mechanism li{grid-template-columns:1fr;gap:2px}.chapter{margin-top:58px}.toolbar{gap:10px}}
@media print{main{max-width:none;padding:0}.toolbar,.video-link{display:none}.detail{display:block}.detail>p{display:block!important}.module{break-inside:avoid-page}a{color:inherit}.outline{grid-template-columns:1fr 1fr}h1{font-size:34px}}
</style></head><body><main><header><div class="eyebrow">AGENTSCOPE / ENTERPRISE</div><h1>从一次请求，到持续运行的企业工作</h1><p class="answer">AgentScope 将模型推理、工具执行与上下文，接到会话、权限、状态恢复和结果交付。</p><p class="lead">Python 2.0.10dev · Java Harness v2 / Service 2.1.0-BETA1</p><p class="video-link"><a href="film/index.html">观看讲解</a></p><p class="glossary">agent 负责推理与行动；tool 承担可执行动作；session 保持一次持续工作的身份；checkpoint 保存可继续的状态；artifact 是供应用读取的交付物。</p></header>'''
a=[head,'<nav class="outline" aria-label="章节目录">']
for no,(title,answer,lead) in CHAPTERS.items():a.append(f'<a href="#chapter-{no}"><b>{no} · {esc(title)}</b><span>{esc(answer)}</span></a>')
a+=['</nav>','<div class="toolbar"><button id="expand-all" type="button">展开来源定位</button><button id="collapse-all" type="button">收起来源定位</button><a href="#questions">按问题查阅</a></div>']
for no,(title,answer,lead) in CHAPTERS.items():
 a.append(f'<section class="chapter" id="chapter-{no}"><div class="chapter-head"><div class="chapter-no">{no}</div><h2>{esc(title)}</h2><p class="answer">{esc(answer)}</p><p class="lead">{esc(lead)}</p></div>')
 for s in [s for s in SCENES if s['chapter'][0]==no]:
  ps=s['essay'].split('\n\n');a.append(f'<article class="module" id="{esc(s["id"])}"><h3>{esc(s["title"])}</h3><p class="principle">{esc(ps[0])}</p><ul class="mechanism">')
  for it in s['items']:a.append(f'<li><span class="name">{esc(it["label"])}</span><span class="work">{esc(it["detail"])}</span></li>')
  a.append(f'</ul><p class="condition">{esc(s["pm"])}</p>')
  if len(ps)>1:a.extend('<p>'+esc(p)+'</p>' for p in ps[1:])
  if s['id'] in DEPTH:
   note=DEPTH[s['id']];a.append('<div class="deep-mechanism"><h4>机制与条件</h4><dl>')
   for key,title in [('why','为什么需要'),('how','怎样工作'),('default','当前默认与前提'),('failure','失败与恢复')]:a.append('<dt>'+title+'</dt><dd>'+esc(note[key])+'</dd>')
   a.append('</dl><p class="source">'+''.join('<a href="'+esc(SOURCES[sid]['url'])+'">'+esc(SOURCES[sid]['title'])+'</a>' for sid in note['refs'])+'</p></div>')
  a.append('<details class="detail"><summary>来源定位</summary>'+''.join('<p><a href="'+esc(e['url'])+'">'+esc(source_title(e))+'</a>'+(' · '+esc(e['version']) if e.get('version') else '')+'</p>' for e in s['evidence'])+'</details>')
  a.append('<p class="source">'+''.join(f'<a href="{esc(e["url"])}">{esc(source_title(e))}</a>' for e in s['evidence'])+'</p></article>')
 a.append('</section>')
a.append('<footer id="questions"><h2>常见追问</h2><nav class="questions" aria-label="按问题查阅">')
a+=['<a href="#'+sid+'">'+esc(q)+'</a>' for q,sid in QUESTIONS]
a+=['</nav></footer></main><script>const ds=[...document.querySelectorAll("details.detail")];document.getElementById("expand-all").onclick=()=>ds.forEach(d=>d.open=true);document.getElementById("collapse-all").onclick=()=>ds.forEach(d=>d.open=false);let openBeforePrint=[];addEventListener("beforeprint",()=>{openBeforePrint=ds.map(d=>d.open);ds.forEach(d=>d.open=true)});addEventListener("afterprint",()=>ds.forEach((d,i)=>d.open=openBeforePrint[i]));</script></body></html>']
(R/'reading-v2.html').write_text('\n'.join(a))
print(len(SCENES),'modules; six chapter answers; twelve query routes')
