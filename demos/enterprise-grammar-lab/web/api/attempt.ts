// One action attempt, from submission to a known outcome.
// A lost response is not a failure: the attempt keeps its identity and is checked before any retry.
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { ApiError } from './core.ts';
import type { W } from './core.ts';

export type AttemptState<R> =
  | { phase: 'idle' }
  | { phase: 'submitting'; attemptId: string }
  | { phase: 'applied'; attemptId: string; result: R }
  | { phase: 'refused'; attemptId: string; problem: W['Problem'] }
  // lastCheck: what the backend said when asked about this attempt, if it has been asked.
  | { phase: 'unknown'; attemptId: string; checking: boolean; lastCheck?: 'not-received' | 'unreachable' };

export interface Attempt<I, R> {
  state: AttemptState<R>;
  submit: (input: I) => void;
  check: () => void;
  retry: () => void;
  reset: () => void;
}

const ACTION_TIMEOUT_MS = 15_000;

export function useAttempt<I, R>(
  send: (input: I, attemptId: string, signal: AbortSignal) => Promise<R>,
  // Turns what the backend recorded for the attempt into the result `send` would have returned.
  recover: (attempt: W['ActionAttempt']) => Promise<R>,
  // Asks the scenario's backend what it recorded for an attempt.
  lookup: (attemptId: string) => Promise<W['ActionAttempt']>,
): Attempt<I, R> {
  const [state, setState] = useState<AttemptState<R>>({ phase: 'idle' });
  const input = useRef<I | null>(null);
  // Set the moment a submission starts. State alone would let two quick clicks both pass before the next render.
  const busy = useRef(false);
  const queryClient = useQueryClient();

  const settle = useCallback(
    (next: AttemptState<R>) => {
      setState(next);
      // An applied action can change any object the page shows; a refusal may mean the page is behind.
      if (next.phase === 'applied' || next.phase === 'refused') void queryClient.invalidateQueries();
    },
    [queryClient],
  );

  const run = useCallback(
    async (attemptId: string) => {
      busy.current = true;
      setState({ phase: 'submitting', attemptId });
      try {
        settle({ phase: 'applied', attemptId, result: await send(input.current!, attemptId, AbortSignal.timeout(ACTION_TIMEOUT_MS)) });
      } catch (error) {
        // Only a 4xx is a definite refusal. A 5xx, even one with a Problem body, says nothing about whether the action ran.
        if (error instanceof ApiError && error.status < 500) settle({ phase: 'refused', attemptId, problem: error.problem });
        else setState({ phase: 'unknown', attemptId, checking: false });
      } finally {
        busy.current = false;
      }
    },
    [send, settle],
  );

  const submit = useCallback(
    (value: I) => {
      // One attempt at a time: while the outcome is pending or unknown, a new one would be a second action.
      if (busy.current || state.phase === 'unknown') return;
      input.current = value;
      void run(crypto.randomUUID());
    },
    [run, state.phase],
  );

  const check = useCallback(async () => {
    if (state.phase !== 'unknown') return;
    const { attemptId } = state;
    setState({ phase: 'unknown', attemptId, checking: true });
    const stillUnknown = (lastCheck: 'not-received' | 'unreachable') => setState({ phase: 'unknown', attemptId, checking: false, lastCheck });
    let attempt: W['ActionAttempt'];
    try {
      attempt = await lookup(attemptId);
    } catch (error) {
      // Only a 404 for the attempt itself means the backend never received it.
      return stillUnknown(error instanceof ApiError && error.status === 404 ? 'not-received' : 'unreachable');
    }
    try {
      if (attempt.outcome === 'rejected' && attempt.problem) settle({ phase: 'refused', attemptId, problem: attempt.problem });
      else settle({ phase: 'applied', attemptId, result: await recover(attempt) });
    } catch {
      // The attempt is known but its result could not be read; the outcome stays unknown to this page.
      stillUnknown('unreachable');
    }
  }, [state, recover, lookup, settle]);

  // Same key, same input: safe once the backend has said it never received the attempt.
  const retry = useCallback(() => {
    if (state.phase === 'unknown' && state.lastCheck === 'not-received') void run(state.attemptId);
  }, [state, run]);

  const reset = useCallback(() => setState({ phase: 'idle' }), []);
  return { state, submit, check: () => void check(), retry, reset };
}
