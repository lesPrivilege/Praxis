window.VG_FIXTURE = {
  "fixture_id": "vg-esc-001",
  "revision": "20260929-r1",
  "synthetic": true,
  "note": "合成数据。语义取自 Praxis Core Model 候选文档（Event ≠ State ≠ Context）；stale basis 行为参照 Courtwork owner.mjs 本地读取。均非产品录屏。",
  "object": { "object_id": "M-0417", "title": "澄川科技 · 服务合同续签审阅" },
  "events": [
    { "event_id": "evt-001", "t": 6.0, "type": "matter.created", "actor": "人工登记", "origin": "authored", "effect": "commit",
      "set": { "counterparty": "澄川科技", "term": "12 个月", "payment": "按季度", "status": "审阅中" }, "evidence_ids": ["src-contract-v1"] },
    { "event_id": "evt-002", "t": 11.0, "type": "candidate.proposed", "actor": "模型提议", "origin": "authored", "effect": "pending",
      "candidate_id": "cand-02", "proposes": { "term": "24 个月" }, "evidence_ids": ["src-email-0912"] },
    { "event_id": "evt-003", "t": 14.5, "type": "decision.approved", "actor": "人工决定", "origin": "authored", "effect": "commit",
      "decides": "cand-02", "evidence_ids": ["src-email-0912"] },
    { "event_id": "evt-004", "t": 18.5, "type": "candidate.proposed", "actor": "模型提议", "origin": "authored", "effect": "pending",
      "candidate_id": "cand-04", "proposes": { "payment": "一次性预付" }, "evidence_ids": [] },
    { "event_id": "evt-005", "t": 21.5, "type": "decision.rejected", "actor": "人工决定", "origin": "authored", "effect": "reject",
      "decides": "cand-04", "reason": "与已签附件的付款节奏冲突", "evidence_ids": ["src-contract-v1"] },
    { "event_id": "evt-006", "t": 35.0, "type": "source.corrected", "actor": "人工修正", "origin": "authored", "effect": "commit",
      "set": { "payment": "按月" }, "reason": "附件 v3 更正付款节奏", "evidence_ids": ["src-contract-v3"] },
    { "event_id": "evt-003", "t": 43.5, "type": "decision.approved", "actor": "重放", "origin": "authored", "effect": "commit",
      "decides": "cand-02", "replay": true, "evidence_ids": ["src-email-0912"] }
  ],
  "contexts": [
    { "context_id": "ctx-A", "t": 27.5, "task": "起草续签邮件", "basis_version": 2,
      "selected": ["counterparty", "term"], "excluded": ["payment", "status"], "budget": { "used": 1850, "limit": 24000 } },
    { "context_id": "ctx-B", "t": 49.0, "task": "复核付款条款", "basis_version": 3,
      "selected": ["payment", "evidence:src-contract-v3"], "excluded": ["term", "counterparty"], "budget": { "used": 3120, "limit": 24000 } }
  ],
  "expected": {
    "log_length": 6,
    "replay_appended": false,
    "final_state_version": 3,
    "final_state": { "counterparty": "澄川科技", "term": "24 个月", "payment": "按月", "status": "审阅中" },
    "rejected_candidate_in_state": false,
    "rejected_event_in_log": true,
    "ctx-A_current_at_end": false,
    "ctx-B_current_at_end": true,
    "term_in_state_while_excluded_from_ctx-B": true
  }
};
