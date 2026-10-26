"""One-time research ingestion from three bounded handoff packages (not a crawler)."""
import json,hashlib,re,shutil,sys
from pathlib import Path
R=Path(sys.argv[1]);B='agentscope-enterprise-20261012';P=R/'vault/provenance'/B;D=R/'vault/distilled'/B;V=R/'vault/snapshots'/B
for p in [P,P/'cards',D,V]:p.mkdir(parents=True,exist_ok=True)
records={};aliases={};handoffs=[]
for group in ['docs','mechanics','runtime']:
 root=Path('/tmp/praxis-scope-'+group); data=json.loads((root/'sources.json').read_text());arr=data.get('sources',data.get('records',[])) if isinstance(data,dict) else data
 reg=set()
 expanded=[]
 for record in arr:
  if ';' in record.get('local',''):
   for f in record['local'].split('; '):
    item=dict(record,local=f)
    name=Path(f).name
    path=name[len('agentscope-'):-len('-e4c1e074')].replace('__','/')
    item['url']='https://raw.githubusercontent.com/agentscope-ai/agentscope/e4c1e074dee3f0f6cca28ca29e934c4ec0605354/'+path
    expanded.append(item)
  else:expanded.append(record)
 for s in expanded:
  loc=s.get('local_file',s.get('local_path',s.get('local')));src=Path(loc);src=src if src.is_absolute() else root/src;reg.add(src.resolve())
  url=s.get('canonical_url',s['url']);key=hashlib.sha256(url.encode()).hexdigest()[:12];slug='as-'+key
  if url not in records:
   dst=V/(slug+'-'+src.name.replace(' ','-')+'.txt');shutil.copyfile(src,dst)
   limits=s.get('limits',['静态文档与选定源码读取；不代表运行或完整审计。']);limits='；'.join(limits) if isinstance(limits,list) else str(limits)
   support=s.get('supports',s.get('purpose','选定源码原件'));support='；'.join(support) if isinstance(support,list) else str(support)
   records[url]=dict(slug=slug,intake_id=B+':'+slug,url=url,original_url=s['url'],title=src.name,official=True,status='partial' if 'source' in str(s.get('kind',s.get('category',''))) else s.get('status','partial'),accessed_at='2026-10-12',summary_zh='官方材料，用于 '+support,supported_claims=[dict(claim_id=slug,locator='；'.join(s.get('locations',[])) or '选定原件；局部阅读范围见主题交接',claim=support)],limits=limits,revisit_trigger='项目版本、接口、归档状态或部署范围变化时重访。',purpose_tags=['BUILD','GRAMMAR'],snapshot_path=dst.relative_to(R).as_posix(),snapshot_sha256=hashlib.sha256(dst.read_bytes()).hexdigest(),card_path=(P/'cards'/(slug+'.md')).relative_to(R).as_posix(),version=s.get('fixed_ref',s.get('commit',data.get('source_commit') if isinstance(data,dict) else None)),capture_group=group)
  aliases[src.name]=records[url];aliases[group+':'+str(src.relative_to(root))]=records[url]
 # Runtime handoff additionally uses fixed-main source files not individually listed in its source ledger.
 if group=='runtime':
  for src in (root/'raw').glob('agentscope-src__*-e4c1e074'):
   if src.resolve() in reg:continue
   rel=src.name[len('agentscope-'):-len('-e4c1e074')].replace('__','/');url='https://raw.githubusercontent.com/agentscope-ai/agentscope/e4c1e074dee3f0f6cca28ca29e934c4ec0605354/'+rel
   if url not in records:
    slug='as-'+hashlib.sha256(url.encode()).hexdigest()[:12];dst=V/(slug+'-'+src.name+'.txt');shutil.copyfile(src,dst)
    records[url]=dict(slug=slug,intake_id=B+':'+slug,url=url,original_url=url,title=rel,official=True,status='partial',accessed_at='2026-10-12',summary_zh='固定主项目源码；用于当前服务装配、资源、会话和执行机制。',supported_claims=[dict(claim_id=slug,locator=rel+'；局部行号见 Runtime 交接',claim='当前 2.0 服务和工作区的静态实现')],limits='来源 URL 按研究包固定提交文件命名恢复；包中未逐条登记，交接仅覆盖选定局部；不代表运行验证。',revisit_trigger='2.0服务结构或版本变化。',purpose_tags=['BUILD'],snapshot_path=dst.relative_to(R).as_posix(),snapshot_sha256=hashlib.sha256(dst.read_bytes()).hexdigest(),card_path=(P/'cards'/(slug+'.md')).relative_to(R).as_posix(),version='e4c1e074dee3f0f6cca28ca29e934c4ec0605354',capture_group=group)
    aliases[src.name]=records[url]
 # Keep authored handoffs separate from immutable source bodies.
 dest=D/(group+'-handoff.md');content=(root/'handoff.md').read_text();content=re.sub(r'\[([^\]]+)\]\((?!https?://)[^)]+\)',r'\1',content);dest.write_text(content)
 (D/(group+'-capture-ledger.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2))
 handoffs.append(dest.name)
for s in records.values():
 card=R/s['card_path'];snap=Path(s['snapshot_path']);rel='../../../snapshots/'+B+'/'+snap.name
 card.write_text(f"# {s['title']}\n\n来源 ID：`{s['slug']}`；读取日：2026-10-12；证据状态：`{s['status']}`。\n\n[官方来源]({s['url']}) · [原件]({rel})\n\n{s['summary_zh']}\n\n局部定位：{s['supported_claims'][0]['locator']}。\n\n边界：{s['limits']}\n\n重访：{s['revisit_trigger']}\n")
cat=dict(schema_version='1.0',cards='generated',generator='scripts/render_source_cards.py',catalog_id='AgentScope 企业线 · 2026-10-12',origin='direct-research',as_of='2026-10-12',intake_path='vault/intake/'+B+'.json',distilled_path='vault/distilled/'+B+'/README.md',sources=list(records.values()),occurrences=[])
(P/'catalog.json').write_text(json.dumps(cat,ensure_ascii=False,indent=2)+'\n')
(P/'README.md').write_text('# AgentScope 企业线来源\n\n逐 URL 的身份、读取范围、版本与 hash 见 [catalog.json](catalog.json)，摘要见 [cards](cards/README.md)。来源原件与探索者解释分开保存。主项目源码锁定 e4c1e074；旧 Runtime/Studio 只用于迁移对照。\n\n[主题研究](../../distilled/'+B+'/README.md) · [知识片](../../../demos/agentscope-enterprise-film/README.md)\n')
(P/'cards/README.md').write_text('# 逐源卡\n\n'+''.join(f"- [{s['slug']} · {s['title']}]({s['slug']}.md)\n" for s in records.values()))
(V/'README.md').write_text('# 公开文档与选定源码快照\n\n保存已登记原件的字节内容，文件名以来源 ID 开始。来源和 SHA-256 见 [catalog](../../provenance/'+B+'/catalog.json)。源码只作研究数据，不执行。正文、依赖、图片和产品服务的完整离线运行并未快照。\n')
(D/'README.md').write_text('# AgentScope 企业线研究\n\n本批用文档系统反推职责，再用固定提交源码核对局部机制。主线区分 Python 2.0、Java Harness v2 与 Java Service 2.1.0-BETA1；旧 Runtime/Studio 已进入迁移线。\n\n'+''.join(f'- [{f}]({f})\n' for f in handoffs)+'\n- [关键裁决](adjudication.md)\n\n[逐源登记](../../provenance/'+B+'/README.md) · [消费知识片](../../../demos/agentscope-enterprise-film/README.md)\n\n边界：研究只覆盖公开文档和选定静态源码。Java 默认恢复机制的文档存在 EVENT_LOG 与旧 AgentStateStore 叙述冲突，未把冲突默认值写入成片。文档内嵌 OpenAPI 局部版本漂移单独保留，不用于推断当前 router。商业版、SLA、目标项目的运行表现和受众理解均未验证。\n')
shutil.copyfile('/tmp/praxis-scope-adjudication/verdict.md',D/'adjudication.md')
(R/'vault/intake'/f'{B}.json').write_text(json.dumps(dict(schema_version='1.0',id=B,date='2026-10-12',kind='direct-public-research',coverage=dict(source_records=len(records),python_source_commit='e4c1e074dee3f0f6cca28ca29e934c4ec0605354',no_conversation_ingestion=True),provenance_path=f'vault/provenance/{B}/catalog.json',distilled_path=f'vault/distilled/{B}/README.md',roles=['main: inclusion and production','gpt-5.6-luna: three bounded explorers','gpt-6-astra: critical adjudication','inherited main model: pipeline worker']),ensure_ascii=False,indent=2)+'\n')
# Portable projection for scene compiler. Names are traceable to the canonical ledger.
M={n:dict(id=s['slug'],url=s['url'],snapshot=s['snapshot_path'],version=s['version']) for n,s in aliases.items()}
Path('/tmp/praxis-agentscope-film/script/source-map.json').write_text(json.dumps(M,ensure_ascii=False,indent=2))
print('source URLs',len(records),'aliases',len(M))

# Cards follow the repository canonical generator, rather than the one-time import template.
import subprocess
subprocess.run([sys.executable,str(R/"scripts/render_source_cards.py"),"--root",str(R)],check=True)
