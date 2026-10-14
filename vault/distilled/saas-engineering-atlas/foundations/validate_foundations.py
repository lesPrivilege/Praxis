#!/usr/bin/env python3
"""Read-only validation of this package's links, identifiers and evidence coverage."""
import json
from pathlib import Path
import re
from urllib.parse import unquote, urldefrag, urlsplit

HERE = Path(__file__).resolve().parent


def read(name):
    return json.loads((HERE / name).read_text(encoding='utf-8'))


def require(value, message):
    if not value:
        raise ValueError(message)


def unique(items, label):
    require(len(items) == len(set(items)), f'duplicate {label}')


def main():
    evidence, curriculum, examples = read('evidence.json'), read('curriculum.json'), read('examples.json')
    cases = {c['case_id'] for c in read('../case-index.json')['cases']}
    algorithms = {a['id'] for a in read('../identifiers.json')['algorithms']}
    sources = {s['id']: s for s in evidence['sources']}
    example_map = {e['id']: e for e in examples['examples']}
    chapters = curriculum['chapters']
    paths = {c['path'] for c in chapters}
    require(len(chapters) == 12, 'chapter count')
    require(paths == {f.name for f in HERE.glob('[0-9][0-9]-*.md')}, 'chapter map differs from files')
    require(len(example_map) == 18, 'example count')
    for rows, key, label in [(evidence['sources'], 'id', 'source IDs'),
                             (evidence['sources'], 'canonical_url', 'canonical URLs'),
                             (evidence['claims'], 'id', 'claim IDs'),
                             (evidence['reviews'], 'id', 'review IDs'),
                             (examples['examples'], 'id', 'example IDs'),
                             (chapters, 'id', 'chapter IDs')]:
        unique([r[key] for r in rows], label)
    reviews = {r['id']: r for r in evidence['reviews']}
    for source in sources.values():
        require(source['title_original'] and source['source_language'] == 'en', source['id'])
        require(source['locators'] and all(source['locators']) and source['claim_scope'], source['id'])
        require(source['status'] == 'read-scoped', source['id'])
        require(source['chapter_paths'] and set(source['chapter_paths']) <= paths, source['id'])
        review = reviews[source['review_id']]
        require(review['source_id'] == source['id'] and review['scope'], 'review mismatch')
        url = urlsplit(source['canonical_url'])
        require(url.scheme == 'https' and url.netloc and not url.query and not url.username, 'nonpublic or parameterized URL')
    for claim in evidence['claims']:
        require(claim['statement'] and claim['local_paths'], claim['id'])
        require(set(claim['source_ids']) <= sources.keys(), claim['id'])
        require(claim['kind'] != 'source-backed' or claim['source_ids'], 'unsupported source claim')
        require(set(claim.get('case_ids', [])) <= cases, 'unknown case')
        require(set(claim.get('example_ids', [])) <= example_map.keys(), 'unknown example')
        for path in claim['local_paths']:
            require((HERE / path).is_file(), f'missing claim path: {path}')
    body_urls, seen_cases, seen_algorithms, seen_examples = set(), set(), set(), set()
    for chapter in chapters:
        text = (HERE / chapter['path']).read_text(encoding='utf-8')
        require(all(word in text for word in ('识题', '解法', '演算', '验算', '变式')), chapter['path'])
        require(set(chapter['case_ids']) <= cases, chapter['path'])
        require(set(chapter['algorithm_ids']) <= algorithms, chapter['path'])
        require(set(chapter['source_ids']) == {s['id'] for s in sources.values() if chapter['path'] in s['chapter_paths']}, 'source map mismatch')
        for eid in chapter['example_ids']:
            require(example_map[eid]['chapter'] == chapter['path'], 'example chapter mismatch')
        seen_cases.update(chapter['case_ids'])
        seen_algorithms.update(chapter['algorithm_ids'])
        seen_examples.update(chapter['example_ids'])
        body_urls.update(urldefrag(u)[0] for u in re.findall(r'\]\((https://[^)]+)\)', text))
    require(seen_cases == cases, '33-case coverage')
    require(seen_algorithms == algorithms, '8-algorithm-family coverage')
    require(seen_examples == example_map.keys(), 'unmapped example')
    require(body_urls == {s['canonical_url'] for s in sources.values()}, 'cited URL and source catalog mismatch')
    link_count = 0
    for file in HERE.glob('*.md'):
        for target in re.findall(r'\]\(([^)]+)\)', file.read_text(encoding='utf-8')):
            if '://' in target or target.startswith('#'):
                continue
            path = unquote(target.split('#')[0])
            require((file.parent / path).is_file(), f'broken link {file.name}: {target}')
            link_count += 1
    print(json.dumps({'status': 'pass', 'chapters': len(chapters), 'examples': len(example_map),
                      'case_ids': len(seen_cases), 'algorithm_ids': len(seen_algorithms),
                      'sources': len(sources), 'claims': len(evidence['claims']),
                      'local_markdown_links': link_count}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
