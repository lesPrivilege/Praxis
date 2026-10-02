"""Check that each route report keeps the strings its task had to preserve (from the frozen protocol)."""
import json, re
from pathlib import Path
KEEP = {
 'R1': ['`409 Conflict`', '`.sync/`', 'syncctl index reset --keep-unsent', 'syncctl push', '`~/.sync/logs/last.json`',
        'only when two devices pushed within the same minute', 'Do not delete', 'normally', 'contact support'],
 'R2': ['4次', '7.5小时', '99.95%', '一个团队', '六周', '1.2万', '2.1万', '0.9万', '12月中旬', '未知', '11月', '数据驻留审查', '运维负责人'],
 'R3': ['520', '480', '455', '470'],
 'R4': ['`npm install`', '`config/app.yaml`', '`timeout`', '> 原文引用:"the server may close idle connections after 30s".',
        '说实话，这一步其实非常简单，大家不用担心。'],
}
def norm(s): return re.sub(r'\s+', '', s)
out = {}
HEADS = {'R1': ('改后的文本', '修改表'), 'R2': ('幻灯片', '相对原备忘录的变动'), 'R3': ('要改的地方', '用到的仓库说法'), 'R4': ('改后的文本', 'diff')}
for f in sorted(Path('reports').glob('R?-*.md.txt')):
    t = f.read_text(); task = f.name[:2]
    h2, h3 = HEADS[task]
    # the deliverable sits between the heading of section 2 and the heading of section 3
    i = re.search(r'(?m)^[^\n]{0,8}2[.、][^\n]{0,6}' + h2, t)
    j = re.search(r'(?m)^[^\n]{0,8}3[.、][^\n]{0,6}' + h3, t)
    body = t[i.start():j.start()] if i and j else t
    out[f.name.split('.')[0]] = {'missing': [k for k in KEEP[task] if norm(k) not in norm(body)], 'section_chars': len(body), 'sliced': bool(i and j)}
print(json.dumps(out, ensure_ascii=False, indent=1))
Path('content-check.json').write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
