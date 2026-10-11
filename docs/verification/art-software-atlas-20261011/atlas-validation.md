# 图谱生成与验证复现

## 2026-10-11

交付按授权仅包含 Markdown/JSON 与小型原创图像；以下原始代码作为可复制的检查说明，不安装依赖、不访问网络、不启用 CI。应在仓库根目录执行。索引是静态投影，生成不会重写旧百科或旧来源卡。修改来源/实体/叶子后先检查映射 G，再重建本批 index 和既有 registry。

## 生成本批交叉索引

保存下面代码到 /tmp 并从仓库根运行；它写本批 index.json。

```python
import json
from pathlib import Path
R=Path.cwd();B=R/'vault/provenance/art-software-atlas'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
G=[
('ASA-G-ANDEAN-WOVEN-GARMENTS','composition/material-relations.md','经纬、服饰与结构约束',['weave-topology','retain-boundary'],'material',list(range(1,4))),
('ASA-G-ISLAMIC-GEOMETRIC-SURFACES','composition/material-relations.md','几何表面与竞争建构解释',['construct-repeat','retain-joint'],'material',list(range(4,8))),
('ASA-G-ISOTYPE-QUANTITY','composition/editorial-translations.md','符号重复与明确计量',['repeat-unit','retain-denominator'],'editorial',list(range(1,6))),
('ASA-G-JAPANESE-COMPOSITION','composition/editorial-translations.md','书写方向、标点与注音关联',['preserve-reading-order','attach-ruby'],'editorial',list(range(6,13))),
('ASA-G-TURRELL-SKYSPACE','composition/spatial-materials.md','天空、光与观看条件',['frame-aperture','modulate-light'],'spatial',list(range(1,5))),
('ASA-G-ANDO-CHURCH-OF-THE-LIGHT','composition/spatial-materials.md','开口、材料与空间序列',['frame-aperture','retain-material-context'],'spatial',list(range(5,12))),
('ASA-G-OPEN-SCORE','motion/score-and-time.md','开放谱与演出自主权',['schedule-event','preserve-performer-choice'],'temporal',[1,2,7,8,9,10]),
('ASA-G-RULE-SYSTEMS','motion/rule-systems.md','规则、扰动与选择',['perturb-rule','seed-reproduce'],'temporal',[3,4,5,6,9]),
('ASA-G-EXTENT','interaction/extent-selection.md','范围、选集与上下文',['select-extent','retain-context'],'discovery',[5,6]),
('ASA-G-DISCOVERY','references/discovery-relay.md','集合到作品与实现的证据接力',['trace-provenance','compare-mechanisms'],'discovery',[1,2,3,4]),
('ASA-G-AGENT-DESIGN-SYSTEM-CONTRACT','references/agent-design-resources.md','设计系统包的语义约束',['package-constraints','map-tokens'],'ecosystem',[1,2,3,6,9,10]),
('ASA-G-AGENT-COMPONENT-RETRIEVAL','references/agent-design-resources.md','组件检索与权限明确的调用',['retrieve-component','separate-read-write'],'ecosystem',[2,4,5,8,9,10])]
paths={}
for gid,rel,*_ in G:paths.setdefault('kit/design/'+rel,[]).append(gid)
# Build a typed projection over existing source catalog shape, without altering old schemas.
prefix={'material':'M','editorial':'E','spatial':'S','temporal':'T','discovery':'R','ecosystem':'A'}
source_rows=[];entities=[];relations=[];reused=[]
for p in sorted(B.glob('*/catalog.json')):
 d=read(p)
 for s in d['sources']:source_rows.append({**s,'kind':'source-record','catalog_path':p.relative_to(R).as_posix()})
 for s in d.get('reused_sources',[]):
  reused.append({'id':s.get('id',s.get('source_id')),'kind':'source-record','url':s['url'],'card_path':s['card_path'],'grammar_paths':s['grammar_paths'],'limits':s['limits']})
for p in sorted(B.glob('*/entities.json')):
 d=read(p);entities+=d['entities'];relations+=d['relations']
byid={s['id']:s for s in source_rows};grammar=[]
for gid,rel,title,ops,stream,nums in G:
 sids=[f'ASA-{prefix[stream]}-{n:02d}' for n in nums if f'ASA-{prefix[stream]}-{n:02d}' in byid]
 path='kit/design/'+rel
 grammar.append({'id':gid,'kind':'derived-grammar','title':title,'path':path,'level':'L2','section':gid.lower(),'reference_priority':'normal','adoption':'reference','operations':ops,'source_ids':sids,'evidence_modalities':sorted({m for sid in sids for m in byid[sid]['evidence_modality']}),'implementation_maturity':'reference-proposal; execution only where a separate receipt explicitly says so'})
 for sid in sids:relations.append({'from':sid,'type':'informs','to':gid,'basis':'derived','limits':'来源支持的主张范围见原卡；本仓库软件转译不是原作者主张。'})
# Record reuse edges without modifying previous source cards or generated indexes.
for s in reused:
 for p in s['grammar_paths']:
  for gid in paths[p]:relations.append({'from':s['id'],'type':'informs','to':gid,'basis':'reused-reference','limits':s['limits']})
# Remove identical typed edges, keep the exact recorded rationale of the first.
unique={}
for e in relations:unique.setdefault((e['from'],e['type'],e['to']),e)
index={'schema_version':'1.0','scope':'Bounded art/software atlas; source catalogs and Kit entries remain canonical; existing sources reused by identity.','levels':{'L0':'task route','L1':'selection abstract','L2':'deep grammar','L3':'source and rights evidence','L4':'verification and history'},'facet_definitions':read(R/'vault/provenance/design-writing-encyclopedia/index.json')['facet_definitions'],'grammar':grammar,'sources':source_rows,'reused_sources':reused,'entities':entities,'relations':list(unique.values()),'redirects':[]}
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
 for dim,f in s.get('facets',{}).items():
  if f['state']!='known' and f['values']:errors.append(s['id']+' nonknown values')
  if not f['evidence'] or set(f['evidence'])-known:errors.append(s['id']+' unresolved facet evidence')
 for p in s['grammar_paths']:
  if os_rel(R/p,(R/s['card_path']).parent) not in body:errors.append(s['id']+' missing grammar backlink')
  if os_rel(R/s['card_path'],(R/p).parent) not in (R/p).read_text():errors.append(s['id']+' missing direct card link in grammar')
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
result={'status':'fail' if errors else 'pass','schema_draft':'2020-12','source_count':len(d['sources']),'reused_sources':len(d['reused_sources']),'deep_entries':len(d['grammar']),'entity_count':len(d['entities']),'relation_count':len(d['relations']),'claim_count':len(claims),'checks':['schema shape','unique source/entity/grammar/claim IDs','typed edge directions','external-key resolution','source-card identity','grammar/source reciprocal links','source canonical URL uniqueness against all provenance catalogs','local Markdown file links','new directory READMEs','grammar ID existence'],'errors':errors}
print(json.dumps(result,ensure_ascii=False,indent=2));Path('/tmp/praxis-atlas-schema-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
sys.exit(bool(errors))
```
