// What every scenario's fake backend needs and none of them should rewrite: HTTP in and out,
// demo identity, action attempts with their idempotency, and the scripted misbehaviour.
import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { components } from '../contracts/work.d.ts';

export type W = components['schemas'];

// A refusal the kernel turns into a Problem response.
export class Refusal extends Error {
  status: number;
  problem: W['Problem'];
  constructor(status: number, problem: W['Problem']) {
    super(problem.message);
    this.status = status;
    this.problem = problem;
  }
}
export const problem = (code: W['Problem']['code'], message: string): W['Problem'] => ({ code, message });
export const notFound = (what: string) => new Refusal(404, problem('not-found', `没有找到${what}。`));

export interface Behaviors {
  latencyMs: [number, number];
  failFirst: { route: string; times: number; message: string }[];
  failAlways: { route: string; message: string }[];
  // An action whose input mentions `ref` loses its response once, before or after it applied.
  dropResponse: { ref: string; when: 'before-apply' | 'after-apply'; times: number }[];
}

export interface Reply {
  status: number;
  body?: unknown;
}
export interface Request {
  method: string;
  // Path below the scenario prefix, e.g. "/matters/M-2048".
  path: string;
  query: URLSearchParams;
  user: W['User'];
  json: () => Promise<any>;
}
export interface ActionRun {
  attemptId: string;
  user: W['User'];
  input: any;
  // For an action accepted as a job: call when the job has run to the end.
  finished: () => void;
}
export interface Scenario {
  prefix: string;
  // Reload the fixture. `later` schedules scripted events; they are cancelled on the next reset.
  reset: (later: (ms: number, run: () => void) => void) => void;
  meta: () => W['Meta'];
  users: () => W['User'][];
  behaviors: () => Behaviors;
  // Reads and plain writes. Undefined means the route is not this scenario's.
  handle: (request: Request) => Promise<Reply | undefined> | Reply | undefined;
  // Actions by type. The reply is stored against the attempt and replayed for the same key.
  actions: Record<string, (run: ActionRun) => Reply & { outcome: 'applied' | 'running' }>;
}

interface Attempt {
  attemptId: string;
  type: string;
  actor: string;
  receivedAt: string;
  fingerprint: string;
  outcome: W['ActionAttempt']['outcome'];
  status: number;
  body: unknown;
}
interface Mounted {
  scenario: Scenario;
  attempts: Map<string, Attempt>;
  failFirst: Map<string, number>;
  drops: Map<string, { when: 'before-apply' | 'after-apply'; left: number }>;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function send(res: ServerResponse, status: number, body?: unknown): void {
  if (body === undefined) {
    res.writeHead(status).end();
    return;
  }
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}

async function readJson(req: IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 64 * 1024) throw new Refusal(422, problem('invalid-input', '请求体过大。'));
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new Refusal(422, problem('invalid-input', '请求体不是有效的 JSON。'));
  }
}

// Tests turn latency off.
export function createBackend(scenarios: Scenario[], options: { latency?: boolean } = {}) {
  let timers = new Set<NodeJS.Timeout>();
  const later = (ms: number, run: () => void) => {
    const timer = setTimeout(() => {
      timers.delete(timer);
      run();
    }, ms);
    timers.add(timer);
  };

  const mounted = new Map<string, Mounted>();
  function reset(): void {
    for (const timer of timers) clearTimeout(timer);
    timers = new Set();
    for (const scenario of scenarios) {
      scenario.reset(later);
      const behaviors = scenario.behaviors();
      mounted.set(scenario.prefix, {
        scenario,
        attempts: new Map(),
        failFirst: new Map(behaviors.failFirst.map((f) => [f.route, f.times])),
        drops: new Map(behaviors.dropResponse.map((d) => [d.ref, { when: d.when, left: d.times }])),
      });
    }
  }
  reset();

  async function action(mount: Mounted, type: string, req: IncomingMessage, res: ServerResponse, user: W['User']): Promise<void> {
    const key = req.headers['idempotency-key'];
    if (typeof key !== 'string' || key.length < 8) throw new Refusal(422, problem('invalid-input', '动作请求需要 Idempotency-Key。'));
    const input = await readJson(req);
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
      throw new Refusal(422, problem('invalid-input', '请求体须是一个对象。'));
    }
    const fingerprint = JSON.stringify([type, user.id, input]);
    const seen = mount.attempts.get(key);
    if (seen) {
      if (seen.fingerprint !== fingerprint) throw new Refusal(422, problem('invalid-input', '这个尝试编号已用于另一个请求。'));
      return send(res, seen.status, seen.body);
    }

    const drop = Object.values(input)
      .map((value) => (typeof value === 'string' ? mount.drops.get(value) : undefined))
      .find((d) => d && d.left > 0);
    if (drop) drop.left -= 1;
    if (drop?.when === 'before-apply') {
      req.socket.destroy();
      return;
    }

    const attempt: Attempt = {
      attemptId: key, type, actor: user.id, receivedAt: new Date().toISOString(), fingerprint,
      outcome: 'rejected', status: 500, body: problem('unavailable', ''),
    };
    try {
      const reply = mount.scenario.actions[type]({ attemptId: key, user, input, finished: () => (attempt.outcome = 'applied') });
      Object.assign(attempt, { outcome: reply.outcome, status: reply.status, body: reply.body });
    } catch (error) {
      if (!(error instanceof Refusal)) throw error;
      Object.assign(attempt, { outcome: 'rejected', status: error.status, body: error.problem });
    }
    mount.attempts.set(key, attempt);
    if (drop?.when === 'after-apply') {
      req.socket.destroy();
      return;
    }
    send(res, attempt.status, attempt.body);
  }

  function attemptView(mount: Mounted, user: W['User'], attemptId: string): W['ActionAttempt'] {
    const attempt = mount.attempts.get(attemptId);
    if (!attempt || attempt.actor !== user.id) throw new Refusal(404, problem('not-found', '后端没有收到这次尝试。'));
    const actor = mount.scenario.users().find((u) => u.id === attempt.actor)!;
    return {
      attemptId: attempt.attemptId,
      type: attempt.type,
      actor: { id: actor.id, name: actor.name },
      receivedAt: attempt.receivedAt,
      outcome: attempt.outcome,
      // A job action answers 202 with the job; its items, not the attempt, say what took effect.
      ...(attempt.status === 202
        ? { jobId: (attempt.body as W['Job']).id }
        : attempt.outcome === 'applied'
          ? { result: attempt.body as W['ActionResult'] }
          : { problem: attempt.body as W['Problem'] }),
    };
  }

  async function route(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const method = req.method ?? 'GET';
    if (method === 'POST' && url.pathname === '/__fake/reset') {
      reset();
      return send(res, 204);
    }
    const match = /^\/api\/([^/]+)(\/.*)$/.exec(url.pathname);
    const mount = match && mounted.get(match[1]);
    if (!match || !mount) return send(res, 404, problem('not-found', '没有这个接口。'));
    const path = match[2];
    const key = `${method} ${path}`;
    const { scenario } = mount;
    const behaviors = scenario.behaviors();

    if (options.latency !== false) {
      const [min, max] = behaviors.latencyMs;
      await sleep(min + Math.random() * (max - min));
    }
    const always = behaviors.failAlways.find((f) => f.route === key);
    if (always) return send(res, 503, problem('unavailable', always.message));
    const left = mount.failFirst.get(key) ?? 0;
    if (left > 0) {
      mount.failFirst.set(key, left - 1);
      return send(res, 503, problem('unavailable', behaviors.failFirst.find((f) => f.route === key)!.message));
    }

    if (key === 'GET /meta') return send(res, 200, scenario.meta());
    // The demo identities are listed openly: one has to be picked before anything else can be asked.
    if (key === 'GET /users') return send(res, 200, scenario.users());

    const user = scenario.users().find((u) => u.id === req.headers['x-demo-persona'] && u.demoPersona);
    if (!user) return send(res, 401, problem('unauthenticated', '请求没有带可用的演示身份。'));
    if (key === 'GET /me') return send(res, 200, user);

    const actionRoute = /^\/actions\/([^/]+)$/.exec(path);
    if (method === 'POST' && actionRoute && Object.hasOwn(scenario.actions, actionRoute[1])) return action(mount, actionRoute[1], req, res, user);
    const attemptRoute = /^\/action-attempts\/([^/]+)$/.exec(path);
    if (method === 'GET' && attemptRoute) return send(res, 200, attemptView(mount, user, attemptRoute[1]));

    const reply = await scenario.handle({ method, path, query: url.searchParams, user, json: () => readJson(req) });
    if (!reply) return send(res, 404, problem('not-found', '没有这个接口。'));
    send(res, reply.status, reply.body);
  }

  const server = createServer((req, res) => {
    route(req, res).catch((error) => {
      if (res.headersSent || res.destroyed) return;
      if (error instanceof Refusal) return send(res, error.status, error.problem);
      console.error(error);
      send(res, 500, problem('unavailable', '后端出错。'));
    });
  });
  return { server, reset };
}
