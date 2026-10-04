// Where each object lives in the URL, and how a list query round-trips through it.
import type { S } from './api.ts';

export type Tab = 'overview' | 'risks' | 'evidence' | 'documents' | 'tasks' | 'activity';

export const matterPath = (matterId: string, tab: Tab = 'overview', itemId?: string) =>
  `/matters/${matterId}${tab === 'overview' ? '' : `/${tab}`}${itemId ? `/${itemId}` : ''}`;
export const riskPath = (matterId: string, riskId: string) => matterPath(matterId, 'risks', riskId);
export const attemptPath = (matterId: string, attemptId: string) =>
  `${matterPath(matterId, 'activity')}?attempt=${encodeURIComponent(attemptId)}`;

export function refPath(matterId: string, ref: { kind: string; id: string }): string {
  switch (ref.kind as S['ObjectKind']) {
    case 'matter': return matterPath(ref.id);
    case 'risk': return riskPath(matterId, ref.id);
    case 'document': return matterPath(matterId, 'documents');
    case 'evidence': return matterPath(matterId, 'evidence');
    case 'task': return matterPath(matterId, 'tasks');
  }
}

export function queryFromParams(params: URLSearchParams): S['MatterQuery'] {
  const text = (name: string) => params.get(name) || undefined;
  return {
    q: text('q'),
    status: text('status') as S['MatterStatus'] | undefined,
    stage: text('stage') as S['MatterStage'] | undefined,
    reviewer: text('reviewer'),
    openRisk: params.get('openRisk') === 'true' || undefined,
    sort: text('sort') as S['MatterSort'] | undefined,
  };
}

export function paramsFromQuery(query: S['MatterQuery']): URLSearchParams {
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries(query)) {
    if (value !== undefined && value !== false && value !== '') params.set(name, String(value));
  }
  params.sort();
  return params;
}

export const listPath = (query: S['MatterQuery'] = {}) => {
  const search = paramsFromQuery(query).toString();
  return search ? `/matters?${search}` : '/matters';
};
