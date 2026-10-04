// Exact amounts in a currency's smallest unit. Nothing here converts between currencies.
import type { S } from './api.ts';

const formats = new Map<string, Intl.NumberFormat>();
function formatOf(currency: string): Intl.NumberFormat {
  if (!formats.has(currency)) formats.set(currency, new Intl.NumberFormat('zh-CN', { style: 'currency', currency }));
  return formats.get(currency)!;
}
// How many decimal places the currency's smallest unit sits at (2 for CNY and USD, 0 for JPY).
// `currency` must be an ISO 4217 code; callers check they have one.
export const exponentOf = (currency: string) => formatOf(currency).resolvedOptions().maximumFractionDigits ?? 2;

export function formatMoney(money: S['Money']): string {
  return formatOf(money.currency).format(money.minor / 10 ** exponentOf(money.currency));
}

// "4800.5" in CNY becomes 480050. Works on the digits, so no binary rounding gets in.
export function toMinor(amount: string, currency: string): number | undefined {
  const match = /^(\d+)(?:\.(\d*))?$/.exec(amount.trim());
  if (!match) return undefined;
  const exponent = exponentOf(currency);
  const fraction = (match[2] ?? '').padEnd(exponent, '0');
  if (fraction.length > exponent) return undefined;
  // Past this point an integer is no longer exact; refuse the amount instead of rounding it.
  const minor = Number(match[1] + fraction);
  return Number.isSafeInteger(minor) ? minor : undefined;
}

export function fromMinor(minor: number, currency: string): string {
  const exponent = exponentOf(currency);
  if (exponent === 0) return String(minor);
  const digits = String(minor).padStart(exponent + 1, '0');
  return `${digits.slice(0, -exponent)}.${digits.slice(-exponent)}`;
}
