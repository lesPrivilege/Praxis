// Scenario rules, views and actions for matter-workbench. No HTTP here.
import type { components } from '../../contracts/matter.d.ts';
import { daysFromNow } from '../fixture.ts';
import { notFound, Refusal } from '../kernel.ts';
import { nextId } from './store.ts';
import type { State, StoredEvent, StoredEvidence, StoredMatter, StoredRecord, StoredRisk } from './store.ts';

type S = components['schemas'];
type User = S['User'];

const RULES = {
  'EV-1': { version: 1, exceptionOwner: '主办合伙人' },
  'ROLE-1': { version: 1, exceptionOwner: '管理合伙人' },
  'COI-1': { version: 2, exceptionOwner: '合规负责人' },
  'ST-1': { version: 1, exceptionOwner: '主办合伙人' },
  'ST-2': { version: 1 },
  'REF-1': { version: 1 },
  'VER-1': { version: 1 },
} as const;
type RuleId = keyof typeof RULES;

function violation(rule: RuleId, message: string, ref?: string): S['RuleViolation'] {
  const def: { version: number; exceptionOwner?: string } = RULES[rule];
  return {
    rule,
    ruleVersion: def.version,
    message,
    ...(def.exceptionOwner ? { exceptionOwner: def.exceptionOwner } : {}),
    ...(ref ? { ref } : {}),
  };
}
const ruleTag = (rule: RuleId) => `${rule}@${RULES[rule].version}`;

// ---- lookups

export function userRef(state: State, id: string): S['UserRef'] {
  const user = state.users.find((u) => u.id === id);
  if (!user) throw new Error(`Unknown user ${id}`);
  return { id: user.id, name: user.name };
}

const canSee = (user: User, matter: StoredMatter) => !matter.wall || matter.wall.members.includes(user.id);

export function matterFor(state: State, user: User, matterId: string): StoredMatter {
  const matter = state.matters.find((m) => m.id === matterId);
  if (!matter) throw notFound(`事项 ${matterId}`);
  if (!canSee(user, matter)) {
    throw new Refusal(403, {
      code: 'forbidden',
      message: '这个事项设有信息隔离，你不在准入名单内。',
      contact: matter.wall!.contact,
    });
  }
  return matter;
}

function riskFor(state: State, user: User, riskId: string): { matter: StoredMatter; risk: StoredRisk } {
  for (const matter of state.matters) {
    const risk = matter.risks.find((r) => r.id === riskId);
    if (risk) return { matter: matterFor(state, user, matter.id), risk };
  }
  throw notFound(`风险 ${riskId}`);
}

function documentOf(matter: StoredMatter, evidence: StoredEvidence) {
  return matter.documents.find((d) => d.id === evidence.documentId)!;
}
const basisCurrent = (matter: StoredMatter, e: StoredEvidence) => e.documentVersion === documentOf(matter, e).version;
const restricted = (user: User, matter: StoredMatter, e: StoredEvidence) =>
  documentOf(matter, e).privileged && user.role === 'paralegal';

// ---- views

export function matterSummary(state: State, matter: StoredMatter): S['MatterSummary'] {
  const open = matter.risks.filter((r) => r.status !== 'decided');
  const party = (role: S['Party']['role']) => matter.parties.find((p) => p.role === role)?.name ?? '';
  return {
    id: matter.id,
    title: matter.title,
    cause: matter.cause,
    client: party('client'),
    counterparty: party('counterparty'),
    stage: matter.stage,
    status: matter.status,
    owner: userRef(state, matter.owner),
    reviewer: matter.reviewer ? userRef(state, matter.reviewer) : null,
    nextDeadline: matter.nextDeadline,
    openRisks: open.length,
    highOpenRisks: open.filter((r) => r.severity === 'high').length,
    recheckRisks: matter.risks.filter((r) => riskSummary(matter, r).needsRecheck).length,
    version: matter.version,
    updatedAt: matter.updatedAt,
  };
}

export function matterDetail(state: State, matter: StoredMatter): S['Matter'] {
  return {
    ...matterSummary(state, matter),
    court: matter.court,
    caseNumber: matter.caseNumber,
    openedAt: matter.openedAt,
    links: {
      parties: matter.parties.length,
      documents: matter.documents.length,
      evidence: matter.evidence.length,
      risks: matter.risks.length,
      tasks: matter.tasks.length,
    },
  };
}

export function listMatters(state: State, user: User, query: S['MatterQuery'] & { page?: number; pageSize?: number }): S['MatterPage'] {
  const reviewer = query.reviewer === 'me' ? user.id : query.reviewer;
  const q = query.q?.trim().toLowerCase();
  const rows = state.matters
    .filter((m) => canSee(user, m))
    .map((m) => matterSummary(state, m))
    .filter((m) => !query.status || m.status === query.status)
    .filter((m) => !query.stage || m.stage === query.stage)
    .filter((m) => !reviewer || (reviewer === 'none' ? m.reviewer === null : m.reviewer?.id === reviewer))
    .filter((m) => !query.openRisk || m.openRisks > 0)
    .filter((m) => !q || [m.id, m.title, m.client, m.counterparty].some((t) => t.toLowerCase().includes(q)));

  const sort = query.sort ?? 'deadline';
  const key = sort.replace('-', '') as 'deadline' | 'updatedAt';
  const direction = sort.startsWith('-') ? -1 : 1;
  const value = (m: S['MatterSummary']) => (key === 'deadline' ? m.nextDeadline?.date : m.updatedAt);
  rows.sort((a, b) => {
    const [x, y] = [value(a), value(b)];
    // Matters without a deadline go last whichever way the rest is ordered.
    if (!x || !y) return x ? -1 : y ? 1 : a.id.localeCompare(b.id);
    return x === y ? a.id.localeCompare(b.id) : (x < y ? -1 : 1) * direction;
  });

  const pageSize = query.pageSize ?? 10;
  const page = query.page ?? 1;
  return {
    items: rows.slice((page - 1) * pageSize, page * pageSize),
    total: rows.length,
    page,
    pageSize,
    actions: [
      {
        type: 'assign-reviewer',
        allowed: user.role === 'partner',
        violations: user.role === 'partner' ? [] : [violation('ROLE-1', '指派复核人由合伙人作出。')],
      },
    ],
  };
}

export function listDocuments(matter: StoredMatter): S['Document'][] {
  return matter.documents.map((d) => ({
    ...d,
    evidenceCount: matter.evidence.filter((e) => e.documentId === d.id).length,
  }));
}

function evidenceView(user: User, matter: StoredMatter, e: StoredEvidence): S['Evidence'] {
  const doc = documentOf(matter, e);
  const hidden = restricted(user, matter, e);
  return {
    id: e.id,
    matterId: matter.id,
    document: { id: doc.id, title: doc.title, version: doc.version },
    documentVersion: e.documentVersion,
    basisCurrent: basisCurrent(matter, e),
    restricted: hidden,
    locator: hidden ? null : e.locator,
    excerpt: hidden ? null : e.excerpt,
    risks: matter.risks.flatMap((r) =>
      r.evidence.filter((link) => link.id === e.id).map((link) => ({ id: r.id, title: r.title, stance: link.stance })),
    ),
  };
}

export const listEvidence = (user: User, matter: StoredMatter) => matter.evidence.map((e) => evidenceView(user, matter, e));

// The record a risk currently stands on: its decision, or the proposal awaiting one.
function standingRecord(risk: StoredRisk): StoredRecord | undefined {
  if (risk.status === 'open') return undefined;
  const kind = risk.status === 'decided' ? 'decision' : 'proposal';
  return risk.records.findLast((r) => r.kind === kind);
}

function riskSummary(matter: StoredMatter, risk: StoredRisk): S['RiskSummary'] {
  const standing = standingRecord(risk);
  const stale = (standing?.cited ?? []).some((c) => {
    const e = matter.evidence.find((x) => x.id === c.evidenceId)!;
    return c.documentVersion !== documentOf(matter, e).version;
  });
  return {
    id: risk.id,
    matterId: matter.id,
    title: risk.title,
    category: risk.category,
    severity: risk.severity,
    status: risk.status,
    disposition: risk.status === 'decided' ? (standing?.disposition ?? null) : null,
    needsRecheck: stale,
    evidenceCount: risk.evidence.length,
    version: risk.version,
    updatedAt: risk.updatedAt,
  };
}

export const listRisks = (matter: StoredMatter) => matter.risks.map((r) => riskSummary(matter, r));

function citable(user: User, matter: StoredMatter, risk: StoredRisk): StoredEvidence[] {
  return risk.evidence
    .map((link) => matter.evidence.find((e) => e.id === link.id)!)
    .filter((e) => basisCurrent(matter, e) && !restricted(user, matter, e));
}

function affordances(user: User, matter: StoredMatter, risk: StoredRisk): S['Affordance'][] {
  if (risk.status === 'decided' && !riskSummary(matter, risk).needsRecheck) return [];
  const evidenceGap = citable(user, matter, risk).length
    ? []
    : [violation('EV-1', '这项风险没有可引用的当前版本依据。', risk.id)];
  const partnerOnly = (what: string) => (user.role === 'partner' ? [] : [violation('ROLE-1', `${what}由合伙人作出。`)]);
  const build = (type: S['ActionType'], violations: S['RuleViolation'][]): S['Affordance'] => ({
    type,
    allowed: violations.length === 0,
    violations,
  });

  const list: S['Affordance'][] = [];
  if (risk.status === 'open' && user.role !== 'partner') {
    const role = user.role === 'associate' ? [] : [violation('ROLE-1', '处置建议由主办律师提出。')];
    list.push(build('propose-risk-disposition', [...role, ...evidenceGap]));
  }
  list.push(build('decide-risk', [...partnerOnly('处置决定'), ...evidenceGap]));
  if (risk.status === 'proposed') list.push(build('return-risk-proposal', partnerOnly('退回建议')));
  return list;
}

// Proposing is the reviewer's step; deciding, and deciding again after the basis moved, is the lead partner's.
function nextStep(state: State, matter: StoredMatter, risk: StoredRisk): S['Risk']['next'] {
  if (risk.status === 'open') return { step: 'propose', owner: matter.reviewer ? userRef(state, matter.reviewer) : null };
  if (risk.status === 'proposed') return { step: 'decide', owner: userRef(state, matter.owner) };
  return riskSummary(matter, risk).needsRecheck ? { step: 'redecide', owner: userRef(state, matter.owner) } : null;
}

export function riskDetail(state: State, user: User, riskId: string): S['Risk'] {
  const { matter, risk } = riskFor(state, user, riskId);
  return {
    ...riskSummary(matter, risk),
    statement: risk.statement,
    matterTitle: matter.title,
    next: nextStep(state, matter, risk),
    evidence: risk.evidence.map((link) => ({
      stance: link.stance,
      item: evidenceView(user, matter, matter.evidence.find((e) => e.id === link.id)!),
    })),
    records: risk.records.map((r) => ({
      kind: r.kind,
      by: userRef(state, r.by),
      at: r.at,
      attemptId: r.attemptId,
      ...(r.disposition ? { disposition: r.disposition } : {}),
      ...(r.rationale ? { rationale: r.rationale } : {}),
      ...(r.cited
        ? {
            cited: r.cited.map((c) => ({
              ...c,
              basisCurrent: c.documentVersion === documentOf(matter, matter.evidence.find((e) => e.id === c.evidenceId)!).version,
            })),
          }
        : {}),
    })),
    actions: affordances(user, matter, risk),
  };
}

export function listTasks(state: State, matter: StoredMatter): S['Task'][] {
  return matter.tasks.map((t) => ({ ...t, matterId: matter.id, assignee: userRef(state, t.assignee) }));
}

function objectRef(matter: StoredMatter, kind: S['ObjectRef']['kind'], id: string): S['ObjectRef'] {
  const title =
    kind === 'matter'
      ? matter.title
      : kind === 'risk'
        ? matter.risks.find((r) => r.id === id)?.title
        : kind === 'document'
          ? matter.documents.find((d) => d.id === id)?.title
          : kind === 'task'
            ? matter.tasks.find((t) => t.id === id)?.title
            : undefined;
  return { kind, id, title: title ?? id };
}

export function listEvents(state: State, matter: StoredMatter): S['AuditEvent'][] {
  return matter.events
    .map((e) => ({
      id: e.id,
      subjectId: matter.id,
      at: e.at,
      actor: userRef(state, e.actor),
      type: e.type,
      target: objectRef(matter, e.target.kind, e.target.id),
      targetVersion: e.targetVersion ?? null,
      attemptId: e.attemptId ?? null,
      changes: e.changes ?? [],
      rules: e.rules ?? [],
      note: e.note ?? null,
    }))
    .sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : b.id.localeCompare(a.id)));
}

export function search(state: State, user: User, q: string): S['SearchHit'][] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  const hits: S['SearchHit'][] = [];
  for (const matter of state.matters.filter((m) => canSee(user, m))) {
    const summary = matterSummary(state, matter);
    if ([matter.id, matter.title, summary.client, summary.counterparty].some((t) => t.toLowerCase().includes(needle))) {
      hits.push({ kind: 'matter', id: matter.id, title: matter.title, matterId: matter.id, context: matter.cause });
    }
    for (const risk of matter.risks) {
      if ([risk.id, risk.title].some((t) => t.toLowerCase().includes(needle))) {
        hits.push({ kind: 'risk', id: risk.id, title: risk.title, matterId: matter.id, context: matter.title });
      }
    }
  }
  return hits.slice(0, 8);
}

// ---- saved views

export function listViews(state: State, user: User): S['SavedView'][] {
  return state.views
    .filter((v) => v.owner === null || v.owner === user.id)
    .map((v) => ({ id: v.id, name: v.name, query: v.query, shared: v.owner === null, owner: v.owner ? userRef(state, v.owner) : null }));
}

export function createView(state: State, user: User, input: S['SavedViewInput']): S['SavedView'] {
  const name = typeof input?.name === 'string' ? input.name.trim() : '';
  if (!name || name.length > 30 || typeof input.query !== 'object' || input.query === null) {
    throw new Refusal(422, { code: 'invalid-input', message: '视图需要 1 到 30 个字的名称和一组筛选条件。' });
  }
  const view = { id: nextId(state, 'V'), name, query: input.query, owner: user.id };
  state.views.push(view);
  return { ...view, shared: false, owner: userRef(state, user.id) };
}

export function deleteView(state: State, user: User, viewId: string): void {
  const view = state.views.find((v) => v.id === viewId && (v.owner === null || v.owner === user.id));
  if (!view) throw notFound(`视图 ${viewId}`);
  if (view.owner === null) throw new Refusal(403, { code: 'forbidden', message: '团队共用的视图不能在这里删除。' });
  state.views.splice(state.views.indexOf(view), 1);
}

// ---- actions

function record(matter: StoredMatter, event: Omit<StoredEvent, 'id'>, state: State): string {
  const id = nextId(state, 'EV');
  matter.events.push({ id, ...event });
  return id;
}

function requireVersion(state: State, risk: StoredRisk, expected: number): void {
  if (risk.version === expected) return;
  throw new Refusal(409, {
    code: 'conflict',
    message: '这项风险在你打开之后已被更新。',
    violations: [violation('VER-1', `提交的是第 ${expected} 版，当前是第 ${risk.version} 版。`, risk.id)],
    currentVersion: risk.version,
    ...(risk.updatedBy ? { changedBy: userRef(state, risk.updatedBy) } : {}),
    changedAt: risk.updatedAt,
  });
}

function requireRole(user: User, role: User['role'], message: string): void {
  if (user.role !== role) throw new Refusal(403, { code: 'forbidden', message, violations: [violation('ROLE-1', message)] });
}

function checkCitations(user: User, matter: StoredMatter, risk: StoredRisk, ids: string[]) {
  const violations: S['RuleViolation'][] = [];
  if (!Array.isArray(ids) || ids.length === 0) violations.push(violation('EV-1', '至少引用一项依据。', risk.id));
  const allowed = citable(user, matter, risk);
  for (const id of ids ?? []) {
    if (!risk.evidence.some((link) => link.id === id)) violations.push(violation('EV-1', `${id} 不是这项风险的依据。`, id));
    else if (!allowed.some((e) => e.id === id)) violations.push(violation('EV-1', `${id} 引用的不是文书的当前版本，或你无权阅读。`, id));
  }
  if (violations.length) throw new Refusal(422, { code: 'rule-violation', message: '依据不满足规则 EV-1。', violations });
  return ids.map((id) => ({ evidenceId: id, documentVersion: matter.evidence.find((e) => e.id === id)!.documentVersion }));
}

function requireText(value: unknown, what: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Refusal(422, { code: 'invalid-input', message: `需要填写${what}。` });
  return value.trim();
}

const DISPOSITIONS: S['Disposition'][] = ['accept', 'mitigate', 'escalate'];
const REVIEW_TASK = '复核本事项的风险处置';

function touch(matter: StoredMatter, risk: StoredRisk, user: User, at: string) {
  risk.version += 1;
  risk.updatedAt = at;
  risk.updatedBy = user.id;
  matter.updatedAt = at;
}

function result(type: S['ActionType'], attemptId: string, matter: StoredMatter, risk: StoredRisk, eventIds: string[], tasks: S['ObjectRef'][] = []): S['ActionResult'] {
  return { attemptId, type, target: objectRef(matter, 'risk', risk.id), targetVersion: risk.version, eventIds, created: tasks };
}

function recordDisposition(
  state: State,
  user: User,
  attemptId: string,
  input: S['DispositionInput'],
  kind: 'proposal' | 'decision',
): { matter: StoredMatter; risk: StoredRisk; from: S['RiskStatus']; fromDisposition: S['Disposition'] | null; at: string } {
  const { matter, risk } = riskFor(state, user, input.riskId);
  requireVersion(state, risk, input.expectedVersion);
  const before = riskSummary(matter, risk);
  // A decision stands until the evidence it cites is superseded; then it may be made again.
  const allowed = kind === 'proposal' ? risk.status === 'open' : risk.status !== 'decided' || before.needsRecheck;
  if (!allowed) {
    const message = risk.status === 'decided' ? '这项风险已经决定，所引依据也没有变化。' : '这项风险已有一份待决定的建议。';
    throw new Refusal(422, { code: 'rule-violation', message, violations: [violation('ST-2', message, risk.id)] });
  }
  if (!DISPOSITIONS.includes(input.disposition)) throw new Refusal(422, { code: 'invalid-input', message: '处置方式不在可选范围内。' });
  const rationale = requireText(input.rationale, '理由');
  const cited = checkCitations(user, matter, risk, input.citedEvidenceIds);

  const from = risk.status;
  const at = new Date().toISOString();
  risk.records.push({ kind, by: user.id, at, attemptId, disposition: input.disposition, rationale, cited });
  risk.status = kind === 'proposal' ? 'proposed' : 'decided';
  touch(matter, risk, user, at);
  return { matter, risk, from, fromDisposition: before.disposition, at };
}

export function proposeRiskDisposition(state: State, user: User, attemptId: string, input: S['DispositionInput']): S['ActionResult'] {
  requireRole(user, 'associate', '处置建议由主办律师提出。');
  const { matter, risk, from, at } = recordDisposition(state, user, attemptId, input, 'proposal');
  const eventId = record(matter, {
    at, actor: user.id, type: 'disposition-proposed', target: { kind: 'risk', id: risk.id }, targetVersion: risk.version, attemptId,
    changes: [{ field: 'status', from, to: risk.status }],
    rules: [ruleTag('ROLE-1'), ruleTag('VER-1'), ruleTag('EV-1')],
  }, state);
  return result('propose-risk-disposition', attemptId, matter, risk, [eventId]);
}

export function decideRisk(state: State, user: User, attemptId: string, input: S['DispositionInput']): S['ActionResult'] {
  requireRole(user, 'partner', '处置决定由合伙人作出。');
  const { matter, risk, from, fromDisposition, at } = recordDisposition(state, user, attemptId, input, 'decision');
  const eventIds = [record(matter, {
    at, actor: user.id, type: 'risk-decided', target: { kind: 'risk', id: risk.id }, targetVersion: risk.version, attemptId,
    changes: [{ field: 'status', from, to: risk.status }, { field: 'disposition', from: fromDisposition, to: input.disposition }],
    rules: [ruleTag('ROLE-1'), ruleTag('VER-1'), ruleTag('EV-1')],
  }, state)];

  // Accepting a risk leaves nothing to do; the other two leave an obligation with an owner and a date.
  const tasks: S['ObjectRef'][] = [];
  if (input.disposition !== 'accept') {
    const escalate = input.disposition === 'escalate';
    const task = {
      id: nextId(state, 'T'),
      title: `${escalate ? '向委托人报告' : '落实处置措施'}：${risk.title}`,
      kind: 'follow-up' as const,
      assignee: escalate ? matter.owner : (matter.reviewer ?? matter.owner),
      dueDate: daysFromNow(escalate ? 3 : 7),
      status: 'open' as const,
      origin: { attemptId, ref: risk.id },
    };
    matter.tasks.push(task);
    tasks.push({ kind: 'task', id: task.id, title: task.title });
    eventIds.push(record(matter, { at, actor: user.id, type: 'task-created', target: { kind: 'task', id: task.id }, attemptId }, state));
  }
  return result('decide-risk', attemptId, matter, risk, eventIds, tasks);
}

export function returnRiskProposal(state: State, user: User, attemptId: string, input: S['ReturnInput']): S['ActionResult'] {
  requireRole(user, 'partner', '退回建议由合伙人作出。');
  const { matter, risk } = riskFor(state, user, input.riskId);
  requireVersion(state, risk, input.expectedVersion);
  if (risk.status !== 'proposed') {
    const message = '这项风险当前没有待决定的建议。';
    throw new Refusal(422, { code: 'rule-violation', message, violations: [violation('ST-2', message, risk.id)] });
  }
  const rationale = requireText(input.rationale, '退回理由');
  const at = new Date().toISOString();
  risk.records.push({ kind: 'return', by: user.id, at, attemptId, rationale });
  risk.status = 'open';
  touch(matter, risk, user, at);
  const eventId = record(matter, {
    at, actor: user.id, type: 'proposal-returned', target: { kind: 'risk', id: risk.id }, targetVersion: risk.version, attemptId,
    changes: [{ field: 'status', from: 'proposed', to: 'open' }],
    rules: [ruleTag('ROLE-1'), ruleTag('VER-1')],
    note: rationale,
  }, state);
  return result('return-risk-proposal', attemptId, matter, risk, [eventId]);
}

export function checkAssignReviewer(state: State, user: User, input: S['AssignReviewerInput']): void {
  requireRole(user, 'partner', '指派复核人由合伙人作出。');
  const reviewer = state.users.find((u) => u.id === input?.reviewerId);
  if (!reviewer || reviewer.role === 'paralegal') {
    throw new Refusal(422, { code: 'invalid-input', message: '复核人须是本所的律师。' });
  }
  if (!Array.isArray(input.matterIds) || input.matterIds.length === 0) {
    throw new Refusal(422, { code: 'invalid-input', message: '至少选择一个事项。' });
  }
}

export function pendingAssignItems(state: State, user: User, matterIds: string[]): S['JobItem'][] {
  return matterIds.map((id) => {
    const matter = state.matters.find((m) => m.id === id && canSee(user, m));
    return { ref: { kind: 'matter', id, title: matter?.title ?? id }, status: 'pending', violations: [] };
  });
}

// One item of an assign-reviewer job. Each matter is checked and applied on its own.
export function assignReviewerItem(state: State, user: User, attemptId: string, matterId: string, reviewerId: string): S['JobItem'] {
  const matter = state.matters.find((m) => m.id === matterId && canSee(user, m));
  if (!matter) {
    return { ref: { kind: 'matter', id: matterId, title: matterId }, status: 'rejected', violations: [violation('REF-1', '没有找到这个事项。', matterId)] };
  }
  const ref = objectRef(matter, 'matter', matter.id);
  const violations: S['RuleViolation'][] = [];
  if (matter.status === 'closed') violations.push(violation('ST-1', '事项已结案，不接受指派。', matter.id));
  const conflict = state.conflicts.find((c) => c.userId === reviewerId && matter.parties.some((p) => p.id === c.partyId));
  if (conflict) {
    const party = matter.parties.find((p) => p.id === conflict.partyId)!;
    violations.push(violation('COI-1', `${userRef(state, reviewerId).name}与${party.name}有已登记的利益冲突：${conflict.note}。`, party.id));
  }
  if (violations.length) return { ref, status: 'rejected', violations };
  // Assigning the reviewer a matter already has creates no second review task.
  if (matter.reviewer === reviewerId) return { ref, status: 'applied', violations: [] };

  const at = new Date().toISOString();
  const from = matter.reviewer ? userRef(state, matter.reviewer).name : null;
  matter.reviewer = reviewerId;
  matter.version += 1;
  matter.updatedAt = at;
  // The review is one obligation: an open review task moves to the new reviewer, a second one is not created.
  const open = matter.tasks.find((t) => t.kind === 'review' && t.status === 'open' && t.title === REVIEW_TASK);
  if (open) open.assignee = reviewerId;
  record(matter, {
    at, actor: user.id, type: 'reviewer-assigned', target: { kind: 'matter', id: matter.id }, targetVersion: matter.version, attemptId,
    changes: [{ field: 'reviewer', from, to: userRef(state, reviewerId).name }],
    rules: [ruleTag('ROLE-1'), ruleTag('ST-1'), ruleTag('COI-1')],
    ...(open ? { note: `复核任务 ${open.id} 随之转给${userRef(state, reviewerId).name}。` } : {}),
  }, state);
  if (!open) {
    const task = {
      id: nextId(state, 'T'),
      title: REVIEW_TASK,
      kind: 'review' as const,
      assignee: reviewerId,
      dueDate: matter.nextDeadline?.date ?? daysFromNow(7),
      status: 'open' as const,
      origin: { attemptId, ref: matter.id },
    };
    matter.tasks.push(task);
    record(matter, { at, actor: user.id, type: 'task-created', target: { kind: 'task', id: task.id }, attemptId }, state);
  }
  return { ref, status: 'applied', violations: [] };
}
