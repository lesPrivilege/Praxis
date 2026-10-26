// The matter scenario mounted on the kernel: its routes, its four actions, its job, and its one scripted colleague.
import type { components } from '../../contracts/matter.d.ts';
import { notFound, problem, Refusal } from '../kernel.ts';
import type { Reply, Request, Scenario } from '../kernel.ts';
import * as domain from './domain.ts';
import { loadState } from './store.ts';
import type { State } from './store.ts';

type S = components['schemas'];

export interface MatterOptions {
  fixture: string;
  // Tests shorten the scripted delays.
  concurrentEditMs?: number;
  jobItemMs?: number;
}

const MATTER_STATUS = ['active', 'on-hold', 'closed'];
const MATTER_STAGE = ['intake', 'pleading', 'evidence', 'hearing', 'enforcement'];
const MATTER_SORT = ['deadline', '-deadline', 'updatedAt', '-updatedAt'];

export function matterScenario(options: MatterOptions): Scenario {
  let state: State;
  let jobs: Map<string, S['Job']>;
  let concurrentEditFired: boolean;
  let later: (ms: number, run: () => void) => void;

  // Someone else files a proposal on the scripted risk a little after it is first opened.
  function scheduleConcurrentEdit(riskId: string): void {
    const script = state.behaviors.concurrentEdit;
    if (!script || script.riskId !== riskId || concurrentEditFired) return;
    concurrentEditFired = true;
    const actor = state.users.find((u) => u.id === script.actor)!;
    later(options.concurrentEditMs ?? script.afterMs, () => {
      try {
        const current = domain.riskDetail(state, actor, riskId);
        domain.proposeRiskDisposition(state, actor, `sim-${riskId}`, {
          riskId,
          expectedVersion: current.version,
          disposition: script.disposition,
          rationale: script.rationale,
          citedEvidenceIds: script.citedEvidenceIds,
        });
      } catch {
        // The risk moved on before the scripted edit; nothing to simulate.
      }
    });
  }

  function runJob(job: S['Job'], user: S['User'], attemptId: string, input: S['AssignReviewerInput'], finished: () => void): void {
    const step = (index: number) => {
      if (index === input.matterIds.length) {
        job.status = 'completed';
        return finished();
      }
      later(options.jobItemMs ?? state.behaviors.jobItemMs, () => {
        job.items[index] = domain.assignReviewerItem(state, user, attemptId, input.matterIds[index], input.reviewerId);
        job.done += 1;
        step(index + 1);
      });
    };
    step(0);
  }

  async function handle({ method, path, query, user: actor, json }: Request): Promise<Reply | undefined> {
    const user = actor as S['User'];
    const key = `${method} ${path}`;
    const ok = (body: unknown): Reply => ({ status: 200, body });

    if (key === 'GET /search') return ok(domain.search(state, user, query.get('q') ?? ''));
    if (key === 'GET /matters') {
      const list = {
        q: query.get('q') ?? undefined,
        status: (query.get('status') ?? undefined) as S['MatterStatus'] | undefined,
        stage: (query.get('stage') ?? undefined) as S['MatterStage'] | undefined,
        reviewer: query.get('reviewer') ?? undefined,
        openRisk: query.get('openRisk') === 'true',
        sort: (query.get('sort') ?? undefined) as S['MatterSort'] | undefined,
        page: query.has('page') ? Number(query.get('page')) : undefined,
        pageSize: query.has('pageSize') ? Number(query.get('pageSize')) : undefined,
      };
      const bad =
        (list.status && !MATTER_STATUS.includes(list.status)) ||
        (list.stage && !MATTER_STAGE.includes(list.stage)) ||
        (list.sort && !MATTER_SORT.includes(list.sort)) ||
        !['true', 'false', null].includes(query.get('openRisk')) ||
        [list.page, list.pageSize].some((n) => n !== undefined && (!Number.isInteger(n) || n < 1)) ||
        (list.pageSize ?? 0) > 50;
      if (bad) throw new Refusal(422, problem('invalid-input', '筛选条件不在可选范围内。'));
      return ok(domain.listMatters(state, user, list));
    }

    const matterRoute = /^\/matters\/([^/]+)(?:\/(parties|documents|evidence|risks|tasks|events))?$/.exec(path);
    if (method === 'GET' && matterRoute) {
      const matter = domain.matterFor(state, user, matterRoute[1]);
      switch (matterRoute[2]) {
        case undefined: return ok(domain.matterDetail(state, matter));
        case 'parties': return ok(matter.parties);
        case 'documents': return ok(domain.listDocuments(matter));
        case 'evidence': return ok(domain.listEvidence(user, matter));
        case 'risks': return ok(domain.listRisks(matter));
        case 'tasks': return ok(domain.listTasks(state, matter));
        case 'events': return ok(domain.listEvents(state, matter));
      }
    }

    const riskRoute = /^\/risks\/([^/]+)$/.exec(path);
    if (method === 'GET' && riskRoute) {
      const risk = domain.riskDetail(state, user, riskRoute[1]);
      if (risk.status === 'open') scheduleConcurrentEdit(risk.id);
      return ok(risk);
    }

    if (key === 'GET /saved-views') return ok(domain.listViews(state, user));
    if (key === 'POST /saved-views') return { status: 201, body: domain.createView(state, user, await json()) };
    const viewRoute = /^\/saved-views\/([^/]+)$/.exec(path);
    if (method === 'DELETE' && viewRoute) {
      domain.deleteView(state, user, viewRoute[1]);
      return { status: 204 };
    }

    const jobRoute = /^\/jobs\/([^/]+)$/.exec(path);
    if (method === 'GET' && jobRoute) {
      const job = jobs.get(jobRoute[1]);
      if (!job) throw notFound('这个作业');
      return ok(job);
    }
    return undefined;
  }

  const applied = (body: S['ActionResult']) => ({ status: 200, body, outcome: 'applied' as const });
  return {
    prefix: 'matter',
    reset(schedule) {
      later = schedule;
      state = loadState(options.fixture);
      jobs = new Map();
      concurrentEditFired = false;
    },
    meta: () => ({ environment: 'synthetic-demo', dataNotice: state.notice, contractVersion: '0.2.0', scenario: 'matter-workbench' }),
    users: () => state.users,
    behaviors: () => state.behaviors,
    handle,
    actions: {
      'propose-risk-disposition': ({ attemptId, user, input }) => applied(domain.proposeRiskDisposition(state, user as S['User'], attemptId, input)),
      'decide-risk': ({ attemptId, user, input }) => applied(domain.decideRisk(state, user as S['User'], attemptId, input)),
      'return-risk-proposal': ({ attemptId, user, input }) => applied(domain.returnRiskProposal(state, user as S['User'], attemptId, input)),
      'assign-reviewer': ({ attemptId, user, input, finished }) => {
        domain.checkAssignReviewer(state, user as S['User'], input);
        const job: S['Job'] = {
          id: `J-${attemptId}`,
          attemptId,
          type: 'assign-reviewer',
          status: 'running',
          total: input.matterIds.length,
          done: 0,
          items: domain.pendingAssignItems(state, user as S['User'], input.matterIds),
        };
        jobs.set(job.id, job);
        runJob(job, user as S['User'], attemptId, input, finished);
        // The stored body is the live job, so a replayed key sees current progress.
        return { status: 202, body: job, outcome: 'running' };
      },
    },
  };
}
