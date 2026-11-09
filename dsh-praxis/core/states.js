// The lifecycles Praxis records, declared once. Core enforces them, the tool descriptions quote
// them, and the page reads the state core derives instead of deriving its own.
import { createHash } from 'node:crypto'

/** How far an original was read. */
export const EVIDENCE = ['verified', 'partial', 'unavailable']
/** A person's verdict on a description: a catalog entry's or a binding's. */
export const VERDICTS = ['accurate', 'revised', 'needs-work']
/**
 * What needs someone now. `needs_work`: a current review says the description is wrong (a
 * rewrite after the review clears it: the rewrite is waiting for a new review, which is the
 * default state, not a signal). `changed`: the source's content changed after the last review.
 * `unreachable`: the last check found the link gone (404, 410, or a host that no longer resolves).
 */
export const SIGNALS = ['needs_work', 'changed', 'unreachable']

/**
 * An own source is `active` until retired; retiring is final. A retired source stays resolvable for
 * runs that read it, but nothing new may be written to it: no filing, curating or reviewing.
 */
export const SOURCE_STATES = ['active', 'retired']
/** A binding is `active` or `removed`; `praxis_remove` and `praxis_restore` move it. */
export const BINDING_STATES = ['active', 'removed']
/**
 * A capture request from the Praxis page: `running` while its agent works, then `done` or
 * `failed`; `stopped` when the Host lost the agent (a restart) before it finished.
 */
export const ASK_STATES = ['running', 'done', 'failed', 'stopped']

export const describe = (list) => list.join('、')

const sha = (text) => createHash('sha256').update(String(text ?? '')).digest('hex')

/** What a review records about the description it judged, so its currency is a comparison, not arithmetic. */
export const seenDescription = (description) => ({ description_sha256: sha(description) })

/**
 * Whether a review still applies: the description it judged is the description now. Reviews made
 * before this rule recorded only a revision; for those the caller says what held then.
 */
export function reviewCurrent(review, description, legacy = true) {
  if (!review) return false
  return review.description_sha256 !== undefined ? review.description_sha256 === sha(description) : legacy
}

/** Refuse a write to a source that can no longer change. */
export function writable(source) {
  if (source?.state === 'retired') throw new Error(`source is retired; it stays readable but cannot change: ${source.id}`)
  return source
}
