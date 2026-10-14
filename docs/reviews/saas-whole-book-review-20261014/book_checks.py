#!/usr/bin/env python3
"""Read-only structural observations, not a proof of teaching or source accuracy."""
import hashlib
import json
import re
import subprocess
from collections import Counter
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[3]
BOOK = ROOT / 'books/saas-engineering'
ATLAS = ROOT / 'vault/distilled/saas-engineering-atlas'
FROZEN = 'cd8d77b6166a6fc566f6aa09b4d9af3e11537408'


def relative(path):
    return path.relative_to(ROOT).as_posix()


def anchors(text):
    seen = Counter()
    result = set(re.findall(r'(?:id|name)=[\"\']([^\"\']+)', text))
    for line in text.splitlines():
        match = re.match(r'^#{1,6}\s+(.+?)\s*#*$', line)
        if not match:
            continue
        title = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', match[1])
        title = re.sub(r'<[^>]*>', '', title).lower()
        slug = ''.join(c for c in title if c.isalnum() or c in '_- ')
        slug = slug.replace(' ', '-')
        count = seen[slug]
        seen[slug] += 1
        result.add(slug if count == 0 else f'{slug}-{count}')
    return result


def main():
    paths = [ROOT / 'books/README.md', *sorted(BOOK.rglob('*.md'))]
    cases = sorted(BOOK.glob('packages/*/[HVX][0-9][0-9].md'))
    foundations = sorted((BOOK / 'foundations').glob('[0-9][0-9]-*.md'))
    enterprise = sorted((BOOK / 'enterprise-mechanisms').glob('[0-9][0-9]-*.md'))
    missing, anchor_candidates, headings, manifest = [], [], [], []
    local_links = external_links = 0
    for path in paths:
        body = path.read_text()
        manifest.append({'path': relative(path), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
                         'lines': len(body.splitlines())})
        for num, line in enumerate(body.splitlines(), 1):
            if re.match(r'^#{1,6}\s', line):
                headings.append({'path': relative(path), 'line': num, 'text': line})
            for target in re.findall(r'\]\(([^\s)]+)(?:\s+"[^"]*")?\)', line):
                parsed = urlsplit(target.strip('<>'))
                if parsed.scheme or parsed.netloc:
                    external_links += 1
                    continue
                local_links += 1
                dest = (path.parent / unquote(parsed.path)).resolve() if parsed.path else path
                item = {'path': relative(path), 'line': num, 'target': target}
                if not dest.exists():
                    missing.append(item)
                elif parsed.fragment and dest.suffix == '.md' and unquote(parsed.fragment) not in anchors(dest.read_text()):
                    anchor_candidates.append(item)
    index = json.loads((ATLAS / 'case-index.json').read_text())['cases']
    case_routes = [{'id': c['case_id'], 'path': relative((ATLAS / c['prose_path']).resolve()),
                    'exists': (ATLAS / c['prose_path']).is_file()} for c in index]
    curriculum = json.loads((ATLAS / 'foundations/curriculum.json').read_text())
    maps = json.loads((ATLAS / 'enterprise-mechanisms/case-links.json').read_text())
    duplicate_case_bodies = list(ATLAS.glob('packages/*/[HVX][0-9][0-9].md'))
    duplicate_foundations = list((ATLAS / 'foundations').glob('[0-9][0-9]-*.md'))
    duplicate_enterprise = list((ATLAS / 'enterprise-mechanisms').glob('[0-9][0-9]-*.md'))
    prior_ids = json.loads(subprocess.check_output(['git', 'show',
        '5c5f7098561d4d87403986d6c3edf58cde20a5e7:docs/reviews/saas-case-independent-review-20261014/findings.json'], cwd=ROOT))
    result = {
        'reviewed_commit': FROZEN,
        'scope': 'All Books Markdown link targets and headings; stable case paths; duplicate-body absence. Anchor candidates require manual adjudication; no rendering or remote link validation.',
        'counts': {'markdown_files': len(paths), 'cases': len(cases), 'foundations': len(foundations),
                   'enterprise': len(enterprise), 'local_link_occurrences': local_links,
                   'external_link_occurrences': external_links, 'headings': len(headings),
                   'curriculum_chapters': len(curriculum['chapters']), 'enterprise_case_links': len(maps['case_links'])},
        'missing_local_targets': missing,
        'unresolved_anchor_candidates': anchor_candidates,
        'case_routes': case_routes,
        'current_vault_duplicate_bodies': [relative(p) for p in duplicate_case_bodies + duplicate_foundations + duplicate_enterprise],
        'earlier_case_findings': [{'id': f['id'], 'title': f['title']} for f in prior_ids['findings']],
        'manifest': manifest,
        'heading_inventory': headings,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
