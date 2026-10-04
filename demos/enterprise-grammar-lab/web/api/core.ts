// What every scenario's API layer shares: the envelope types and the two ways a request can go wrong.
import type { components } from '../../contracts/work.d.ts';

export type W = components['schemas'];

// The backend answered and said why not.
export class ApiError extends Error {
  status: number;
  problem: W['Problem'];
  constructor(status: number, problem: W['Problem']) {
    super(problem.message);
    this.status = status;
    this.problem = problem;
  }
}

// No answer the contract defines: connection lost, timeout, or a gateway error.
// For a read this is a failure; for an action the outcome is unknown.
export class TransportError extends Error {}

const isProblem = (value: unknown): value is W['Problem'] =>
  typeof value === 'object' && value !== null && 'code' in value && 'message' in value;

export async function unwrap<T>(call: Promise<{ data?: T; error?: unknown; response: Response }>): Promise<T> {
  let settled;
  try {
    settled = await call;
  } catch (cause) {
    throw new TransportError('请求没有得到响应。', { cause });
  }
  if (settled.response.ok) return settled.data as T;
  if (isProblem(settled.error)) throw new ApiError(settled.response.status, settled.error);
  throw new TransportError(`服务返回了 ${settled.response.status}，没有说明原因。`);
}
