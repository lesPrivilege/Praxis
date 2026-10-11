#!/usr/bin/env python3
"""Exercise recorded discovery cases and rejection boundaries without writes."""
from copy import deepcopy
import unittest
from unittest.mock import patch

import atlas_index as atlas


class AtlasTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.index = atlas.read(atlas.DEST)
        cls.cases = atlas.read(atlas.R / 'docs/verification/art-software-atlas-20261011/facet-query-results.json')['cases']

    def test_recorded_queries_and_witnesses(self):
        # Includes no-hit cases for runtime contamination, cross-entity matching,
        # shared-evidence overreach and missing-vs-not-applicable classification.
        for case in self.cases:
            with self.subTest(intent=case['intent']):
                actual = atlas.query(self.index, case['filters'])
                self.assertEqual([g['grammar_id'] for g in actual], case['expected'])
                self.assertEqual(actual, case['results'])

    def test_invalid_filters(self):
        for filters in [[], {'bad': 'Nasca'}, {'bad.artifact': 'woven-garment'},
                        {'exemplar.bad': 'Nasca'}, {'exemplar.artifact': []},
                        {'exemplar.artifact': 4},
                        {'exemplar.artifact': {'state': 'missing'}},
                        {'exemplar.artifact': {'state': []}}]:
            with self.subTest(filters=filters), self.assertRaises(ValueError):
                atlas.query(self.index, filters)

    def test_projection_and_validation(self):
        self.assertEqual(atlas.build(), self.index)
        self.assertEqual(atlas.validate(self.index), [])

    def test_damaged_records_are_rejected(self):
        mutations = {
            'invalid facet state': lambda d: d['sources'][0]['facets']['language'].update(state='invalid'),
            'known without values': lambda d: d['sources'][0]['facets']['language'].update(state='known', values=[]),
            'unknown with values': lambda d: d['sources'][0]['facets']['language'].update(state='unknown', values=['en']),
            'missing facet evidence': lambda d: d['sources'][0]['facets']['language'].update(evidence=['missing']),
            'invalid source kind': lambda d: d['sources'][0].update(kind='exemplar'),
            'deleted source': lambda d: d['sources'].pop(),
            'deleted relation': lambda d: d['relations'].pop(),
            'reused identity drift': lambda d: d['reused_sources'][0].update(url='https://example.invalid/'),
            'missing grammar anchor': lambda d: d['grammar'][0].update(section='missing-section'),
            'missing facet posting': lambda d: d['facet_index']['language']['states']['unreviewed'].pop(),
            'reversed documents': self.reverse_documents,
            'source as implementation': self.source_implements,
        }
        for name, mutate in mutations.items():
            with self.subTest(case=name):
                damaged = deepcopy(self.index)
                mutate(damaged)
                self.assertTrue(atlas.validate(damaged))

    def test_reused_canonical_identity(self):
        # Mutate the editing source, not just the projection: a rebuild must
        # still resolve each reused identity against its original owner.
        original_read = atlas.read
        for catalog_path in sorted(atlas.B.glob('*/catalog.json')):
            catalog = original_read(catalog_path)
            for i, source in enumerate(catalog.get('reused_sources', [])):
                for field, value in [('id', 'UNREGISTERED-REUSE'),
                                     ('url', 'https://example.invalid/changed-source'),
                                     ('card_path', self.index['sources'][0]['card_path'])]:
                    with self.subTest(source=source.get('id'), field=field):
                        changed = deepcopy(catalog)
                        changed['reused_sources'][i][field] = value
                        with patch.object(atlas, 'read', side_effect=lambda p: changed if p == catalog_path else original_read(p)):
                            errors = atlas.validate(atlas.build())
                        self.assertTrue(any('reused' in e for e in errors), errors)

    def test_canonical_citation_edges(self):
        original_read = atlas.read
        catalog_path = atlas.B / 'discovery/catalog.json'
        grammar_path = atlas.B / 'grammar.json'
        for removed_side in ('source', 'grammar'):
            catalog, grammar = original_read(catalog_path), original_read(grammar_path)
            if removed_side == 'source':
                next(s for s in catalog['sources'] if s['id'] == 'ASA-R-01')['grammar_paths'] = []
            else:
                for g in grammar['grammar']:
                    if 'ASA-R-01' in g['source_ids']:
                        g['source_ids'].remove('ASA-R-01')
            def changed_read(path):
                if path == catalog_path:
                    return catalog
                if path == grammar_path:
                    return grammar
                return original_read(path)
            with self.subTest(side=removed_side), patch.object(atlas, 'read', side_effect=changed_read):
                errors = atlas.validate(atlas.build())
                self.assertTrue(any('declarations disagree' in e for e in errors), errors)
                if removed_side == 'source':
                    self.assertTrue(any('undeclared source citation' in e for e in errors), errors)

    @staticmethod
    def reverse_documents(data):
        edge = next(e for e in data['relations'] if e['type'] == 'documents')
        edge['from'], edge['to'] = edge['to'], edge['from']

    @staticmethod
    def source_implements(data):
        edge = next(e for e in data['relations'] if e['type'] == 'implements')
        edge['from'] = data['sources'][0]['id']


if __name__ == '__main__':
    unittest.main(verbosity=2)
