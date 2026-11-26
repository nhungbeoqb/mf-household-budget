// Hand-drawn SVG charts, built from the ledger's real figures.
// No chart library: two small functions, one job each.
import { money, esc } from "./format.js";

// Horizontal bars: one per category, amount labelled, budget limit marked.
export function categoryBars(rows, spentByCat) {
  const max = Math.max(...rows.map((r) => Math.max(r.limit, r.spent)), 1);
  const rowH = 44;
  const height = rows.length * rowH + 16;
  const width = 640;
  const labelW = 130;
  const barW = width - labelW - 90;
  let y = 8;
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Spending by category, bars against each budget limit" class="chart">`;
  for (const r of rows) {
    const spentW = Math.round((r.spent / max) * barW);
    const limitX = labelW + Math.round((r.limit / max) * barW);
    const over = r.spent > r.limit;
    out += `<text x="0" y="${y + 15}" class="chart-label">${esc(r.name)}</text>`;
    out += `<rect x="${labelW}" y="${y}" width="${spentW}" height="24" rx="4" fill="${over ? "#c0392b" : r.color}" />`;
    out += `<line x1="${limitX}" y1="${y - 4}" x2="${limitX}" y2="${y + 28}" stroke="#2a2118" stroke-width="2" />`;
    // A nearly-full bar leaves no room for its value outside it, so the
    // value goes inside the bar in white instead of colliding with the limit.
    if (spentW > barW - 100) {
      out += `<text x="${labelW + spentW - 8}" y="${y + 17}" class="chart-value-in" text-anchor="end">${money(r.spent)}</text>`;
    } else {
      out += `<text x="${labelW + spentW + 8}" y="${y + 17}" class="chart-value">${money(r.spent)}</text>`;
    }
    out += `<text x="${width - 4}" y="${y + 17}" class="chart-limit" text-anchor="end">of ${money(r.limit)}</text>`;
    y += rowH;
  }
  out += `</svg><p class="chart-note">Bars show what was spent; the black tick marks the budget limit. Red means over budget.</p>`;
  return out;
}

// Balance through the month: a line stepping with each transaction.
export function balanceLine(points) {
  const width = 640;
  const height = 260;
  const padL = 64;
  const padR = 16;
  const padT = 18;
  const padB = 30;
  const min = Math.min(...points.map((p) => p.balance));
  const max = Math.max(...points.map((p) => p.balance));
  const span = max - min || 1;
  const x = (i) => padL + (i / (points.length - 1)) * (width - padL - padR);
  const y = (v) => padT + (1 - (v - min) / span) * (height - padT - padB);
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.balance).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)},${height - padB} L${x(0).toFixed(1)},${height - padB} Z`;
  const first = points[0];
  const last = points[points.length - 1];
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Checking balance through November, from ${money(first.balance)} to ${money(last.balance)}" class="chart">
    <line x1="${padL}" y1="${y(min)}" x2="${width - padR}" y2="${y(min)}" class="chart-grid" />
    <line x1="${padL}" y1="${y(max)}" x2="${width - padR}" y2="${y(max)}" class="chart-grid" />
    <text x="${padL - 8}" y="${y(max) + 4}" class="chart-axis" text-anchor="end">${money(max)}</text>
    <text x="${padL - 8}" y="${y(min) + 4}" class="chart-axis" text-anchor="end">${money(min)}</text>
    <text x="${padL}" y="${height - 8}" class="chart-axis">31 Oct</text>
    <text x="${width - padR}" y="${height - 8}" class="chart-axis" text-anchor="end">26 Nov</text>
    <path d="${area}" fill="#1e5b44" opacity="0.12" />
    <path d="${line}" fill="none" stroke="#1e5b44" stroke-width="3" stroke-linejoin="round" />
    <circle cx="${x(0)}" cy="${y(first.balance)}" r="4" fill="#1e5b44" />
    <circle cx="${x(points.length - 1)}" cy="${y(last.balance)}" r="5" fill="#e86a33" />
    <text x="${x(points.length - 1) - 6}" y="${y(last.balance) - 10}" class="chart-value" text-anchor="end">${money(last.balance)} now</text>
  </svg><p class="chart-note">Checking balance after every payday, bill and shop, from ${money(first.balance)} on 31 October to ${money(last.balance)} today.</p>`;
}

// Three-month comparison: income vs spending, grouped bars.
export function monthBars(months) {
  const width = 640;
  const height = 240;
  const max = Math.max(...months.flatMap((m) => [m.income, m.spent]), 1);
  const groupW = width / months.length;
  const barW = 52;
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Income against spending for September, October and November" class="chart">`;
  months.forEach((m, i) => {
    const cx = groupW * i + groupW / 2;
    const inH = Math.round((m.income / max) * 160);
    const spH = Math.round((m.spent / max) * 160);
    out += `<rect x="${cx - barW - 6}" y="${180 - inH}" width="${barW}" height="${inH}" rx="4" fill="#1e5b44" />`;
    out += `<rect x="${cx + 6}" y="${180 - spH}" width="${barW}" height="${spH}" rx="4" fill="#e86a33" />`;
    out += `<text x="${cx - barW / 2 - 6}" y="${168 - inH}" class="chart-value" text-anchor="middle">${money(m.income)}</text>`;
    out += `<text x="${cx + barW / 2 + 6}" y="${168 - spH}" class="chart-value" text-anchor="middle">${money(m.spent)}</text>`;
    out += `<text x="${cx}" y="205" class="chart-label" text-anchor="middle">${esc(m.month)}</text>`;
  });
  out += `<text x="${width / 2}" y="230" class="chart-note" text-anchor="middle">Green = money in &nbsp;·&nbsp; Orange = money spent</text></svg>`;
  return out;
}
