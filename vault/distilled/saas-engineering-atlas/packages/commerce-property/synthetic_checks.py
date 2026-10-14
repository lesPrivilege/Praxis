#!/usr/bin/env python3
"""P05 executable teaching models, Python stdlib only; no provider integration.

Run from any directory. Emits JSON to stdout and exits nonzero on unexpected
failure. Fixed fixtures are invented. SQLite tests exercise only the declared
local model, not PostgreSQL, an HTTP API, a browser, or a production payment rail.
Counterexamples deliberately execute unsafe alternatives and report what breaks.
"""
import itertools
import json
import platform
import sqlite3
import sys
import tempfile
import traceback
from datetime import date, datetime, timezone
from fractions import Fraction
from pathlib import Path
from zoneinfo import ZoneInfo


def require(condition, reason):
    if not condition:
        raise AssertionError(reason)


def rejects(call, error=ValueError):
    try:
        call()
    except error:
        return
    raise AssertionError(f"expected {error.__name__}")


def apportion(total, weights):
    """Integer largest remainder; stable input order resolves equal remainders."""
    if not isinstance(total, int) or total < 0 or not weights:
        raise ValueError("nonnegative integer amount and nonempty weights required")
    if any(not isinstance(w, int) or w < 0 for w in weights) or sum(weights) <= 0:
        raise ValueError("nonnegative integer weights with positive sum required")
    denominator = sum(weights)
    amounts = [total * w // denominator for w in weights]
    order = sorted(range(len(weights)), key=lambda i: (-(total * weights[i] % denominator), i))
    for i in order[:total - sum(amounts)]:
        amounts[i] += 1
    return amounts


def quantity_state(ordered, shipped, cancelled, returned):
    if min(ordered, shipped, cancelled, returned) < 0:
        raise ValueError("negative quantity")
    if shipped + cancelled > ordered or returned > shipped:
        raise ValueError("quantity conservation violated")
    return {"pending": ordered - shipped - cancelled, "net_kept": shipped - returned}


class Tender:
    """Synthetic check-level exposure, not a provider payment implementation."""
    def __init__(self, due):
        self.due = due
        self.attempts = {}

    @property
    def settled(self):
        return sum(a for a, s in self.attempts.values() if s == "succeeded")

    @property
    def available(self):
        # Both in-flight and unknown attempts reserve the check balance.
        return self.due - sum(a for a, s in self.attempts.values() if s != "failed")

    @property
    def closed(self):
        return self.settled == self.due and all(s in ("failed", "succeeded") for _, s in self.attempts.values())

    def submit(self, key, amount):
        if key in self.attempts:
            if self.attempts[key][0] != amount:
                raise ValueError("same key with changed request")
            return "same-attempt"
        if amount <= 0 or amount > self.available:
            raise ValueError("no collectible balance")
        self.attempts[key] = (amount, "pending")
        return "created"

    def observe(self, key, state):
        if state not in ("unknown", "succeeded", "failed", "pending"):
            raise ValueError("unrecognized state")
        amount, old = self.attempts[key]
        if old == state:
            return "duplicate"
        if old in ("succeeded", "failed"):
            if state in ("pending", "unknown"):
                return "stale-hint-ignored"
            raise ValueError("conflicting terminal evidence needs reconciliation")
        if old == "unknown" and state == "pending":
            return "stale-hint-ignored"
        self.attempts[key] = (amount, state)
        return "updated"


def overlaps(a, b):
    if a[0] >= a[1] or b[0] >= b[1]:
        raise ValueError("empty or reversed stay")
    return max(a[0], b[0]) < min(a[1], b[1])


def free_rooms(bookings, requested):
    return [room for room, stays in bookings.items() if not any(overlaps(stay, requested) for stay in stays)]


def approved_total(lines):
    """Select one authoritative revision per originating cost line."""
    by_origin = {}
    for line in lines:
        if line["status"] != "approved":
            continue
        origin = line["origin"]
        if origin in by_origin:
            raise ValueError("multiple active approved revisions of one origin")
        by_origin[origin] = line["amount"]
    return sum(by_origin.values())


def closure(graph, start):
    """Reachability with cycle rejection; do not sum paths as independent work."""
    visiting, visited = set(), set()

    def visit(node):
        if node in visiting:
            raise ValueError("dependency cycle")
        if node in visited:
            return
        visiting.add(node)
        for target in graph.get(node, []):
            visit(target)
        visiting.remove(node)
        visited.add(node)

    visit(start)
    return visited


def deposit_partition(received, decided, disputed, refunded=0, refund_pending=0):
    values = (received, decided, disputed, refunded, refund_pending)
    if any(not isinstance(v, int) or v < 0 for v in values):
        raise ValueError("nonnegative integer amounts required")
    refundable = received - decided - disputed - refunded - refund_pending
    if refundable < 0:
        raise ValueError("deposit would be allocated twice")
    return {"decided": decided, "disputed": disputed, "refunded": refunded,
            "refund_pending": refund_pending, "refundable": refundable}


def commerce_money():
    discount = apportion(1001, [12000, 2000])
    require(discount == [858, 143], "line discount")
    cup = apportion(discount[0], [1, 1, 1])
    lid = apportion(discount[1], [1, 1])
    refund = (4000 - cup[0]) + (1000 - lid[0])
    require(cup == [286, 286, 286] and lid == [72, 71], "stable unit allocations")
    require(refund == 4642 and 12999 - refund - 260 == 8097, "settlement reconciliation")
    # Unsafe recomputation loses which unit received the extra cent.
    naive_second_lid = 1000 - round(Fraction(143, 2))
    correct_second_lid = 1000 - lid[1]
    require(naive_second_lid != correct_second_lid, "counterexample must expose rounding error")
    return {"line_discounts": discount, "unit_discounts": [cup, lid], "refund": refund,
            "net_after_synthetic_fee": 8097, "counterexample": {"recomputed_second_lid": naive_second_lid, "frozen_second_lid": correct_second_lid}}


def allocation_exhaustive():
    count = 0
    # Independent rational quotas establish rounding bounds and conservation.
    for weights in itertools.product(range(4), repeat=3):
        if sum(weights) == 0:
            continue
        for total in range(13):
            out = apportion(total, list(weights))
            require(sum(out) == total, "allocation loses cents")
            for amount, weight in zip(out, weights):
                quota = Fraction(total * weight, sum(weights))
                require(abs(amount - quota) < 1, "allocation exceeds quota bound")
                if weight == 0:
                    require(amount == 0, "zero weight received amount")
            count += 1
    rejects(lambda: apportion(-1, [1]))
    rejects(lambda: apportion(1, [0, 0]))
    rejects(lambda: apportion(1, [-1, 2]))
    return {"finite_inputs": count, "invalid_inputs_rejected": 3, "scope": "quota/conservation only; no claim of fairness across changing inputs"}


def commerce_quantities():
    result = quantity_state(3, 2, 1, 1)
    require(result == {"pending": 0, "net_kept": 1}, "return must not erase gross shipment")
    rejects(lambda: quantity_state(3, 2, 2, 0))
    rejects(lambda: quantity_state(3, 2, 0, 3))
    rejects(lambda: quantity_state(3, -1, 0, 0))
    naive_pending = 3 - (2 - 1) - 1
    require(naive_pending == 1, "unsafe shipment subtraction should reopen obligation")
    return {"gross_shipped": 2, "result": result, "invalid_states_rejected": 3, "counterexample_pending_after_erasing_return": naive_pending}


def restaurant_split():
    discounts = apportion(501, [4150, 3750])
    checks = [4150 - discounts[0], 3750 - discounts[1]]
    require(discounts == [263, 238] and checks == [3887, 3512], "check split")
    require(sum(checks) == 7399, "split checks changed debt")
    return {"discounts": discounts, "checks": checks, "total_due": 7399}


def unknown_tender():
    t = Tender(7399)
    t.submit("cash-1", 3000)
    t.observe("cash-1", "succeeded")
    t.submit("card-1", 4399)
    t.observe("card-1", "unknown")
    require(t.available == 0 and not t.closed and t.settled == 3000, "unknown must occupy balance without closing")
    rejects(lambda: t.submit("card-2", 4399))
    rejects(lambda: t.submit("card-1", 4400))
    require(t.submit("card-1", 4399) == "same-attempt", "stable operation identity")
    t.observe("card-1", "succeeded")
    require(t.observe("card-1", "unknown") == "stale-hint-ignored", "late old event")
    require(t.observe("card-1", "succeeded") == "duplicate", "duplicate result")
    require(t.closed and t.settled == 7399, "confirmed check")
    return {"rejected": ["second collection while unknown", "key with changed amount"], "final_received": t.settled, "closed": t.closed}


def tender_failure_recovery():
    t = Tender(1000)
    t.submit("try-1", 1000)
    t.observe("try-1", "unknown")
    t.observe("try-1", "failed")  # Authoritative no-effect confirmation, not timeout.
    require(t.available == 1000, "confirmed failure releases reservation")
    rejects(lambda: t.observe("try-1", "succeeded"))
    t.submit("try-2", 1000)
    t.observe("try-2", "succeeded")
    require(t.closed, "replacement after confirmed failure")
    return {"attempts": t.attempts, "conflicting_terminal_evidence": "rejected for reconciliation"}


def lodging_calendar():
    start, end = date(2026, 10, 24), date(2026, 10, 27)
    zone = ZoneInfo("Europe/Berlin")
    utc_start = datetime(2026, 10, 24, tzinfo=zone).astimezone(timezone.utc)
    utc_end = datetime(2026, 10, 27, tzinfo=zone).astimezone(timezone.utc)
    elapsed = (utc_end - utc_start).total_seconds() / 3600
    planned_start = datetime(2026, 10, 24, 15, tzinfo=zone).astimezone(timezone.utc)
    planned_end = datetime(2026, 10, 27, 11, tzinfo=zone).astimezone(timezone.utc)
    planned_hours = (planned_end - planned_start).total_seconds() / 3600
    require((end - start).days == 3 and elapsed == 73, "DST fixture")
    require(planned_hours == 69, "actual arrival and departure clock times")
    require(sum([12000, 15000, 13000]) == 40000, "night rate snapshot")
    return {"calendar_nights": 3, "midnight_elapsed_hours": elapsed, "planned_elapsed_hours": planned_hours,
            "counterexample_elapsed_divided_by_24": elapsed / 24, "room_charge": 40000}


def lodging_continuity():
    bookings = {"A": [(24, 25)], "B": [(25, 26)]}
    requested = (24, 26)
    nightly_free = [free_rooms(bookings, (d, d + 1)) for d in range(*requested)]
    uninterrupted = free_rooms(bookings, requested)
    require(nightly_free == [["B"], ["A"]] and uninterrupted == [], "continuity counterexample")
    require(not overlaps((24, 25), (25, 26)), "half-open adjacent bookings")
    rejects(lambda: overlaps((24, 24), (24, 26)))
    capacities, existing = [3, 2, 3], [2, 2, 1]
    residual = [c - x for c, x in zip(capacities, existing)]
    require(residual == [1, 0, 2] and min(residual[:2]) < 1, "capacity constraint")
    return {"nightly_free_rooms": nightly_free, "continuous_free_rooms": uninterrupted, "residual": residual, "two_night_request": "rejected"}


def lodging_folio():
    received, hold, room, dining = 10000, 8000, 40000, 6000
    require(room + dining - received == 36000, "authorization is not received funds")
    after_capture = room + dining - received - hold
    require(after_capture == 28000, "capture creates confirmed funds")
    routed_personal_balance = dining - received
    require(routed_personal_balance == -4000, "routing changes payer balance")
    return {"before_capture_due": 36000, "after_capture_due": after_capture,
            "company_room_route_personal_refund": -routed_personal_balance,
            "counterexample_counting_hold_as_cash_understates_due_by": hold}


def construction_revision():
    rows = [{"origin": "CE1-L1", "status": "superseded", "amount": 10000},
            {"origin": "CE1-L1", "status": "approved", "amount": 12000},
            {"origin": "CE1-L2", "status": "proposed", "amount": 8000},
            {"origin": "CE2-L1", "status": "approved", "amount": 3000}]
    result = approved_total(rows)
    require(result == 15000, "only active approved scope")
    rejects(lambda: approved_total(rows + [rows[1]]))
    unsafe = sum(x["amount"] for x in rows)
    require(unsafe == 33000 and unsafe != result, "version and estimate double count")
    return {"active_approved": result, "counterexample_sum_all_records": unsafe, "duplicate_active_origin": "rejected"}


def construction_dependencies():
    # Impact traversal uses reverse adjacency of the JSON derived_from edges.
    # Stored edge direction remains derived object -> evidence/source.
    graph = {"RFI-1": ["CE-1", "CE-2"], "CE-1": ["VAR-1"], "CE-2": ["VAR-1"], "VAR-1": ["CERT-1"]}
    reached = closure(graph, "RFI-1")
    require(len(reached) == 5, "shared variation must visit once")
    rejects(lambda: closure({"A": ["B"], "B": ["A"]}, "A"))
    return {"reachable_ids": sorted(reached), "shared_variation_count": 1, "cyclic_dependency": "rejected"}


def construction_certificate():
    # V15 chapter fixture: accounting units; no retention, tax or advance.
    base_quantity, approved_change_quantity, unit_price = 100, 20, 50
    approved = (base_quantity + approved_change_quantity) * unit_price
    first, second = (60 + 8) * unit_price, (100 + 15) * unit_price
    paid = 3400 + 2000
    require((approved, first, second) == (6000, 3400, 5750), "certificate snapshots")
    require(second - first == 2350 and second - paid == 350 and approved - second == 250, "increment and independent balances")
    def certify_change(quantity):
        if not 0 <= quantity <= approved_change_quantity:
            raise ValueError("above approved quantity")
        return quantity * unit_price
    rejects(lambda: certify_change(21))
    require(first + second == 9150, "unsafe adding cumulative values")
    return {"approved": approved, "cumulative_certificates": [first, second], "second_increment": 2350,
            "certified_unpaid": 350, "approved_uncertified": 250,
            "counterexample_sum_cumulative": first + second, "change_quantity_21": "rejected"}


def property_partition():
    # V16 chapter fixture: accounting units, not a legal deposit policy.
    p = deposit_partition(3000, 500, 600)
    require(p["refundable"] == 1900 and sum(p.values()) == 3000, "partition conservation")
    pending = deposit_partition(3000, 500, 600, refund_pending=1900)
    require(pending["refundable"] == 0, "unknown refund occupies remaining allocation")
    rejects(lambda: deposit_partition(3000, 500, 600, refund_pending=3800))
    resolved_while_unknown = deposit_partition(3000, 800, 0, refund_pending=1900)
    require(resolved_while_unknown["refundable"] == 300, "release only newly resolved amount")
    settled = deposit_partition(3000, 800, 0, refunded=2200)
    require(settled["refundable"] == 0 and sum(settled.values()) == 3000, "final closed partition")
    return {"initial": p, "refund_unknown": pending, "resolved_while_first_refund_unknown": resolved_while_unknown, "final": settled,
            "double_refund_allocation": "rejected"}


def property_responsibility():
    evidence = [{"cost": 45000, "responsibility": "landlord"},
                {"cost": 12000, "responsibility": "tenant-approved"},
                {"cost": 8000, "responsibility": "disputed"}]
    actual_deduction = sum(x["cost"] for x in evidence if x["responsibility"] == "tenant-approved")
    require(actual_deduction == 12000 and sum(x["cost"] for x in evidence) == 65000, "repair cost is not liability")
    require("unit-1" == "unit-1" and ("lease-1", "unit-1") != ("lease-2", "unit-1"), "tenancy scope")
    signed = [{"interval": (10, 20), "occupancy": "planned"}]
    proposed = (15, 25)
    conflict = any(overlaps(x["interval"], proposed) for x in signed)
    unsafe_active_only = any(overlaps(x["interval"], proposed) for x in signed if x["occupancy"] == "active")
    require(conflict and not unsafe_active_only, "signed future rights must reserve space before move-in")
    return {"repair_total": 65000, "approved_deduction": actual_deduction, "counterexample_blanket_repair_deduction_overstates": 53000,
            "overlapping_signed_future_lease": "rejected", "counterexample_active_only_filter_misses_conflict": not unsafe_active_only}


def sqlite_optimistic_contention():
    # Two real SQLite connections read the same version before either command commits.
    # Writes are interleaved deterministically, not a throughput or thread-race test.
    with tempfile.TemporaryDirectory(prefix="p05-model-") as temp:
        path = str(Path(temp) / "model.sqlite")
        a, b = sqlite3.connect(path), sqlite3.connect(path)
        try:
            a.execute("CREATE TABLE stock(tenant TEXT, resource TEXT, free INTEGER CHECK(free>=0), version INTEGER, PRIMARY KEY(tenant,resource))")
            a.execute("INSERT INTO stock VALUES('T1','last-room',1,0)")
            a.commit()
            va = a.execute("SELECT version FROM stock WHERE tenant='T1'").fetchone()[0]
            vb = b.execute("SELECT version FROM stock WHERE tenant='T1'").fetchone()[0]
            sql = "UPDATE stock SET free=free-1,version=version+1 WHERE tenant=? AND resource=? AND version=? AND free>=1"
            ra = a.execute(sql, ("T1", "last-room", va)).rowcount
            a.commit()
            rb = b.execute(sql, ("T1", "last-room", vb)).rowcount
            b.commit()
            require((ra, rb) == (1, 0), "stale competitor must lose")
            require(a.execute("SELECT free FROM stock").fetchone()[0] == 0, "stock invariant")
            return {"read_versions": [va, vb], "accepted_rows": [ra, rb], "free": 0,
                    "scope": "real SQLite CAS interleaving; not PostgreSQL/HTTP load"}
        finally:
            a.close()
            b.close()


def sqlite_recovery_and_scope():
    with tempfile.TemporaryDirectory(prefix="p05-model-") as temp:
        path = str(Path(temp) / "model.sqlite")
        c = sqlite3.connect(path)
        c.execute("CREATE TABLE effects(tenant TEXT, operation TEXT, amount INTEGER, PRIMARY KEY(tenant,operation))")
        c.execute("CREATE TABLE inbox(tenant TEXT, event TEXT, consumed INTEGER, PRIMARY KEY(tenant,event))")
        c.execute("INSERT INTO inbox VALUES('T1','event-1',0)")
        c.commit()
        try:
            with c:
                c.execute("INSERT INTO effects VALUES('T1','refund-1',4642)")
                raise RuntimeError("injected failure before atomic commit")
        except RuntimeError:
            pass
        require(c.execute("SELECT count(*) FROM effects").fetchone()[0] == 0, "rollback should remove partial local effect")
        with c:
            c.execute("INSERT INTO effects VALUES('T1','refund-1',4642)")
            c.execute("UPDATE inbox SET consumed=1 WHERE tenant='T1' AND event='event-1'")
        c.close()  # Reopen disk state, then simulate redelivery after missing acknowledgment.
        c = sqlite3.connect(path)
        try:
            existing = c.execute("SELECT amount FROM effects WHERE tenant=? AND operation=?", ("T1", "refund-1")).fetchone()
            require(existing == (4642,), "effect survived reopen")
            rejects(lambda: c.execute("INSERT INTO effects VALUES('T1','refund-1',4642)"), sqlite3.IntegrityError)
            c.rollback()
            with c:
                c.execute("INSERT INTO effects VALUES('T2','refund-1',777)")
            own = c.execute("SELECT amount FROM effects WHERE tenant=? AND operation=?", ("T2", "refund-1")).fetchone()[0]
            require(own == 777, "same business number must be isolated")
            unsafe_count = c.execute("SELECT count(*) FROM effects WHERE operation='refund-1'").fetchone()[0]
            require(unsafe_count == 2, "unscoped lookup counterexample")
            require(c.execute("SELECT consumed FROM inbox").fetchone()[0] == 1, "atomic consume persisted")
            return {"injected_local_failure": "rolled back", "reopen": "one T1 effect persisted", "duplicate_effect": "unique constraint rejected",
                    "T2_scoped_amount": own, "counterexample_unscoped_matches": unsafe_count,
                    "scope": "local SQLite atomic transaction; external payment is not in this transaction"}
        finally:
            c.close()


TESTS = [
    ("V04-money", "worked_example_and_counterexample", commerce_money),
    ("V04-apportion-exhaustive", "finite_model_check", allocation_exhaustive),
    ("V04-quantities", "negative_invariants", commerce_quantities),
    ("V05-split", "worked_example", restaurant_split),
    ("V05-unknown-tender", "unknown_duplicate_out_of_order", unknown_tender),
    ("V05-confirmed-failure", "failure_recovery", tender_failure_recovery),
    ("V06-calendar", "worked_example_and_counterexample", lodging_calendar),
    ("V06-continuity", "negative_invariants", lodging_continuity),
    ("V06-folio", "worked_example_and_counterexample", lodging_folio),
    ("V15-revisions", "negative_invariants", construction_revision),
    ("V15-dependencies", "graph_and_cycle_rejection", construction_dependencies),
    ("V15-certificate", "worked_example_and_counterexample", construction_certificate),
    ("V16-deposit", "unknown_refund_and_dispute", property_partition),
    ("V16-liability", "counterexample", property_responsibility),
    ("P05-stale-writers", "sqlite_interleaving", sqlite_optimistic_contention),
    ("P05-local-recovery", "sqlite_failure_injection_isolation", sqlite_recovery_and_scope),
]


def main():
    records = []
    for name, kind, test in TESTS:
        try:
            observation = test()
            records.append({"id": name, "kind": kind, "status": "pass", "observed": observation})
        except Exception as error:
            records.append({"id": name, "kind": kind, "status": "fail", "error": str(error), "traceback": traceback.format_exc()})
    failures = sum(r["status"] != "pass" for r in records)
    print(json.dumps({"suite": "P05 synthetic teaching models", "python": platform.python_version(),
                      "status": "fail" if failures else "pass", "tests": len(records), "failures": failures,
                      "scope": "fixed invented data, pure computations, finite states and local SQLite; no UI, provider, AI, load, PostgreSQL or legal validation",
                      "results": records}, ensure_ascii=False, indent=2))
    return bool(failures)


if __name__ == "__main__":
    sys.exit(main())
