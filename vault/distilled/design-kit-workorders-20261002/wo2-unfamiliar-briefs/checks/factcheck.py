"""Check that each agent report keeps the brief's facts. Whitespace-insensitive substring match per layout section."""
import json
import re
import sys
from pathlib import Path

FACTS = {
    'A': ['14天', '7天', '6件', '4件', '2件', '1次', '2元', '30天', '11月30日', '12月14日', '12月1日', '周二', '周四',
          '18:30', '20:30', 'toolroom@example.org', '志愿者编号', '不变', '不限次数', '有人预约时不能续借',
          '按原借期归还', '一层服务台', '排队超过两周'],
    'B': ['约10分钟', '1–3个工作日', '5天', '23户', '未知', '3天内', '身份证件', '租赁合同或房产证明', '周一至周六',
          '9:00', '18:00', 'frontdesk@example.org', '前一步没办完，后一步无法受理', '临时通行单', '短信通知',
          '按登记顺序', '门禁生效后可申请'],
    'C': ['约1个工作日', '3–10个工作日', '1个工作日内', '5–12个工作日', '资料不全会退回', '补齐后重新计时',
          '取决于街道办的排期', '不需要到场', '抄水电表读数', '0000-0000', '9:00', '18:00',
          '前一步办结后才进入下一步', '签约后到拿钥匙要多久'],
}


def squash(s):
    return re.sub(r'[\s│|┃─━┌┐└┘├┤┬┴┼—\-]+', '', s).replace('-', '–').replace('~', '–').replace('：', ':')


def sections(text):
    """Split a report on its numbered top-level headings (e.g. '3. 宽版结构' or '## 3')."""
    parts = re.split(r'(?m)^(?:#+\s*)?(?:\*\*)?(\d)[.、]\s*', text)
    return {parts[i]: parts[i + 1] for i in range(1, len(parts) - 1, 2)}


root = Path(sys.argv[1])
out = {}
for f in sorted(root.glob('*.md')):
    brief = f.stem[0]
    sec = sections(f.read_text())
    res = {}
    for n, name in (('3', 'layout_1'), ('4', 'layout_2')):
        body = squash(sec.get(n, ''))
        missing = [x for x in FACTS[brief] if squash(x) not in body]
        res[name] = {'chars': len(body), 'missing': missing}
    out[f.stem] = res
print(json.dumps(out, ensure_ascii=False, indent=1))
