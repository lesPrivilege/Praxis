window.VG_FIXTURE = {
  "fixture_id": "vg-schema-gate-001",
  "revision": "20260929-r1",
  "synthetic": true,
  "note": "合成数据。候选→验证→提交与三种投影取自 Schema Engineering 论文语义（SE-SCHEMA-01..05、VG-SCHEMA-001/002）；stale 候选改编自 Luna 样例 vg-schema-stale-candidate-001。校验函数为本 demo 新写的最小实现，不是 Work Contract runtime。",
  "contract": {
    "contract_id": "C-renewal", "contract_version": 2,
    "gates": [
      { "id": "shape", "label": "结构", "rule": "term_months: integer 1–60" },
      { "id": "evidence", "label": "证据", "rule": "evidence ≥ 1 条，含来源、版本、位置" },
      { "id": "version", "label": "版本", "rule": "期望版本 = 当前版本" },
      { "id": "authority", "label": "权限", "rule": "reviewer 决定后提交" }
    ]
  },
  "state": {
    "matter_id": "M-0417", "state_version": 3, "last_event": "evt-006",
    "fields": { "counterparty": "澄川科技", "term_months": 12, "payment": "monthly" }
  },
  "candidates": [
    { "candidate_id": "cand-11", "t": 5.5, "actor": "模型提议",
      "body": { "matter_id": "M-0417", "expected_state_version": 3, "proposes": { "term_months": "三年" },
                "evidence": [{ "source": "src-email-0925", "source_version": "v1", "location": "§2" }] },
      "expected": { "result": "rejected", "gate": "shape", "reason_code": "TYPE_MISMATCH" } },
    { "candidate_id": "cand-12", "t": 20.5, "actor": "模型提议",
      "body": { "matter_id": "M-0417", "expected_state_version": 3, "proposes": { "term_months": 36 }, "evidence": [] },
      "expected": { "result": "rejected", "gate": "evidence", "reason_code": "EVIDENCE_REQUIRED" } },
    { "candidate_id": "cand-13", "t": 35.5, "actor": "模型提议",
      "body": { "matter_id": "M-0417", "expected_state_version": 2, "proposes": { "term_months": 24 },
                "evidence": [{ "source": "src-email-0925", "source_version": "v1", "location": "§2" }] },
      "expected": { "result": "rejected", "gate": "version", "reason_code": "STATE_VERSION_CONFLICT" } },
    { "candidate_id": "cand-14", "t": 50.5, "actor": "模型提议",
      "body": { "matter_id": "M-0417", "expected_state_version": 3, "proposes": { "term_months": 24 },
                "evidence": [{ "source": "src-email-0925", "source_version": "v1", "location": "§2" }] },
      "decision": { "actor": "reviewer 林", "decision": "approve", "t": 60.2 },
      "expected": { "result": "committed", "gate": null, "reason_code": null, "event_id": "evt-007", "state_version_after": 4 } }
  ],
  "projections": {
    "model_context": { "task": "起草确认邮件", "include": ["counterparty", "term_months"], "evidence_refs": true, "budget": { "used": 1240, "limit": 24000 } },
    "reviewer_packet": { "uncertainty": "对方法务尚未书面确认", "consequence": "续签期限生效；付款节奏不变" },
    "retrieval_index": { "stale_hits": ["term_months=12 @v3"] }
  },
  "expected": {
    "final_state_version": 4,
    "final_term_months": 24,
    "committed_events": ["evt-007"],
    "retained_candidates": ["cand-11", "cand-12", "cand-13"],
    "state_unchanged_after_rejections": true,
    "projection_identity": "M-0417@v4",
    "stale_hit_promoted": false
  }
};
