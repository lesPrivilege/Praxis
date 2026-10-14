#!/usr/bin/env python3
"""Project canonical sources and review/claim indexes from preserved author records.

No network access; canonicalization is exact URL equality plus recorded redirects.
The seed catalog is the immutable pre-integration input. Package evidence remains
source-owned. Never infer one review's scope from another review of the same URL.
"""
import argparse
from collections import defaultdict
from copy import deepcopy
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ATLAS = ROOT / 'vault/distilled/saas-engineering-atlas'
PROV = ROOT / 'vault/provenance/saas-engineering-atlas'

def read(p):
    return json.loads(p.read_text())

def encoded(d):
    return json.dumps(d, ensure_ascii=False, indent=2) + '\n'

def build():
    seed = read(PROV / 'seed-catalog.json')
    records = deepcopy(seed['sources'])
    origins = {s['id']: 'vault/provenance/saas-engineering-atlas/seed-catalog.json' for s in records}
    reviews, claims = [], []
    for s in records:
        for c in s['supported_claims']:
            claims.append({'id': c['claim_id'], 'kind': 'source_fact', 'source_ids': [s['id']],
                           'statement': c['claim'], 'locator': c['locator'], 'limitations': s['limits'],
                           'origin_path': origins[s['id']], 'original_record': c})
    for p in sorted((ATLAS / 'packages').glob('*/evidence.json')):
        d = read(p)
        origin = p.relative_to(ROOT).as_posix()
        for s in d['sources']:
            records.append(deepcopy(s)); origins[s['id']] = origin
        for i, review in enumerate(d['reviews']):
            reviews.append({'review_id': f"{d['package_id']}:review:{i+1:03}", 'origin_path': origin,
                            'origin_pointer': f'/reviews/{i}', 'original_record': deepcopy(review)})
        for c in d['claims']:
            claims.append({**deepcopy(c), 'origin_path': origin})
    # These redirects are explicitly documented by the package authors.
    redirects = {
        'MEWS_POS': ('https://docs.mews.com/connector-api/use-cases/point-of-sale', 'P05 review MEWS_POS canonical_url'),
        'GREENHOUSE': ('https://docs.greenhouse.io/harvest.html', 'P02 review GREENHOUSE scope documents redirect'),
        'MAXIMO': ('https://www.ibm.com/support/pages/maximo-support-desk-allowable-status-changes-work-orders', 'P06 source_aliases: same article UID ibm11112013'),
    }
    groups = defaultdict(list)
    for s in records:
        url = redirects.get(s['id'], (s.get('canonical_url', s['url']), ''))[0]
        groups[url].append(s)
    sources, aliases = [], {}
    for url, members in groups.items():
        first = members[0]; ids = [s['id'] for s in members]; sid = first['id']
        assert len(ids) == len(set(ids)), ids
        aliases.update({i: sid for i in ids})
        scoped = [c for c in claims if c['kind'] == 'source_fact' and set(c['source_ids']) & set(ids)]
        review_ids = [r['review_id'] for r in reviews if r['original_record']['source_id'] in ids]
        source = {
            'id': sid, 'aliases': ids[1:], 'slug': first.get('slug', sid.lower().replace('_', '-')),
            'title': first['title'], 'original_url': first.get('original_url', first['url']),
            'url': url, 'canonical_url': url,
            'status': 'verified-in-scope' if scoped else 'unverified',
            'summary_zh': '按下列独立主张和读取范围消费；全文摘要与限制见来源总表。' if scoped else '保留的研究线索，当前没有可用于本教材事实的已支持主张。',
            'limits': '每项主张保留自己的 locator 与 limitations；URL 合并不扩大任一读取范围。无 provider 执行或全文快照。',
            'purpose_tags': ['GRAMMAR'], 'card_path': 'vault/provenance/saas-engineering-atlas/sources.md',
            'supported_claims': [{'claim_id': c['id'], 'claim': c['statement'], 'locator': c['locator'],
                                  'limitations': c['limitations'], 'original_source_ids': c['source_ids'],
                                  'origin_path': c['origin_path']} for c in scoped],
            'grammar_paths': sorted({'vault/distilled/saas-engineering-atlas/README.md'} | {
                str(Path(c['origin_path']).parent / (c['case_id'] + '.md')) for c in scoped if 'case_id' in c}),
            'history_record': 'vault/provenance/saas-engineering-atlas/reviews.json',
            'review_ids': review_ids, 'evidence_modality': ['text_read'] if scoped else [],
            'snapshot_status': 'not-captured', 'implementation_maturity': 'not-assessed',
            'adoption': 'research-candidate', 'license_state': '原创概括与公共链接；未转载全文或图像。',
            'revisit_trigger': '实现前按具体版本、字段、制度与部署范围重新核查；来源变更或主张冲突时复读。',
        }
        sources.append(source)
    for r in reviews:
        r['canonical_source_id'] = aliases[r['original_record']['source_id']]
    for c in claims:
        c['canonical_source_ids'] = list(dict.fromkeys(aliases[x] for x in c['source_ids']))
    catalog = {**seed, 'origin': 'integrated-public-source-reviews', 'sources': sources,
               'generation': 'scripts/build_saas_atlas_indexes.py; edit source-owned inputs, not this projection'}
    history = {
        'contract_version': '1.0', 'scope': 'Author reading records preserved verbatim; integration did not re-browse.',
        'canonicalization': 'Exact canonical URL; preserve explicit version paths and page scope. Redirects require recorded evidence.',
        'redirect_decisions': [{'source_id': k, 'canonical_url': v[0], 'basis': v[1]} for k, v in redirects.items()],
        'source_records': [{'source_id': s['id'], 'canonical_source_id': aliases[s['id']],
                            'origin_path': origins[s['id']], 'original_record': s} for s in records],
        'reviews': reviews,
    }
    lines = ['# 来源总表', '', '按 canonical URL 汇集材料，原 ID 作为别名保留。每条主张的范围独立；当前可用状态、读取日期与失败记录见 [catalog](catalog.json) 和 [reviews](reviews.json)。包内 evidence 是原始编辑源，本页由索引脚本生成。', '']
    for s in sources:
        lines += [f"## {s['id']}", '', f"[{s['title']}]({s['url']})", '']
        if s['aliases']:
            lines += ['同源 ID：' + '、'.join(f'`{x}`' for x in s['aliases']) + '。', '']
        if not s['supported_claims']:
            lines += ['本教材保留此研究入口；所列读取记录未形成支持事实的主张。', '']
        for c in s['supported_claims']:
            loc = c['locator'] if isinstance(c['locator'], str) else '；'.join(c['locator'])
            lines += [f"- `{c['claim_id']}`：{c['claim']} 定位：{loc}。边界：{c['limitations']}"]
        lines += ['', '消费：' + '、'.join(f'[{Path(p).stem}](../../../{p})' for p in s['grammar_paths']) + '。', '', '复查：' + s['revisit_trigger'], '']
    return {PROV/'catalog.json': encoded(catalog), PROV/'reviews.json': encoded(history),
            PROV/'claims.json': encoded({'contract_version': '1.0', 'claims': claims}),
            PROV/'source-aliases.json': encoded({'contract_version': '1.0', 'aliases': aliases}),
            PROV/'sources.md': '\n'.join(lines).rstrip()+'\n'}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    outputs = build()
    stale = [str(p.relative_to(ROOT)) for p, data in outputs.items() if not p.exists() or p.read_text() != data]
    if args.check:
        print(encoded({'status': 'fail' if stale else 'pass', 'stale': stale}))
        return bool(stale)
    for p, data in outputs.items():
        p.write_text(data)
    print(f'Generated {len(outputs)} source projections')
    return False

if __name__ == '__main__':
    raise SystemExit(main())
