// Page renderers: each takes the ledger state and returns the page's HTML.
// The router in app.js drops the result into <main> and wires the buttons.
import { HOUSEHOLD, CATEGORIES, BUDGETS, PAST_MONTHS } from "./data.js";
import { totals, budgetRows, spentByCategory, balanceSeries, upcomingBills, TODAY } from "./store.js";
import { money, shortDate, longDate, daysUntil, pct, esc } from "./format.js";
import { categoryBars, balanceLine, monthBars } from "./charts.js";

export function catName(id) {
  if (id === "income") return "Income";
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.name : id;
}

export function catColor(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.color : "#7a6a58";
}

function moneyCard(label, value, note, tone) {
  return `<div class="money-card ${tone || ""}">
    <div class="money-label">${label}</div>
    <div class="money-value">${money(value)}</div>
    <div class="money-note">${note}</div>
  </div>`;
}

function bar(percent, color) {
  const p = Math.max(0, Math.min(100, percent));
  return `<div class="bar" role="img" aria-label="${p} percent"><div class="bar-fill" style="width:${p}%;background:${color}"></div></div>`;
}

// --- Dashboard --------------------------------------------------------------
export function dashboard(state) {
  const t = totals(state);
  const spent = spentByCategory(state);
  const top = BUDGETS.map((b) => ({ ...b, spent: spent[b.category] || 0 }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 4);
  const upcoming = upcomingBills(state).slice(0, 3);
  const recent = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
  const goals = state.goals;
  return `
  <section class="hero">
    <p class="kicker">November 2026 · ${esc(HOUSEHOLD.members)}</p>
    <h1>The Kitchen Table Ledger</h1>
    <p class="lede">One household's shared money, kept where everyone can see it — at the kitchen table. Every dollar in, every dollar out, and what's left for the rest of the month.</p>
    <p class="today">Today is ${esc(HOUSEHOLD.todayLabel)} · 4 days left in November</p>
  </section>

  <section class="money-grid" aria-label="November in numbers">
    ${moneyCard("Money in", t.income, "Rosa's pay, Marco's pay, market stall", "in")}
    ${moneyCard("Spent", t.spent, "Bills, food, transport, life", "out")}
    ${moneyCard("Set aside", t.setAside, "Emergency fund + holiday fund", "save")}
    ${moneyCard("Left over", t.leftOver, "Still in checking for 4 days", "left")}
  </section>

  <section class="panel">
    <h2>Checking balance: ${money(t.balance)}</h2>
    <p>Started November with ${money(HOUSEHOLD.openingBalance)}. After ${money(t.income)} in and ${money(t.spent + t.setAside)} out, this is where the household stands.</p>
    ${bar(pct(t.balance, HOUSEHOLD.openingBalance + t.income), "#1e5b44")}
  </section>

  <div class="two-col">
    <section class="panel">
      <h2>Where November's money went</h2>
      ${top.map((r) => `<div class="mini-row"><span class="mini-name">${esc(catName(r.category))}</span>${bar(pct(r.spent, t.spent), catColor(r.category))}<span class="mini-amount">${money(r.spent)}</span></div>`).join("")}
      <p><a class="btn" href="#/budgets">See all budgets →</a></p>
    </section>
    <section class="panel">
      <h2>Coming up</h2>
      ${upcoming.map((b) => {
        const d = daysUntil(b.due, TODAY);
        return `<div class="mini-row"><span class="mini-name">${esc(b.name)}</span><span class="due">${d === 0 ? "due today" : d === 1 ? "due tomorrow" : "due in " + d + " days"}</span><span class="mini-amount">${money(b.amount)}</span></div>`;
      }).join("")}
      <p><a class="btn" href="#/bills">All bills →</a></p>
    </section>
  </div>

  <div class="two-col">
    <section class="panel">
      <h2>Savings at a glance</h2>
      ${goals.map((g) => `<div class="mini-row"><span class="mini-name">${esc(g.name)}</span>${bar(pct(g.saved, g.goal), "#1e5b44")}<span class="mini-amount">${money(g.saved)} of ${money(g.goal)}</span></div>`).join("")}
      <p><a class="btn" href="#/goals">Savings goals →</a></p>
    </section>
    <section class="panel">
      <h2>Latest spending</h2>
      ${recent.map((t) => `<div class="mini-row"><span class="mini-name">${esc(t.label)}</span><span class="due">${shortDate(t.date)}</span><span class="mini-amount ${t.kind === "income" ? "plus" : ""}">${t.kind === "income" ? "+" : "−"}${money(t.amount)}</span></div>`).join("")}
      <p><a class="btn" href="#/transactions">All transactions →</a></p>
    </section>
  </div>`;
}

// --- Transactions -----------------------------------------------------------
export function transactions(state, opts, editing) {
  const { filter, query } = opts;
  let list = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  if (filter && filter !== "all") list = list.filter((t) => t.category === filter || (filter === "income" && t.kind === "income"));
  if (query) {
    const q = query.toLowerCase();
    list = list.filter((t) => (t.label + " " + (t.note || "")).toLowerCase().includes(q));
  }
  const t = totals(state);
  const catOptions = CATEGORIES.filter((c) => c.id !== "savings")
    .map((c) => `<option value="${c.id}" ${filter === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("");
  const editingTx = editing ? state.transactions.find((x) => x.id === editing) : null;
  return `
  <section class="hero slim">
    <h1>Transactions</h1>
    <p class="lede">Every dollar in and out in November — ${state.transactions.length} entries. Add one, fix one, or take one out; the dashboard, budgets and reports all update at once.</p>
  </section>

  <section class="panel">
    <h2>${editingTx ? "Edit transaction" : "Add a transaction"}</h2>
    <form id="tx-form" class="tx-form">
      <label>Date <input type="date" name="date" value="${editingTx ? editingTx.date : TODAY}" min="2026-11-01" max="2026-11-30" required></label>
      <label>What was it? <input type="text" name="label" value="${editingTx ? esc(editingTx.label) : ""}" placeholder="e.g. SuperMart — weekly shop" required maxlength="120"></label>
      <label>Category
        <select name="category">
          ${CATEGORIES.filter((c) => c.id !== "savings").map((c) => `<option value="${c.id}" ${editingTx && editingTx.category === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}
          <option value="income" ${editingTx && editingTx.kind === "income" ? "selected" : ""}>Income</option>
        </select>
      </label>
      <label>Kind
        <select name="kind">
          <option value="expense" ${!editingTx || editingTx.kind === "expense" ? "selected" : ""}>Money out</option>
          <option value="income" ${editingTx && editingTx.kind === "income" ? "selected" : ""}>Money in</option>
          <option value="transfer" ${editingTx && editingTx.kind === "transfer" ? "selected" : ""}>Set aside (savings)</option>
        </select>
      </label>
      <label>Amount ($) <input type="number" name="amount" min="1" step="1" value="${editingTx ? editingTx.amount : ""}" placeholder="0" required></label>
      <div class="form-actions">
        <button class="btn primary" type="submit">${editingTx ? "Save changes" : "Add to the ledger"}</button>
        ${editingTx ? `<button class="btn" type="button" data-action="cancel-edit">Cancel</button>` : ""}
      </div>
    </form>
  </section>

  <section class="panel">
    <div class="filter-row">
      <label>Show
        <select id="tx-filter">
          <option value="all" ${filter === "all" ? "selected" : ""}>Everything</option>
          <option value="income" ${filter === "income" ? "selected" : ""}>Money in</option>
          ${catOptions}
        </select>
      </label>
      <label>Search <input type="search" id="tx-search" value="${esc(query)}" placeholder="e.g. petrol, cinema, rent"></label>
      <span class="count">${list.length} shown · ${money(t.income)} in · ${money(t.spent)} out</span>
    </div>
    <div class="tx-list">
      ${list.map((tx) => `
      <article class="tx-row">
        <div class="tx-date">${shortDate(tx.date)}</div>
        <div class="tx-main">
          <div class="tx-label">${esc(tx.label)}</div>
          ${tx.note ? `<div class="tx-note">${esc(tx.note)}</div>` : ""}
          <span class="chip" style="--chip:${catColor(tx.category)}">${esc(catName(tx.category))}</span>
        </div>
        <div class="tx-amount ${tx.kind === "income" ? "plus" : tx.kind === "transfer" ? "save" : ""}">${tx.kind === "income" ? "+" : "−"}${money(tx.amount)}</div>
        <div class="tx-actions">
          <button class="btn small" type="button" data-action="edit-tx" data-id="${tx.id}">Edit</button>
          <button class="btn small danger" type="button" data-action="delete-tx" data-id="${tx.id}">Delete</button>
        </div>
      </article>`).join("") || `<p class="empty">Nothing matches. Try a different search, or add the transaction above.</p>`}
    </div>
  </section>`;
}

// --- Budgets ----------------------------------------------------------------
export function budgets(state) {
  const rows = budgetRows(state);
  const totalLimit = rows.reduce((s, r) => s + r.limit, 0);
  const totalSpent = rows.reduce((s, r) => s + r.spent, 0);
  const over = rows.filter((r) => r.spent > r.limit);
  return `
  <section class="hero slim">
    <h1>Budgets</h1>
    <p class="lede">The limits Rosa and Marco agreed on 1 November, against what November actually cost. ${money(totalSpent)} of ${money(totalLimit)} spent — ${pct(totalSpent, totalLimit)}% of the plan.${over.length ? ` ${over.length} category${over.length > 1 ? "ies are" : " is"} over budget.` : " Nothing is over budget."}</p>
  </section>
  <section class="panel">
    <h2>November plan: ${money(totalSpent)} of ${money(totalLimit)}</h2>
    ${bar(pct(totalSpent, totalLimit), totalSpent > totalLimit ? "#c0392b" : "#1e5b44")}
    <div class="budget-list">
      ${rows.map((r) => {
        const p = pct(r.spent, r.limit);
        const isOver = r.spent > r.limit;
        return `<article class="budget-row ${isOver ? "over" : ""}">
        <div class="budget-head"><span class="budget-name">${esc(catName(r.category))}</span><span class="budget-nums">${money(r.spent)} of ${money(r.limit)}</span></div>
        ${bar(p, isOver ? "#c0392b" : catColor(r.category))}
        <div class="budget-foot"><span>${p}% used</span><span>${isOver ? money(r.spent - r.limit) + " over — take it from Fun next month" : money(r.left) + " left"}</span></div>
      </article>`;
      }).join("")}
    </div>
    <p class="note">Budgets are read from the same transactions as the dashboard, so a new entry updates these bars at once. Limits are set on the first of the month, at the kitchen table.</p>
  </section>`;
}

// --- Bills ------------------------------------------------------------------
export function bills(state) {
  const upcoming = state.bills.filter((b) => !b.paid).sort((a, b) => (a.due < b.due ? -1 : 1));
  const paid = state.bills.filter((b) => b.paid).sort((a, b) => (a.due < b.due ? -1 : 1));
  const upcomingSum = upcoming.reduce((s, b) => s + b.amount, 0);
  const paidSum = paid.reduce((s, b) => s + b.amount, 0);
  const billRow = (b) => {
    const d = daysUntil(b.due, TODAY);
    const when = b.paid ? "Paid" : d === 0 ? "Due today" : d === 1 ? "Due tomorrow" : d < 0 ? Math.abs(d) + " days overdue" : "Due in " + d + " days";
    return `<article class="bill-row ${b.paid ? "paid" : ""}">
      <div class="bill-main">
        <div class="bill-name">${esc(b.name)}</div>
        <div class="bill-meta">${longDate(b.due)} · ${esc(b.repeat)} · ${esc(catName(b.category))}</div>
      </div>
      <div class="bill-when ${b.paid ? "" : d <= 2 ? "soon" : ""}">${when}</div>
      <div class="bill-amount">${money(b.amount)}</div>
      <div class="bill-actions">
        ${b.paid
          ? `<button class="btn small" type="button" data-action="unpay-bill" data-id="${b.id}">Mark unpaid</button>`
          : `<button class="btn small primary" type="button" data-action="pay-bill" data-id="${b.id}">Mark paid</button>`}
      </div>
    </article>`;
  };
  return `
  <section class="hero slim">
    <h1>Bills</h1>
    <p class="lede">The bills that keep the flat running, and when each one falls due. ${money(upcomingSum)} still to pay before December — mark one paid and it lands in the transactions at once.</p>
  </section>
  <section class="panel">
    <h2>Still to pay — ${money(upcomingSum)}</h2>
    <div class="bill-list">${upcoming.map(billRow).join("") || `<p class="empty">Nothing left to pay. The month is covered.</p>`}</div>
  </section>
  <section class="panel">
    <h2>Paid in November — ${money(paidSum)}</h2>
    <div class="bill-list">${paid.map(billRow).join("")}</div>
    <p class="note">Paying a bill here adds it to the transactions with today's date; marking it unpaid again takes it back out.</p>
  </section>`;
}

// --- Goals ------------------------------------------------------------------
export function goals(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalGoal = state.goals.reduce((s, g) => s + g.goal, 0);
  return `
  <section class="hero slim">
    <h1>Savings goals</h1>
    <p class="lede">What the family is saving for, and how close each pot is. ${money(totalSaved)} saved toward ${money(totalGoal)} of plans — the emergency fund gets ${money(800)} every 1st of the month, the holiday fund ${money(300)} on the 15th.</p>
  </section>
  <section class="goals-grid">
    ${state.goals.map((g) => {
      const p = pct(g.saved, g.goal);
      const reached = g.saved >= g.goal;
      return `<article class="panel goal-card ${reached ? "reached" : ""}">
        <h2>${esc(g.name)} ${reached ? `<span class="badge">Reached!</span>` : ""}</h2>
        <p>${esc(g.why)}</p>
        <div class="goal-nums"><span class="goal-saved">${money(g.saved)}</span><span>of ${money(g.goal)}</span></div>
        ${bar(p, reached ? "#e9b44c" : "#1e5b44")}
        <p class="goal-pct">${p}% there · ${money(g.goal - g.saved)} to go${g.monthly ? ` · ${money(g.monthly)}/month` : ""}</p>
        ${reached ? `<p class="note">Sofia picks her red bike up on Saturday.</p>` : `
        <form class="goal-form" data-goal="${g.id}">
          <label>Add to this pot ($)<input type="number" name="amount" min="1" step="1" placeholder="50" required></label>
          <button class="btn primary" type="submit">Add money</button>
        </form>`}
      </article>`;
    }).join("")}
  </section>`;
}

// --- Reports ----------------------------------------------------------------
export function reports(state) {
  const t = totals(state);
  const rows = budgetRows(state).map((r) => ({ ...r, name: catName(r.category), color: catColor(r.category) }));
  const series = balanceSeries(state);
  const biggest = [...state.transactions]
    .filter((x) => x.kind === "expense")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  const daily = {};
  for (const tx of state.transactions) {
    if (tx.kind !== "expense") continue;
    daily[tx.date] = (daily[tx.date] || 0) + tx.amount;
  }
  const busiest = Object.entries(daily).sort((a, b) => b[1] - a[1])[0];
  return `
  <section class="hero slim">
    <h1>Reports</h1>
    <p class="lede">November in pictures. Every chart is drawn from the ledger's own transactions — add an entry and the pictures change.</p>
  </section>

  <section class="panel">
    <h2>November in three lines</h2>
    <ul class="takeaways">
      <li><strong>${money(t.income)} came in</strong> and ${money(t.spent)} went out, leaving ${money(t.leftOver)} unspent with 4 days to go.</li>
      <li><strong>Housing is the biggest cost</strong> at ${money(1850)} — rent alone is ${pct(1850, t.spent)}% of everything spent.</li>
      <li><strong>The busiest day was ${longDate(busiest[0])}</strong>, when ${money(busiest[1])} went out in a single day.</li>
      <li><strong>Groceries ran closest to the line</strong>: ${money(spentByCategory(state).groceries || 0)} of a ${money(720)} budget, ${pct(spentByCategory(state).groceries || 0, 720)}% used.</li>
    </ul>
  </section>

  <section class="panel">
    <h2>Spending by category</h2>
    ${categoryBars(rows, spentByCategory(state))}
  </section>

  <section class="panel">
    <h2>Balance through the month</h2>
    ${balanceLine(series)}
  </section>

  <section class="panel">
    <h2>Three months side by side</h2>
    ${monthBars(PAST_MONTHS)}
    <p class="note">Spending has crept up ${money(3992 - 3740)} since September — mostly groceries and the car insurance. Income has held steady at ${money(6520)}.</p>
  </section>

  <section class="panel">
    <h2>Biggest single spends</h2>
    ${biggest.map((tx, i) => `<div class="mini-row"><span class="mini-name">${i + 1}. ${esc(tx.label)}</span><span class="due">${shortDate(tx.date)}</span><span class="mini-amount">${money(tx.amount)}</span></div>`).join("")}
  </section>`;
}
