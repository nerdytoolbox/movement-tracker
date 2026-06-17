export function toDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function getDatesInRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(toDateString(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function getLast365Days(): string[] {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 364);
  return getDatesInRange(start, end);
}

export function isToday(dateStr: string): boolean {
  return dateStr === toDateString();
}
