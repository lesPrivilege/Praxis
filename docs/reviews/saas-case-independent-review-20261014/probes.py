#!/usr/bin/env python3
"""Reproduce selected observations in the frozen teaching fixtures, without edits."""
import json
from dataclasses import replace
from pathlib import Path
import runpy
import tempfile

ROOT = Path(__file__).resolve().parents[3]
PACKAGE = ROOT / 'vault/distilled/saas-engineering-atlas/packages/data-ai-control'


def main():
    h07 = runpy.run_path(str(PACKAGE / 'check_h07.py'))
    h08 = runpy.run_path(str(PACKAGE / 'check_h08.py'))
    x01 = runpy.run_path(str(PACKAGE / 'check_x01.py'))
    results = {}

    first = h07['ROWS'][1]
    changed = replace(first, cents=8100)
    m2 = [h07['first_completed'](rows, 'alpha', h07['D2'])
          for rows in [(first, changed), (changed, first)]]
    assert m2 == [8000, 8100]
    try:
        h07['current_completed']((first, changed), 'alpha', h07['D2'])
    except ValueError as exc:
        m1 = str(exc)
    else:
        raise AssertionError('expected M1 to reject conflicting revision')
    results['IR-01'] = {'M2_cents_by_order': m2, 'M1_control': m1}

    first = h08['row']('same-event', 0, severity=40)
    changed = dict(first, severity=99)
    identical = h08['deduplicate']([first, dict(first)])
    scores = [h08['score'](h08['deduplicate'](rows))
              for rows in [(first, changed), (changed, first)]]
    assert len(identical) == 1 and scores == [40, 99]
    results['IR-02'] = {'identical_replay_count': len(identical),
                        'conflicting_payload_scores_by_order': scores}

    with tempfile.TemporaryDirectory(prefix='saas-review-') as temp:
        invalid = {}
        for eligible in (2, -1):
            ledger = x01['Ledger'](Path(temp) / f'eligibility-{eligible}.sqlite')
            try:
                ledger.record('synthetic-tenant', 'run-a', 400, eligible, 2)
                invalid[str(eligible)] = list(map(str, ledger.totals('synthetic-tenant', 0, 10)))
            finally:
                ledger.close()
        assert invalid == {'2': ['400', '800', '1.6'], '-1': ['400', '-400', '-0.8']}
        results['IR-03'] = {'cost_billable_amount_by_invalid_eligibility': invalid}

    quota = x01['Quota']()
    assert quota.reserve('same-run', 800)
    quota.settle('same-run', 400)
    assert quota.reserve('same-run', 800)
    quota.settle('same-run', 400)
    assert quota.spent == 800
    results['scope-limit-quota'] = {
        'spent_after_same_run_settled_twice': quota.spent,
        'interpretation': 'Quota alone is not a run lifecycle or replay guard; not a separate defect.'}
    print(json.dumps({'status': 'observations-reproduced', 'results': results,
                      'scope': 'local synthetic helpers; no provider, UI, model, load or production database'},
                     ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
