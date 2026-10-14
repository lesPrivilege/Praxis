# SaaS cases: independent review

Reviewed `lesPrivilege/Praxis` at **`6d9e6c1807f7f77f36ef1cbd4e5c1a090d6a8cc8`**, from `cloud/saas-engineering-atlas-20261014`, on 2026-10-14. Delivery branch: `cloud/saas-case-independent-review-20261014`.

The scope is all 33 chapters and the corresponding evidence, models, examples, checks and transfer claims in the six completed packages. Foundations and enterprise-mechanisms are excluded. This directory contains review material only; the textbook, product, source evidence and example implementations were not edited.

- [Review and repair priorities](review.md)
- [Machine-readable case coverage](coverage.json): all 33 cases, hashes, reading depth, sampled source checks, tests and limits
- [Adjudicated findings](findings.json): exact paths, lines, evidence, repairs and severity
- [Check receipt](checks.json): actual command output and scope
- [Independent probes](probes.py) and [observed results](probes-results.json)
- [Supplemental primary-source checks](source-review.json)

Six fresh `gpt-6-luna` reviewers examined disjoint packages. A fresh `gpt-6-astra` reviewer challenged selected invariants. The coordinating Codex agent reconciled their findings, reopened selected sources, inspected shared semantics and transfer data, and reran the supplied checks. These are actual review roles, not the cases' authorship history. Model identifiers describe the requested reviewer configurations; no unexposed model build is asserted.

Coverage is deliberately explicit: every case received structural review, but factual verification, topology semantics and adversarial input exploration were sampled. A passing script is evidence about its local model, not proof of provider behavior, production isolation, regulatory compliance or teaching effectiveness.

To reproduce the additional probes from the repository root:

```bash
python3 -B docs/reviews/saas-case-independent-review-20261014/probes.py
```

The probe runner checks that the recorded weaknesses and controls are reproducible at the frozen revision. A successful exit therefore means the observations reproduced; it does **not** mean those weaknesses are repaired. It uses only standard-library code and a temporary SQLite database.
