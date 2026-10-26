"""Read-only independent probes of the frozen enterprise teaching package.

Run from the repository root. Exit zero means the frozen observations reproduced,
including defects; it does not mean those defects were repaired.
"""
import hashlib
import json
from pathlib import Path
import subprocess
import sys

sys.dont_write_bytecode = True
REPO = Path(__file__).resolve().parents[3]
ASSET = REPO / "vault/distilled/saas-engineering-atlas/enterprise-mechanisms"
BOOK = REPO / "projects/books/saas-engineering/enterprise-mechanisms"
FROZEN = "cd8d77b6166a6fc566f6aa09b4d9af3e11537408"
sys.path.insert(0, str(ASSET))
from mechanism_lab import Change, FakeAdapter, OperationJournal, RuleError


def intent(change=None):
    change = change or Change()
    change.approve("owner", "service-owner")
    return change.intent("operator", "executor")


def independent_arithmetic():
    examples = json.loads((ASSET / "examples.json").read_text())
    purchase, change = [item["policy"] for item in examples["examples"]]
    # These expressions do not call the author's arithmetic or tests.
    commitment = purchase["requested_qty"] * purchase["price_minor"]
    settlement = purchase["accepted_qty"] * purchase["price_minor"]
    calculated = {
        "commitment_fen": commitment,
        "changed_price_commitment_fen": 12 * 82000,
        "settlement_fen": settlement,
        "prepayment_fen": commitment * 30 // 100,
        "quantity_conservation_units": purchase["accepted_qty"]
        + purchase["pending_inspection_qty"] + purchase["not_received_qty"],
        "received_acceptance_percent": purchase["accepted_qty"] * 100 // purchase["received_qty"],
        "commitment_settlement_percent": purchase["accepted_qty"] * 100 // purchase["requested_qty"],
        "worker_limit_before_after": [change["initial_worker_limit"], change["desired_worker_limit"]],
        "configuration_versions_before_after": [8, 8 + 1],
        "probe_pass_percent_before_after": [8 * 100 // 10, 10 * 100 // 10],
        "cutover_before_total": sum([12, 5, 2, 1]),
        "cutover_after_total": sum([12, 6, 1, 1]),
        "cutover_routinely_actionable_percent": (12 + 6) * 100 // 20,
        "training_pass_percent_rounded": round(5 * 100 / 6, 1),
        "configuration_person_days": 8 + 8 * 1,
        "customization_person_days": 20 + 8 * 4,
        "incremental_person_days": (20 + 8 * 4) - (8 + 8 * 1),
        "saved_person_days_30_minutes": 30 * 220 * 2 / (8 * 60),
        "saved_person_days_60_minutes": 60 * 220 * 2 / (8 * 60),
    }
    expected = {
        "commitment_fen": 960000, "changed_price_commitment_fen": 984000,
        "settlement_fen": 720000, "prepayment_fen": 288000,
        "quantity_conservation_units": 12, "received_acceptance_percent": 90,
        "commitment_settlement_percent": 75, "worker_limit_before_after": [4, 6],
        "configuration_versions_before_after": [8, 9], "probe_pass_percent_before_after": [80, 100],
        "cutover_before_total": 20, "cutover_after_total": 20,
        "cutover_routinely_actionable_percent": 90, "training_pass_percent_rounded": 83.3,
        "configuration_person_days": 16, "customization_person_days": 52,
        "incremental_person_days": 36, "saved_person_days_30_minutes": 27.5,
        "saved_person_days_60_minutes": 55.0,
    }
    assert calculated == expected
    return calculated


def acceptance_probe():
    observations = []
    for passed, total in [(8, 10), (1, 1), (9, 9), (10, 10)]:
        journal = OperationJournal()
        try:
            journal.enqueue(intent())
            journal.dispatch("T-1", "OP-42", FakeAdapter())
            try:
                outcome = journal.accept("T-1", "OP-42", "owner", "service-owner",
                                         passed, total, "synthetic-probe-evidence")
            except RuleError as exc:
                outcome = str(exc)
            observations.append({"passed": passed, "total": total, "outcome": outcome})
        finally:
            journal.close()
    assert [x["outcome"] for x in observations] == ["acceptance_failed", "closed", "closed", "closed"]
    return observations


def contradictory_receipt_probe():
    # A deliberately faulty provider response contradicts its actual operation ledger.
    # This probes contract-error handling, not a normal compliant provider trace.
    class ContradictoryProvider(FakeAdapter):
        def submit(self, body):
            return {**super().submit(body), "state": "rejected"}

    provider, journal = ContradictoryProvider(), OperationJournal()
    try:
        journal.enqueue(intent())
        first = journal.dispatch("T-1", "OP-42", provider)
        later = journal.reconcile("T-1", "OP-42", provider)
        result = {"dispatch_outcome": first, "provider_observation": provider.lookup("T-1", "OP-42")["state"],
                  "reconcile_outcome": later, "journal_evidence": json.loads(journal.row("T-1", "OP-42")["result"])["state"],
                  "actual_provider_effect_count": provider.effect_count}
        assert result == {"dispatch_outcome": "rejected", "provider_observation": "applied",
                          "reconcile_outcome": "rejected", "journal_evidence": "rejected",
                          "actual_provider_effect_count": 1}
        second_provider, second_journal = FakeAdapter(), OperationJournal()
        try:
            second_journal.enqueue(intent())
            second_journal.dispatch("T-1", "OP-42", second_provider)
            original_row = second_journal.row("T-1", "OP-42")
            second_provider.entries[("T-1", "OP-42")][1]["receipt"] = "contradictory-new-receipt"
            outcome = second_journal.reconcile("T-1", "OP-42", second_provider)
            final_row = second_journal.row("T-1", "OP-42")
            assert original_row == final_row
            result["same_state_conflict"] = {
                "provider_state": "applied", "provider_receipt": "contradictory-new-receipt",
                "reconcile_outcome": outcome,
                "stored_receipt": json.loads(final_row["result"])["receipt"],
                "entire_journal_row_unchanged": original_row == final_row,
                "journal_columns": [row[1] for row in second_journal.db.execute("PRAGMA table_info(operations)")],
            }
        finally:
            second_journal.close()
        return result
    finally:
        journal.close()


def revision_probe():
    journal, provider = OperationJournal(), FakeAdapter()
    try:
        first = intent()
        journal.enqueue(first)
        journal.dispatch("T-1", "OP-42", provider)
        revised = Change(revision=4, config_version=9, desired=8)
        second = intent(revised)
        try:
            outcome = journal.enqueue(second)
        except RuleError as exc:
            outcome = str(exc)
        assert outcome == "idempotency_conflict"
        assert second["business_key"] == "CHG-42/r3/apply"
        return {"approved_revision": json.loads(revised.approval["scope"])["revision"],
                "resulting_approval_ref": second["approval_ref"], "resulting_business_key": second["business_key"],
                "resulting_operation_id": second["operation_id"], "enqueue_outcome": outcome}
    finally:
        journal.close()


def data_alignment():
    examples = json.loads((ASSET / "examples.json").read_text())["examples"]
    policy = examples[0]["policy"]
    receipt = FakeAdapter().submit(intent())
    return {"derived_not_received_units": policy["requested_qty"] - policy["received_qty"],
            "pending_inspection_units": policy["pending_inspection_qty"],
            "sidecar_remaining_delivery_qty": examples[0]["steps"][-1]["effect"]["remaining_delivery_qty"],
            "receipt_fields": sorted(receipt), "receipt_has_used_expected_version": "expected_version" in receipt}


def main():
    # Root may commit this review on a descendant branch. Verify audited file bytes
    # still match the frozen target instead of requiring HEAD itself to be frozen.
    paths = sorted(list(BOOK.glob("*.md")) + list(ASSET.glob("*.py")) + list(ASSET.glob("*.json")))
    hashes = {}
    for path in paths:
        relative = path.relative_to(REPO).as_posix()
        frozen = subprocess.check_output(["git", "show", FROZEN + ":" + relative], cwd=REPO)
        assert path.read_bytes() == frozen, "audited content changed: " + relative
        hashes[relative] = hashlib.sha256(frozen).hexdigest()
    print(json.dumps({"frozen_sha": FROZEN, "result": "frozen_observations_reproduced",
                      "arithmetic": independent_arithmetic(), "EMR-01": acceptance_probe(),
                      "EMR-02": contradictory_receipt_probe(), "EMR-03": revision_probe(),
                      "data_alignment": data_alignment(), "audited_file_sha256": hashes}, indent=2))


if __name__ == "__main__":
    main()
