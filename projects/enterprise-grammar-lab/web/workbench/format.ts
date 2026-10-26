const pad = (n: number) => String(n).padStart(2, '0');

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatClock(ms: number): string {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// Whole days from today to a YYYY-MM-DD date; negative when it has passed.
export function daysUntil(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return Math.round((new Date(y, m - 1, d).getTime() - start) / 86_400_000);
}

export function relativeDays(date: string): string {
  const days = daysUntil(date);
  if (days === 0) return '今天';
  return days > 0 ? `还有 ${days} 天` : `已过 ${-days} 天`;
}
