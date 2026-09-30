"""Synthetic business-semantic example; not a production approval engine."""
import json
from pathlib import Path
def judge(case):
    if case.get("state") == "approved":
        return "already_decided"
    if case["revision"] != 1:
        return "revalidate"
    if not case["paid"] or not case["returned"]:
        return "needs_evidence"
    return "ready_for_review"
cases = json.loads(Path(__file__).with_name("cases.json").read_text())
for case in cases:
    result = judge(case)
    assert result == case["expected"], (case["id"], result)
    assert result != "approved"
print("PASS: 4 synthetic cases; no automated approval, real-model or business acceptance claim")
