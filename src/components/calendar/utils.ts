export const HOUR_HEIGHT = 56;
export const DAY_START_HOUR = 0;
export const DAY_END_HOUR = 24;
export const HOURS = Array.from(
  { length: DAY_END_HOUR - DAY_START_HOUR },
  (_, i) => DAY_START_HOUR + i,
);

export function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function weekDays(anchor: Date, count = 7) {
  const start = startOfWeek(anchor);
  return Array.from({ length: count }, (_, i) => addDays(start, i));
}

export function formatHour(hour: number) {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function minutesFromDayStart(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

export function eventTopPx(start: Date) {
  return (minutesFromDayStart(start) / 60) * HOUR_HEIGHT;
}

export function eventHeightPx(start: Date, end: Date | null) {
  const endDate = end ?? new Date(start.getTime() + 60 * 60 * 1000);
  const minutes = Math.max(
    30,
    (endDate.getTime() - start.getTime()) / (60 * 1000),
  );
  return (minutes / 60) * HOUR_HEIGHT;
}

export function weekRangeIso(anchor: Date) {
  const start = startOfWeek(anchor);
  const end = addDays(start, 7);
  end.setMilliseconds(-1);
  return { from: start.toISOString(), to: end.toISOString() };
}
