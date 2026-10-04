// In-memory state of the payment-review scenario, loaded from its fixture. Restarting the process resets it.
import type { components } from '../../contracts/payment.d.ts';
import { readFixture, requireConsistent } from '../fixture.ts';
import type { Behaviors } from '../kernel.ts';

type S = components['schemas'];

export interface StoredFragment {
  key: string;
  locator: string;
  text: string;
  // What the rules read. People read `text`.
  value: unknown;
}
export interface StoredFileVersion {
  version: number;
  receivedAt: string;
  source: string;
  fragments: StoredFragment[];
}
export interface StoredFile {
  id: string;
  kind: S['FileKind'];
  title: string;
  // Oldest first. Earlier versions stay readable.
  versions: StoredFileVersion[];
}
export interface StoredBasis {
  fileId: string;
  version: number;
}
export interface StoredRecord {
  kind: S['ReviewRecord']['kind'];
  by: string;
  at: string;
  attemptId: string;
  caseVersion: number;
  conclusion?: 'sufficient' | 'exception';
  explanation?: string;
  proposalUse?: S['ProposalUse'];
  proposalId?: string;
  basis?: StoredBasis[];
}
export interface StoredEvent {
  id: string;
  at: string;
  actor: string;
  type: S['AuditEventType'];
  target: { kind: S['ObjectKind']; id: string };
  targetVersion?: number;
  attemptId?: string;
  changes?: S['AuditEvent']['changes'];
  rules?: string[];
  note?: string;
}
export interface StoredCase {
  id: string;
  title: string;
  vendor: string;
  contractNo: string;
  milestone: string;
  requester: string;
  owner: string | null;
  dueDate: string | null;
  // What the records say. Whether a drafting case is ready follows from the checks.
  stage: 'drafting' | 'in-review' | 'decided';
  version: number;
  updatedAt: string;
  updatedBy?: string;
  // Who supplies each kind of missing material.
  contacts: Record<'invoice' | 'acceptance' | 'terms' | 'currency', string>;
  wall?: { members: string[]; contact: string };
  files: StoredFile[];
  proposal: { id: string; generatedAt: string; suggestion: S['Proposal']['suggestion']; text: string; basis: StoredBasis[] } | null;
  records: StoredRecord[];
  events: StoredEvent[];
}
export interface PaymentBehaviors extends Behaviors {
  concurrentEdit: { caseId: string; afterMs: number; actor: string; explanation: string; proposalUse: S['ProposalUse'] } | null;
}
export interface State {
  notice: string;
  users: S['User'][];
  lead: string;
  cases: StoredCase[];
  behaviors: PaymentBehaviors;
  seq: number;
}

export function fixtureProblems(data: Omit<State, 'seq'>): string[] {
  const problems: string[] = [];
  const users = new Set(data.users.map((u) => u.id));
  const user = (id: string | null | undefined, path: string) => {
    if (id && !users.has(id)) problems.push(`unknown-user ${path}: ${id}`);
  };
  const seen = new Map<string, string>();
  const claim = (id: string, path: string) => {
    if (seen.has(id)) problems.push(`duplicate-id ${path}: ${id} is also ${seen.get(id)}`);
    else seen.set(id, path);
  };
  user(data.lead, 'lead');

  data.cases.forEach((c, ci) => {
    const at = `cases[${ci}]`;
    claim(c.id, at);
    user(c.owner, `${at}.owner`);
    c.wall?.members.forEach((id, i) => user(id, `${at}.wall.members[${i}]`));
    const versions = new Map<string, number>();
    // The rules read "the" invoice, "the" acceptance record: a second file of a kind would be silently ignored.
    const kinds = c.files.map((f) => f.kind);
    for (const kind of new Set(kinds)) {
      if (kinds.filter((k) => k === kind).length > 1) problems.push(`duplicate-kind ${at}.files: more than one ${kind}`);
    }
    c.files.forEach((f, fi) => {
      claim(f.id, `${at}.files[${fi}]`);
      versions.set(f.id, f.versions.length);
      f.versions.forEach((v, vi) => {
        if (v.version !== vi + 1) problems.push(`bad-version ${at}.files[${fi}].versions[${vi}]: expected ${vi + 1}, found ${v.version}`);
      });
    });
    const basis = (list: StoredBasis[] | undefined, path: string) => {
      for (const b of list ?? []) {
        const max = versions.get(b.fileId);
        if (!max) problems.push(`dangling-file ${path}: ${b.fileId}`);
        else if (b.version < 1 || b.version > max) problems.push(`bad-version ${path}: ${b.fileId} has no version ${b.version}`);
      }
    };
    basis(c.proposal?.basis, `${at}.proposal.basis`);
    c.records.forEach((r, ri) => {
      user(r.by, `${at}.records[${ri}].by`);
      basis(r.basis, `${at}.records[${ri}].basis`);
    });
    const last = c.records.at(-1)?.kind;
    const expected: (string | undefined)[] = { drafting: [undefined, 'return'], 'in-review': ['submission'], decided: ['acceptance'] }[c.stage];
    if (!expected.includes(last)) problems.push(`bad-state ${at}: stage ${c.stage} but the last record is ${last ?? 'absent'}`);
    c.events.forEach((e, ei) => {
      user(e.actor, `${at}.events[${ei}].actor`);
      const known = e.target.kind === 'case' ? e.target.id === c.id : versions.has(e.target.id);
      if (!known) problems.push(`dangling-target ${at}.events[${ei}]: ${e.target.kind} ${e.target.id}`);
    });
  });

  const script = data.behaviors.concurrentEdit;
  if (script) {
    user(script.actor, 'behaviors.concurrentEdit.actor');
    if (!seen.has(script.caseId)) problems.push(`dangling-behavior behaviors.concurrentEdit: ${script.caseId}`);
  }
  data.behaviors.dropResponse.forEach((d, i) => {
    if (!seen.has(d.ref)) problems.push(`dangling-behavior behaviors.dropResponse[${i}]: ${d.ref}`);
  });
  return problems;
}

export function loadState(fixturePath: string): State {
  const { dates: _dates, ...data } = readFixture(fixturePath);
  requireConsistent(fixturePath, fixtureProblems(data));
  let seq = 5000;
  for (const c of data.cases) for (const event of c.events) event.id = `EV-${++seq}`;
  return { ...data, seq };
}

export function nextId(state: State, prefix: string): string {
  return `${prefix}-${++state.seq}`;
}
