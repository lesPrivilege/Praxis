// The payment-review scenario's API: its client, read hooks and actions, all typed by its contract.
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import createClient from 'openapi-fetch';
import type { components, paths } from '../../contracts/payment.d.ts';
import { useAttempt } from '../api/attempt.ts';
import { TransportError, unwrap } from '../api/core.ts';
import { personaStore, usePersona } from '../api/persona.ts';

export type S = components['schemas'];

export const persona = personaStore('payment-persona');
const api = createClient<paths>({ baseUrl: '/api/payment' });
api.use({
  onRequest({ request }) {
    request.headers.set('X-Demo-Persona', persona.get());
    return request;
  },
});

// ---- reads. Query keys start with the scenario and the demo identity, so each identity has its own cache.

const SCOPE = 'payment';
export type CaseListQuery = NonNullable<paths['/cases']['get']['parameters']['query']>;

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
export function useCases(query: CaseListQuery) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'cases', query],
    queryFn: () => unwrap(api.GET('/cases', { params: { query } })),
    placeholderData: keepPreviousData,
  });
}
export function useCase(caseId: string) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'case', caseId],
    queryFn: () => unwrap(api.GET('/cases/{caseId}', { params: { path: { caseId } } })),
  });
}
// Refreshing a case refreshes its checks, proposal and record with it, so what is on the page is one moment's copy.
export function useRefreshCase(caseId: string) {
  const { personaId } = usePersona();
  const queryClient = useQueryClient();
  return () => void queryClient.invalidateQueries({ queryKey: [SCOPE, personaId, 'case', caseId] });
}

// Checks, proposal and record load separately: each is a panel that can fail on its own.
export function useChecks(caseId: string) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'case', caseId, 'checks'],
    queryFn: () => unwrap(api.GET('/cases/{caseId}/checks', { params: { path: { caseId } } })),
  });
}
export function useProposal(caseId: string, enabled: boolean) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'case', caseId, 'proposal'],
    queryFn: () => unwrap(api.GET('/cases/{caseId}/proposal', { params: { path: { caseId } } })),
    enabled,
  });
}
export function useEvents(caseId: string) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'case', caseId, 'events'],
    queryFn: () => unwrap(api.GET('/cases/{caseId}/events', { params: { path: { caseId } } })),
  });
}
export function useFileVersion(fileId: string, version: number) {
  const { personaId } = usePersona();
  return useQuery({
    queryKey: [SCOPE, personaId, 'file', fileId, version],
    queryFn: () => unwrap(api.GET('/files/{fileId}/versions/{version}', { params: { path: { fileId, version } } })),
  });
}

// ---- writes

const header = (attemptId: string) => ({ header: { 'Idempotency-Key': attemptId } });
const lookup = (attemptId: string) => unwrap(api.GET('/action-attempts/{attemptId}', { params: { path: { attemptId } } }));
async function recover(attempt: S['ActionAttempt']): Promise<S['ActionResult']> {
  if (!attempt.result) throw new TransportError('后端记录了这次尝试，但没有给出结果。');
  return attempt.result;
}

const submit = (body: S['SubmitInput'], attemptId: string, signal: AbortSignal) =>
  unwrap(api.POST('/actions/submit-for-review', { params: header(attemptId), body, signal }));
const accept = (body: S['AcceptInput'], attemptId: string, signal: AbortSignal) =>
  unwrap(api.POST('/actions/accept-review', { params: header(attemptId), body, signal }));
const giveBack = (body: S['ReturnInput'], attemptId: string, signal: AbortSignal) =>
  unwrap(api.POST('/actions/return-review', { params: header(attemptId), body, signal }));

export const useSubmitForReview = () => useAttempt(submit, recover, lookup);
export const useAcceptReview = () => useAttempt(accept, recover, lookup);
export const useReturnReview = () => useAttempt(giveBack, recover, lookup);
