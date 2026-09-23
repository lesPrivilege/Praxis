#!/usr/bin/env python3
"""Preflight for the repository's conservative xmind-md/0.1 generation subset."""
import argparse
import re
from pathlib import Path


def lint(path):
    errors = []
    if path.suffix != '.md':
        errors.append('expected .md extension')
    try:
        body = path.read_bytes().decode('utf-8')
    except UnicodeDecodeError:
        return ['invalid UTF-8']
    lines = body.splitlines()
    if not lines or not re.fullmatch(r'# [^\s].*', lines[0]):
        errors.append('first line must be the central H1 (no BOM or metadata)')
    h1 = 0
    previous = 0
    list_depth = None
    for number, line in enumerate(lines, 1):
        def fail(message):
            errors.append(f'{number}: {message}')
        if '\t' in line or any(c in line for c in '\u00a0\u200b\u200c\u200d\u2060\ufeff'):
            fail('tab or invisible character')
        if not line.strip():
            continue
        heading = re.fullmatch(r'(#{1,6}) ([^\s].*)', line)
        if heading:
            level = len(heading[1])
            h1 += level == 1
            if level > previous + 1:
                fail('heading level skipped')
            previous = level
            list_depth = None
        else:
            item = re.fullmatch(r'( *)(?:- |[0-9]+\. )([^\s].*)', line)
            if not item:
                fail('expected heading or list item in generated subset')
                continue
            indent = len(item[1])
            if indent % 4:
                fail('list indentation must be a multiple of four spaces')
            depth = indent // 4
            if (list_depth is None and depth != 0) or (list_depth is not None and depth > list_depth + 1):
                fail('list indentation level skipped')
            list_depth = depth
            if re.match(r'\[[ xX]\] ', item[2]):
                fail('task checkbox is outside profile')
        if re.search(r'<(?:/?[A-Za-z][^>]*|!--.*)>', line):
            fail('HTML is outside profile')
        if re.search(r'!\[|\[\^[^\]]+\]|```|~~~|\$\$', line):
            fail('image, footnote or code/math block is outside profile')
    if h1 != 1:
        errors.append(f'expected exactly one H1; found {h1}')
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('files', nargs='+', type=Path)
    args = parser.parse_args()
    failures = 0
    for path in args.files:
        try:
            errors = lint(path)
        except OSError as exc:
            errors = [str(exc)]
        print(f'{path}: ' + ('PASS' if not errors else '\n  ' + '\n  '.join(errors)))
        failures += bool(errors)
    return bool(failures)


if __name__ == '__main__':
    raise SystemExit(main())
