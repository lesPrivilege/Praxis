// Where each object lives in the URL, and how a list query round-trips through it.
import type { CaseListQuery, S } from './api.ts';

export type Tab = 'review' | 'files' | 'activity';
export type CaseQuery = Omit<CaseListQuery, 'page' | 'pageSize'>;

export const casePath = (caseId: string, tab: Tab = 'review') => `/reviews/${caseId}${tab === 'review' ? '' : `/${tab}`}`;
export const attemptPath = (caseId: string, attemptId: string) => `${casePath(caseId, 'activity')}?attempt=${encodeURIComponent(attemptId)}`;

// An evidence reference is an address too: which file, which version, which place in it.
export function evidenceSearch(ref: { fileId: string; version: number; key?: string }): string {
  const params = new URLSearchParams({ file: ref.fileId, fv: String(ref.version) });
  if (ref.key) params.set('at', ref.key);
  return `?${params}`;
}

export function queryFromParams(params: URLSearchParams): CaseQuery {
  const text = (name: string) => params.get(name) || undefined;
  const integer = (name: string) => (params.get(name) ? Number(params.get(name)) : undefined);
  return {
    q: text('q'),
    status: text('status') as S['CaseStatus'] | undefined,
    owner: text('owner'),
    dueFrom: text('dueFrom'),
    dueTo: text('dueTo'),
    currency: text('currency'),
    amountMin: integer('amountMin'),
    amountMax: integer('amountMax'),
    sort: text('sort') as S['CaseSort'] | undefined,
  };
}

export function paramsFromQuery(query: CaseQuery): URLSearchParams {
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.set(name, String(value));
  }
  params.sort();
  return params;
}

export const listPath = (query: CaseQuery = {}) => {
  const search = paramsFromQuery(query).toString();
  return search ? `/reviews?${search}` : '/reviews';
};
