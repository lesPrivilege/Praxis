// Behaviour of the matter scenario's fake backend, one test per situation in its scenario contract §3.
// Every JSON response is also validated against the OpenAPI contract.
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, beforeEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { contractCheck } from '../contract-check.ts';
import { readFixture } from '../fixture.ts';
import { createBackend } from '../kernel.ts';
import { matterScenario } from './scenario.ts';
import { fixtureProblems } from './store.ts';

const fixture = fileURLToPath(new URL('../../fixtures/legal.json', import.meta.url));
const check = contractCheck('matter.openapi.yaml');
const backend = createBackend([matterScenario({ fixture, concurrentEditMs: 40, jobItemMs: 5 })], { latency: false });
let base = '';
before(async () => {
  await new Promise<void>((resolve) => backend.server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${(backend.server.address() as AddressInfo).port}/api/matter`;
});
after(() => backend.server.close());
beforeEach(() => backend.reset());

const ZHOU = 'U-zhou'; // partner
const LIN = 'U-lin'; // associate
const CHEN = 'U-chen'; // paralegal
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

const disposition = (riskId: string, expectedVersion: number, citedEvidenceIds: string[], extra = {}) => ({
  riskId, expectedVersion, disposition: 'accept', rationale: '测试理由。', citedEvidenceIds, ...extra,
});

test('identity: meta is open, everything else needs a demo persona', async () => {
  assert.equal((await get(null, '/meta')).body.environment, 'synthetic-demo');
  assert.equal((await get(null, '/me')).status, 401);
  assert.equal((await get('U-xu', '/me')).status, 401, 'a user who is not a demo persona cannot be assumed');
  assert.equal((await get(LIN, '/me')).body.role, 'associate');
});

test('list: filters, sorting, pagination and collection affordances', async () => {
  const first = (await get(ZHOU, '/matters')).body;
  assert.equal(first.total, 14);
  assert.equal(first.items.length, 10);
  assert.equal(first.items[0].id, 'M-2057', 'nearest deadline first');
  const second = (await get(ZHOU, '/matters?page=2')).body;
  assert.equal(second.items.length, 4);
  assert.ok(second.items.every((m: any) => m.nextDeadline === null), 'matters without a deadline go last');
  assert.deepEqual((await get(LIN, '/matters?reviewer=me&status=active')).body.items.map((m: any) => m.id).sort(), ['M-2048', 'M-2053', 'M-2054', 'M-2057', 'M-2061']);
  assert.equal((await get(ZHOU, '/matters?q=北辰')).body.total, 1);
  assert.equal((await get(ZHOU, '/matters?status=nonsense')).status, 422);
  assert.equal((await get(ZHOU, '/matters?pageSize=500')).status, 422);
  assert.equal((await get(ZHOU, '/matters?page=0')).status, 422);
  assert.equal((await get(ZHOU, '/matters?openRisk=maybe')).status, 422);
  const m2048 = first.items.find((m: any) => m.id === 'M-2048');
  assert.deepEqual([m2048.openRisks, m2048.recheckRisks], [6, 1]);
  assert.equal(first.actions[0].allowed, true);
  const forLin = (await get(LIN, '/matters')).body.actions[0];
  assert.equal(forLin.allowed, false);
  assert.equal(forLin.violations[0].rule, 'ROLE-1');
});

test('permission: a walled matter is absent from the list and refused with a contact', async () => {
  assert.equal((await get(CHEN, '/matters')).body.total, 13);
  const refused = await get(CHEN, '/matters/M-2054');
  assert.equal(refused.status, 403);
  assert.match(refused.body.contact, /何蔚/);
  assert.equal((await get(CHEN, '/search?q=启衡')).body.length, 0);
});

test('permission: privileged evidence shows that it exists, not what it says', async () => {
  const forChen = (await get(CHEN, '/matters/M-2048/evidence')).body.find((e: any) => e.id === 'E-9006');
  assert.deepEqual([forChen.restricted, forChen.excerpt, forChen.locator], [true, null, null]);
  const forLin = (await get(LIN, '/matters/M-2048/evidence')).body.find((e: any) => e.id === 'E-9006');
  assert.equal(forLin.restricted, false);
  assert.ok(forLin.excerpt);
});

test('version change: a decision citing a superseded document version needs rechecking', async () => {
  const risk = (await get(ZHOU, '/risks/R-3102')).body;
  assert.equal(risk.needsRecheck, true);
  assert.equal(risk.records[0].cited[0].basisCurrent, false);
  assert.equal((await get(ZHOU, '/risks/R-3101')).body.needsRecheck, false);

  // The superseded basis reopens the decision; the old record stays.
  assert.deepEqual(risk.actions.map((a: any) => [a.type, a.allowed]), [['decide-risk', true]]);
  assert.equal((await act(ZHOU, 'decide-risk', disposition('R-3102', 3, ['E-9002']))).status, 422, 'the superseded evidence still cannot be cited');
  const again = await act(ZHOU, 'decide-risk', disposition('R-3102', 3, ['E-9003'], { disposition: 'escalate' }));
  assert.equal(again.status, 200);
  const after = (await get(ZHOU, '/risks/R-3102')).body;
  assert.deepEqual([after.needsRecheck, after.disposition, after.records.length, after.actions.length], [false, 'escalate', 2, 0]);
  const event = (await get(ZHOU, '/matters/M-2048/events')).body.find((e: any) => e.type === 'risk-decided');
  assert.deepEqual(event.changes.find((c: any) => c.field === 'disposition'), { field: 'disposition', from: 'mitigate', to: 'escalate' });
});

test('affordances: the backend says what each role may do and why not', async () => {
  const byType = (risk: any) => Object.fromEntries(risk.actions.map((a: any) => [a.type, a]));
  const lin = byType((await get(LIN, '/risks/R-3101')).body);
  assert.equal(lin['propose-risk-disposition'].allowed, true);
  assert.equal(lin['decide-risk'].violations[0].rule, 'ROLE-1');
  const noEvidence = byType((await get(LIN, '/risks/R-3105')).body);
  assert.equal(noEvidence['propose-risk-disposition'].violations[0].rule, 'EV-1');
  const zhou = byType((await get(ZHOU, '/risks/R-3103')).body);
  assert.deepEqual([zhou['decide-risk'].allowed, zhou['return-risk-proposal'].allowed], [true, true]);
  assert.equal(zhou['propose-risk-disposition'], undefined);
  const chen = byType((await get(CHEN, '/risks/R-3101')).body);
  assert.ok(Object.values(chen).every((a: any) => !a.allowed));
});

test('propose: records the proposal, bumps the version and writes one audit event', async () => {
  const key = newKey();
  const applied = await act(LIN, 'propose-risk-disposition', disposition('R-3101', 2, ['E-9004']), key);
  assert.equal(applied.status, 200);
  assert.equal(applied.body.targetVersion, 3);
  const risk = (await get(LIN, '/risks/R-3101')).body;
  assert.equal(risk.status, 'proposed');
  assert.deepEqual(risk.records.map((r: any) => [r.kind, r.by.id, r.attemptId]), [['proposal', LIN, key]]);
  const event = (await get(LIN, '/matters/M-2048/events')).body[0];
  assert.deepEqual([event.type, event.attemptId, event.targetVersion], ['disposition-proposed', key, 3]);
  assert.ok(event.rules.includes('EV-1@1'));
});

test('rules: role, citations and state are refused with the rule that applies', async () => {
  const role = await act(LIN, 'decide-risk', disposition('R-3101', 2, ['E-9004']));
  assert.deepEqual([role.status, role.body.violations[0].rule], [403, 'ROLE-1']);
  const none = await act(LIN, 'propose-risk-disposition', disposition('R-3101', 2, []));
  assert.deepEqual([none.status, none.body.violations[0].rule], [422, 'EV-1']);
  const unrelated = await act(LIN, 'propose-risk-disposition', disposition('R-3101', 2, ['E-9001']));
  assert.equal(unrelated.status, 422);
  const stale = await act(ZHOU, 'decide-risk', disposition('R-3103', 2, ['E-9002']));
  assert.equal(stale.status, 422);
  await act(ZHOU, 'decide-risk', disposition('R-3101', 2, ['E-9004']));
  const decided = await act(ZHOU, 'decide-risk', disposition('R-3101', 3, ['E-9004']));
  assert.deepEqual([decided.status, decided.body.violations[0].rule], [422, 'ST-2']);
  assert.equal((await call(ZHOU, 'POST', '/actions/decide-risk', [], newKey())).status, 422, 'a body that is not an object is refused, not a crash');
  assert.equal((await act(LIN, 'propose-risk-disposition', disposition('R-3120', 1, ['E-9100'], { rationale: ' ' }))).status, 422);
  assert.equal((await get(LIN, '/risks/R-3120')).body.status, 'open', 'refused attempts change nothing');
});

test('conflict: someone else updated the risk after it was opened', async () => {
  const opened = (await get(LIN, '/risks/R-3104')).body;
  await new Promise((resolve) => setTimeout(resolve, 120)); // the scripted colleague files a proposal
  const refused = await act(LIN, 'propose-risk-disposition', disposition('R-3104', opened.version, ['E-9005']));
  assert.equal(refused.status, 409);
  assert.equal(refused.body.currentVersion, opened.version + 1);
  assert.equal(refused.body.changedBy.name, '许衡');
  const now = (await get(LIN, '/risks/R-3104')).body;
  assert.deepEqual([now.status, now.records.length, now.records[0].by.name], ['proposed', 1, '许衡']);
});

test('repeat: the same attempt key returns the first result and has no second effect', async () => {
  const key = newKey();
  const body = disposition('R-3103', 2, ['E-9001'], { disposition: 'mitigate' });
  const first = await act(ZHOU, 'decide-risk', body, key);
  const again = await act(ZHOU, 'decide-risk', body, key);
  assert.deepEqual(again, first);
  const tasks = (await get(ZHOU, '/matters/M-2048/tasks')).body.filter((t: any) => t.origin?.attemptId === key);
  assert.equal(tasks.length, 1);
  assert.equal((await act(ZHOU, 'decide-risk', { ...body, rationale: '换了内容。' }, key)).status, 422);
});

test('unknown outcome: the response is lost after the action applied', async () => {
  const key = newKey();
  const body = disposition('R-3106', 1, ['E-9008']);
  await assert.rejects(act(ZHOU, 'decide-risk', body, key));
  const attempt = await get(ZHOU, `/action-attempts/${key}`);
  assert.deepEqual([attempt.status, attempt.body.outcome, attempt.body.result.targetVersion], [200, 'applied', 2]);
  assert.equal((await act(ZHOU, 'decide-risk', body, key)).status, 200, 'replaying the key is safe');
  assert.equal((await get(ZHOU, '/risks/R-3106')).body.records.length, 1);
});

test('unknown outcome: the request never arrived, so the same key may be retried', async () => {
  const key = newKey();
  const body = disposition('R-3107', 1, ['E-9009']);
  await assert.rejects(act(ZHOU, 'decide-risk', body, key));
  assert.equal((await get(ZHOU, `/action-attempts/${key}`)).status, 404);
  assert.equal((await get(ZHOU, '/risks/R-3107')).body.status, 'open');
  assert.equal((await act(ZHOU, 'decide-risk', body, key)).status, 200);
});

test('decide: accepting leaves no task; mitigating and escalating leave one with an owner', async () => {
  const accept = await act(ZHOU, 'decide-risk', disposition('R-3101', 2, ['E-9004']));
  assert.deepEqual(accept.body.created, []);
  const key = newKey();
  const escalate = await act(ZHOU, 'decide-risk', disposition('R-3103', 2, ['E-9001'], { disposition: 'escalate' }), key);
  assert.equal(escalate.body.created.length, 1);
  assert.equal(escalate.body.eventIds.length, 2);
  const task = (await get(ZHOU, '/matters/M-2048/tasks')).body.find((t: any) => t.id === escalate.body.created[0].id);
  assert.deepEqual([task.assignee.id, task.origin.attemptId, task.origin.ref], [ZHOU, key, 'R-3103']);
});

test('return: the proposal goes back to open and stays in the history', async () => {
  const returned = await act(ZHOU, 'return-risk-proposal', { riskId: 'R-3103', expectedVersion: 2, rationale: '请补充实际损失的测算。' });
  assert.equal(returned.status, 200);
  const risk = (await get(LIN, '/risks/R-3103')).body;
  assert.equal(risk.status, 'open');
  assert.deepEqual(risk.records.map((r: any) => r.kind), ['proposal', 'return']);
  assert.equal(risk.actions.find((a: any) => a.type === 'propose-risk-disposition').allowed, true);
});

test('bulk: each matter is checked on its own and failures keep their rule', async () => {
  assert.equal((await act(LIN, 'assign-reviewer', { matterIds: ['M-2049'], reviewerId: LIN })).status, 403);
  const key = newKey();
  const accepted = await act(ZHOU, 'assign-reviewer', { matterIds: ['M-2049', 'M-2050', 'M-2052', 'M-2053', 'M-9999'], reviewerId: LIN }, key);
  assert.equal(accepted.status, 202);
  assert.equal(accepted.body.items[0].ref.title, '远岫资本诉澄江置业股权转让纠纷');
  assert.equal((await get(ZHOU, `/action-attempts/${key}`)).body.jobId, accepted.body.id);
  let job = accepted.body;
  while (job.status !== 'completed') {
    await new Promise((resolve) => setTimeout(resolve, 10));
    job = (await get(ZHOU, `/jobs/${job.id}`)).body;
  }
  assert.deepEqual(job.items.map((i: any) => [i.ref.id, i.status, i.violations[0]?.rule]), [
    ['M-2049', 'applied', undefined],
    ['M-2050', 'rejected', 'ST-1'],
    ['M-2052', 'rejected', 'COI-1'],
    ['M-2053', 'applied', undefined],
    ['M-9999', 'rejected', 'REF-1'],
  ]);
  assert.equal((await get(ZHOU, '/matters/M-2049')).body.reviewer.id, LIN);
  assert.equal((await get(ZHOU, '/matters/M-2049/tasks')).body[0].origin.attemptId, key);
  assert.equal((await get(ZHOU, '/matters/M-2053/tasks')).body.length, 1, 'the reviewer it already had gets no second review task');
  assert.equal((await get(ZHOU, `/action-attempts/${key}`)).body.outcome, 'applied');

  // Handing a matter to someone else moves its open review task; it does not leave two.
  const moved = await act(ZHOU, 'assign-reviewer', { matterIds: ['M-2048'], reviewerId: 'U-xu' });
  let handover = moved.body;
  while (handover.status !== 'completed') {
    await new Promise((resolve) => setTimeout(resolve, 10));
    handover = (await get(ZHOU, `/jobs/${handover.id}`)).body;
  }
  const reviews = (await get(ZHOU, '/matters/M-2048/tasks')).body.filter((t: any) => t.kind === 'review');
  assert.deepEqual(reviews.map((t: any) => [t.id, t.assignee.id]), [['T-501', 'U-xu']]);
  assert.match((await get(ZHOU, '/matters/M-2048/events')).body[0].note, /T-501/);
});

test('partial failure: one panel fails while the rest of the page loads', async () => {
  assert.equal((await get(ZHOU, '/matters/M-2053/events')).status, 503);
  assert.equal((await get(ZHOU, '/matters/M-2053/risks')).status, 200);
  assert.equal((await get(ZHOU, '/matters/M-2051/risks')).status, 503);
  assert.equal((await get(ZHOU, '/matters/M-2051/risks')).status, 200, 'the transient failure clears on retry');
});

test('saved views: personal views can be added and removed, shared ones stay', async () => {
  const created = await call(LIN, 'POST', '/saved-views', { name: '开庭在即', query: { stage: 'hearing' } });
  assert.equal(created.status, 201);
  assert.equal((await get(LIN, '/saved-views')).body.length, 4);
  assert.equal((await get(ZHOU, '/saved-views')).body.length, 3, 'personal views are not visible to others');
  assert.equal((await call(LIN, 'DELETE', '/saved-views/V-1')).status, 403);
  assert.equal((await call(LIN, 'DELETE', `/saved-views/${created.body.id}`)).status, 204);
  assert.equal((await call(LIN, 'POST', '/saved-views', { name: '', query: {} })).status, 422);
});

test('next: each risk says which step it waits for and who holds it', async () => {
  const next = async (id: string) => (await get(ZHOU, `/risks/${id}`)).body.next;
  assert.deepEqual(await next('R-3101'), { step: 'propose', owner: { id: LIN, name: '林知夏' } });
  assert.deepEqual(await next('R-3103'), { step: 'decide', owner: { id: ZHOU, name: '周明远' } });
  assert.deepEqual(await next('R-3102'), { step: 'redecide', owner: { id: ZHOU, name: '周明远' } });
  assert.deepEqual(await next('R-3130'), { step: 'propose', owner: null }, 'no reviewer assigned yet');
  await act(ZHOU, 'decide-risk', disposition('R-3101', 2, ['E-9004']));
  assert.equal(await next('R-3101'), null);
});

test('fixture: inconsistencies are reported together, with their paths', () => {
  const { dates: _dates, savedViews: _views, ...data } = readFixture(fixture);
  assert.deepEqual(fixtureProblems(data), []);
  data.matters[0].evidence[0].documentId = 'D-000';
  data.matters[0].risks[0].evidence.push({ id: 'E-000', stance: 'supports' });
  data.matters[0].risks[1].records = [];
  data.matters[1].id = data.matters[0].id; // its own opening event now points at a matter id it no longer has
  data.matters[0].tasks[0].assignee = 'U-nobody';
  assert.deepEqual(fixtureProblems(data).map((p) => p.split(' ')[0]).sort(), ['bad-state', 'dangling-document', 'dangling-evidence', 'dangling-target', 'duplicate-id', 'unknown-user']);
});

test('fixture: a status the records could not have produced is refused', () => {
  const mutated = (change: (risks: any[]) => void) => {
    const { dates: _dates, savedViews: _views, ...data } = readFixture(fixture);
    change(data.matters.flatMap((m: any) => m.risks));
    return fixtureProblems(data).map((p) => p.split(' ')[0]);
  };
  const proposed = (risks: any[]) => risks.find((r) => r.status === 'proposed');
  const decided = (risks: any[]) => risks.find((r) => r.status === 'decided');
  assert.deepEqual(mutated((risks) => { proposed(risks).status = 'not-a-status'; }), ['bad-state']);
  assert.deepEqual(mutated((risks) => { decided(risks).status = 'open'; }), ['bad-state'], 'decided by its records, open by its status');
  assert.deepEqual(mutated((risks) => { const r = proposed(risks); r.records.push({ ...r.records[0], kind: 'return' }); }), ['bad-state'], 'returned, yet still proposed');
  assert.deepEqual(mutated((risks) => { const r = decided(risks); r.records.push({ ...r.records[0], kind: 'return' }); }), ['bad-record-order'], 'a decision cannot be returned');
  assert.deepEqual(mutated((risks) => { proposed(risks).records[0].kind = 'constructor'; }), ['bad-record-order']);
});

test('empty and detail: a new matter has no linked objects', async () => {
  const matter = (await get(ZHOU, '/matters/M-2055')).body;
  assert.deepEqual(matter.links, { parties: 2, documents: 0, evidence: 0, risks: 0, tasks: 0 });
  assert.deepEqual((await get(ZHOU, '/matters/M-2055/risks')).body, []);
  assert.equal((await get(ZHOU, '/matters/M-0000')).status, 404);
});
