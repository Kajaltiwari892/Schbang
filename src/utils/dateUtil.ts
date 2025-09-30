export function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Format a Date object to 'YYYY-MM-DD' using local date parts (no UTC)
export function formatDateLocal(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}


export function parseDateToLocal(s: string | Date) {
  if (s instanceof Date) return new Date(s.getFullYear(), s.getMonth(), s.getDate());
  if (typeof s !== "string") return new Date(s);

  // If format is exactly YYYY-MM-DD -> manual parse (avoid UTC)
  const ymd = /^\d{4}-\d{2}-\d{2}$/.test(s);
  if (ymd) {
    const [y, mm, dd] = s.split("-").map(Number);
    return new Date(y, mm - 1, dd);
  }

  // Fallback for ISO or other formats: create Date and normalize to local midnight
  const dt = new Date(s);
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

// Compare two dates by local Y/M/D
export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}


export function getMonthDays(year: number, month: number) {
  // first and last day of the current month (local)
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  // start from Sunday of the week that contains the first day
  const startOffset = firstOfMonth.getDay(); // 0 = Sun .. 6 = Sat
  const gridStart = new Date(year, month, 1 - startOffset);

  // end on Saturday of the week that contains the last day
  const endOffset = 6 - lastOfMonth.getDay();
  const gridEnd = new Date(year, month + 1, 0 + endOffset);

  const days: Date[] = [];
  for (let d = new Date(gridStart); d <= gridEnd; d.setDate(d.getDate() + 1)) {
    // push a copy (new Date) to avoid mutating same reference
    days.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  }
  return days;
}
