#!/usr/bin/env python3
"""V03 synthetic invariants; standard library only, no external integrations.

SQLite is a local durability/concurrency model, not a PostgreSQL deployment test.
The instrument is an explicit stub. Failure fixtures are expected rejections;
known-bad algorithms are asserted to disagree with the intended policy.
"""
from collections import deque
from dataclasses import dataclass
from decimal import Decimal as D
from hashlib import sha256
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest


def number(value):
    value = D(str(value))
    if not value.is_finite():
        raise ValueError("non-finite value")
    return value


def fit(points):
    """Unweighted teaching fit, not a validated analytical procedure."""
    points = [(number(x), number(y)) for x, y in points]
    if len(points) < 2:
        raise ValueError("insufficient standards")
    mx = sum(x for x, _ in points) / len(points)
    my = sum(y for _, y in points) / len(points)
    denominator = sum((x - mx) ** 2 for x, _ in points)
    if not denominator:
        raise ValueError("degenerate concentrations")
    slope = sum((x - mx) * (y - my) for x, y in points) / denominator
    if slope <= 0:
        raise ValueError("nonpositive slope forbidden by M1")
    return my - slope * mx, slope, min(x for x, _ in points), max(x for x, _ in points)


def concentration(signal, curve, dilution=1):
    a, b, low, high = curve
    measured = (number(signal) - a) / b
    dilution = number(dilution)
    if dilution <= 0 or not low <= measured <= high:
        raise ValueError("invalid dilution or extrapolation")
    return measured * dilution


@dataclass(frozen=True)
class Calibration:
    valid_from: int = 0
    valid_until: int = 60
    invalid_from: int | None = None

    def permits(self, acquired_at):
        return (self.valid_from <= acquired_at < self.valid_until
                and (self.invalid_from is None or acquired_at < self.invalid_from))


def numeric_decision(c, expanded_uncertainty="0.30", limit="9.0"):
    c, u, limit = map(number, (c, expanded_uncertainty, limit))
    if u < 0:
        raise ValueError("negative uncertainty")
    if c > limit:
        return "oos"
    return "eligible" if c + u <= limit else "review_required"


def evaluate(signal, qc_signal="11.2", acquired_at=50, calibration=Calibration()):
    curve = fit([(0, 1), (5, 11), (10, 21)])
    if not calibration.permits(acquired_at):
        return "calibration_blocked"
    if abs(concentration(qc_signal, curve) - D("5.0")) > D("0.25"):
        return "qc_blocked"
    return numeric_decision(concentration(signal, curve))


def release_candidate(results, investigation_open=False):
    # Results remain in the batch record even when scientifically invalidated.
    if investigation_open or not results:
        return False
    for result in results:
        if result.get("invalidated"):
            if not result.get("scientific_justification") or not result.get("reviewer"):
                return False
            continue
        if result["decision"] != "eligible":
            return False
    return any(not r.get("invalidated") for r in results)


def allocate(tenant, sample_tenant, sample_id, original_volume, aliquots):
    if tenant != sample_tenant:
        raise ValueError("cross-tenant parent")
    total = D(0)
    for item in aliquots:
        if item["tenant"] != tenant or item["sample"] != sample_id:
            raise ValueError("mixed sample identity")
        if item["unit"] != "mL" or number(item["volume"]) <= 0:
            raise ValueError("invalid volume or unit")
        total += number(item["volume"])
    remaining = number(original_volume) - total
    if remaining < 0:
        raise ValueError("over-allocation")
    return remaining


def impacted(reverse_edges, root, first_hop_allowed=None):
    """Reverse derived_from traversal; interval filtering is on result first hops."""
    visited, queue = {root}, deque([root])
    while queue:
        node = queue.popleft()
        for child in reverse_edges.get(node, []):
            if node == root and first_hop_allowed is not None and child not in first_hop_allowed:
                continue
            if child not in visited:
                visited.add(child)
                queue.append(child)
    return visited - {root}


def open_store(path):
    db = sqlite3.connect(path)
    db.executescript("""
      CREATE TABLE IF NOT EXISTS imports (
        tenant TEXT, instrument TEXT, run TEXT, acquisition TEXT, digest TEXT NOT NULL,
        payload TEXT NOT NULL, consumed INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (tenant, instrument, run, acquisition));
      CREATE TABLE IF NOT EXISTS epochs (tenant TEXT PRIMARY KEY, epoch INTEGER);
      CREATE TABLE IF NOT EXISTS lots (
        tenant TEXT, id TEXT, version INTEGER, state TEXT,
        PRIMARY KEY (tenant, id));
      CREATE TABLE IF NOT EXISTS certificates (
        tenant TEXT, lot TEXT, version INTEGER, epoch INTEGER, state TEXT,
        PRIMARY KEY (tenant, lot, version));
      CREATE TABLE IF NOT EXISTS distribution_intents (
        tenant TEXT, lot TEXT, version INTEGER,
        PRIMARY KEY (tenant, lot, version));
    """)
    return db


def import_result(db, tenant, acquisition, payload, instrument="I1", run="R1"):
    body = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    digest = sha256(body.encode()).hexdigest()
    with db:
        old = db.execute("SELECT digest FROM imports WHERE tenant=? AND instrument=? AND run=? AND acquisition=?",
                         (tenant, instrument, run, acquisition)).fetchone()
        if old:
            if old[0] != digest:
                raise ValueError("identity reused with changed content")
            return "existing"
        db.execute("INSERT INTO imports (tenant,instrument,run,acquisition,digest,payload) VALUES (?,?,?,?,?,?)",
                   (tenant, instrument, run, acquisition, digest, body))
    return "created"


def approve(db, tenant, lot, expected_version, expected_epoch):
    # BEGIN IMMEDIATE makes this deterministic local write serialization.
    # Production needs authorized reviewer and full dependency guards as well.
    db.execute("BEGIN IMMEDIATE")
    try:
        epoch = db.execute("SELECT epoch FROM epochs WHERE tenant=?", (tenant,)).fetchone()[0]
        state = db.execute("SELECT version,state FROM lots WHERE tenant=? AND id=?",
                           (tenant, lot)).fetchone()
        if epoch != expected_epoch or state != (expected_version, "review_ready"):
            raise ValueError("stale evidence or lot version")
        db.execute("INSERT INTO certificates VALUES (?,?,?,?,?)",
                   (tenant, lot, expected_version, epoch, "approved"))
        db.execute("UPDATE lots SET version=version+1,state='released' WHERE tenant=? AND id=?",
                   (tenant, lot))
        db.commit()
    except Exception:
        db.rollback()
        raise


def authorize_distribution(db, tenant, lot, version):
    """Local send gate only: no file generation or real network call is modeled.

    A real worker rechecks before sending; if a request is already in flight when
    invalidation occurs, external outcome stays unknown pending reconciliation.
    """
    db.execute("BEGIN IMMEDIATE")
    try:
        epoch = db.execute("SELECT epoch FROM epochs WHERE tenant=?", (tenant,)).fetchone()[0]
        certificate = db.execute("SELECT epoch,state FROM certificates WHERE tenant=? AND lot=? AND version=?",
                                 (tenant, lot, version)).fetchone()
        state = db.execute("SELECT state FROM lots WHERE tenant=? AND id=?", (tenant, lot)).fetchone()[0]
        if certificate != (epoch, "approved") or state != "released":
            raise ValueError("distribution no longer eligible")
        db.execute("INSERT INTO distribution_intents VALUES (?,?,?)", (tenant, lot, version))
        db.execute("UPDATE certificates SET state='issued' WHERE tenant=? AND lot=? AND version=?",
                   (tenant, lot, version))
        db.commit()
    except Exception:
        db.rollback()
        raise


def invalidate(db, tenant, lot):
    # Fixture already knows the affected lot. Graph traversal is tested separately.
    with db:
        db.execute("UPDATE epochs SET epoch=epoch+1 WHERE tenant=?", (tenant,))
        db.execute("UPDATE lots SET version=version+1,state='reassessment_hold' WHERE tenant=? AND id=?",
                   (tenant, lot))
        db.execute("UPDATE certificates SET state='distribution_hold' WHERE tenant=? AND lot=?",
                   (tenant, lot))


class InstrumentStub:
    def __init__(self):
        self.runs, self.start_calls = {}, 0

    def start_then_timeout(self, operation, run):
        self.start_calls += 1
        self.runs[operation] = {"run": run, "state": "acquired"}
        raise TimeoutError("simulated timeout after acceptance")

    def query(self, operation):
        return self.runs.get(operation)


class V03Checks(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "synthetic.sqlite"
        self.db = open_store(self.path)

    def tearDown(self):
        self.db.close()
        self.temp.cleanup()

    def seed_lot(self):
        with self.db:
            self.db.execute("INSERT INTO epochs VALUES ('A',0)")
            self.db.execute("INSERT INTO lots VALUES ('A','L1',1,'review_ready')")

    def test_01_hand_calculation(self):
        curve = fit([(0, 1), (5, 11), (10, 21)])
        self.assertEqual(curve[:2], (D(1), D(2)))
        self.assertEqual(concentration(18, curve), D("8.5"))
        self.assertEqual(concentration("11.2", curve), D("5.1"))
        self.assertEqual(evaluate(18), "eligible")

    def test_02_borderline_and_oos_are_distinct(self):
        self.assertEqual(evaluate("18.6"), "review_required")
        self.assertEqual(evaluate("19.4"), "oos")

    def test_03_degenerate_and_nonfinite_inputs_rejected(self):
        for points in [[(5, 1), (5, 11)], [(0, 11), (10, 1)], [(0, 1), ("NaN", 3)]]:
            with self.subTest(points=points), self.assertRaises(ValueError):
                fit(points)

    def test_04_extrapolation_and_bad_dilution_rejected(self):
        curve = fit([(0, 1), (5, 11), (10, 21)])
        for signal, dilution in [(25, 1), (18, 0), (18, -1)]:
            with self.subTest(signal=signal, dilution=dilution), self.assertRaises(ValueError):
                concentration(signal, curve, dilution)

    def test_05_independent_qc_failure_blocks_good_sample(self):
        self.assertEqual(evaluate(18, qc_signal=12), "qc_blocked")

    def test_06_half_open_calibration_and_late_delivery(self):
        self.assertEqual(evaluate(18, acquired_at=59), "eligible")
        self.assertEqual(evaluate(18, acquired_at=60), "calibration_blocked")
        self.assertEqual(evaluate(18, acquired_at=50), "eligible")  # imported at 90

    def test_07_retrospective_revocation_uses_effective_time(self):
        c = Calibration(invalid_from=40)
        self.assertTrue(c.permits(20))
        self.assertFalse(c.permits(50))

    def test_08_retesting_does_not_erase_oos(self):
        results = [{"decision": "oos"}, {"decision": "eligible"}]
        self.assertFalse(release_candidate(results))
        self.assertFalse(release_candidate([results[1]], investigation_open=True))
        self.assertEqual(len(results), 2)

    def test_09_invalidation_requires_reason_and_reviewer(self):
        records = [{"decision": "oos", "invalidated": True}, {"decision": "eligible"}]
        self.assertFalse(release_candidate(records))
        records[0].update(scientific_justification="synthetic documented preparation error",
                          reviewer="qualified-synthetic-reviewer")
        self.assertTrue(release_candidate(records))
        self.assertEqual(records[0]["decision"], "oos")

    def test_10_aliquot_identity_volume_and_tenant(self):
        aliquots = [{"tenant": "A", "sample": "S1", "unit": "mL", "volume": 10}] * 2
        self.assertEqual(allocate("A", "A", "S1", 40, aliquots), D(20))
        for changed in [dict(aliquots[0], tenant="B"), dict(aliquots[0], sample="S2"),
                        dict(aliquots[0], unit="L"), dict(aliquots[0], volume=41)]:
            with self.subTest(changed=changed), self.assertRaises(ValueError):
                allocate("A", "A", "S1", 40, [changed])

    def test_11_graph_scope_and_cycle_termination(self):
        graph = {"C1": ["T0", "T1"], "T0": ["COA0"], "T1": ["COA1"],
                 "C2": ["T2"], "COA1": ["T1"]}  # corrupt cycle terminates
        self.assertEqual(impacted(graph, "C1", {"T1"}), {"T1", "COA1"})
        self.assertNotIn("T2", impacted(graph, "C1"))

    def test_12_duplicate_and_changed_digest(self):
        self.assertEqual(import_result(self.db, "A", "ACQ1", {"c": "8.5"}), "created")
        self.assertEqual(import_result(self.db, "A", "ACQ1", {"c": "8.5"}), "existing")
        with self.assertRaises(ValueError):
            import_result(self.db, "A", "ACQ1", {"c": "8.1"})
        self.assertEqual(self.db.execute("SELECT count(*) FROM imports").fetchone()[0], 1)

    def test_13_local_store_tenant_key_isolation(self):
        import_result(self.db, "A", "ACQ1", {"c": "8.5"})
        import_result(self.db, "B", "ACQ1", {"c": "9.2"})
        row = self.db.execute("SELECT payload FROM imports WHERE tenant=? AND instrument=? AND run=? AND acquisition=?",
                              ("A", "I1", "R1", "ACQ1")).fetchone()
        self.assertEqual(json.loads(row[0]), {"c": "8.5"})

    def test_14_reopen_after_commit_before_consumption(self):
        import_result(self.db, "A", "ACQ1", {"c": "8.5"})
        self.db.close()
        self.db = open_store(self.path)  # simulated restart; no process kill
        self.assertEqual(import_result(self.db, "A", "ACQ1", {"c": "8.5"}), "existing")
        with self.db:
            self.db.execute("UPDATE imports SET consumed=1 WHERE tenant='A' AND instrument='I1' AND run='R1' AND acquisition='ACQ1'")
        self.assertEqual(self.db.execute("SELECT count(*),sum(consumed) FROM imports").fetchone(), (1, 1))

    def test_15_two_stale_approvals_only_one_certificate(self):
        self.seed_lot()
        second = open_store(self.path)
        try:
            approve(self.db, "A", "L1", 1, 0)
            with self.assertRaises(ValueError):
                approve(second, "A", "L1", 1, 0)
            self.assertEqual(second.execute("SELECT count(*) FROM certificates").fetchone()[0], 1)
        finally:
            second.close()

    def test_16_invalidation_before_approval_blocks_snapshot(self):
        self.seed_lot()
        invalidate(self.db, "A", "L1")
        with self.assertRaises(ValueError):
            approve(self.db, "A", "L1", 1, 0)
        self.assertEqual(self.db.execute("SELECT count(*) FROM certificates").fetchone()[0], 0)

    def test_17_invalidation_after_approval_preserves_and_holds_certificate(self):
        self.seed_lot()
        approve(self.db, "A", "L1", 1, 0)
        authorize_distribution(self.db, "A", "L1", 1)
        invalidate(self.db, "A", "L1")
        self.assertEqual(self.db.execute("SELECT epoch,state FROM certificates").fetchone(),
                         (0, "distribution_hold"))
        self.assertEqual(self.db.execute("SELECT state FROM lots").fetchone()[0], "reassessment_hold")

    def test_18_unknown_outcome_and_old_notification_stub(self):
        instrument = InstrumentStub()
        with self.assertRaises(TimeoutError):
            instrument.start_then_timeout("OP1", "R1")
        operation_state = "unknown"
        self.assertEqual(operation_state, "unknown")
        current = instrument.query("OP1")
        old_notification = {"run": "R1", "state": "acquiring"}
        self.assertNotEqual(old_notification["state"], current["state"])
        projected = instrument.query("OP1")["state"]  # reconcile, not arrival order
        self.assertEqual(projected, "acquired")
        self.assertEqual(instrument.start_calls, 1)

    def test_19_known_bad_strategies_are_exposed(self):
        bad_last_only = [{"decision": "oos"}, {"decision": "eligible"}][-1]["decision"] == "eligible"
        self.assertTrue(bad_last_only)
        self.assertFalse(release_candidate([{"decision": "oos"}, {"decision": "eligible"}]))
        bad_ignore_uncertainty = D("8.8") <= D("9.0")
        self.assertTrue(bad_ignore_uncertainty)
        self.assertEqual(numeric_decision("8.8"), "review_required")
        bad_use_import_time = Calibration().permits(90)
        self.assertFalse(bad_use_import_time)
        self.assertTrue(Calibration().permits(50))

    def test_20_invalidation_after_approval_before_issue_blocks_distribution(self):
        self.seed_lot()
        approve(self.db, "A", "L1", 1, 0)
        self.assertEqual(self.db.execute("SELECT state FROM certificates").fetchone()[0], "approved")
        invalidate(self.db, "A", "L1")
        with self.assertRaises(ValueError):
            authorize_distribution(self.db, "A", "L1", 1)
        self.assertEqual(self.db.execute("SELECT count(*) FROM distribution_intents").fetchone()[0], 0)
        self.assertEqual(self.db.execute("SELECT state FROM certificates").fetchone()[0], "distribution_hold")

    def test_21_full_acquisition_key_avoids_instrument_and_run_collisions(self):
        import_result(self.db, "A", "ACQ1", {"c": "8.5"}, instrument="I1", run="R1")
        import_result(self.db, "A", "ACQ1", {"c": "9.2"}, instrument="I2", run="R1")
        import_result(self.db, "A", "ACQ1", {"c": "8.7"}, instrument="I1", run="R2")
        self.assertEqual(self.db.execute("SELECT count(*) FROM imports").fetchone()[0], 3)
        with self.assertRaises(ValueError):
            import_result(self.db, "A", "ACQ1", {"c": "7.0"}, instrument="I1", run="R1")


if __name__ == "__main__":
    unittest.main(verbosity=2)
