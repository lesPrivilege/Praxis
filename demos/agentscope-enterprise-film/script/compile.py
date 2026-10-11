"""Author script → reading-paced screen storyboard, deterministic stage and reading companion."""
import json,re,math,html
from pathlib import Path
from story import SCENES,FINAL
R=Path(__file__).resolve().parents[1];M=json.loads((R/'script/source-map.json').read_text());scenes=SCENES+json.loads((R/'script/java-scenes.json').read_text())+json.loads((R/'script/java-more.json').read_text())+FINAL
count=lambda s:len(re.findall(r'[一-鿿A-Za-z0-9]',s))
for s in scenes:
 s['chapter'][1]=s['chapter'][1].replace('Java企业接入','Java 企业接入')
 s['dark']=s.get('dark',False)
 if s['id'] in ['events','compression']:s['kind']='rows'
 if s['id']=='events':s['lead']='不同事件按身份更新同一回复'
 if s['id']=='scheduling':
  s['lead']='并发安全属性控制一批调用的执行顺序';s['items'][1]={'label':'依赖步骤','detail':'先取得前一步结果，再发起后一步。'}
  s['essay']+=' 生成文件再发布文件的先后关系，由编排或后续推理轮表达。调度器不自动推断业务依赖。'
 if s['id']=='react':s['items'][1]['detail']='发送上下文；无工具请求时形成答复。'
 if s['id']=='pipeline':s['items'][2]['detail']='返回 pass、fail 或 impossible。';s['items'][3]['detail']='未通过且预算允许时继续。'
 if s['id']=='lanes':s['essay']=s['essay'].split('Python 本片局部机制')[0]+'Python 2.0 的主项目提供 Agent 与托管服务。Java Harness 与 Java Service 分别维护应用侧和平台侧的契约。'

 if s['id']=='migration':s['kind']='merge'
 if s['id']=='permission':s['kind']='branch';s['items']=s['items'][:3]
 if s['id']=='java-budget':
  s['items'][1]['detail']='限制模型调用次数或累计用量。';s['pm']='已启动的并行调用不会被额度强行截断。'
 s['evidence']=[]
 for ref in s['refs']:
  if ref not in M:raise ValueError('Missing source '+ref)
  s['evidence'].append(M[ref])
 s['sourceLine']=s.get('scope','java.agentscope.io · Harness v2 / Service 2.1.0-BETA1') if s['chapter'][0]=='05' else ('官方仓库 README · Runtime / Studio' if s['id']=='migration' else 'docs.agentscope.io · AgentScope 2.0')
 events=[dict(at=0,duration=1)];t=max(4.5,count(s['title'])/4.7+1)
 s['leadAt']=round(t,2);events.append(dict(at=s['leadAt'],duration=.85));t+=max(3.4,count(s['lead'])/4.7+1)
 if s['kind']=='branch':s['centerAt']=round(t,2);events.append(dict(at=s['centerAt'],duration=.85));t+=4
 for it in s['items']:
  bundle=count(it['label'])+count(it['detail'])+2
  it['labelAt']=round(t,2);events.append(dict(at=it['labelAt'],duration=.85))
  if bundle<=34:
   it['detailAt']=it['labelAt'];t+=max(4.8,bundle/5.0+1.4)
  else:
   t+=max(3.1,(count(it['label'])+2)/5.0+1)
   it['detailAt']=round(t,2);events.append(dict(at=it['detailAt'],duration=.85));t+=max(3.6,count(it['detail'])/5.0+1.1)
 s['pmAt']=round(t,2);events.append(dict(at=s['pmAt'],duration=.85));t+=max(6,count(s['pm'])/4.5+2)
 s['dur']=math.ceil(t);s['events']=events
beats=dict(schema_version='1.0',scenes=scenes)
(R/'script/beats.json').write_text(json.dumps(beats,ensure_ascii=False,indent=2)+'\n')
(R/'film/scenes.js').write_text('window.STORY='+json.dumps(beats,ensure_ascii=False)+';\n'+(R/'script/stage-template.js').read_text())
md=['# AgentScope 企业线：从运行机制到业务交付','','[影片舞台](film/index.html) · [分镜与时间](script/beats.json)','','AgentScope 把 Agent 的推理、工具、上下文与权限，接到持续运行的会话、工作区、事件与服务。Python 和 Java 提供各自的实现路径。下面按文档系统对应的问题逐层展开。','']
ht=['<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AgentScope 企业线 · 机制阅读稿</title><style>body{margin:0;background:#f3f1eb;color:#152b32;font:18px/1.8 "PingFang SC",sans-serif}main{max-width:980px;margin:auto;padding:36px 24px 80px}a{color:#006d77}h1{font:700 44px/1.25 "Songti SC",serif}h2{margin-top:68px;font-size:29px}h3{font-size:22px}p{margin:15px 0}details{background:#e4ece8;padding:15px 20px}summary{cursor:pointer}table{border-collapse:collapse;width:100%;margin:20px 0}th,td{padding:11px 14px;border-bottom:1px solid #bec9c6;text-align:left;vertical-align:top}th{width:28%;font-weight:600}nav a{display:block}.source-ref{font-size:14px;color:#546c73}.pm-reading{border-left:4px solid #b85c39;padding:9px 15px;background:#e9e4d9}article{break-inside:avoid-page}@media(max-width:600px){main{padding:22px 18px}h1{font-size:34px}th,td{padding:8px}th{width:35%}}@media print{details{display:none}main{max-width:none}a{color:inherit}}</style><main><h1>AgentScope 企业线</h1><p>从运行机制到业务交付</p><p><a href="film/index.html">观看讲解</a></p><details><summary>章节目录</summary><nav>']
for i,s in enumerate(scenes):ht.append(f'<a href="#{s["id"]}">{i+1:02d} · {html.escape(s["title"])}</a>')
ht.append('</nav></details>');last=None
for i,s in enumerate(scenes):
 if s['chapter']!=last:md+=['## '+ ' · '.join(s['chapter']),''];last=s['chapter']
 md+=['### '+str(i+1).zfill(2)+' · '+s['title'],'',s['essay'],'','| 局部 | 实现与作用 |','|---|---|']
 for it in s['items']:md.append('| '+it['label'].replace('|','｜')+' | '+it['detail']+' |')
 refs=' · '.join(f'[{e["id"]}]({e["url"]})' for e in s['evidence']);md+=['',s['pm'],'','依据：'+refs,'']
 ht.append(f'<article id="{s["id"]}"><h2>{i+1:02d} · {html.escape(s["title"])}</h2>')
 ht.extend('<p>'+html.escape(p)+'</p>' for p in s['essay'].split('\n\n'))
 ht.append('<table><tbody>');ht.extend('<tr><th scope="row">'+html.escape(it['label'])+'</th><td>'+html.escape(it['detail'])+'</td></tr>' for it in s['items']);ht.append('</tbody></table>')
 ht.append('<p class="pm-reading">'+html.escape(s['pm'])+'</p><p class="source-ref">'+ ' · '.join(f'<a href="{html.escape(e["url"])}">{e["id"]}</a>' for e in s['evidence'])+'</p></article>')
ht.append('</main></html>');(R/'reading.md').write_text('\n'.join(md));(R/'reading.html').write_text('\n'.join(ht))
# Meaningful implementation locators, separate from the screen argument.
lines=['# 主张与来源映射','','| 场 | 认知任务 | 对象与变换 | 证据 |','|---|---|---|---|']
for s in scenes:lines.append('| '+s['id']+' | '+s['title']+' | '+s['kind']+'；依次揭示 '+ ' → '.join(i['label'] for i in s['items'])+' | '+ '、'.join(e['id'] for e in s['evidence'])+' |')
lines+=['','详尽原稿在 [reading.md](../reading.md)；固定源码局部定位在 [机制研究](../../../vault/distilled/agentscope-enterprise-20261012/mechanics-handoff.md)。','']
(R/'script/storyboard.md').write_text('\n'.join(lines))
print(len(scenes),'scenes',sum(s['dur'] for s in scenes),'seconds',sum(count(s['essay']) for s in scenes),'companion characters')
