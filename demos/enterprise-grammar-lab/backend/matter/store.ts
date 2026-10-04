// In-memory state of the matter scenario, loaded from its fixture. Restarting the process resets it.
import type { components } from '../../contracts/matter.d.ts';
import { readFixture, requireConsistent } from '../fixture.ts';
import type { Behaviors } from '../kernel.ts';

type S = components['schemas'];

export interface StoredRecord {
  kind: 'proposal' | 'decision' | 'return';
  by: string;
  at: string;
  attemptId: string;
  disposition?: S['Disposition'];
  rationale?: string;
  cited?: { evidenceId: string; documentVersion: number }[];
}
export interface StoredRisk {
  id: string;
  title: string;
  category: S['RiskFields']['category'];
  severity: S['Severity'];
  status: S['RiskStatus'];
  version: number;
  updatedAt: string;
  updatedBy?: string;
  statement: string;
  evidence: { id: string; stance: S['Stance'] }[];
  records: StoredRecord[];
}
export interface StoredEvidence {
  id: string;
  documentId: string;
  documentVersion: number;
  locator: string;
  excerpt: string;
}
export type StoredDocument = Omit<S['Document'], 'evidenceCount'>;
export interface StoredTask extends Omit<S['Task'], 'assignee' | 'matterId'> {
  assignee: string;
}
export interface StoredEvent {
  id: string;
  at: string;
  actor: string;
  type: S['AuditEvent']['type'];
  target: { kind: S['ObjectRef']['kind']; id: string };
  targetVersion?: number;
  attemptId?: string;
  changes?: S['AuditEvent']['changes'];
  rules?: string[];
  note?: string;
}
export interface StoredMatter {
  id: string;
  title: string;
  cause: string;
  stage: S['MatterStage'];
  status: S['MatterStatus'];
  owner: string;
  reviewer: string | null;
  court: string | null;
  caseNumber: string | null;
  openedAt: string;
  nextDeadline: { label: string; date: string } | null;
  version: number;
  updatedAt: string;
  wall?: { members: string[]; contact: string };
  parties: S['Party'][];
  documents: StoredDocument[];
  evidence: StoredEvidence[];
  risks: StoredRisk[];
  tasks: StoredTask[];
  events: StoredEvent[];
}
export interface StoredView {
  id: string;
  name: string;
  query: S['MatterQuery'];
  owner: string | null;
}
export interface MatterBehaviors extends Behaviors {
  jobItemMs: number;
  concurrentEdit: {
    riskId: string;
    afterMs: number;
    actor: string;
    disposition: S['Disposition'];
    rationale: string;
    citedEvidenceIds: string[];
  } | null;
}
export interface State {
  notice: string;
  users: S['User'][];
  conflicts: { userId: string; partyId: string; note: string }[];
  views: StoredView[];
  matters: StoredMatter[];
  behaviors: MatterBehaviors;
  seq: number;
}

// A fixture that points at something missing fails here, with every problem listed, not later in a request.
export function fixtureProblems(data: Omit<State, 'views' | 'seq'>): string[] {
  const problems: string[] = [];
  const users = new Set(data.users.map((u) => u.id));
  const seen = new Map<string, string>();
  const claim = (id: string, path: string) => {
    if (seen.has(id)) problems.push(`duplicate-id ${path}: ${id} is also ${seen.get(id)}`);
    else seen.set(id, path);
  };
  const user = (id: string | null | undefined, path: string) => {
    if (id && !users.has(id)) problems.push(`unknown-user ${path}: ${id}`);
  };
  data.users.forEach((u, i) => claim(u.id, `users[${i}]`));

  data.matters.forEach((m, mi) => {
    const at = `matters[${mi}]`;
    claim(m.id, at);
    user(m.owner, `${at}.owner`);
    user(m.reviewer, `${at}.reviewer`);
    m.wall?.members.forEach((id, i) => user(id, `${at}.wall.members[${i}]`));
    m.parties.forEach((x, i) => claim(x.id, `${at}.parties[${i}]`));
    m.documents.forEach((x, i) => claim(x.id, `${at}.documents[${i}]`));
    const documents = new Map(m.documents.map((d) => [d.id, d]));
    m.evidence.forEach((e, i) => {
      claim(e.id, `${at}.evidence[${i}]`);
      const doc = documents.get(e.documentId);
      if (!doc) problems.push(`dangling-document ${at}.evidence[${i}]: ${e.documentId}`);
      else if (e.documentVersion < 1 || e.documentVersion > doc.version) {
        problems.push(`bad-version ${at}.evidence[${i}]: ${e.id} cites version ${e.documentVersion} of ${doc.id}, which is at ${doc.version}`);
      }
    });
    const evidence = new Set(m.evidence.map((e) => e.id));
    m.risks.forEach((r, i) => {
      const path = `${at}.risks[${i}]`;
      claim(r.id, path);
      const linked = new Set(r.evidence.map((link) => link.id));
      for (const id of linked) if (!evidence.has(id)) problems.push(`dangling-evidence ${path}.evidence: ${id}`);
      r.records.forEach((record, ri) => {
        user(record.by, `${path}.records[${ri}].by`);
        for (const c of record.cited ?? []) {
          if (!linked.has(c.evidenceId)) problems.push(`dangling-evidence ${path}.records[${ri}].cited: ${c.evidenceId}`);
        }
      });
      const standing = r.status === 'open' ? null : r.status === 'decided' ? 'decision' : 'proposal';
      if (standing && !r.records.some((record) => record.kind === standing)) {
        problems.push(`bad-state ${path}: status ${r.status} without a ${standing} record`);
      }
    });
    m.tasks.forEach((t, i) => {
      claim(t.id, `${at}.tasks[${i}]`);
      user(t.assignee, `${at}.tasks[${i}].assignee`);
    });
    const ids = {
      matter: new Set([m.id]),
      risk: new Set(m.risks.map((r) => r.id)),
      document: new Set(documents.keys()),
      evidence,
      task: new Set(m.tasks.map((t) => t.id)),
    };
    m.events.forEach((e, i) => {
      user(e.actor, `${at}.events[${i}].actor`);
      if (!ids[e.target.kind]?.has(e.target.id)) problems.push(`dangling-target ${at}.events[${i}]: ${e.target.kind} ${e.target.id}`);
    });
  });

  const known = (id: string) => seen.has(id);
  data.conflicts.forEach((c, i) => {
    user(c.userId, `conflicts[${i}].userId`);
    if (!known(c.partyId)) problems.push(`dangling-party conflicts[${i}]: ${c.partyId}`);
  });
  const script = data.behaviors.concurrentEdit;
  if (script) {
    user(script.actor, 'behaviors.concurrentEdit.actor');
    for (const id of [script.riskId, ...script.citedEvidenceIds]) {
      if (!known(id)) problems.push(`dangling-behavior behaviors.concurrentEdit: ${id}`);
    }
  }
  data.behaviors.dropResponse.forEach((d, i) => {
    if (!known(d.ref)) problems.push(`dangling-behavior behaviors.dropResponse[${i}]: ${d.ref}`);
  });
  return problems;
}

export function loadState(fixturePath: string): State {
  const { dates: _dates, savedViews, ...rest } = readFixture(fixturePath);
  const data = rest as Omit<State, 'views' | 'seq'>;
  requireConsistent(fixturePath, fixtureProblems(data));
  let seq = 1000;
  for (const matter of data.matters) {
    for (const event of matter.events) event.id = `EV-${++seq}`;
  }
  return {
    ...data,
    views: savedViews.map((v: Omit<StoredView, 'owner'>) => ({ ...v, owner: null })),
    seq,
  };
}

export function nextId(state: State, prefix: string): string {
  return `${prefix}-${++state.seq}`;
}
