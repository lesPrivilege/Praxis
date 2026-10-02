from pathlib import Path
import re, subprocess, json, html, shutil, argparse
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description='Rebuild the offline SaaS book from editable chapters')
parser.add_argument('--output',type=Path,help='Output directory; defaults to deliverable/SaaS_Book_Manuscript_v1_zh')
args=parser.parse_args()
OUT=args.output.resolve() if args.output else ROOT/'deliverable'/'SaaS_Book_Manuscript_v1_zh'
OUT.mkdir(parents=True,exist_ok=True)
PARTS={1:'第一部 先有组织 再有软件',4:'第二部 怎样形成可行动的表示',8:'第三部 怎样跨时间和边界完成工作',11:'第四部 人为什么仍要看见 判断和授权',15:'第五部 软件怎样变成组织和经济制度',18:'第六部 用 Agent 重做一次 但允许它失败'}
manifest_path=ROOT/'figure-manifest.json' if (ROOT/'figure-manifest.json').exists() else ROOT/'editorial/figure-manifest.json'
FIGS=json.loads(manifest_path.read_text())
def convert(md):
 md=re.sub(r'^(#+) ',r'\1# ',md,flags=re.M)
 return subprocess.check_output(['pandoc','-f','markdown+tex_math_dollars+tex_math_single_backslash','-t','html5','--mathml','--wrap=none'],input=md.encode()).decode()
chapters=[];nav=[]
for p in sorted((ROOT/'chapters').glob('ch[0-9][0-9].md')):
 n=int(p.stem[2:]); text=p.read_text(); title=text.splitlines()[0].lstrip('# ')
 if n in PARTS:nav.append('<span class="part-label">'+PARTS[n]+'</span>')
 nav.append(f'<a class="toc-item" href="#ch{n:02d}">{html.escape(title)}</a>')
 body=convert(text.replace("../assets/","assets/")).replace("<figure>","<figure class=\"figure\">")
 for f in [x for x in FIGS if x['chapter']==n]:
  if f['file'] in text: continue
  marker='图 '+f['number'];matches=list(re.finditer(r'<p>.*?</p>',body,re.S));target=next((x for x in matches if marker in x.group()),None)
  cap=html.escape('图 '+f['number']+'　'+f['title']+'。本书原创综合；相关依据：'+ '、'.join(f['source_ids'])+'。')
  tag=f'<figure class="figure"><img src="{f["file"]}" alt="{html.escape(f["title"])}"><figcaption>{cap}</figcaption></figure>'
  if target:body=body[:target.end()]+'\n'+tag+body[target.end():]
  else:body+='\n'+tag
 banner=f'<div class="part-banner">{PARTS[n]}</div>' if n in PARTS else ''
 chapters.append(banner+f'<section class="chapter" id="ch{n:02d}">'+body+'<p class="back"><a href="#contents">返回目录</a></p></section>')
nav=''.join(nav)
ledger=json.loads((ROOT/'evidence/evidence_ledger.json').read_text())
sources='<h2>来源索引与证据使用</h2><p>本索引方便沿正文的来源编号回查。完整读取范围、原文定位、支持边界及不能证明的结论，见包内 evidence/evidence_ledger.json 和 CSV。引用来源不表示本书的综合推导已经由该来源证明。</p><ol class="source-index">'
for s in ledger['sources']:
 sid=s['source_id']+(' / '+', '.join(s['aliases']) if s.get('aliases') else '')
 meta='；'.join(str(v) for v in [s.get('authors'),s.get('publication_or_version')] if v not in [None,''])
 details=(html.escape(meta)+'。' if meta else '')
 if s.get('locator'):details+='读取范围：'+html.escape(str(s['locator']))+'。'
 sources+=f'<li id="source-{s["source_id"]}"><b>{html.escape(sid)}</b>　<a href="{html.escape(s["url"],quote=True)}">{html.escape(s["title"])}</a>'+('<br>'+details if details else '')+'</li>'
sources+='</ol>'
cover='<header class="cover" id="top"><h1>清算 SaaS</h1><p class="subtitle">从组织约束到软件机制<br>再到 Agent 的逐项审计</p><p class="edition">正文初稿 v1 · 六部二十三章<br>2026 年 9 月 30 日</p><p class="note">合成案例与实验协议均已明确标注。本稿没有运行 A/B/C 比较实验；结论保留条件与反证入口。</p></header>'
page='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="清算 SaaS 正文初稿：六部二十三章，可离线阅读。"><title>清算 SaaS 正文初稿 v1</title><style>'+(ROOT/'build/book.css').read_text()+'</style></head><body><nav class="sidebar" id="contents" aria-label="全书目录"><strong>清算 SaaS</strong><div class="meta">正文初稿 v1 · 可离线阅读</div><a href="#preface">前言 为什么要逐项清算</a>'+nav+'<span class="part-label">附录</span><a href="#sources">来源索引与证据使用</a></nav><main>'+cover+'<nav class="toc-print"><h2>目录</h2><a class="toc-item" href="#preface">前言 为什么要逐项清算</a>'+nav+'</nav><section class="chapter" id="preface">'+convert((ROOT/'chapters/preface.md').read_text())+'</section>'+''.join(chapters)+'<section class="chapter" id="sources">'+sources+'</section></main></body></html>'
(OUT/'index.html').write_text(page)
for name in ['chapters','assets','evidence']:
 dest=OUT/name;dest.mkdir(exist_ok=True)
 for p in (ROOT/name).iterdir():
  if p.is_file() and p.suffix in ['.md','.svg','.json','.csv']:shutil.copy2(p,dest/p.name)
for f in FIGS:
 p=OUT/'chapters'/f'ch{f["chapter"]:02d}.md'
 if p.exists():
  s=p.read_text()
  if '../'+f['file'] in s: continue
  paras=s.split('\n\n'); idx=next((i for i,t in enumerate(paras) if '图 '+f['number'] in t),len(paras)-1)
  paras.insert(idx+1,f'![图 {f["number"]} {f["title"]}](../{f["file"]})\n\n图 {f["number"]}：{f["title"]}。本书原创综合；相关依据：'+ '、'.join(f['source_ids'])+'。')
  p.write_text('\n\n'.join(paras))
combined=['# 清算 SaaS\n\n正文初稿 v1 · 2026 年 9 月 30 日\n', (ROOT/'chapters/preface.md').read_text()]
for p in sorted((OUT/'chapters').glob('ch[0-9][0-9].md')):
 n=int(p.stem[2:]);combined += (['# '+PARTS[n]] if n in PARTS else [])+[p.read_text().replace('../assets/','assets/')]
(OUT/'manuscript.md').write_text('\n\n'.join(combined))
print(json.dumps({'directory':str(OUT),'chapters':len(chapters),'html_bytes':len(page.encode()),'math_blocks':len(re.findall('display="block"',page))},ensure_ascii=False))
