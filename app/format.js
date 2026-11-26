// Small formatting helpers: money and dates, one place, used by every view.
export function money(n) {
  const sign = n < 0 ? "−" : "";
  return sign + "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function moneyCents(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// "2026-11-08" -> "Sun 8 Nov"
export function shortDate(iso) {
  const d = new Date(iso + "T12:00:00");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return days[d.getUTCDay()] + " " + d.getUTCDate() + " " + months[d.getUTCMonth()];
}

// "2026-11-08" -> "8 November 2026"
export function longDate(iso) {
  const d = new Date(iso + "T12:00:00");
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return d.getUTCDate() + " " + months[d.getUTCMonth()] + " " + d.getUTCFullYear();
}

// Days from the ledger's "today" (26 Nov 2026) to a due date.
export function daysUntil(iso, todayIso) {
  const a = new Date(todayIso + "T12:00:00");
  const b = new Date(iso + "T12:00:00");
  return Math.round((b - a) / 86400000);
}

export function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
