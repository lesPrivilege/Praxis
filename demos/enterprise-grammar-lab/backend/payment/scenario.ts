// The payment-review scenario mounted on the kernel: its routes, its three actions, and its one scripted colleague.
import type { components } from '../../contracts/payment.d.ts';
import { problem, Refusal } from '../kernel.ts';
import type { Reply, Request, Scenario } from '../kernel.ts';
import * as domain from './domain.ts';
import { loadState } from './store.ts';
import type { State } from './store.ts';

type S = components['schemas'];

export interface PaymentOptions {
  fixture: string;
  // Tests shorten the scripted delay.
  concurrentEditMs?: number;
}

const STATUS = ['needs-material', 'ready', 'in-review', 'decided'];
const SORT = ['dueDate', '-dueDate', 'updatedAt', '-updatedAt'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const invalid = (message: string) => new Refusal(422, problem('invalid-input', message));

export function paymentScenario(options: PaymentOptions): Scenario {
  let state: State;
  let concurrentEditFired: boolean;
  let later: (ms: number, run: () => void) => void;

  // A colleague submits the scripted case a little after it is first opened.
  function scheduleConcurrentEdit(caseId: string): void {
    const script = state.behaviors.concurrentEdit;
    if (!script || script.caseId !== caseId || concurrentEditFired) return;
    concurrentEditFired = true;
    const actor = state.users.find((u) => u.id === script.actor)!;
    later(options.concurrentEditMs ?? script.afterMs, () => {
      try {
        const current = domain.caseFor(state, actor, caseId);
        domain.submitForReview(state, actor, `sim-${caseId}`, {
          caseId,
          expectedVersion: current.version,
          explanation: script.explanation,
          proposalUse: script.proposalUse,
        });
      } catch {
        // The case moved on before the scripted edit; nothing to simulate.
      }
    });
  }

  function listQuery(query: URLSearchParams): domain.CaseQuery {
    const text = (name: string) => query.get(name) ?? undefined;
    // An empty value is not a number; Number('') would quietly make it 0.
    const integer = (name: string) => (query.has(name) ? (query.get(name) === '' ? Number.NaN : Number(query.get(name))) : undefined);
    const list: domain.CaseQuery = {
      q: text('q'),
      status: text('status') as S['CaseStatus'] | undefined,
      owner: text('owner'),
      dueFrom: text('dueFrom'),
      dueTo: text('dueTo'),
      currency: text('currency'),
      amountMin: integer('amountMin'),
      amountMax: integer('amountMax'),
      sort: text('sort') as S['CaseSort'] | undefined,
      page: integer('page'),
      pageSize: integer('pageSize'),
    };
    if ((list.status && !STATUS.includes(list.status)) || (list.sort && !SORT.includes(list.sort))) throw invalid('筛选条件不在可选范围内。');
    if ([list.dueFrom, list.dueTo].some((d) => d !== undefined && !DATE.test(d))) throw invalid('日期须写成 YYYY-MM-DD。');
    if ([list.amountMin, list.amountMax].some((n) => n !== undefined && (!Number.isInteger(n) || n < 0))) throw invalid('金额须是不小于 0 的整数，以最小货币单位计。');
    // Amounts in different currencies cannot be put on one scale, so a range needs its currency.
    if ((list.amountMin !== undefined || list.amountMax !== undefined) && !list.currency) throw invalid('按金额筛选须同时指定币种：不同币种的金额不能比较。');
    if ([list.page, list.pageSize].some((n) => n !== undefined && (!Number.isInteger(n) || n < 1)) || (list.pageSize ?? 0) > 50) throw invalid('页码或每页条数不在可选范围内。');
    return list;
  }

  function handle({ method, path, query, user: actor }: Request): Reply | undefined {
    if (method !== 'GET') return undefined;
    const user = actor as S['User'];
    const ok = (body: unknown): Reply => ({ status: 200, body });

    if (path === '/search') return ok(domain.search(state, user, query.get('q') ?? ''));
    if (path === '/cases') return ok(domain.listCases(state, user, listQuery(query)));

    const caseRoute = /^\/cases\/([^/]+)(?:\/(checks|proposal|events))?$/.exec(path);
    if (caseRoute) {
      const found = domain.caseFor(state, user, caseRoute[1]);
      switch (caseRoute[2]) {
        case undefined:
          if (found.stage === 'drafting') scheduleConcurrentEdit(found.id);
          return ok(domain.caseDetail(state, user, found));
        case 'checks': return ok(domain.checks(found));
        case 'proposal': return ok(domain.proposal(found));
        case 'events': return ok(domain.listEvents(state, found));
      }
    }

    const fileRoute = /^\/files\/([^/]+)\/versions\/(\d+)$/.exec(path);
    if (fileRoute) return ok(domain.fileVersion(state, user, fileRoute[1], Number(fileRoute[2])));
    return undefined;
  }

  const applied = (body: S['ActionResult']) => ({ status: 200, body, outcome: 'applied' as const });
  return {
    prefix: 'payment',
    reset(schedule) {
      later = schedule;
      state = loadState(options.fixture);
      concurrentEditFired = false;
    },
    meta: () => ({ environment: 'synthetic-demo', dataNotice: state.notice, contractVersion: '0.1.0', scenario: 'payment-review' }),
    users: () => state.users,
    behaviors: () => state.behaviors,
    handle,
    actions: {
      'submit-for-review': ({ attemptId, user, input }) => applied(domain.submitForReview(state, user as S['User'], attemptId, input)),
      'accept-review': ({ attemptId, user, input }) => applied(domain.acceptReview(state, user as S['User'], attemptId, input)),
      'return-review': ({ attemptId, user, input }) => applied(domain.returnReview(state, user as S['User'], attemptId, input)),
    },
  };
}
