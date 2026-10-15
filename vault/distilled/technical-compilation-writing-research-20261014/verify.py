#!/usr/bin/env python3
"""Check this research's source identities and bounded teaching arithmetic.

Standard library only. Reads Git objects and optional source bytes; never imports,
installs, executes, or fetches upstream code. Prints a JSON receipt to stdout.
"""

import argparse
import hashlib
import json
from fractions import Fraction
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urlparse


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
SCOPE = HERE.relative_to(ROOT).as_posix() + "/"


def read_json(name):
    return json.loads((HERE / name).read_text())


def require(condition, message):
    if not condition:
        raise ValueError(message)


def git(*args):
    return subprocess.check_output(["git", "-C", str(ROOT), *args])


def check_sources(cache):
    sources = read_json("catalog.json")["sources"]
    records = read_json("history.json")["records"]
    history = {item["id"]: item for item in records}
    require(len(history) == len(records), "duplicate history ID")
    ids = {item["id"] for item in sources}
    require(len(ids) == len(sources), "duplicate source ID")
    require(ids == set(history), "catalog/history identity mismatch")
    urls = [s["canonical_url"] for s in sources]
    require(len(urls) == len(set(urls)), "duplicate canonical URL")
    pinned = hashed = live = 0
    for source in sources:
        record = history[source["history_record"]]
        require(record["id"] == source["id"], "wrong history mapping")
        require((HERE / source["card_path"]).is_file(), "missing source card")
        for consumer in source["consumer_paths"]:
            require((HERE / consumer).is_file(), "missing consumer")
        url = urlparse(source["canonical_url"])
        require(url.scheme == "https" and not url.query and not url.username,
                "unexpected non-public URL shape")
        if record["upstream_commit"] is None:
            live += 1
            continue
        parts = unquote(url.path).strip("/").split("/")
        owner, repo, kind, commit = parts[:4]
        require(url.netloc == "github.com" and kind == "blob", "unrecognized source URL")
        require(re.fullmatch(r"[0-9a-f]{40}", commit) is not None, "unpinned Git source")
        require(commit == record["upstream_commit"], "source commit mismatch")
        pinned += 1
        if cache:
            data = (cache / owner / repo / Path(*parts[4:])).read_bytes()
            require(hashlib.sha256(data).hexdigest() == record["file_sha256"],
                    f"source hash mismatch: {source['id']}")
            require(len(data) == record["bytes"], f"source size mismatch: {source['id']}")
            hashed += 1
    return {"catalog_records": len(sources), "pinned_git_files": pinned,
            "source_hashes_rechecked": hashed, "live_pages_without_snapshot": live,
            "source_cache_check": "performed" if cache else "skipped; no cache provided"}


def check_arithmetic():
    fixture = read_json("h01-fixture.json")
    original = git("show", f"{fixture['source_commit']}:{fixture['source_path']}")
    require(hashlib.sha256(original).hexdigest() == fixture["source_sha256"],
            "H01 source identity changed")
    inputs = fixture["inputs"]
    start, end, added = (inputs[k] for k in ("period_start", "period_end", "add_day"))
    price = inputs["full_period_price_per_seat"]
    original_charge = inputs["original_seats"] * price * Fraction(
        inputs["discount_numerator"], inputs["discount_denominator"])
    added_charge = inputs["added_seats"] * price * Fraction(end - added, end - start)
    results = []
    for scenario in fixture["scenarios"]:
        day = scenario["cancel_day"]
        require(start <= added <= day <= end, "invalid scenario interval")
        earned_original = original_charge * Fraction(day - start, end - start)
        earned_added = added_charge * Fraction(day - added, end - added)
        credit = added_charge - earned_added
        cash = original_charge + added_charge
        values = {"original_charge": original_charge, "added_charge": added_charge,
                  "earned": earned_original + earned_added, "credit": credit,
                  "net_charge": cash - credit,
                  "original_future": original_charge - earned_original,
                  "cash_before_confirmation": cash,
                  "cash_after_confirmation": cash - credit}
        require(all(value.denominator == 1 for value in values.values()),
                "scenario needs an explicit fractional-amount rounding policy")
        values = {key: int(value) for key, value in values.items()}
        require(values == scenario["expected"], f"unexpected arithmetic: {scenario['name']}")
        require(values["net_charge"] == values["earned"] + values["original_future"],
                "service allocation does not conserve amount")
        results.append({"name": scenario["name"], "actual": values})
    rounding = fixture["rounding"]
    cumulative = [rounding["amount"] * day // rounding["days"]
                  for day in range(rounding["days"] + 1)]
    daily = [b - a for a, b in zip(cumulative, cumulative[1:])]
    require(daily == rounding["expected_daily"], "rounding mismatch")
    require(sum(daily) == rounding["amount"], "rounding loses units")
    return {"source_sha256": fixture["source_sha256"], "scenarios": results,
            "rounding_daily": daily, "scope": "small synthetic arithmetic; not provider or whole-book validation"}


def check_review_binding(cache):
    if not cache:
        return {"status": "skipped; no source cache provided"}
    book = cache / "bojieli" / "ai-infra-book"
    review = json.loads((book / "research/ch04-whole-chapter-review-2026-09-11/validation.json").read_text())
    actual = hashlib.sha256((book / "manuscripts/04-加速器架构.md").read_bytes()).hexdigest()
    recorded = review["source_sha256"]
    return {"historical_report_sha256": recorded, "inspected_manuscript_sha256": actual,
            "same_input": recorded == actual,
            "meaning": "different input identity; no judgment of current manuscript correctness"}


def check_scope():
    base = read_json("history.json")["praxis_base"]
    paths = set(git("diff", "--name-only", base, "--").decode().splitlines())
    paths.update(git("ls-files", "--others", "--exclude-standard").decode().splitlines())
    require(paths and all(path.startswith(SCOPE) for path in paths),
            "changes outside authorized research scope")
    for path in HERE.rglob("*"):
        if path.is_dir():
            require((path / "README.md").is_file(), f"missing directory README: {path}")
    return {"base": base, "changed_files": len(paths), "allowed_scope": SCOPE}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-cache", type=Path,
                        help="existing read/ directory of original source bytes; no network access")
    args = parser.parse_args()
    receipt = {"status": "passed", "scope": check_scope(),
               "source_identity": check_sources(args.source_cache),
               "h01_arithmetic": check_arithmetic(),
               "infra_review_binding": check_review_binding(args.source_cache),
               "upstream_execution": "none"}
    print(json.dumps(receipt, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
