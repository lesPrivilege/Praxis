# SaaS repair provenance verification

Independent read-only verification of frozen commit `5e6b7e3bc4e7d2bcfe737c231ddfe0c3be015f5b`. The check recomputes SHA-256 from Git blobs at the cited source commits and final commit; it does not use the repair records' historical-reproduction hashes as its oracle.

Run from the repository root:

```sh
python3 -B docs/reviews/saas-final-repair-verification-20261014/provenance/verify_provenance.py
```

The script archives each reviewed commit under a temporary directory, overlays the audit directory from its exact import commit, and runs the original read-only probe. It attaches a temporary Git metadata directory to the local object database so a probe can use `git show`; it does not check out or change repository refs. All four probes exited zero, and each fresh stdout SHA-256 equals that probe's separately committed result file.

| Audit | Imported audit source | Reviewed source | Files verified | Probe |
| --- | --- | --- | ---: | --- |
| Case independent review | `5c5f7098561d4d87403986d6c3edf58cde20a5e7` | `6d9e6c1807f7f77f36ef1cbd4e5c1a090d6a8cc8` | 8 | Reproduced |
| Foundations independent review | `b97d728bd2a2abe4687203592ac1341242f07333` | `ee597ceaa3675f818746c6122353858872af17e4` | 5 | Reproduced |
| Whole-book independent review | `7aa7da4c9f64d589733a1feb3e14e8697c101e1e` | `cd8d77b6166a6fc566f6aa09b4d9af3e11537408` | 15 | Reproduced |

All 28 original audit files are byte-identical in the final commit. Case, foundations, and whole-book probes reproduce their historical observations, including the reviewed defects; these are provenance checks, not repair acceptance tests.

The audit of provenance transitions `cd8d77b → 0a57962 → 5e6b7e3` finds no deletion or mutation in the original source-read records, review records, or claims. From the initial commit to the frozen commit, all 210 prior source-record entries, 222 prior review entries, and 386 prior claims remain exactly equal. The 205 original catalog source identities also remain. Three existing catalog entries receive additive claim, locator, or alias links; their prior URLs, claims, review IDs, and scope metadata remain. Eight original author evidence files have matching bytes at the initial and frozen commits.

The append-only evidence packages resolve to 5 new repair rereads, 5 associated review records, and 10 claims for the atlas repairs; and 4 rereads, 4 review records, and 9 claims for the whole-book repairs. Every source, review, and claim ID projects into the global provenance records; claim source references stay within the corresponding evidence package, and each cited chapter path exists. WB terms that refer to existing Procore or ServiceNow source identities are represented as aliases and added read/claim links, while the original records and read history remain intact.

Provenance counts across the three commits are recorded in [results.json](results.json), together with each source-file SHA-256, every provenance change path, fresh probe hashes, and the exact additions. The check verifies object identity, preservation, projection, and path scope. It does not reopen live external sources or retest the raw manuscript.
