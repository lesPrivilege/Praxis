"""Original synthetic teaching models. Standard library only; no live provider."""
from __future__ import annotations

from contextlib import contextmanager
from dataclasses import dataclass, field
import http.client
import json
import sqlite3
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlsplit
from urllib.request import Request, urlopen


class RuleError(Exception):
    """A determinate refusal with a stable machine-readable reason."""


class UnknownResult(Exception):
    """The call did not establish whether the effect occurred."""


class ContractError(Exception):
    """The response cannot establish an understood outcome."""


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


@contextmanager
def transaction(db):
    db.execute("BEGIN IMMEDIATE")
    try:
        yield
    except Exception:
        db.rollback()
        raise
    else:
        db.commit()


class PurchaseLedger:
    """EM-E01: a single PO; SQLite serializes allocation checks and writes."""
    def __init__(self, path=":memory:"):
        self.db = sqlite3.connect(path, isolation_level=None, timeout=3)
        self.db.row_factory = sqlite3.Row
        self.db.executescript("""
        CREATE TABLE IF NOT EXISTS po(
          id TEXT PRIMARY KEY, tenant TEXT NOT NULL, requester TEXT NOT NULL,
          qty INTEGER NOT NULL, price INTEGER NOT NULL, version INTEGER NOT NULL,
          approved_version INTEGER, accepted INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS invoice(
          id TEXT PRIMARY KEY, qty INTEGER NOT NULL, version INTEGER NOT NULL,
          evidence_ref TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS invoice_revision(
          id TEXT, version INTEGER, qty INTEGER, evidence_ref TEXT, PRIMARY KEY(id,version));
        CREATE TABLE IF NOT EXISTS allocation(
          invoice_id TEXT PRIMARY KEY, invoice_version INTEGER NOT NULL,
          qty INTEGER NOT NULL, amount INTEGER NOT NULL);
        INSERT OR IGNORE INTO po VALUES('PO-17','T-1','requester',12,80000,1,NULL,9);
        INSERT OR IGNORE INTO invoice VALUES('INV-9',10,1,'supplier-original');
        INSERT OR IGNORE INTO invoice_revision VALUES('INV-9',1,10,'supplier-original');
        """)

    def close(self):
        self.db.close()

    def approve(self, actor, role, expected_version):
        with transaction(self.db):
            row = self.db.execute("SELECT * FROM po").fetchone()
            if role != "budget-owner" or actor == row["requester"]:
                raise RuleError("not_authorized")
            if expected_version != row["version"]:
                raise RuleError("stale_version")
            self.db.execute("UPDATE po SET approved_version=version")

    def change_price(self, price):
        if type(price) is not int or price <= 0:
            raise RuleError("invalid_price")
        with transaction(self.db):
            if self.db.execute("SELECT count(*) FROM allocation").fetchone()[0]:
                raise RuleError("allocated_change_requires_adjustment")
            self.db.execute("UPDATE po SET price=?,version=version+1,approved_version=NULL", (price,))

    def revise_invoice(self, qty, expected_version, evidence_ref):
        if type(qty) is not int or qty <= 0 or not evidence_ref:
            raise RuleError("invalid_revision")
        with transaction(self.db):
            row = self.db.execute("SELECT * FROM invoice WHERE id='INV-9'").fetchone()
            if row["version"] != expected_version:
                raise RuleError("stale_version")
            if self.db.execute("SELECT 1 FROM allocation WHERE invoice_id='INV-9'").fetchone():
                raise RuleError("allocated_change_requires_adjustment")
            self.db.execute("INSERT INTO invoice_revision VALUES('INV-9',?,?,?)", (expected_version+1,qty,evidence_ref))
            self.db.execute("UPDATE invoice SET qty=?,version=version+1,evidence_ref=? WHERE id='INV-9'", (qty,evidence_ref))

    def add_invoice(self, invoice_id, qty):
        if type(qty) is not int or qty <= 0:
            raise RuleError("invalid_quantity")
        self.db.execute("INSERT INTO invoice VALUES(?,?,1,'synthetic-supplier-record')", (invoice_id,qty))

    def allocate(self, invoice_id, expected_version):
        with transaction(self.db):
            po = self.db.execute("SELECT * FROM po").fetchone()
            inv = self.db.execute("SELECT * FROM invoice WHERE id=?", (invoice_id,)).fetchone()
            if inv is None:
                raise RuleError("missing_invoice")
            if inv["version"] != expected_version:
                raise RuleError("stale_version")
            if po["approved_version"] != po["version"]:
                raise RuleError("approval_required")
            prior = self.db.execute("SELECT * FROM allocation WHERE invoice_id=?", (invoice_id,)).fetchone()
            if prior:
                return dict(prior)
            used = self.db.execute("SELECT coalesce(sum(qty),0) FROM allocation").fetchone()[0]
            if used + inv["qty"] > min(po["qty"], po["accepted"]):
                raise RuleError("insufficient_accepted_quantity")
            amount = inv["qty"] * po["price"]
            self.db.execute("INSERT INTO allocation VALUES(?,?,?,?)", (invoice_id,inv["version"],inv["qty"],amount))
            return dict(self.db.execute("SELECT * FROM allocation WHERE invoice_id=?", (invoice_id,)).fetchone())

    def payment_intent(self, actor, role):
        if role != "treasury" or actor in {"requester", "ap-clerk"}:
            raise RuleError("not_authorized")
        po = self.db.execute("SELECT * FROM po").fetchone()
        allocation = self.db.execute("SELECT * FROM allocation WHERE invoice_id='INV-9'").fetchone()
        if allocation is None or po["approved_version"] != po["version"]:
            raise RuleError("payment_not_ready")
        return {"tenant":"T-1", "operation_id":"PAY-17", "business_key":f"INV-9/r{allocation['invoice_version']}/payment",
                "kind":"payment", "target":"supplier-fixture-account-v1",
                "amount_minor":allocation["amount"], "currency":"CNY"}


CHANGE_ACCEPTANCE_POLICY = {"version":"SVC-ACCEPT-1", "required_probes_passed":10, "probe_total":10}


@dataclass
class Change:
    tenant: str = "T-1"
    revision: int = 3
    config_version: int = 8
    desired: int = 6
    requester: str = "operator"
    approval: dict | None = field(default=None)

    def scope(self):
        return {"revision":self.revision, "config_version":self.config_version,
                "desired":self.desired, "target":"SVC-7", "tenant":self.tenant,
                "acceptance_policy":dict(CHANGE_ACCEPTANCE_POLICY)}

    def approve(self, actor, role):
        if role != "service-owner" or actor == self.requester:
            raise RuleError("not_authorized")
        self.approval = {"scope":canonical(self.scope()), "valid_from":1200, "valid_until":1230,
                         "approver":actor, "ref":f"APR-42-r{self.revision}"}

    def intent(self, actor, role, now=1205):
        if role != "executor":
            raise RuleError("not_authorized")
        if not self.approval or self.approval["scope"] != canonical(self.scope()):
            raise RuleError("approval_stale")
        if not self.approval["valid_from"] <= now < self.approval["valid_until"]:
            raise RuleError("approval_expired")
        if type(self.revision) is not int or self.revision < 3:
            raise RuleError("unsupported_change_revision")
        # Preserve the original r3 fixture label; each later revision is a new intent.
        operation_id = "OP-42" if self.revision == 3 else f"OP-42-r{self.revision}"
        return {"tenant":self.tenant, "operation_id":operation_id, "business_key":f"CHG-42/r{self.revision}/apply",
                "kind":"change", "target":"SVC-7", "expected_version":self.config_version,
                "desired":self.desired, "approval_ref":self.approval["ref"],
                "valid_from":1200, "valid_until":1230,
                "acceptance_policy":dict(CHANGE_ACCEPTANCE_POLICY)}


def validate_result(result, intent=None):
    if not isinstance(result, dict):
        raise ContractError("response_not_object")
    for key in ("tenant", "operation_id", "target", "state", "receipt"):
        if not isinstance(result.get(key), str) or not result[key]:
            raise ContractError("missing_"+key)
    if result["state"] not in {"accepted", "applied", "rejected"}:
        raise ContractError("unknown_provider_state")
    if intent:
        for key in ("tenant", "operation_id", "target"):
            if result[key] != intent[key]:
                raise ContractError("mismatched_"+key)
        if result["state"] == "applied":
            if intent["kind"] == "change":
                if (type(result.get("version")) is not int or
                    result["version"] != intent["expected_version"]+1 or
                    result.get("desired") != intent["desired"]):
                    raise ContractError("mismatched_change_effect")
            elif (result.get("amount_minor") != intent["amount_minor"] or
                  result.get("currency") != intent["currency"]):
                raise ContractError("mismatched_payment_effect")
    return result


class FakeAdapter:
    """An application-port fake with an explicit unknown-after-effect fault."""
    def __init__(self):
        self.entries = {}
        self.configs = {}
        self.values = {}
        self.lose_next_response = False
        self.effect_count = 0

    def submit(self, intent):
        key = (intent["tenant"], intent["operation_id"])
        encoded = canonical(intent)
        if key in self.entries:
            old, result = self.entries[key]
            if old != encoded:
                raise RuleError("idempotency_conflict")
            return validate_result(dict(result), intent)
        result = {k:intent[k] for k in ("tenant", "operation_id", "target")}
        result.update(state="applied", receipt="fake-receipt-"+intent["operation_id"])
        if intent["kind"] == "change":
            config_key = (intent["tenant"], intent["target"])
            current = self.configs.get(config_key, 8)
            if intent["expected_version"] != current:
                result["state"] = "rejected"
            else:
                result.update(version=current+1, desired=intent["desired"])
                self.configs[config_key] = current+1
                self.values[config_key] = intent["desired"]
        else:
            result.update(amount_minor=intent["amount_minor"], currency=intent["currency"])
        self.entries[key] = (encoded, dict(result))
        self.effect_count += result["state"] == "applied"
        if self.lose_next_response:
            self.lose_next_response = False
            raise UnknownResult("response_lost_after_effect")
        return validate_result(result, intent)

    def lookup(self, tenant, operation_id):
        pair = self.entries.get((tenant, operation_id))
        return validate_result(dict(pair[1])) if pair else None


class HttpAdapter:
    """Real HTTP transport for the local teaching protocol; loopback only."""
    def __init__(self, base_url):
        parsed = urlsplit(base_url)
        if parsed.scheme != "http" or parsed.hostname != "127.0.0.1" or parsed.username or parsed.password:
            raise ValueError("lab_adapter_requires_loopback_http")
        self.base_url = base_url.rstrip("/")

    def _request(self, path, body=None):
        data = canonical(body).encode() if body is not None else None
        request = Request(self.base_url+path, data=data, headers={"Content-Type":"application/json"},
                          method="POST" if data is not None else "GET")
        try:
            with urlopen(request, timeout=2) as response:
                raw = response.read()
                if response.status not in (200, 202):
                    raise ContractError("unexpected_status")
        except HTTPError as exc:
            if exc.code == 404 and body is None:
                return None
            if exc.code == 409:
                raise RuleError("idempotency_conflict") from exc
            if exc.code in (400, 401, 403):
                raise RuleError("provider_rejected_request") from exc
            raise UnknownResult("http_"+str(exc.code)) from exc
        except (URLError, TimeoutError, OSError, http.client.HTTPException) as exc:
            raise UnknownResult("transport_interrupted") from exc
        try:
            return validate_result(json.loads(raw), body)
        except (ValueError, UnicodeError) as exc:
            raise ContractError("invalid_json") from exc

    def submit(self, intent):
        return self._request("/operations", intent)

    def lookup(self, tenant, operation_id):
        result = self._request("/operations?"+urlencode({"tenant":tenant,"operation_id":operation_id}))
        if result is not None and (result["tenant"], result["operation_id"]) != (tenant, operation_id):
            raise ContractError("mismatched_lookup_identity")
        return result


class OperationJournal:
    """Durable intent/outbox in one row; recovery never invents a new operation."""
    def __init__(self, path=":memory:"):
        self.db = sqlite3.connect(path, isolation_level=None)
        self.db.row_factory = sqlite3.Row
        self.db.execute("""CREATE TABLE IF NOT EXISTS operations(
          tenant TEXT, id TEXT, business_key TEXT, payload TEXT, state TEXT,
          result TEXT, acceptance TEXT,
          PRIMARY KEY(tenant,id), UNIQUE(tenant,business_key))""")
        self.db.execute("""CREATE TABLE IF NOT EXISTS observation_conflicts(
          tenant TEXT, operation_id TEXT, prior_result TEXT, observed_result TEXT,
          reason TEXT, PRIMARY KEY(tenant,operation_id,observed_result))""")

    def close(self):
        self.db.close()

    def enqueue(self, intent):
        if intent["kind"] == "change" and intent.get("acceptance_policy") != CHANGE_ACCEPTANCE_POLICY:
            raise RuleError("invalid_acceptance_policy")
        with transaction(self.db):
            old = self.db.execute("SELECT * FROM operations WHERE tenant=? AND id=?",
                                  (intent["tenant"],intent["operation_id"])).fetchone()
            if old:
                if old["payload"] != canonical(intent):
                    raise RuleError("idempotency_conflict")
                return old["state"]
            try:
                self.db.execute("INSERT INTO operations VALUES(?,?,?,?,'queued',NULL,NULL)",
                                (intent["tenant"],intent["operation_id"],intent["business_key"],canonical(intent)))
            except sqlite3.IntegrityError as exc:
                raise RuleError("business_intent_exists") from exc
        return "queued"

    def row(self, tenant, operation_id):
        row = self.db.execute("SELECT * FROM operations WHERE tenant=? AND id=?", (tenant,operation_id)).fetchone()
        if row is None:
            raise RuleError("operation_not_found")
        result = dict(row)
        result["conflict_count"] = self.db.execute(
            "SELECT count(*) FROM observation_conflicts WHERE tenant=? AND operation_id=?",
            (tenant,operation_id)).fetchone()[0]
        return result

    def conflicts(self, tenant, operation_id):
        return [dict(r) for r in self.db.execute(
            "SELECT * FROM observation_conflicts WHERE tenant=? AND operation_id=? ORDER BY observed_result",
            (tenant,operation_id))]

    @staticmethod
    def visible_state(row):
        return "evidence_conflict" if row["conflict_count"] else row["state"]

    def _state(self, tenant, operation_id, state, result=None):
        self.db.execute("UPDATE operations SET state=?, result=coalesce(?,result) WHERE tenant=? AND id=?",
                        (state,canonical(result) if result is not None else None,tenant,operation_id))

    def _mark_uncertain(self, tenant, operation_id):
        # A slower sender cannot erase evidence already saved by reconciliation.
        with transaction(self.db):
            self.db.execute("UPDATE operations SET state='unknown' WHERE tenant=? AND id=? AND state='sending'",
                            (tenant,operation_id))
            return self.visible_state(self.row(tenant, operation_id))

    def _observe(self, tenant, operation_id, result):
        with transaction(self.db):
            row = self.row(tenant, operation_id)
            intent = json.loads(row["payload"])
            validate_result(result, intent)
            terminal = {"closed", "settled", "awaiting_acceptance", "rejected"}
            if row["state"] in terminal:
                prior = json.loads(row["result"])
                if result["state"] == "accepted":
                    return self.visible_state(row)  # weaker receipt, no terminal contradiction
                if prior != result:
                    self.db.execute("INSERT OR IGNORE INTO observation_conflicts VALUES(?,?,?,?,?)",
                                    (tenant,operation_id,canonical(prior),canonical(result),
                                     "contradictory_terminal_evidence"))
                    return "evidence_conflict"  # commit the diagnostic; preserve established facts
                return self.visible_state(row)
            state = result["state"]
            if state == "applied":
                state = "settled" if intent["kind"] == "payment" else "awaiting_acceptance"
            self._state(tenant, operation_id, state, result)
            return state

    def dispatch(self, tenant, operation_id, adapter, now=1205):
        with transaction(self.db):
            row = self.row(tenant, operation_id)
            if row["state"] != "queued":
                raise RuleError("reconcile_existing_operation")
            intent = json.loads(row["payload"])
            if intent["kind"] == "change" and not intent["valid_from"] <= now < intent["valid_until"]:
                self._state(tenant, operation_id, "expired")
                return "expired"
            self._state(tenant, operation_id, "sending")
        try:
            result = adapter.submit(intent)
            return self._observe(tenant, operation_id, result)
        except (UnknownResult, ContractError):
            return self._mark_uncertain(tenant, operation_id)
        except RuleError:
            # A contradictory provider key may conceal a prior effect: retain for reconciliation.
            self._mark_uncertain(tenant, operation_id)
            raise

    def reconcile(self, tenant, operation_id, adapter):
        row = self.row(tenant, operation_id)
        if row["state"] in {"queued", "expired"}:
            raise RuleError("nothing_sent")
        try:
            result = adapter.lookup(tenant, operation_id)
            if result is None:
                return self.visible_state(row)  # absence of observation is not proof of failure
            return self._observe(tenant, operation_id, result)
        except (UnknownResult, ContractError):
            # Preserve established evidence and any previously recorded conflict.
            return self.visible_state(self.row(tenant, operation_id))

    def accept(self, tenant, operation_id, actor, role, passed, total, evidence_ref):
        if role != "service-owner" or actor == "operator":
            raise RuleError("not_authorized")
        with transaction(self.db):
            row = self.row(tenant, operation_id)
            if row["state"] != "awaiting_acceptance":
                raise RuleError("effect_not_confirmed")
            if row["conflict_count"]:
                raise RuleError("evidence_conflict")
            policy = json.loads(row["payload"])["acceptance_policy"]
            if (type(passed) is not int or type(total) is not int or
                passed != policy["required_probes_passed"] or total != policy["probe_total"] or not evidence_ref):
                raise RuleError("acceptance_failed")
            record = {"actor":actor,"passed":passed,"total":total,"evidence_ref":evidence_ref,
                      "policy_version":policy["version"]}
            self.db.execute("UPDATE operations SET state='closed',acceptance=? WHERE tenant=? AND id=?",
                            (canonical(record),tenant,operation_id))
        return "closed"


def migrate_work(records):
    """No heuristic conversion: explicit source state, identity and evidence."""
    mapping = {"approved":"ready", "effect_confirmed":"awaiting_acceptance",
               "sent_unknown":"unknown", "missing_authorization":"blocked"}
    output, seen = [], set()
    for item in records:
        key = (item["tenant"],item["id"])
        if key in seen:
            raise RuleError("duplicate_business_identity")
        seen.add(key)
        state = item["state"]
        if state not in mapping:
            raise RuleError("unmapped_source_state")
        if state in {"sent_unknown", "effect_confirmed"} and not item.get("operation_id"):
            raise RuleError("missing_operation_identity")
        if state == "approved" and not item.get("approval_ref"):
            raise RuleError("missing_approval")
        if state == "effect_confirmed" and not item.get("effect_ref"):
            raise RuleError("missing_effect_evidence")
        if state == "missing_authorization" and not item.get("reason"):
            raise RuleError("missing_block_reason")
        output.append({**item,"source_state":state,"state":mapping[state]})
    return output
