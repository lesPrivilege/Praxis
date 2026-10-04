// The matter scenario's API: its client, read hooks and actions, all typed by its contract.
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import createClient from 'openapi-fetch';
import type { components, paths } from '../../contracts/matter.d.ts';
import { useAttempt } from '../api/attempt.ts';
import { TransportError, unwrap } from '../api/core.ts';
import { personaStore, usePersona } from '../api/persona.ts';

export type S = components['schemas'];

export const persona = personaStore('matter-persona');
const api = createClient<paths>({ baseUrl: '/api/matter' });
api.use({
  onRequest({ request }) {
    request.headers.set('X-Demo-Persona', persona.get());
    return request;
  },
});

// ---- reads. Query keys start with the scenario and the demo identity, so each identity has its own cache.

const SCOPE = 'matter';
export type MatterListQuery = S['MatterQuery'] & { page?: number; pageSize?: number };

export function useMeta() {
  return useQuery({ queryKey: [SCOPE, 'meta'], queryFn: () => unwrap(api.GET('/meta')), staleTime: Infinity });
}
export function useUsers() {
  return useQuery({ queryKey: [SCOPE, 'users'], queryFn: () => unwrap(api.GET('/users')), staleTime: Infinity });
}
export function useSearch(q: string) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'search', q],
    queryFn: () => unwrap(api.GET('/search', { params: { query: { q } } })),
    enabled: q.trim().length > 0,
  });
}
export function useSavedViews() {
  const { personaId } = usePersona();
  return useQuery({ queryKey: [SCOPE, personaId, 'saved-views'], queryFn: () => unwrap(api.GET('/saved-views')) });
}
export function useMatters(query: MatterListQuery) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'matters', query],
    queryFn: () => unwrap(api.GET('/matters', { params: { query } })),
    placeholderData: keepPreviousData,
  });
}
export function useMatter(matterId: string) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'matter', matterId],
    queryFn: () => unwrap(api.GET('/matters/{matterId}', { params: { path: { matterId } } })),
  });
}

// Refreshing a matter refreshes everything read under it, so no panel is left showing an older copy.
export function useRefreshMatter(matterId: string) {
  const { personaId } = usePersona();
  const queryClient = useQueryClient();
  return () => void queryClient.invalidateQueries({ queryKey: [SCOPE, personaId, 'matter', matterId] });
}

// One hook per linked object type: each panel of an object view loads and fails on its own.
export function useParties(matterId: string) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'matter', matterId, 'parties'],
    queryFn: () => unwrap(api.GET('/matters/{matterId}/parties', { params: { path: { matterId } } })),
  });
}
export function useDocuments(matterId: string) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'matter', matterId, 'documents'],
    queryFn: () => unwrap(api.GET('/matters/{matterId}/documents', { params: { path: { matterId } } })),
  });
}
export function useEvidence(matterId: string) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'matter', matterId, 'evidence'],
    queryFn: () => unwrap(api.GET('/matters/{matterId}/evidence', { params: { path: { matterId } } })),
  });
}
export function useRisks(matterId: string) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'matter', matterId, 'risks'],
    queryFn: () => unwrap(api.GET('/matters/{matterId}/risks', { params: { path: { matterId } } })),
  });
}
export function useTasks(matterId: string) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'matter', matterId, 'tasks'],
    queryFn: () => unwrap(api.GET('/matters/{matterId}/tasks', { params: { path: { matterId } } })),
  });
}
export function useEvents(matterId: string) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'matter', matterId, 'events'],
    queryFn: () => unwrap(api.GET('/matters/{matterId}/events', { params: { path: { matterId } } })),
  });
}
export function useRisk(riskId: string) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'risk', riskId],
    queryFn: () => unwrap(api.GET('/risks/{riskId}', { params: { path: { riskId } } })),
  });
}
export function useJob(jobId: string | undefined) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'job', jobId],
    queryFn: () => unwrap(api.GET('/jobs/{jobId}', { params: { path: { jobId: jobId! } } })),
    enabled: Boolean(jobId),
    refetchInterval: (query) => (query.state.data?.status === 'completed' ? false : 500),
    // A job keeps running whether or not anyone is looking; its progress should be current when they look back.
    refetchIntervalInBackground: true,
  });
}

// ---- writes

const header = (attemptId: string) => ({ header: { 'Idempotency-Key': attemptId } });
const lookup = (attemptId: string) => unwrap(api.GET('/action-attempts/{attemptId}', { params: { path: { attemptId } } }));

async function recoverResult(attempt: S['ActionAttempt']): Promise<S['ActionResult']> {
  if (!attempt.result) throw new TransportError('后端记录了这次尝试，但没有给出结果。');
  return attempt.result;
}
async function recoverJob(attempt: S['ActionAttempt']): Promise<S['Job']> {
  if (!attempt.jobId) throw new TransportError('后端记录了这次尝试，但没有给出作业。');
  return unwrap(api.GET('/jobs/{jobId}', { params: { path: { jobId: attempt.jobId } } }));
}

const propose = (body: S['DispositionInput'], attemptId: string, signal: AbortSignal) =>
  unwrap(api.POST('/actions/propose-risk-disposition', { params: header(attemptId), body, signal }));
const decide = (body: S['DispositionInput'], attemptId: string, signal: AbortSignal) =>
  unwrap(api.POST('/actions/decide-risk', { params: header(attemptId), body, signal }));
const giveBack = (body: S['ReturnInput'], attemptId: string, signal: AbortSignal) =>
  unwrap(api.POST('/actions/return-risk-proposal', { params: header(attemptId), body, signal }));
const assign = (body: S['AssignReviewerInput'], attemptId: string, signal: AbortSignal) =>
  unwrap(api.POST('/actions/assign-reviewer', { params: header(attemptId), body, signal }));

export const useProposeRiskDisposition = () => useAttempt(propose, recoverResult, lookup);
export const useDecideRisk = () => useAttempt(decide, recoverResult, lookup);
export const useReturnRiskProposal = () => useAttempt(giveBack, recoverResult, lookup);
export const useAssignReviewer = () => useAttempt(assign, recoverJob, lookup);

export const createSavedView = (body: S['SavedViewInput']) => unwrap(api.POST('/saved-views', { body }));
export const deleteSavedView = (viewId: string) =>
  unwrap(api.DELETE('/saved-views/{viewId}', { params: { path: { viewId } } }));
