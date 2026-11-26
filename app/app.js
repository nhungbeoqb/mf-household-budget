// The Kitchen Table Ledger — router and wiring.
// Hash routes: #/ dashboard, #/transactions, #/budgets, #/bills, #/goals, #/reports.
// One render function per page (views.js); this file only routes and listens.
import { HOUSEHOLD } from "./data.js";
import {
  loadState, saveState, resetState, addTransaction, updateTransaction,
  deleteTransaction, setBillPaid, addToGoal,
} from "./store.js";
import { dashboard, transactions, budgets, bills, goals, reports } from "./views.js";

const PAGES = {
  "/": { title: "Dashboard", render: dashboard },
  "/transactions": { title: "Transactions", render: (s) => transactions(s, txFilter, editingId) },
  "/budgets": { title: "Budgets", render: budgets },
  "/bills": { title: "Bills", render: bills },
  "/goals": { title: "Savings goals", render: goals },
  "/reports": { title: "Reports", render: reports },
};

let state = loadState();
let txFilter = { filter: "all", query: "" };
let editingId = null;

const main = document.getElementById("page");
const navLinks = [...document.querySelectorAll(".nav-link")];

function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const page = PAGES[hash] || PAGES["/"];
  main.innerHTML = page.render(state);
  document.title = `${page.title} — The Kitchen Table Ledger`;
  for (const a of navLinks) {
    const href = a.getAttribute("href").slice(1) || "/";
    a.classList.toggle("active", href === hash);
    if (href === hash) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  }
  const first = main.querySelector("h1");
  if (first) first.setAttribute("tabindex", "-1");
  window.scrollTo(0, 0);
}

function rerender() {
  route();
}

// --- transaction form -------------------------------------------------------
main.addEventListener("submit", (e) => {
  if (e.target.id === "tx-form") {
    e.preventDefault();
    const data = new FormData(e.target);
    const amount = Math.round(Number(data.get("amount")));
    if (!amount || amount <= 0) return;
    const tx = {
      date: String(data.get("date")),
      label: String(data.get("label")).trim(),
      category: String(data.get("category")),
      kind: String(data.get("kind")),
      amount,
      note: "",
    };
    if (tx.kind === "income") tx.category = "income";
    if (editingId) {
      updateTransaction(state, editingId, tx);
      editingId = null;
    } else {
      addTransaction(state, tx);
    }
    rerender();
    return;
  }
  if (e.target.classList.contains("goal-form")) {
    e.preventDefault();
    const amount = Math.round(Number(new FormData(e.target).get("amount")));
    if (amount > 0) addToGoal(state, e.target.dataset.goal, amount);
    rerender();
  }
});

// --- clicks: edit, delete, pay bills, cancel edit ---------------------------
main.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (action === "edit-tx") {
    editingId = id;
    rerender();
    const form = document.getElementById("tx-form");
    if (form) form.scrollIntoView({ block: "start" });
  } else if (action === "cancel-edit") {
    editingId = null;
    rerender();
  } else if (action === "delete-tx") {
    const tx = state.transactions.find((x) => x.id === id);
    if (tx && window.confirm(`Take "${tx.label}" out of the ledger?`)) {
      deleteTransaction(state, id);
      if (editingId === id) editingId = null;
      rerender();
    }
  } else if (action === "pay-bill") {
    setBillPaid(state, id, true);
    rerender();
  } else if (action === "unpay-bill") {
    setBillPaid(state, id, false);
    rerender();
  }
});

// --- filters on the transactions page ---------------------------------------
main.addEventListener("input", (e) => {
  if (e.target.id === "tx-search") {
    txFilter.query = e.target.value;
    const panel = e.target.closest(".panel");
    const keepFocus = document.activeElement === e.target;
    rerender();
    if (keepFocus) {
      const input = document.getElementById("tx-search");
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  }
});

main.addEventListener("change", (e) => {
  if (e.target.id === "tx-filter") {
    txFilter.filter = e.target.value;
    rerender();
  }
});

// --- footer: reset the demo data --------------------------------------------
document.getElementById("reset-demo").addEventListener("click", () => {
  if (window.confirm("Put November back to the family's real figures, undoing your changes?")) {
    state = resetState();
    txFilter = { filter: "all", query: "" };
    editingId = null;
    rerender();
  }
});

document.getElementById("year").textContent = String(new Date().getFullYear());
document.querySelector(".household-line").textContent =
  `${HOUSEHOLD.name} · ${HOUSEHOLD.members} · ${HOUSEHOLD.monthLabel}`;

window.addEventListener("hashchange", route);
route();
