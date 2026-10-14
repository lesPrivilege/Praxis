#!/usr/bin/env python3
"""Independent byte/provenance checks for the frozen SaaS repair delivery.

Run from any directory with Python 3 and the source Git object database available:
    python3 -B docs/reviews/saas-final-repair-verification-20261014/provenance/verify_provenance.py

The historical probes run in temporary archive trees. A temporary Git metadata
directory points at the source object database so read-only `git show` calls
inside the old probes work without checking out any commit.
"""
from __future__ import annotations

import hashlib
import json
import os
import pathlib
import subprocess
import tarfile
import tempfile


ROOT = pathlib.Path(__file__).resolve().parents[4]
FROZEN = "5e6b7e3bc4e7d2bcfe737c231ddfe0c3be015f5b"
ATLAS_START = "cd8d77b6166a6fc566f6aa09b4d9af3e11537408"
ATLAS_REPAIR = "0a579621747993223491eb867ad002be41bfe828"
CASE_IMPORT = "5c5f7098561d4d87403986d6c3edf58cde20a5e7"
CASE_REVIEWED = "6d9e6c1807f7f77f36ef1cbd4e5c1a090d6a8cc8"
FOUND_IMPORT = "b97d728bd2a2abe4687203592ac1341242f07333"
FOUND_REVIEWED = "ee597ceaa3675f818746c6122353858872af17e4"
WHOLE_IMPORT = "7aa7da4c9f64d589733a1feb3e14e8697c101e1e"
WHOLE_REVIEWED = ATLAS_START
OUT = ROOT / "docs/reviews/saas-final-repair-verification-20261014/provenance"


def git(*args: str, binary: bool = False, cwd: pathlib.Path = ROOT):
    result = subprocess.run(["git", *args], cwd=cwd, check=True, stdout=subprocess.PIPE)
    return result.stdout if binary else result.stdout.decode().strip()


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def blob(revision: str, path: str) -> bytes:
    return git("show", f"{revision}:{path}", binary=True)


def load_blob(revision: str, path: str):
    return json.loads(blob(revision, path))


def tracked_tree_files(revision: str, prefix: str) -> list[str]:
    return git("ls-tree", "-r", "--name-only", revision, "--", prefix).splitlines()


def audit_preservation() -> dict:
    groups = [
        ("case", CASE_IMPORT, CASE_REVIEWED, "docs/reviews/saas-case-independent-review-20261014", "probes.py"),
        ("foundations", FOUND_IMPORT, FOUND_REVIEWED, "docs/reviews/saas-foundations-independent-review-20261014", "audit_checks.py"),
        ("whole_book", WHOLE_IMPORT, WHOLE_REVIEWED, "docs/reviews/saas-whole-book-review-20261014", "book_checks.py"),
    ]
    checked = []
    for name, source_commit, reviewed_commit, prefix, _ in groups:
        paths = tracked_tree_files(source_commit, prefix)
        comparisons = []
        for path in paths:
            source_hash = sha(blob(source_commit, path))
            frozen_hash = sha(blob(FROZEN, path))
            if source_hash != frozen_hash:
                raise AssertionError(f"frozen audit mismatch: {path} source={source_hash} frozen={frozen_hash}")
            comparisons.append({"path": path, "sha256": source_hash})
        # Reviewed commits carry the source tree, not the later imported audit.
        subprocess.run(["git", "cat-file", "-e", f"{reviewed_commit}^{{commit}}"],
                       cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
        checked.append({"name": name, "source_commit": source_commit,
                        "reviewed_commit": reviewed_commit, "file_count": len(paths),
                        "files_byte_identical": len(comparisons), "files": comparisons})

    # Whole-book import commit itself is also named in its repair record.
    return {"groups": checked, "total_original_files": sum(g["file_count"] for g in checked)}


def historical_probe(name: str, import_commit: str, reviewed_commit: str,
                     audit_dir: str, script: str) -> dict:
    """Archive a reviewed tree and overlay only the exact imported audit files."""
    with tempfile.TemporaryDirectory(prefix=f"praxis-prov-{name}-") as temp:
        work = pathlib.Path(temp)
        archive = work / "tree.tar"
        with archive.open("wb") as stream:
            subprocess.run(["git", "archive", reviewed_commit], cwd=ROOT,
                           stdout=stream, check=True)
        with tarfile.open(archive) as tf:
            tf.extractall(work, filter="data")
        # Give this archive a private Git metadata directory backed by source objects.
        subprocess.run(["git", "init", "-q"], cwd=work, check=True)
        git_dir = work / ".git"
        objects = git_dir / "objects"
        objects.mkdir(exist_ok=True)
        source_objects = pathlib.Path(git("rev-parse", "--git-path", "objects"))
        if not source_objects.is_absolute():
            source_objects = ROOT / source_objects
        (objects / "info").mkdir(parents=True, exist_ok=True)
        (objects / "info/alternates").write_text(str(source_objects.resolve()) + "\n")
        subprocess.run(["git", "update-ref", "refs/heads/frozen-source", reviewed_commit], cwd=work, check=True)
        subprocess.run(["git", "symbolic-ref", "HEAD", "refs/heads/frozen-source"], cwd=work, check=True)

        paths = tracked_tree_files(import_commit, audit_dir)
        for rel in paths:
            target = work / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(blob(import_commit, rel))
        result = subprocess.run(["python3", "-B", f"{audit_dir}/{script}"], cwd=work,
                                check=False, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode:
            raise RuntimeError(f"{name} probe failed ({result.returncode}): "
                               f"{result.stderr.decode(errors='replace')[-2000:]}")
        stdout_hash = sha(result.stdout)
        # Check generated report matches the audit's separately committed result artifact.
        expected_name = {"case": "probes-results.json", "foundations": "check-results.json",
                         "whole_book": "book-check-results.json", "enterprise": "enterprise-results.json"}[name]
        expected_path = f"{audit_dir}/{expected_name}"
        if stdout_hash != sha(blob(import_commit, expected_path)):
            raise AssertionError(f"{name} reproduced stdout differs from imported report {expected_path}")
        parsed = json.loads(result.stdout)
        observed = parsed.get("status") or parsed.get("result") or "exit-zero historical observations"
        if name == "enterprise":
            observed = parsed.get("result")
        return {"name": name, "exit_code": result.returncode, "result": observed,
                "stdout_sha256": stdout_hash, "expected_result_sha256": sha(blob(import_commit, expected_path)),
                "stderr_empty": not result.stderr, "reviewed_commit": reviewed_commit,
                "audit_source_commit": import_commit, "audit_file_count": len(paths)}


def source_provenance() -> dict:
    prefix = "vault/provenance/saas-engineering-atlas/"

    def data(rev: str, filename: str):
        return load_blob(rev, prefix + filename)

    source_counts = {}
    for rev in (ATLAS_START, ATLAS_REPAIR, FROZEN):
        cat, reviews, claims = data(rev, "catalog.json"), data(rev, "reviews.json"), data(rev, "claims.json")
        source_counts[rev] = {"catalog_sources": len(cat["sources"]),
                              "source_read_records": len(reviews["source_records"]),
                              "review_reads": len(reviews["reviews"]), "claims": len(claims["claims"])}

    # Stable identity/read/history records from atlas integration must be intact.
    preservation = []
    for filename, array_name, key in [
        ("reviews.json", "source_records", "source_id"),
        ("reviews.json", "reviews", "review_id"),
        ("claims.json", "claims", "id"),
    ]:
        old = data(ATLAS_START, filename)[array_name]
        new = data(FROZEN, filename)[array_name]
        old_map, new_map = {row[key]: row for row in old}, {row[key]: row for row in new}
        missing = sorted(old_map.keys() - new_map.keys())
        changed = sorted(k for k in old_map.keys() & new_map.keys() if old_map[k] != new_map[k])
        if missing or changed:
            raise AssertionError(f"old provenance changed in {filename}:{array_name}; missing={missing[:10]} changed={changed[:10]}")
        added = sorted(new_map.keys() - old_map.keys())
        preservation.append({"collection": f"{filename}:{array_name}", "old_count": len(old),
                             "final_count": len(new), "old_records_preserved_exactly": len(old),
                             "additions": len(added), "added_ids": added})

    # Catalog source objects may gain additive aliases/claims/reader paths.
    old_sources = {r["id"]: r for r in data(ATLAS_START, "catalog.json")["sources"]}
    final_sources = {r["id"]: r for r in data(FROZEN, "catalog.json")["sources"]}
    missing_sources = sorted(old_sources.keys() - final_sources.keys())
    if missing_sources:
        raise AssertionError(f"source identities deleted: {missing_sources}")
    enriched = []
    additive_fields = {"aliases", "supported_claims", "grammar_paths", "review_ids"}
    for identity, old in old_sources.items():
        new = final_sources[identity]
        if old == new:
            continue
        for key, value in old.items():
            if key in additive_fields:
                if not all(item in new.get(key, []) for item in value):
                    raise AssertionError(f"old source field removed: {identity}.{key}")
            elif new.get(key) != value:
                raise AssertionError(f"non-additive source change: {identity}.{key}")
        enriched.append(identity)

    evidence_results = []
    for filename in ("repair-evidence.json", "whole-book-repair-evidence.json"):
        evidence = data(FROZEN, filename)
        catalog = data(FROZEN, "catalog.json")["sources"]
        global_reviews = data(FROZEN, "reviews.json")["reviews"]
        global_source_records = data(FROZEN, "reviews.json")["source_records"]
        global_claims = data(FROZEN, "claims.json")["claims"]
        catalog_ids = {s["id"] for s in catalog}
        catalog_aliases = {alias for s in catalog for alias in s.get("aliases", [])}
        review_ids = {r["review_id"] for r in global_reviews}
        claim_ids = {c["id"] for c in global_claims}
        source_record_ids = {r["source_id"] for r in global_source_records}
        expected_sources = {s["id"] for s in evidence["sources"]}
        expected_reviews = {r["id"] for r in evidence["reviews"]}
        expected_claims = {c["id"] for c in evidence["claims"]}
        missing = {"sources": sorted(expected_sources - catalog_ids - catalog_aliases),
                   "reviews": sorted(expected_reviews - review_ids),
                   "claims": sorted(expected_claims - claim_ids)}
        if any(missing.values()):
            raise AssertionError(f"evidence projection missing from global provenance ({filename}): {missing}")
        if not expected_sources.issubset(source_record_ids):
            raise AssertionError(f"evidence sources lack read records ({filename}): {sorted(expected_sources-source_record_ids)}")
        source_by_id = {r["source_id"]: r for r in global_source_records}
        for source in evidence["sources"]:
            projected = source_by_id[source["id"]]
            if projected["origin_path"] != prefix + filename or projected["original_record"] != source:
                raise AssertionError(f"source read projection differs from scoped evidence: {filename}:{source['id']}")
        review_by_id = {r["review_id"]: r for r in global_reviews}
        claim_by_id = {c["id"]: c for c in global_claims}
        for review in evidence["reviews"]:
            projected = review_by_id[review["id"]]
            if projected["origin_path"] != prefix + filename or projected["original_record"] != review:
                raise AssertionError(f"review projection differs from scoped evidence: {filename}:{review['id']}")
        allowed_paths = set()
        for claim in evidence["claims"]:
            projected = claim_by_id[claim["id"]]
            if projected.get("origin_path") != prefix + filename:
                raise AssertionError(f"claim projection path mismatch: {filename}:{claim['id']}")
            for key, value in claim.items():
                if projected.get(key) != value:
                    raise AssertionError(f"claim projection field mismatch: {filename}:{claim['id']}.{key}")
            for path in claim.get("chapter_paths", []):
                allowed_paths.add(path)
                if not (ROOT / path).is_file():
                    raise AssertionError(f"evidence chapter path missing: {filename}:{path}")
            unknown_sources = set(claim.get("source_ids", [])) - expected_sources
            if unknown_sources:
                raise AssertionError(f"claim references out-of-scope source: {filename}:{claim['id']} {sorted(unknown_sources)}")
        evidence_results.append({"file": filename, "scope": evidence["scope"],
                                 "sources": len(evidence["sources"]), "reviews": len(evidence["reviews"]),
                                 "claims": len(evidence["claims"]), "all_ids_projected": True,
                                 "scoped_records_project_exactly": True,
                                 "claim_chapter_paths": sorted(allowed_paths),
                                 "claim_source_references_in_scope": True})

    # Prior author evidence promised by the first repair record is independently
    # recomputed at the initial and final commits; no historic JSON hashes are trusted.
    verification = load_blob(FROZEN, "docs/reviews/saas-atlas-repairs-20261014/verification.json")
    author_hashes = verification["original_author_evidence_sha256"]
    author_checks = []
    for path, claimed in sorted(author_hashes.items()):
        initial_hash, final_hash = sha(blob(ATLAS_START, path)), sha(blob(FROZEN, path))
        if initial_hash != final_hash:
            raise AssertionError(f"original author evidence changed: {path}")
        if final_hash != claimed:
            raise AssertionError(f"verification hash inaccurate for author evidence: {path}")
        author_checks.append({"path": path, "sha256": final_hash})

    paths = {}
    for a, b in ((ATLAS_START, ATLAS_REPAIR), (ATLAS_REPAIR, FROZEN)):
        diff = git("diff", "--name-status", a, b, "--", "vault/provenance/saas-engineering-atlas", "vault/distilled/saas-engineering-atlas").splitlines()
        statuses = {"added": 0, "modified": 0, "deleted": 0, "renamed": 0}
        entries = []
        for line in diff:
            parts = line.split("\t")
            code = parts[0]
            status = "added" if code.startswith("A") else "deleted" if code.startswith("D") else "renamed" if code.startswith("R") else "modified"
            statuses[status] += 1
            entries.append({"status": code, "path": parts[-1]})
        paths[f"{a[:7]}..{b[:7]}"] = {**statuses, "changed_paths": entries}

    return {"counts_by_commit": source_counts, "old_record_preservation": preservation,
            "catalog_source_identities_retained": len(old_sources),
            "catalog_entries_with_only_additive_evidence": enriched,
            "source_evidence_packages": evidence_results,
            "original_author_evidence_byte_preservation": {"file_count": len(author_checks), "files": author_checks},
            "scoped_change_paths": paths}


def main() -> None:
    actual_head = git("rev-parse", "HEAD")
    if actual_head != FROZEN:
        raise RuntimeError(f"expected frozen HEAD {FROZEN}, found {actual_head}")
    preservation = audit_preservation()
    probes = [
        historical_probe("case", CASE_IMPORT, CASE_REVIEWED,
                         "docs/reviews/saas-case-independent-review-20261014", "probes.py"),
        historical_probe("foundations", FOUND_IMPORT, FOUND_REVIEWED,
                         "docs/reviews/saas-foundations-independent-review-20261014", "audit_checks.py"),
        historical_probe("whole_book", WHOLE_IMPORT, WHOLE_REVIEWED,
                         "docs/reviews/saas-whole-book-review-20261014", "book_checks.py"),
        historical_probe("enterprise", WHOLE_IMPORT, WHOLE_REVIEWED,
                         "docs/reviews/saas-whole-book-review-20261014", "enterprise-probes.py"),
    ]
    result = {"status": "pass", "frozen_commit": FROZEN,
              "audit_file_preservation": preservation,
              "historical_probe_reproduction": probes,
              "atlas_source_provenance": source_provenance(),
              "limits": ["Structural identity, content-hash and record-projection checks only.",
                         "Historical defect probes intentionally run on their reviewed commits.",
                         "No live external source reopening or raw manuscript retest was performed."]}
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "results.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"status": result["status"], "total_original_files": preservation["total_original_files"],
                      "historical_probes": len(probes),
                      "old_provenance_collections": result["atlas_source_provenance"]["old_record_preservation"],
                      "output": "docs/reviews/saas-final-repair-verification-20261014/provenance/results.json"},
                     ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
