// The ledger's state: loads the seed, keeps every change in localStorage,
// and answers the questions every page asks (how much came in, went out,
// is left, and where it went). All figures come from the transactions.
import { HOUSEHOLD, SEED_TRANSACTIONS, SEED_BILLS, SEED_GOALS, BUDGETS } from "./data.js";

const KEY = "kitchen-table-ledger-v1";
export const TODAY = "2026-11-26";

function freshState() {
  return {
    transactions: structuredClone(SEED_TRANSACTIONS),
    bills: structuredClone(SEED_BILLS),
    goals: structuredClone(SEED_GOALS),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || !Array.isArray(parsed.bills) || !Array.isArray(parsed.goals)) {
      return freshState();
    }
    return parsed;
  } catch {
    return freshState();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  const state = freshState();
  saveState(state);
  return state;
}

// --- derived figures -------------------------------------------------------

export function totals(state) {
  let income = 0;
  let spent = 0;
  let setAside = 0;
  for (const t of state.transactions) {
    if (t.kind === "income") income += t.amount;
    else if (t.kind === "transfer") setAside += t.amount;
    else spent += t.amount;
  }
  const leftOver = income - spent - setAside;
  const balance = HOUSEHOLD.openingBalance + income - spent - setAside;
  return { income, spent, setAside, leftOver, balance };
}

export function spentByCategory(state) {
  const out = {};
  for (const t of state.transactions) {
    if (t.kind !== "expense") continue;
    out[t.category] = (out[t.category] || 0) + t.amount;
  }
  return out;
}

export function budgetRows(state) {
  const spent = spentByCategory(state);
  return BUDGETS.map((b) => ({
    category: b.category,
    limit: b.limit,
    spent: spent[b.category] || 0,
    left: b.limit - (spent[b.category] || 0),
  }));
}

export function upcomingBills(state) {
  return state.bills.filter((b) => !b.paid);
}

export function upcomingTotal(state) {
  return upcomingBills(state).reduce((s, b) => s + b.amount, 0);
}

// Running checking balance day by day, for the reports chart.
export function balanceSeries(state) {
  const events = state.transactions
    .map((t) => ({
      date: t.date,
      delta: t.kind === "income" ? t.amount : -t.amount,
    }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  let balance = HOUSEHOLD.openingBalance;
  const points = [{ date: "2026-10-31", balance }];
  for (const e of events) {
    balance += e.delta;
    points.push({ date: e.date, balance });
  }
  return points;
}

// --- edits -----------------------------------------------------------------

export function addTransaction(state, tx) {
  const id = "u" + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  state.transactions.push({ id, ...tx });
  saveState(state);
  return id;
}

export function updateTransaction(state, id, patch) {
  const t = state.transactions.find((x) => x.id === id);
  if (!t) return false;
  Object.assign(t, patch);
  saveState(state);
  return true;
}

export function deleteTransaction(state, id) {
  const i = state.transactions.findIndex((x) => x.id === id);
  if (i < 0) return false;
  state.transactions.splice(i, 1);
  saveState(state);
  return true;
}

// Paying a bill adds its transaction (dated today); unpaying removes it.
export function setBillPaid(state, billId, paid) {
  const bill = state.bills.find((b) => b.id === billId);
  if (!bill) return false;
  if (paid && !bill.paid) {
    const id = "u" + Date.now().toString(36) + Math.floor(Math.random() * 1000);
    state.transactions.push({
      id,
      date: TODAY,
      label: bill.name,
      category: bill.category,
      kind: "expense",
      amount: bill.amount,
      note: "Paid from the bills page",
    });
    bill.paid = true;
    bill.txId = id;
  } else if (!paid && bill.paid) {
    if (bill.txId) deleteTransaction(state, bill.txId);
    bill.paid = false;
    bill.txId = null;
  }
  saveState(state);
  return true;
}

export function addToGoal(state, goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal || !(amount > 0)) return false;
  goal.saved = Math.min(goal.goal, goal.saved + amount);
  saveState(state);
  return true;
}
