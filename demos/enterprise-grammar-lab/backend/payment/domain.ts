// Scenario rules, views and actions for payment-review. No HTTP here.
// The check rules are written for the drill. They are not legal or financial conclusions.
import type { components } from '../../contracts/payment.d.ts';
import { notFound, Refusal } from '../kernel.ts';
import { nextId } from './store.ts';
import type { State, StoredBasis, StoredCase, StoredEvent, StoredFile, StoredRecord } from './store.ts';

type S = components['schemas'];
type User = S['User'];
type Money = S['Money'];

const RULES = {
  'ROLE-1': { version: 1, exceptionOwner: '运营负责人' },
  'SUB-1': { version: 1, exceptionOwner: '复核负责人' },
  'SUB-2': { version: 1 },
  'SUB-3': { version: 1 },
  'VER-1': { version: 1 },
  'VER-2': { version: 1 },
  'ST-1': { version: 1 },
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

// ---- money. Amounts are compared only within one currency; nothing here converts.

export function formatMoney(money: Money): string {
  const format = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: money.currency });
  return format.format(money.minor / 10 ** (format.resolvedOptions().maximumFractionDigits ?? 2));
}

// ---- lookups

export function userRef(state: State, id: string): S['UserRef'] {
  const user = state.users.find((u) => u.id === id);
  if (!user) throw new Error(`Unknown user ${id}`);
  return { id: user.id, name: user.name };
}

const canSee = (user: User, c: StoredCase) => !c.wall || c.wall.members.includes(user.id);

export function caseFor(state: State, user: User, caseId: string): StoredCase {
  const found = state.cases.find((c) => c.id === caseId);
  if (!found) throw notFound(`复核事项 ${caseId}`);
  if (!canSee(user, found)) {
    throw new Refusal(403, { code: 'forbidden', message: '这个事项属于保密采购，你不在准入名单内。', contact: found.wall!.contact });
  }
  return found;
}

const current = (file: StoredFile) => file.versions.at(-1)!;
const fileOf = (c: StoredCase, kind: S['FileKind']) => c.files.find((f) => f.kind === kind);
const valueOf = (file: StoredFile, key: string) => current(file).fragments.find((f) => f.key === key)?.value;

function evidenceRef(file: StoredFile, key: string): S['EvidenceRef'] {
  const version = current(file);
  const fragment = version.fragments.find((f) => f.key === key);
  return { fileId: file.id, title: file.title, version: version.version, currentVersion: version.version, key, locator: fragment?.locator ?? key };
}

function basisView(c: StoredCase, basis: StoredBasis[]): S['BasisVersion'][] {
  return basis.map((b) => {
    // A file that has since left the case is shown by its id, and is never current.
    const file = c.files.find((f) => f.id === b.fileId);
    return { fileId: b.fileId, title: file?.title ?? b.fileId, version: b.version, current: file !== undefined && b.version === current(file).version };
  });
}
const basisNow = (c: StoredCase): StoredBasis[] => c.files.map((f) => ({ fileId: f.id, version: current(f).version }));
// True when the basis is exactly what the case holds now: same files, same versions, none added, none gone.
function basisIsCurrent(c: StoredCase, basis: StoredBasis[]): boolean {
  const key = (list: StoredBasis[]) => list.map((b) => `${b.fileId}@${b.version}`).sort().join(' ');
  return key(basis) === key(basisNow(c));
}

// ---- checks: deterministic rules over the current versions of the files

const CHECKS = {
  'CUR-1': { version: 1, title: '发票币种与合同约定一致' },
  'ACC-1': { version: 1, title: '验收记录存在并已签署' },
  'CAP-1': { version: 1, title: '发票金额不超过里程碑上限' },
} as const;

type Finding = Pick<S['CheckResult'], 'outcome' | 'detail'> & Partial<Pick<S['CheckResult'], 'basis' | 'missing' | 'conflict'>>;

export function checks(c: StoredCase): S['CheckResult'][] {
  const contract = fileOf(c, 'contract');
  const terms = fileOf(c, 'terms');
  const supplement = fileOf(c, 'supplement');
  const invoice = fileOf(c, 'invoice');
  const acceptance = fileOf(c, 'acceptance');
  const amount = invoice ? ((valueOf(invoice, 'amount') as Money | undefined) ?? null) : null;
  const noInvoice = { what: '发票记录', supplier: c.contacts.invoice };
  const noAmount = { what: '写明价税合计的发票记录', supplier: c.contacts.invoice };
  const result = (rule: keyof typeof CHECKS, finding: Finding): S['CheckResult'] => ({
    rule,
    ruleVersion: CHECKS[rule].version,
    title: CHECKS[rule].title,
    basis: [],
    missing: [],
    conflict: null,
    ...finding,
  });

  const currency = (): Finding => {
    const agreed = terms ? (valueOf(terms, 'currency') as string) : null;
    const basis = terms ? [evidenceRef(terms, 'currency')] : [];
    if (!terms) return { outcome: 'unknown', detail: '没有付款条件表，不知道合同约定的结算币种。', missing: [{ what: '付款条件表', supplier: c.contacts.terms }] };
    if (!agreed) return { outcome: 'unknown', detail: '付款条件表里没有写结算币种。', missing: [{ what: '写明结算币种的付款条件表', supplier: c.contacts.terms }] };
    if (!invoice) return { outcome: 'unknown', detail: '还没有发票记录，无法核对币种。', basis, missing: [noInvoice] };
    if (!amount) return { outcome: 'unknown', detail: '发票记录里没有价税合计。', basis, missing: [noAmount] };
    basis.push(evidenceRef(invoice, 'amount'));
    return amount.currency === agreed
      ? { outcome: 'pass', detail: `发票与合同都以 ${agreed} 结算。`, basis }
      : { outcome: 'fail', detail: `发票以 ${amount.currency} 开具，合同约定以 ${agreed} 结算。`, basis };
  };

  const accepted = (): Finding => {
    const basis = contract ? [evidenceRef(contract, 'acceptance-clause')] : [];
    if (!acceptance) {
      return { outcome: 'unknown', detail: `还没有${c.milestone}的验收记录。`, basis, missing: [{ what: `${c.milestone}的验收记录`, supplier: c.contacts.acceptance }] };
    }
    basis.push(evidenceRef(acceptance, 'milestone'), evidenceRef(acceptance, 'signed'));
    const milestone = valueOf(acceptance, 'milestone');
    // A record for another milestone is not a failed one for this milestone: the one needed is still missing.
    if (milestone !== c.milestone) {
      return { outcome: 'unknown', detail: `手上的验收记录是${milestone}的，这次申请的是${c.milestone}。`, basis, missing: [{ what: `${c.milestone}的验收记录`, supplier: c.contacts.acceptance }] };
    }
    return valueOf(acceptance, 'signed') === true
      ? { outcome: 'pass', detail: `${c.milestone}的验收记录已签署。`, basis }
      : { outcome: 'fail', detail: '验收记录还没有签署。', basis };
  };

  const withinCap = (): Finding => {
    const basis = contract ? [evidenceRef(contract, 'cap-clause')] : [];
    const termsCap = terms ? (valueOf(terms, 'cap') as Money | undefined) : undefined;
    if (!terms) return { outcome: 'unknown', detail: '没有付款条件表，不知道里程碑上限。', basis, missing: [{ what: '付款条件表', supplier: c.contacts.terms }] };
    if (!termsCap) return { outcome: 'unknown', detail: `付款条件表里没有${c.milestone}的上限。`, basis, missing: [{ what: `写明${c.milestone}上限的付款条件表`, supplier: c.contacts.terms }] };
    const supplementCap = supplement ? (valueOf(supplement, 'cap') as Money | undefined) : undefined;
    if (supplement && supplementCap && (supplementCap.currency !== termsCap.currency || supplementCap.minor !== termsCap.minor)) {
      // Two sources state the cap differently. The rule does not pick one.
      return {
        outcome: 'conflict',
        detail: '付款条件表和补充协议对上限的写法不同，无法判断发票是否超限。',
        basis: invoice ? [...basis, evidenceRef(invoice, 'amount')] : basis,
        missing: [{ what: '适用哪一个上限的书面确认', supplier: c.contacts.terms }],
        conflict: {
          field: `${c.milestone}的付款上限`,
          values: [
            { display: formatMoney(termsCap), ref: evidenceRef(terms, 'cap') },
            { display: formatMoney(supplementCap), ref: evidenceRef(supplement, 'cap') },
          ],
        },
      };
    }
    basis.push(evidenceRef(terms, 'cap'));
    // A supplement that restates the same cap is part of what the result rests on.
    if (supplement && supplementCap) basis.push(evidenceRef(supplement, 'cap'));
    if (!invoice) return { outcome: 'unknown', detail: '还没有发票记录，无法核对金额。', basis, missing: [noInvoice] };
    if (!amount) return { outcome: 'unknown', detail: '发票记录里没有价税合计。', basis, missing: [noAmount] };
    basis.push(evidenceRef(invoice, 'amount'));
    if (amount.currency !== termsCap.currency) {
      return {
        outcome: 'unknown',
        detail: `发票以 ${amount.currency} 计，上限以 ${termsCap.currency} 计，金额不能直接比较。`,
        basis,
        missing: [{ what: '按合同币种重开的发票，或经确认的换算依据', supplier: c.contacts.currency }],
      };
    }
    return amount.minor <= termsCap.minor
      ? { outcome: 'pass', detail: `发票 ${formatMoney(amount)}，上限 ${formatMoney(termsCap)}。`, basis }
      : {
          outcome: 'fail',
          detail: `发票 ${formatMoney(amount)}，比上限 ${formatMoney(termsCap)} 高 ${formatMoney({ currency: amount.currency, minor: amount.minor - termsCap.minor })}。`,
          basis,
        };
  };

  return [result('CUR-1', currency()), result('ACC-1', accepted()), result('CAP-1', withinCap())];
}

// ---- views

interface Standing {
  failed: number;
  blocking: number;
  status: S['CaseStatus'];
  needsRecheck: boolean;
}

function standing(c: StoredCase): Standing {
  const results = checks(c);
  const failed = results.filter((r) => r.outcome === 'fail').length;
  const blocking = results.filter((r) => r.outcome === 'unknown' || r.outcome === 'conflict').length;
  const submission = c.stage === 'drafting' ? undefined : c.records.findLast((r) => r.kind === 'submission');
  const needsRecheck = submission?.basis !== undefined && !basisIsCurrent(c, submission.basis);
  return { failed, blocking, needsRecheck, status: c.stage === 'drafting' ? (blocking > 0 ? 'needs-material' : 'ready') : c.stage };
}

export function caseSummary(state: State, c: StoredCase): S['CaseSummary'] {
  const invoice = fileOf(c, 'invoice');
  return {
    id: c.id,
    title: c.title,
    vendor: c.vendor,
    contractNo: c.contractNo,
    milestone: c.milestone,
    amount: invoice ? ((valueOf(invoice, 'amount') as Money | undefined) ?? null) : null,
    dueDate: c.dueDate,
    owner: c.owner ? userRef(state, c.owner) : null,
    ...standing(c),
    version: c.version,
    updatedAt: c.updatedAt,
  };
}

export interface CaseQuery {
  q?: string;
  status?: S['CaseStatus'];
  owner?: string;
  dueFrom?: string;
  dueTo?: string;
  currency?: string;
  amountMin?: number;
  amountMax?: number;
  sort?: S['CaseSort'];
  page?: number;
  pageSize?: number;
}

export function listCases(state: State, user: User, query: CaseQuery): S['CasePage'] {
  const owner = query.owner === 'me' ? user.id : query.owner;
  const q = query.q?.trim().toLowerCase();
  const rows = state.cases
    .filter((c) => canSee(user, c))
    .map((c) => caseSummary(state, c))
    .filter((c) => !query.status || c.status === query.status)
    .filter((c) => !owner || (owner === 'none' ? c.owner === null : c.owner?.id === owner))
    // A case without a due date or an amount is outside any range, not at its low end.
    .filter((c) => !query.dueFrom || (c.dueDate !== null && c.dueDate >= query.dueFrom))
    .filter((c) => !query.dueTo || (c.dueDate !== null && c.dueDate <= query.dueTo))
    .filter((c) => !query.currency || c.amount?.currency === query.currency)
    .filter((c) => query.amountMin === undefined || (c.amount !== null && c.amount.minor >= query.amountMin))
    .filter((c) => query.amountMax === undefined || (c.amount !== null && c.amount.minor <= query.amountMax))
    .filter((c) => !q || [c.id, c.title, c.vendor, c.contractNo].some((t) => t.toLowerCase().includes(q)));

  const sort = query.sort ?? 'dueDate';
  const direction = sort.startsWith('-') ? -1 : 1;
  const value = (c: S['CaseSummary']) => (sort.endsWith('dueDate') ? c.dueDate : c.updatedAt);
  rows.sort((a, b) => {
    const [x, y] = [value(a), value(b)];
    // Cases without a due date go last whichever way the rest is ordered.
    if (!x || !y) return x ? -1 : y ? 1 : a.id.localeCompare(b.id);
    return x === y ? a.id.localeCompare(b.id) : (x < y ? -1 : 1) * direction;
  });

  const pageSize = query.pageSize ?? 10;
  const page = query.page ?? 1;
  return { items: rows.slice((page - 1) * pageSize, page * pageSize), total: rows.length, totalExact: true, page, pageSize };
}

function nextStep(state: State, c: StoredCase, at: Standing): S['Case']['next'] {
  const lead = userRef(state, state.lead);
  if (c.stage === 'drafting') {
    // Who supplies what is listed with each check; no single person holds this step.
    return at.blocking > 0 ? { step: 'supply-material', owner: null } : { step: 'submit', owner: c.owner ? userRef(state, c.owner) : null };
  }
  if (at.needsRecheck) return { step: 'recheck', owner: lead };
  return c.stage === 'in-review' ? { step: 'decide', owner: lead } : { step: 'pay-elsewhere', owner: null };
}

function affordances(user: User, c: StoredCase, at: Standing): S['Affordance'][] {
  const build = (type: S['ActionType'], violations: S['RuleViolation'][]): S['Affordance'] => ({ type, allowed: violations.length === 0, violations });
  const leadOnly = (what: string) => (user.role === 'lead' ? [] : [violation('ROLE-1', `${what}由复核负责人作出。`)]);
  if (c.stage === 'drafting') {
    return [
      build('submit-for-review', [
        ...(user.role === 'reviewer' ? [] : [violation('ROLE-1', '提交复核由复核员作出。')]),
        ...(at.blocking > 0 ? [violation('SUB-1', `有 ${at.blocking} 项检查还不能判断，先补齐材料。`, c.id)] : []),
      ]),
    ];
  }
  const giveBack = build('return-review', leadOnly('退回'));
  if (c.stage === 'decided') return at.needsRecheck ? [giveBack] : [];
  return [
    build('accept-review', [
      ...leadOnly('接受复核材料'),
      ...(at.needsRecheck ? [violation('VER-2', '提交之后材料有了新版本，不能直接接受；退回后由复核员按新版本重新提交。', c.id)] : []),
    ]),
    giveBack,
  ];
}

// A proposal can be adopted as it stands only if it was made on the current material and says what the checks say.
// One made on older material, or one that disagrees with the checks, can still be amended or set aside.
function proposalUses(c: StoredCase, at: Standing): S['ProposalUse'][] {
  if (!c.proposal) return ['none'];
  const agrees = c.proposal.suggestion === (at.failed > 0 ? 'submit-as-exception' : 'submit');
  return basisIsCurrent(c, c.proposal.basis) && agrees ? ['adopted', 'amended', 'rejected'] : ['amended', 'rejected'];
}

export function caseDetail(state: State, user: User, c: StoredCase): S['Case'] {
  const at = standing(c);
  return {
    ...caseSummary(state, c),
    requester: c.requester,
    files: c.files.map((f) => ({ id: f.id, title: f.title, kind: f.kind, version: current(f).version, receivedAt: current(f).receivedAt, source: current(f).source })),
    records: c.records.map((r) => ({
      kind: r.kind,
      by: userRef(state, r.by),
      at: r.at,
      attemptId: r.attemptId,
      caseVersion: r.caseVersion,
      ...(r.conclusion ? { conclusion: r.conclusion } : {}),
      ...(r.explanation ? { explanation: r.explanation } : {}),
      ...(r.proposalUse ? { proposalUse: r.proposalUse } : {}),
      ...(r.proposalId ? { proposalId: r.proposalId } : {}),
      ...(r.basis ? { basis: basisView(c, r.basis) } : {}),
    })),
    submission: {
      conclusion: at.failed > 0 ? 'exception' : 'sufficient',
      explanationRequired: at.failed > 0,
      proposalUses: proposalUses(c, at),
      receiver: userRef(state, state.lead),
      basis: basisView(c, basisNow(c)),
    },
    next: nextStep(state, c, at),
    actions: affordances(user, c, at),
  };
}

export function proposal(c: StoredCase): S['Proposal'] {
  if (!c.proposal) throw notFound('这个事项的机器提议');
  return {
    id: c.proposal.id, source: 'machine', generatedAt: c.proposal.generatedAt, suggestion: c.proposal.suggestion, text: c.proposal.text,
    basis: basisView(c, c.proposal.basis),
    current: basisIsCurrent(c, c.proposal.basis),
  };
}

export function fileVersion(state: State, user: User, fileId: string, version: number): S['FileVersion'] {
  for (const c of state.cases) {
    const file = c.files.find((f) => f.id === fileId);
    if (!file) continue;
    caseFor(state, user, c.id);
    const found = file.versions.find((v) => v.version === version);
    if (!found) throw notFound(`${file.title}的第 ${version} 版`);
    return {
      id: file.id,
      caseId: c.id,
      title: file.title,
      kind: file.kind,
      version: found.version,
      currentVersion: current(file).version,
      receivedAt: found.receivedAt,
      source: found.source,
      fragments: found.fragments.map(({ key, locator, text }) => ({ key, locator, text })),
    };
  }
  throw notFound(`材料 ${fileId}`);
}

function objectRef(c: StoredCase, kind: S['ObjectKind'], id: string): S['ObjectRef'] {
  return { kind, id, title: kind === 'case' ? c.title : (c.files.find((f) => f.id === id)?.title ?? id) };
}

export function listEvents(state: State, c: StoredCase): S['AuditEvent'][] {
  return c.events
    .map((e) => ({
      id: e.id,
      subjectId: c.id,
      at: e.at,
      actor: userRef(state, e.actor),
      type: e.type,
      target: objectRef(c, e.target.kind, e.target.id),
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
  return state.cases
    .filter((c) => canSee(user, c) && [c.id, c.title, c.vendor, c.contractNo].some((t) => t.toLowerCase().includes(needle)))
    .slice(0, 8)
    .map((c) => ({ kind: 'case', id: c.id, title: c.title, context: c.contractNo }));
}

// ---- actions

function requireRole(user: User, role: User['role'], message: string): void {
  if (user.role !== role) throw new Refusal(403, { code: 'forbidden', message, violations: [violation('ROLE-1', message)] });
}

function requireVersion(state: State, c: StoredCase, expected: number): void {
  if (c.version === expected) return;
  throw new Refusal(409, {
    code: 'conflict',
    message: '这个事项在你打开之后已被更新。',
    violations: [violation('VER-1', `提交的是第 ${expected} 版，当前是第 ${c.version} 版。`, c.id)],
    currentVersion: c.version,
    ...(c.updatedBy ? { changedBy: userRef(state, c.updatedBy) } : {}),
    changedAt: c.updatedAt,
  });
}

function refuse(rule: RuleId, message: string, ref: string): never {
  throw new Refusal(422, { code: 'rule-violation', message, violations: [violation(rule, message, ref)] });
}

function apply(
  state: State,
  user: User,
  attemptId: string,
  c: StoredCase,
  type: S['ActionType'],
  to: StoredCase['stage'],
  record: Omit<StoredRecord, 'by' | 'at' | 'attemptId' | 'caseVersion'>,
  event: Pick<StoredEvent, 'type' | 'rules' | 'note'>,
): S['ActionResult'] {
  const from = standing(c).status;
  const at = new Date().toISOString();
  c.stage = to;
  c.version += 1;
  c.updatedAt = at;
  c.updatedBy = user.id;
  c.records.push({ ...record, by: user.id, at, attemptId, caseVersion: c.version });
  const eventId = nextId(state, 'EV');
  c.events.push({
    id: eventId, at, actor: user.id, target: { kind: 'case', id: c.id }, targetVersion: c.version, attemptId,
    changes: [{ field: 'status', from, to: standing(c).status }],
    ...event,
  });
  return { attemptId, type, target: objectRef(c, 'case', c.id), targetVersion: c.version, eventIds: [eventId], created: [] };
}

export function submitForReview(state: State, user: User, attemptId: string, input: S['SubmitInput']): S['ActionResult'] {
  requireRole(user, 'reviewer', '提交复核由复核员作出。');
  const c = caseFor(state, user, input.caseId);
  requireVersion(state, c, input.expectedVersion);
  if (c.stage !== 'drafting') refuse('ST-1', '这个事项已经提交，或已经决定。', c.id);
  const at = standing(c);
  if (at.blocking > 0) refuse('SUB-1', `有 ${at.blocking} 项检查还不能判断，先补齐材料。`, c.id);
  const explanation = typeof input.explanation === 'string' ? input.explanation.trim() : '';
  // The conclusion follows from the checks. A failed check can only go forward as a stated exception.
  if (at.failed > 0 && !explanation) refuse('SUB-2', '有未通过的检查，须写明作为例外提交的理由。', c.id);
  const uses = proposalUses(c, at);
  if (!uses.includes(input.proposalUse)) {
    if (input.proposalUse === 'adopted' && c.proposal) refuse('SUB-3', '这份机器提议基于旧版本的材料，或与检查结果不一致，不能原样采纳。', c.id);
    throw new Refusal(422, { code: 'invalid-input', message: '须说明对机器提议的处置；没有机器提议时填“无”。' });
  }

  return apply(state, user, attemptId, c, 'submit-for-review', 'in-review',
    {
      kind: 'submission', conclusion: at.failed > 0 ? 'exception' : 'sufficient', ...(explanation ? { explanation } : {}),
      proposalUse: input.proposalUse, ...(c.proposal ? { proposalId: c.proposal.id } : {}), basis: basisNow(c),
    },
    { type: 'review-submitted', rules: [ruleTag('ROLE-1'), ruleTag('VER-1'), ruleTag('ST-1'), ruleTag('SUB-1'), ruleTag('SUB-2'), ruleTag('SUB-3')] });
}

export function acceptReview(state: State, user: User, attemptId: string, input: S['AcceptInput']): S['ActionResult'] {
  requireRole(user, 'lead', '接受复核材料由复核负责人作出。');
  const c = caseFor(state, user, input.caseId);
  requireVersion(state, c, input.expectedVersion);
  if (c.stage !== 'in-review') refuse('ST-1', '这个事项当前不在待复核状态。', c.id);
  if (standing(c).needsRecheck) refuse('VER-2', '提交之后材料有了新版本，不能直接接受。', c.id);
  const note = typeof input.note === 'string' ? input.note.trim() : '';
  // Accepting the review material is not paying. Payment is started elsewhere, by finance.
  return apply(state, user, attemptId, c, 'accept-review', 'decided',
    { kind: 'acceptance', ...(note ? { explanation: note } : {}), basis: c.records.findLast((r) => r.kind === 'submission')!.basis },
    { type: 'review-accepted', rules: [ruleTag('ROLE-1'), ruleTag('VER-1'), ruleTag('ST-1'), ruleTag('VER-2')], note: '复核材料已接受；付款由财务另行发起，不在本工作台。' });
}

export function returnReview(state: State, user: User, attemptId: string, input: S['ReturnInput']): S['ActionResult'] {
  requireRole(user, 'lead', '退回由复核负责人作出。');
  const c = caseFor(state, user, input.caseId);
  requireVersion(state, c, input.expectedVersion);
  // An accepted case can be reopened only when the material it was accepted on has since changed.
  const open = c.stage === 'in-review' || (c.stage === 'decided' && standing(c).needsRecheck);
  if (!open) refuse('ST-1', '这个事项当前没有可退回的提交。', c.id);
  const reason = typeof input.reason === 'string' ? input.reason.trim() : '';
  if (!reason) throw new Refusal(422, { code: 'invalid-input', message: '需要填写退回理由。' });
  return apply(state, user, attemptId, c, 'return-review', 'drafting',
    { kind: 'return', explanation: reason },
    { type: 'review-returned', rules: [ruleTag('ROLE-1'), ruleTag('VER-1'), ruleTag('ST-1')], note: reason });
}
