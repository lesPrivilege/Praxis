// Fixture loading shared by the scenarios: relative dates, so deadlines never go stale.
import { readFileSync } from 'node:fs';

export function localDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function daysFromNow(days: number): string {
  const now = new Date();
  return localDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + days));
}

// "@-5d" becomes a date, "@-1d16:40" a date-time, both relative to today.
function resolveDates(value: unknown, now: Date): unknown {
  if (typeof value === 'string' && value.startsWith('@')) {
    const m = /^@([+-]\d+)d(?:(\d\d):(\d\d))?$/.exec(value);
    if (!m) throw new Error(`Bad relative date in fixture: ${value}`);
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + Number(m[1]), Number(m[2] ?? 12), Number(m[3] ?? 0));
    return m[2] ? d.toISOString() : localDate(d);
  }
  if (Array.isArray(value)) return value.map((v) => resolveDates(v, now));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveDates(v, now)]));
  }
  return value;
}

export function readFixture(path: string): any {
  return resolveDates(JSON.parse(readFileSync(path, 'utf8')), new Date());
}

// Refuses to start on an inconsistent fixture, listing every problem at once.
export function requireConsistent(path: string, problems: string[]): void {
  if (problems.length) throw new Error(`Fixture ${path} is inconsistent:\n${problems.join('\n')}`);
}
