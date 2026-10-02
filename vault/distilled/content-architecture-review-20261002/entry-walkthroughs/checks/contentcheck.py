"""Check the strings each task had to keep (from the frozen protocol) in the '产出' section of each report.

Run from this directory: python3 contentcheck.py
"""
import json, re
from pathlib import Path
KEEP = {
 'P1': ['3 名内勤', '两小时', '型号', '价格表'],
 'P2': ['90 天', '账单', '登录与权限', '数据导入', '其他', '周五', '不写回', '只读'],
 'P3': ['40 小时', '3 小时', '甲', '乙'],
 'N1': ['导出功能', '本次迭代', '响应速度'],
 'N2': ['幂等'],
 'N3': ['2026-10-02', '2026-09-07', '2025-12-31', '2026-01-05', 'A-1041', 'A-0988', 'A-0760', '已发货', '待确认', '已取消'],
}
FORBID = {'N1': ['大幅', '显著', '明显'], 'N3': ['2026/'], 'P1': []}
def norm(s): return re.sub(r'\s+', '', s)
out = {}
HERE = Path(__file__).resolve().parent
for f in sorted((HERE.parent / 'reports').glob('??-*.md.txt')):
    t = f.read_text(); task = f.name[:2]; name = f.name[:-len('.md.txt')]
    i = re.search(r'(?m)^[^\n]{0,8}2[.、][^\n]{0,4}产出', t); j = re.search(r'(?m)^[^\n]{0,8}3[.、][^\n]{0,4}依据', t)
    body = t[i.start():j.start()] if i and j else t
    # the two smallest tasks explain alternatives next to the answer; check the answer itself, not the explanation
    if task == 'N3':
        m = re.search(r'```\n(.*?)```', body, re.S); body = m.group(1) if m else body
    if task == 'N1':
        body = next((ln for ln in body.split('\n') if '导出功能' in ln and '|' not in ln), body)
    out[name] = {'sliced': bool(i and j), 'section_chars': len(body),
                   'missing': [k for k in KEEP[task] if norm(k) not in norm(body)],
                   'forbidden_present': [k for k in FORBID.get(task, []) if k in body]}
(HERE / 'content-check.json').write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
print(json.dumps(out, ensure_ascii=False, indent=1))
