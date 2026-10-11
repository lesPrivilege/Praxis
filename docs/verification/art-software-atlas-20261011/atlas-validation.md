# 图谱生成与验证复现

## 当前复现入口

运行 `python3 scripts/atlas_index.py --check`；修改叶子登记后先运行 `python3 scripts/build_registry.py` 同步身份，再运行 `python3 scripts/atlas_index.py --build` 与仓库验证。查询用法见 [分面查询](../../../vault/provenance/art-software-atlas/facets.md)。脚本是当前实现的唯一维护位置；下方代码保留初次交付及本地修订时的复现证据，不再同步维护。

## 2026-10-11

交付按授权仅包含 Markdown/JSON 与小型原创图像；以下原始代码作为可复制的检查说明，不安装依赖、不访问网络、不启用 CI。应在仓库根目录执行。索引是静态投影，生成不会重写旧百科或旧来源卡。修改来源、实体或 grammar.json 的叶子登记后，重建本批 index 和既有 registry。grammar 元数据不再藏在生成器的硬编码表中。

## 生成本批交叉索引

保存下面代码到 /tmp 并从仓库根运行；它写本批 index.json。

```python
import json
from pathlib import Path
R=Path.cwd();B=R/'vault/provenance/art-software-atlas'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
source_rows=[];entities=[];relations=[];reused=[]
for p in sorted(B.glob('*/catalog.json')):
 d=read(p)
 for s in d['sources']:source_rows.append({**s,'kind':'source-record','catalog_path':p.relative_to(R).as_posix()})
 for s in d.get('reused_sources',[]):reused.append({'id':s.get('id',s.get('source_id')),'kind':'source-record','url':s['url'],'card_path':s['card_path'],'grammar_paths':s['grammar_paths'],'limits':s['limits']})
for p in sorted(B.glob('*/entities.json')):
 d=read(p);entities+=d['entities'];relations+=d['relations']
byid={s['id']:s for s in source_rows};grammar=[];paths={}
for row in read(B/'grammar.json')['grammar']:
 g={**row,'facets':dict(row['facets'])}
 g['evidence_modalities']=sorted({m for sid in g['source_ids'] for m in byid[sid]['evidence_modality']})
 g['facets']['operation']={'values':g['operations'],'state':'known','basis':'inferred','evidence':[g['id']],'rationale':'由本库 grammar.operations 单点投影；这是本库操作命名，不声称原作者使用相同分类。'}
 grammar.append(g);paths.setdefault(g['path'],[]).append(g['id'])
 for sid in g['source_ids']:relations.append({'from':sid,'type':'informs','to':g['id'],'basis':'derived','limits':'来源支持的主张范围见原卡；本仓库软件转译不是原作者主张。'})
for s in reused:
 for p in s['grammar_paths']:
  for gid in paths[p]:relations.append({'from':s['id'],'type':'informs','to':gid,'basis':'reused-reference','limits':s['limits']})
unique={}
for e in relations:unique.setdefault((e['from'],e['type'],e['to']),e)
defs=read(R/'vault/provenance/design-writing-encyclopedia/index.json')['facet_definitions']
# A generated ID-only posting list. Classification values/rationale are edited only at their owner.
facet_index={}
for dim in defs:
 post={'values':{},'states':{s:[] for s in ['known','unknown','not-applicable','unreviewed']}}
 for n in source_rows+reused+entities+grammar:
  f=n.get('facets',{}).get(dim);state=f['state'] if f else 'unreviewed'
  post['states'][state].append(n['id'])
  if state=='known':
   for value in f['values']:post['values'].setdefault(value,[]).append(n['id'])
 for k in post['values']:post['values'][k].sort()
 for k in post['states']:post['states'][k].sort()
 post['values']=dict(sorted(post['values'].items()));facet_index[dim]=post
index={'schema_version':'1.1','scope':'Bounded art/software atlas; source/entity/grammar registrations remain canonical; existing sources reused by identity.','levels':{'L0':'task route','L1':'selection abstract','L2':'deep grammar','L3':'source and rights evidence','L4':'verification and history'},'facet_definitions':defs,'grammar':grammar,'sources':source_rows,'reused_sources':reused,'entities':entities,'relations':list(unique.values()),'redirects':[],'facet_index':facet_index}
write(B/'index.json',index)
print(json.dumps({k:len(index[k]) for k in ['grammar','sources','reused_sources','entities','relations']}))
```

## 只读校验

使用环境已有 jsonschema；无依赖时报告缺失，不自动安装。保存到 /tmp 后从仓库根执行；结果写临时 JSON，不改来源。类型约束定义 docs→entity、substrate→grammar，不接受反方向。

```python
import json,re,sys,hashlib,os
def os_rel(p,base):return os.path.relpath(p,base)
from pathlib import Path
from urllib.parse import urlsplit,urlunsplit,unquote
from collections import Counter
import jsonschema
R=Path.cwd();B=R/'vault/provenance/art-software-atlas'
schema=json.loads((B/'schema.json').read_text())
d=json.loads((B/'index.json').read_text());errors=[]
for e in jsonschema.Draft202012Validator(schema,format_checker=jsonschema.FormatChecker()).iter_errors(d):errors.append('schema '+str(list(e.path))+': '+e.message)
nodes=d['sources']+d['reused_sources']+d['entities']+d['grammar'];ids={n['id']:n for n in nodes};counts=Counter(n['id'] for n in nodes)
errors +=['duplicate ID '+k for k,v in counts.items() if v>1]
claims=[c['claim_id'] for s in d['sources'] for c in s['supported_claims']];known=set(ids)|set(claims)
errors +=['duplicate claim '+k for k,v in Counter(claims).items() if v>1]
for n in nodes:
 for sid in n.get('source_ids',[]):
  if sid not in ids or ids[sid]['kind']!='source-record':errors.append(n['id']+' invalid source '+sid)
 for key in ['card_path','history_record','path']:
  if n.get(key) and not (R/n[key]).is_file():errors.append(n['id']+' missing '+key)
 for p in n.get('grammar_paths',[]):
  if not (R/p).is_file():errors.append(n['id']+' missing grammar '+p)
for s in d['sources']:
 body=(R/s['card_path']).read_text()
 if s['url'] not in body or s['id'] not in body:errors.append(s['id']+' missing identity in card')
 for p in s['grammar_paths']:
  if os_rel(R/p,(R/s['card_path']).parent) not in body:errors.append(s['id']+' missing grammar backlink')
  if os_rel(R/s['card_path'],(R/p).parent) not in (R/p).read_text():errors.append(s['id']+' missing direct card link in grammar')

# Classification is validated at its owning level, not only on source records.
for n in nodes:
 for dim,f in n.get('facets',{}).items():
  if (f['state']=='known') != bool(f['values']):errors.append(n['id']+' invalid state/value '+dim)
  if not f['evidence'] or set(f['evidence'])-known:errors.append(n['id']+' unresolved facet evidence '+dim)
  owner_dims={'source-record':{'industry_author','language'},'derived-grammar':{'industry_applicability','task','artifact','operation','language'}}.get(n['kind'],{'artifact','style_lineage','stack_runtime'})
  if dim in owner_dims and not f.get('rationale'):errors.append(n['id']+' missing facet rationale '+dim)
# Projections cannot become a second editing authority.
for p in sorted(B.glob('*/catalog.json')):
 for n in json.loads(p.read_text())['sources']:
  actual={k:v for k,v in ids[n['id']].items() if k not in ['kind','catalog_path']}
  if actual!=n:errors.append('source projection drift '+n['id'])
for p in sorted(B.glob('*/entities.json')):
 for n in json.loads(p.read_text())['entities']:
  if ids[n['id']]!=n:errors.append('entity projection drift '+n['id'])
for n in json.loads((B/'grammar.json').read_text())['grammar']:
 actual=dict(ids[n['id']]);actual.pop('evidence_modalities');actual['facets']=dict(actual['facets']);op=actual['facets'].pop('operation')
 if actual!=n:errors.append('grammar projection drift '+n['id'])
 if op['values']!=n['operations']:errors.append('operation projection drift '+n['id'])
# Every facet has an exact inverted projection, including distinct absent/unreviewed state.
for dim in d['facet_definitions']:
 expected={'values':{},'states':{state:[] for state in ['known','unknown','not-applicable','unreviewed']}}
 for n in nodes:
  f=n.get('facets',{}).get(dim);state=f['state'] if f else 'unreviewed'
  if state not in expected['states']:continue # Schema already reports invalid states.
  expected['states'][state].append(n['id'])
  if state=='known':
   for val in f['values']:expected['values'].setdefault(val,[]).append(n['id'])
 for members in list(expected['states'].values())+list(expected['values'].values()):members.sort()
 if d['facet_index'].get(dim)!=expected:errors.append('facet posting drift '+dim)

for g in d['grammar']:
 if g['id'] not in (R/g['path']).read_text():errors.append(g['id']+' absent in grammar body')
allowed={'documents':({'source-record'},{'discovery-corpus','exemplar','implementation-substrate'}),'contains':({'discovery-corpus'},{'exemplar','implementation-substrate','discovery-corpus'}),'implements':({'implementation-substrate'},{'derived-grammar'}),'informs':({'source-record','exemplar','implementation-substrate','discovery-corpus'},{'derived-grammar','implementation-substrate'}),'contrasts':({'derived-grammar','exemplar'},{'derived-grammar','exemplar'}),'discovered-via':({'source-record','exemplar','implementation-substrate'},{'discovery-corpus'})}
for e in d['relations']:
 if e['from'] not in ids or e['to'] not in ids:errors.append('unresolved edge '+str(e));continue
 a,b=ids[e['from']]['kind'],ids[e['to']]['kind'];aa,bb=allowed[e['type']]
 if a not in aa or b not in bb:errors.append(f'edge kind {e["from"]} {e["type"]} {e["to"]}: {a}->{b}')
# New source URL identity against all existing catalogs, ignoring fragment for document duplicates.
def canon(u):
 q=urlsplit(u);return urlunsplit((q.scheme.lower(),q.netloc.lower(),q.path.rstrip('/'),q.query,''))
allurls={}
for p in (R/'vault/provenance').rglob('catalog.json'):
 for s in json.loads(p.read_text())['sources']:allurls.setdefault(canon(s['url']),[]).append((str(p.relative_to(R)),s.get('id',s['slug'])))
for s in d['sources']:
 if len(allurls[canon(s['url'])])>1:errors.append('duplicate canonical '+s['id']+': '+str(allurls[canon(s['url'])]))
# Every new directory and all local Markdown path links; anchors checked for stable grammar sections separately.
paths=list(B.rglob('*.md'))+list((R/'docs/verification/art-software-atlas-20261011').rglob('*.md'))+[R/g['path'] for g in d['grammar']]
for path in set(paths):
 for t in re.findall(r'\[[^\]]*\]\(([^\n]+?)\)',path.read_text()):
  if urlsplit(t).scheme or t.startswith('#'):continue
  target=(path.parent/unquote(t.split('#')[0])).resolve()
  if not target.exists():errors.append(str(path.relative_to(R))+' broken '+t)
for directory in [B,*[p for p in B.rglob('*') if p.is_dir()]]:
 if not (directory/'README.md').is_file():errors.append('missing README '+str(directory.relative_to(R)))
# Reject private acquisition/traces in newly added files by scope; no transcripts sourced.
result={'status':'fail' if errors else 'pass','schema_draft':'2020-12','source_count':len(d['sources']),'reused_sources':len(d['reused_sources']),'deep_entries':len(d['grammar']),'entity_count':len(d['entities']),'relation_count':len(d['relations']),'claim_count':len(claims),'checks':['schema shape','unique source/entity/grammar/claim IDs','typed edge directions','external-key resolution','source-card identity','grammar/source reciprocal links','source canonical URL uniqueness against all provenance catalogs','local Markdown file links','new directory READMEs','grammar ID existence','facet evidence at every owner','canonical source/entity/grammar projection equality','operation single-authority projection','exact inverse facet postings including unreviewed'],'errors':errors}
print(json.dumps(result,ensure_ascii=False,indent=2));Path('/tmp/praxis-atlas-schema-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
sys.exit(bool(errors))
```
