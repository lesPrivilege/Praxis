// Behaviour of the payment-review scenario's fake backend, one test per situation in its scenario contract.
// Every JSON response is also validated against the OpenAPI contract.
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, beforeEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { contractCheck } from '../contract-check.ts';
import { readFixture } from '../fixture.ts';
import { createBackend } from '../kernel.ts';
import { paymentScenario } from './scenario.ts';
import { caseSummary, checks } from './domain.ts';
import { fixtureProblems, loadState } from './store.ts';

const fixture = fileURLToPath(new URL('../../fixtures/payment.json', import.meta.url));
const check = contractCheck('payment.openapi.yaml');
const backend = createBackend([paymentScenario({ fixture, concurrentEditMs: 40 })], { latency: false });
let base = '';
before(async () => {
  await new Promise<void>((resolve) => backend.server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${(backend.server.address() as AddressInfo).port}/api/payment`;
});
after(() => backend.server.close());
beforeEach(() => backend.reset());

const SHEN = 'U-shen'; // reviewer
const GU = 'U-gu'; // lead
const TANG = 'U-tang'; // observer
let keys = 0;
const newKey = () => `test-attempt-${++keys}`;

async function call(persona: string | null, method: string, path: string, body?: unknown, key?: string) {
  const response = await fetch(base + path, {
    method,
    headers: {
      ...(persona ? { 'x-demo-persona': persona } : {}),
      ...(key ? { 'idempotency-key': key } : {}),
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  check(method, path, response.status, text);
  return { status: response.status, body: text ? JSON.parse(text) : undefined };
}
const get = (persona: string | null, path: string) => call(persona, 'GET', path);
const act = (persona: string, type: string, body: unknown, key = newKey()) => call(persona, 'POST', `/actions/${type}`, body, key);
const submit = (caseId: string, expectedVersion: number, extra = {}) => ({ caseId, expectedVersion, explanation: '', proposalUse: 'adopted', ...extra });
const checksOf = async (caseId: string) => Object.fromEntries((await get(SHEN, `/cases/${caseId}/checks`)).body.map((c: any) => [c.rule, c]));

test('identity: the persona list is open, everything else needs one', async () => {
  assert.equal((await get(null, '/meta')).body.scenario, 'payment-review');
  assert.equal((await get(null, '/users')).body.length, 4);
  assert.equal((await get(null, '/cases')).status, 401);
  assert.equal((await get(SHEN, '/me')).body.role, 'reviewer');
});

test('list: status, owner, dates and an amount range that needs its currency', async () => {
  const all = (await get(GU, '/cases?pageSize=50')).body;
  assert.deepEqual([all.total, all.totalExact], [12, true]);
  assert.equal(all.items[0].id, 'PR-4105', 'nearest due date first');
  assert.equal(all.items.at(-1).id, 'PR-4108', 'no due date goes last');
  const status = Object.fromEntries(all.items.map((c: any) => [c.id, c.status]));
  assert.deepEqual([status['PR-4101'], status['PR-4102'], status['PR-4103'], status['PR-4104'], status['PR-4108']], ['ready', 'needs-material', 'needs-material', 'in-review', 'decided']);
  assert.equal((await get(SHEN, '/cases?owner=me&status=ready')).body.total, 4);
  assert.deepEqual((await get(GU, '/cases?owner=none')).body.items.map((c: any) => c.id), ['PR-4107']);

  const range = await get(GU, '/cases?amountMin=10000000');
  assert.equal(range.status, 422, 'a range without a currency is refused, not guessed');
  const cny = (await get(GU, '/cases?currency=CNY&amountMin=10000000&amountMax=30000000')).body.items.map((c: any) => c.id).sort();
  assert.deepEqual(cny, ['PR-4102', 'PR-4103', 'PR-4105']);
  assert.deepEqual((await get(GU, '/cases?currency=USD')).body.items.map((c: any) => c.id), ['PR-4106']);
  assert.equal((await get(GU, '/cases?dueFrom=tomorrow')).status, 422);
  assert.equal((await get(GU, '/cases?status=paid')).status, 422);
});

test('amount: a case without an invoice has no amount, not zero', async () => {
  const c = (await get(GU, '/cases/PR-4107')).body;
  assert.equal(c.amount, null);
  assert.equal((await get(GU, '/cases?currency=CNY&amountMax=100')).body.total, 0, 'unknown is outside every range');
});

test('checks: pass, fail, unknown and conflict each say what they rest on', async () => {
  const over = await checksOf('PR-4101');
  assert.deepEqual([over['CUR-1'].outcome, over['ACC-1'].outcome, over['CAP-1'].outcome], ['pass', 'pass', 'fail']);
  assert.match(over['CAP-1'].detail, /高 ¥6,000\.00/);
  assert.deepEqual(over['CAP-1'].basis.map((b: any) => b.key), ['cap-clause', 'cap', 'amount']);

  const missing = await checksOf('PR-4102');
  assert.equal(missing['ACC-1'].outcome, 'unknown');
  assert.deepEqual(missing['ACC-1'].missing, [{ what: '里程碑一的验收记录', supplier: '甲方项目经理 宋棠' }]);

  const conflict = (await checksOf('PR-4103'))['CAP-1'];
  assert.equal(conflict.outcome, 'conflict');
  assert.deepEqual(conflict.conflict.values.map((v: any) => [v.display, v.ref.title]), [['¥300,000.00', '付款条件表'], ['¥260,000.00', '补充协议']]);
  assert.equal(conflict.missing[0].supplier, '合同管理员 祁安');

  const currency = await checksOf('PR-4106');
  assert.deepEqual([currency['CUR-1'].outcome, currency['CAP-1'].outcome], ['fail', 'unknown']);
  assert.match(currency['CAP-1'].detail, /不能直接比较/);
});

test('evidence: a reference opens the exact version and place; a version that was never kept is refused', async () => {
  const ref = (await checksOf('PR-4101'))['CAP-1'].basis.find((b: any) => b.key === 'amount');
  const file = (await get(SHEN, `/files/${ref.fileId}/versions/${ref.version}`)).body;
  assert.equal(file.fragments.find((f: any) => f.key === ref.key).text, '价税合计 ¥486,000.00');
  assert.equal((await get(SHEN, `/files/${ref.fileId}/versions/9`)).status, 404);
  assert.equal((await get(SHEN, '/files/F-0000/versions/1')).status, 404);
  const reissued = (await get(GU, '/cases/PR-4105')).body.files.find((f: any) => f.kind === 'invoice');
  const old = (await get(GU, `/files/${reissued.id}/versions/1`)).body;
  assert.deepEqual([old.version, old.currentVersion], [1, 2], 'the earlier version stays readable');
});

test('proposal: a machine suggestion is separate from the checks and may disagree with them', async () => {
  const proposal = (await get(SHEN, '/cases/PR-4102/proposal')).body;
  assert.deepEqual([proposal.source, proposal.suggestion], ['machine', 'submit']);
  assert.equal((await get(SHEN, '/cases/PR-4102')).body.status, 'needs-material', 'the suggestion does not move the case');
  assert.equal((await get(GU, '/cases/PR-4105/proposal')).body.current, false, 'based on a superseded invoice');
  assert.equal((await get(GU, '/cases/PR-4107/proposal')).status, 404);
});

test('proposal: one made on older material, or one that disagrees with the checks, cannot be adopted as it stands', async () => {
  // PR-4105 after return: the proposal still rests on invoice v1.
  await act(GU, 'return-review', { caseId: 'PR-4105', expectedVersion: 4, reason: '发票已重开。' });
  assert.deepEqual((await get(SHEN, '/cases/PR-4105')).body.submission.proposalUses, ['amended', 'rejected']);
  const stale = await act(SHEN, 'submit-for-review', submit('PR-4105', 5, { proposalUse: 'adopted' }));
  assert.deepEqual([stale.status, stale.body.violations[0].rule], [422, 'SUB-3']);
  assert.deepEqual((await get(GU, '/cases/PR-4107')).body.submission.proposalUses, ['none']);
  assert.equal((await get(null, '/cases?amountMin=&currency=CNY')).status, 401);
  assert.equal((await get(GU, '/cases?amountMin=&currency=CNY')).status, 422, 'an empty number is not zero');
  // Outside the contract, so asked without the contract check: a name every object inherits is not an action type.
  const inherited = await fetch(`${base}/actions/constructor`, { method: 'POST', headers: { 'x-demo-persona': GU, 'idempotency-key': newKey(), 'content-type': 'application/json' }, body: '{}' });
  assert.equal(inherited.status, 404);
});

test('checks on edge material: what is present but silent, what is for another milestone, what was added or removed', () => {
  const state = loadState(fixture);
  const by = (c: any) => Object.fromEntries(checks(c).map((r) => [r.rule, r]));
  const fresh = () => structuredClone(state.cases.find((c) => c.id === 'PR-4104')!);
  const file = (c: any, kind: string) => c.files.find((f: any) => f.kind === kind);

  let c = fresh();
  file(c, 'terms').versions[0].fragments = file(c, 'terms').versions[0].fragments.filter((f: any) => f.key !== 'currency');
  assert.match(by(c)['CUR-1'].detail, /付款条件表里没有写结算币种/, 'the file is there; it is the statement that is missing');

  c = fresh();
  file(c, 'acceptance').versions[0].fragments.find((f: any) => f.key === 'milestone').value = '里程碑九';
  assert.deepEqual([by(c)['ACC-1'].outcome, by(c)['ACC-1'].missing[0].what], ['unknown', '里程碑一的验收记录']);

  c = fresh();
  file(c, 'invoice').versions[0].fragments.find((f: any) => f.key === 'amount').value = { currency: 'CNY', minor: 0 };
  assert.equal(by(c)['CAP-1'].outcome, 'pass');

  // Submitted on four files. One more arriving, or one leaving, means the submission no longer rests on what the case holds.
  const summary = (x: any) => caseSummary(state, x).needsRecheck;
  assert.equal(summary(fresh()), false);
  c = fresh();
  c.files.push({ ...structuredClone(file(c, 'contract')), id: 'F-9999', kind: 'supplement' });
  assert.equal(summary(c), true);
  c = fresh();
  c.files = c.files.filter((f: any) => f.kind !== 'contract');
  assert.equal(summary(c), true, 'and it does not crash');
});

test('affordances and next step follow the state and the role', async () => {
  const actions = async (persona: string, id: string) => Object.fromEntries((await get(persona, `/cases/${id}`)).body.actions.map((a: any) => [a.type, a]));
  assert.equal((await actions(SHEN, 'PR-4101'))['submit-for-review'].allowed, true);
  assert.equal((await actions(SHEN, 'PR-4102'))['submit-for-review'].violations[0].rule, 'SUB-1');
  assert.equal((await actions(GU, 'PR-4101'))['submit-for-review'].violations[0].rule, 'ROLE-1');
  const lead = await actions(GU, 'PR-4104');
  assert.deepEqual([lead['accept-review'].allowed, lead['return-review'].allowed], [true, true]);
  const stale = await actions(GU, 'PR-4105');
  assert.deepEqual([stale['accept-review'].violations[0].rule, stale['return-review'].allowed], ['VER-2', true]);
  assert.deepEqual((await get(GU, '/cases/PR-4108')).body.actions, []);
  assert.ok(Object.values(await actions(TANG, 'PR-4104')).every((a: any) => !a.allowed));

  const next = async (id: string) => (await get(GU, `/cases/${id}`)).body.next;
  assert.deepEqual(await next('PR-4102'), { step: 'supply-material', owner: null });
  assert.deepEqual(await next('PR-4101'), { step: 'submit', owner: { id: SHEN, name: '沈若溪' } });
  assert.deepEqual(await next('PR-4104'), { step: 'decide', owner: { id: GU, name: '顾承安' } });
  assert.deepEqual(await next('PR-4105'), { step: 'recheck', owner: { id: GU, name: '顾承安' } });
  assert.deepEqual(await next('PR-4108'), { step: 'pay-elsewhere', owner: null });
});

test('submit: an exception goes forward only with an explanation; the conclusion follows from the checks', async () => {
  const before = (await get(SHEN, '/cases/PR-4101')).body;
  assert.deepEqual([before.submission.conclusion, before.submission.explanationRequired, before.submission.receiver.name], ['exception', true, '顾承安']);
  assert.deepEqual(before.submission.proposalUses, ['adopted', 'amended', 'rejected']);
  const bare = await act(SHEN, 'submit-for-review', submit('PR-4101', 3));
  assert.deepEqual([bare.status, bare.body.violations[0].rule], [422, 'SUB-2']);
  assert.equal((await act(SHEN, 'submit-for-review', submit('PR-4101', 3, { explanation: '超出部分是一次性数据迁移费。', proposalUse: 'none' }))).status, 422, 'the machine proposal has to be accounted for');

  const key = newKey();
  const done = await act(SHEN, 'submit-for-review', submit('PR-4101', 3, { explanation: '超出部分是一次性数据迁移费，验收记录有注明。', proposalUse: 'amended' }), key);
  assert.deepEqual([done.status, done.body.targetVersion, done.body.created], [200, 4, []]);
  const c = (await get(GU, '/cases/PR-4101')).body;
  assert.equal(c.status, 'in-review');
  assert.deepEqual([c.records[0].kind, c.records[0].conclusion, c.records[0].proposalUse, c.records[0].proposalId, c.records[0].basis.length], ['submission', 'exception', 'amended', 'MP-1', 4]);
  const event = (await get(GU, '/cases/PR-4101/events')).body[0];
  assert.deepEqual([event.type, event.attemptId, event.changes[0].to], ['review-submitted', key, 'in-review']);
});

test('rules: role, missing material and state are refused with the rule that applies', async () => {
  assert.equal((await act(GU, 'submit-for-review', submit('PR-4109', 2))).body.violations[0].rule, 'ROLE-1');
  const blocked = await act(SHEN, 'submit-for-review', submit('PR-4103', 4));
  assert.deepEqual([blocked.status, blocked.body.violations[0].rule], [422, 'SUB-1']);
  assert.equal((await act(SHEN, 'submit-for-review', submit('PR-4104', 3))).body.violations[0].rule, 'ST-1');
  assert.equal((await act(SHEN, 'accept-review', { caseId: 'PR-4104', expectedVersion: 3 })).status, 403);
  assert.equal((await act(GU, 'accept-review', { caseId: 'PR-4101', expectedVersion: 3 })).body.violations[0].rule, 'ST-1');
  assert.equal((await act(GU, 'return-review', { caseId: 'PR-4104', expectedVersion: 3, reason: ' ' })).status, 422);
  assert.equal((await act(GU, 'return-review', { caseId: 'PR-4108', expectedVersion: 4, reason: '想重看。' })).body.violations[0].rule, 'ST-1');
  assert.equal((await call(GU, 'POST', '/actions/accept-review', [], newKey())).status, 422);
});

test('decide: accepting the material is not paying, and leaves the earlier records in place', async () => {
  const accepted = await act(GU, 'accept-review', { caseId: 'PR-4104', expectedVersion: 3, note: '可以转财务。' });
  assert.equal(accepted.status, 200);
  const c = (await get(GU, '/cases/PR-4104')).body;
  assert.deepEqual([c.status, c.next.step, c.records.map((r: any) => r.kind)], ['decided', 'pay-elsewhere', ['submission', 'acceptance']]);
  assert.match((await get(GU, '/cases/PR-4104/events')).body[0].note, /付款由财务另行发起/);
});

test('return: the case goes back to the reviewer and the submission stays in the history', async () => {
  await act(GU, 'return-review', { caseId: 'PR-4104', expectedVersion: 3, reason: '请补上发票的开票日期。' });
  const c = (await get(SHEN, '/cases/PR-4104')).body;
  assert.deepEqual([c.status, c.next.owner.id, c.records.map((r: any) => r.kind)], ['ready', SHEN, ['submission', 'return']]);
  assert.equal(c.actions[0].allowed, true);
});

test('version change: material that changed after submission cannot be accepted, only returned and resubmitted', async () => {
  const c = (await get(GU, '/cases/PR-4105')).body;
  assert.equal(c.needsRecheck, true);
  assert.deepEqual(c.records[0].basis.filter((b: any) => !b.current).map((b: any) => b.title), ['发票记录']);
  const refused = await act(GU, 'accept-review', { caseId: 'PR-4105', expectedVersion: 4 });
  assert.deepEqual([refused.status, refused.body.violations[0].rule], [422, 'VER-2']);
  await act(GU, 'return-review', { caseId: 'PR-4105', expectedVersion: 4, reason: '发票已重开，按新版本重新提交。' });
  await act(SHEN, 'submit-for-review', submit('PR-4105', 5, { proposalUse: 'rejected' }));
  const again = (await get(GU, '/cases/PR-4105')).body;
  assert.deepEqual([again.needsRecheck, again.status, again.records.at(-1).basis.every((b: any) => b.current)], [false, 'in-review', true]);
});

test('conflict: a colleague submitted the case after it was opened', async () => {
  const opened = (await get(SHEN, '/cases/PR-4109')).body;
  await new Promise((resolve) => setTimeout(resolve, 120));
  const refused = await act(SHEN, 'submit-for-review', submit('PR-4109', opened.version));
  assert.deepEqual([refused.status, refused.body.currentVersion, refused.body.changedBy.name], [409, opened.version + 1, '陆言']);
});

test('unknown outcome: lost after applying, and never arrived', async () => {
  const applied = newKey();
  await assert.rejects(act(SHEN, 'submit-for-review', submit('PR-4110', 2), applied));
  assert.equal((await get(SHEN, `/action-attempts/${applied}`)).body.outcome, 'applied');
  assert.equal((await act(SHEN, 'submit-for-review', submit('PR-4110', 2), applied)).status, 200, 'replaying the key is safe');
  assert.equal((await get(SHEN, '/cases/PR-4110')).body.records.length, 1);

  const lost = newKey();
  await assert.rejects(act(SHEN, 'submit-for-review', submit('PR-4111', 2), lost));
  assert.equal((await get(SHEN, `/action-attempts/${lost}`)).status, 404);
  assert.equal((await act(SHEN, 'submit-for-review', submit('PR-4111', 2), lost)).status, 200);
  assert.equal((await act(SHEN, 'submit-for-review', submit('PR-4111', 2, { explanation: '换了内容。' }), lost)).status, 422);
});

test('permission and partial failure', async () => {
  assert.equal((await get(TANG, '/cases?pageSize=50')).body.total, 11);
  const walled = await get(TANG, '/cases/PR-4112');
  assert.deepEqual([walled.status, walled.body.contact], [403, '顾承安（复核负责人）']);
  const file = (await get(GU, '/cases/PR-4112')).body.files[0];
  assert.equal((await get(TANG, `/files/${file.id}/versions/1`)).status, 403, 'a file of a walled case is walled too');
  assert.equal((await get(GU, '/cases/PR-4106/events')).status, 503);
  assert.equal((await get(GU, '/cases/PR-4106/checks')).status, 200);
  assert.equal((await get(GU, '/cases/PR-4107/checks')).status, 503);
  assert.equal((await get(GU, '/cases/PR-4107/checks')).status, 200);
});

test('fixture: inconsistencies are reported together, with their paths', () => {
  const { dates: _dates, ...data } = readFixture(fixture);
  assert.deepEqual(fixtureProblems(data), []);
  data.cases[0].proposal.basis[0].version = 7;
  data.cases[3].records = [];
  data.cases[1].owner = 'U-nobody';
  assert.deepEqual(fixtureProblems(data).map((p) => p.split(' ')[0]).sort(), ['bad-state', 'bad-version', 'unknown-user']);
});

test('fixture: a stage the records could not have produced, or a proposal the case does not have, is refused', () => {
  const mutated = (change: (cases: any[]) => void) => {
    const { dates: _dates, ...data } = readFixture(fixture);
    change(data.cases);
    return fixtureProblems(data).map((p) => p.split(' ')[0]);
  };
  const inReview = (cases: any[]) => cases.find((c) => c.stage === 'in-review');
  const submission = (cases: any[]) => cases.flatMap((c) => c.records).find((r) => r.proposalId);
  assert.deepEqual(mutated((cases) => { cases[0].stage = 'not-a-stage'; }), ['bad-state']);
  assert.deepEqual(mutated((cases) => { inReview(cases).stage = 'decided'; }), ['bad-state'], 'nobody accepted it');
  assert.deepEqual(mutated((cases) => { const c = inReview(cases); c.records.unshift({ ...c.records[0], kind: 'acceptance' }); }), ['bad-record-order'], 'accepted before it was submitted');
  assert.deepEqual(mutated((cases) => { submission(cases).proposalId = 'MP-0'; }), ['dangling-proposal']);
  assert.deepEqual(mutated((cases) => { delete submission(cases).proposalId; }), ['missing-proposal']);
});
