#!/usr/bin/env python3
"""Independent arithmetic, reservation, first-use and local navigation probes."""
import importlib.util
import json
import math
from fractions import Fraction
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
ATLAS = ROOT / 'vault/distilled/saas-engineering-atlas'
BOOK = ROOT / 'books/saas-engineering'
FROZEN = '5e6b7e3bc4e7d2bcfe737c231ddfe0c3be015f5b'
BASE = 'cd8d77b6166a6fc566f6aa09b4d9af3e11537408'


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def main():
    stock_path = ATLAS / 'packages/industry-networks/synthetic_checks.py'
    stock = load('final_reader_stock', stock_path)
    finance = load('final_reader_finance', ATLAS / 'packages/commercial-finance/checks.py')
    observations = {}
    count = 0
    for available in range(21):
        for first in range(1, 21):
            for second in range(1, 21):
                model = stock.StockReservation(available)
                expected = 'reserved' if first <= available else 'insufficient_stock'
                assert model.reserve('first', first, 1) == expected
                balance = available - first if expected == 'reserved' else available
                if expected == 'reserved':
                    assert model.reserve('second', second, 1) == 'version_conflict'
                expected_second = 'reserved' if second <= balance else 'insufficient_stock'
                assert model.reserve('second', second, model.version) == expected_second
                if expected_second == 'reserved':
                    balance -= second
                assert model.available == balance >= 0
                assert model.available + sum(model.reserved.values()) == available
                before = (model.available, model.version, dict(model.reserved))
                for identity, qty in model.reserved.copy().items():
                    assert model.reserve(identity, qty, -1) == 'reserved'
                    try:
                        model.reserve(identity, qty + 1, model.version)
                    except ValueError as exc:
                        assert str(exc) == 'identity_conflict'
                    else:
                        raise AssertionError('same identity accepted a new quantity')
                assert (model.available, model.version, model.reserved) == before
                count += 1
    observations['WB-03'] = dict(status='pass', independent_scenarios=count,
        domain='available 0..20; each ordered request quantity 1..20; stale version then fresh retry; replay and changed-content checks',
        examples={'Q1_16_Q2_16_stock_16': 'one commit; stale-version conflict then shortage',
                  'S1_10_S2_6_stock_16': 'both commit after retry; zero remains'})

    source = stock_path.read_text()
    mutations = []
    for name, old, new, expected in [
        ('remove_version_guard', 'if expected_version != self.version:', 'if False:', 'version_conflict'),
        ('remove_stock_guard', 'if qty > self.available:', 'if False:', 'insufficient_stock'),
    ]:
        assert source.count(old) == 1
        namespace = {'__name__': 'review_mutant'}
        exec(compile(source.replace(old, new), '<in-memory-stock-mutant>', 'exec'), namespace)
        m = namespace['StockReservation'](16)
        assert m.reserve('Q1', 16, 1) == 'reserved'
        result = m.reserve('Q2', 16, 1 if 'version' in name else m.version)
        mutations.append(dict(name=name, rejected_by_oracle=result != expected,
                              expected=expected, observed=result))
    assert all(x['rejected_by_oracle'] for x in mutations)
    observations['WB-03']['implementation_mutations'] = mutations

    count = 0
    for amount in range(101):
        for duration in range(1, 12):
            start = -3
            for day in range(start - 2, start + duration + 3):
                elapsed = max(0, min(day - start, duration))
                oracle = math.floor(Fraction(amount * elapsed, duration))
                assert finance.cumulative(amount, start, start + duration, day) == oracle
                count += 1
            parts = [finance.window(amount, start, start + duration, day, day + 1)
                     for day in range(start, start + duration)]
            assert sum(parts) == amount
    values = [2, 1, 3, 0, 4]
    prefix = [sum(values[:i]) for i in range(len(values) + 1)]
    assert values[1:4] == [1, 3, 0] and prefix[4] - prefix[1] == 4
    observations['WB-07'] = dict(status='pass', fraction_oracle_comparisons=count,
        allocation=[finance.window(100, 0, 3, i, i + 1) for i in range(3)],
        array_positions=[1, 2, 3], selected_values=values[1:4], prefix=prefix)

    changed = subprocess.check_output(['git', 'diff', '--name-only', BASE, FROZEN, '--',
        'books/saas-engineering'], cwd=ROOT, text=True).splitlines()
    links = []
    for rel in changed:
        path = ROOT / rel
        if path.suffix != '.md':
            continue
        for number, line in enumerate(path.read_text().splitlines(), 1):
            for target in re.findall(r'\]\(([^)]+)\)', line):
                parsed = urlsplit(target)
                if parsed.scheme or parsed.netloc:
                    continue
                destination = (path.parent / unquote(parsed.path)).resolve() if parsed.path else path
                links.append(dict(path=rel, line=number, target=target,
                                  exists=destination.exists()))
    assert all(x['exists'] for x in links)
    observations['local_navigation'] = dict(status='pass', changed_reader_files=len(changed),
        links_checked=len(links), records=links,
        scope='Relative target existence. Repaired transfer and first-use prose read manually; this parser does not prove prose semantics or arbitrary heading anchors.')

    proposal_id = 'TR:H03:V07:dependency-not-capacity'
    proposals = json.loads((ATLAS / 'transfer-proposals.json').read_text())['proposals']
    proposal = next(p for p in proposals if p['id'] == proposal_id)
    assert proposal['id'].split(':')[1:3] == ['H03', 'V07']
    assert proposal['previous_ids'] == ['TR:H03:H07:dependency-not-capacity']
    assert proposal_id in proposal['occurrences'][0]['context']
    body = (BOOK / 'packages/commercial-finance/H03.md').read_text()
    assert proposal_id in body and '../industry-networks/V07.md' in body
    observations['WB-04'] = dict(status='pass', proposal=proposal)

    # Independent expected expansions, then inspect the first visible occurrence
    # rather than checking only that a definition appears somewhere in the file.
    terms = {
        'EAM':'enterprise asset management', 'CMMS':'computerized maintenance management system',
        'FSM':'field service management', 'PLM':'product lifecycle management',
        'MES':'manufacturing execution system', 'CAE':'computer-aided engineering',
        'SDC':'Synopsys Design Constraints', 'SPEF':'Standard Parasitic Exchange Format',
        'OSS':'operations support systems', 'BSS':'business support systems',
        'EHR':'electronic health record', 'HIS':'hospital information system',
        'LIS':'laboratory information system', 'CRA':'clinical research associate',
        'ITSM':'IT service management', 'PSA':'professional services automation',
        'SIEM':'security information and event management',
        'SOAR':'security orchestration, automation and response', 'CAS':'compare-and-swap',
        'CLM':'contract lifecycle management', 'DML':'data manipulation language',
        'REST':'representational state transfer', 'CU':'currency unit',
        'PCCO':'Prime Contract Change Order', 'IWMS':'integrated workplace management system',
    }
    mapping = json.loads((ROOT / 'docs/reviews/saas-whole-book-repairs-20261014/term-review.json').read_text())
    first_uses = []
    for use in mapping['first_uses']:
        lines = (ROOT / use['path']).read_text().splitlines()
        for number, line in enumerate(lines, 1):
            visible = re.sub(r'\]\([^)]*\)', ']', line)
            if re.search(r'(?<!\w)' + use['term'] + r'(?!\w)', visible):
                assert terms[use['term']] in visible
                first_uses.append(dict(term=use['term'], path=use['path'], line=number,
                                       expansion=terms[use['term']]))
                break
        else:
            raise AssertionError('term missing: ' + use['term'])
    observations['WB-06'] = dict(status='pass', definitions=25, first_uses=first_uses,
        evidence='The four provider/specialized name sources are independently read in source-checks.json.')
    report = dict(reviewed_commit=FROZEN, status='pass', observations=observations,
                  scope='Synthetic serialized models, arithmetic and changed reader paths; no live-provider/concurrency/reader-participant experiment.')
    (HERE / 'reader-results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(status='pass', reservation_scenarios=8400,
                         arithmetic_comparisons=count, links_checked=len(links), first_use_occurrences=len(first_uses))))


if __name__ == '__main__':
    main()
