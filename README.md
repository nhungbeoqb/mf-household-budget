![make.fun bounty](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)
![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/nhungbeoqb/mf-household-budget/rank.svg)
![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/nhungbeoqb/mf-household-budget/reward.svg)

# The Kitchen Table Ledger

A household budget site for the Alvarez household — Rosa & Marco, with Sofia (9) and Leo (6) — for November 2026. One family's shared money, kept where everyone can see it: at the kitchen table.

Built for the [make.fun bounty "Make the best household budget site"](https://make.fun/bounty/best-household-budget-site-20261126-1457).

## What it is

- **Dashboard** — November in numbers: $6,520 in, $3,992 spent, $1,100 set aside, $1,428 left over, checking balance $3,568.
- **Transactions** — all 38 entries for the month. Add, edit, delete, filter by category, search. Changes save in the browser and update every page at once.
- **Budgets** — the limits the family agreed on 1 November, against what November actually cost ($3,992 of a $4,300 plan).
- **Bills** — $2,185 still to pay before December, $2,356 already paid. Marking a bill paid adds it to the transactions.
- **Savings goals** — emergency fund ($7,640 of $10,000), summer holiday ($1,150 of $2,400), washing machine ($410 of $650), Sofia's bike ($320 of $320 — reached).
- **Reports** — spending by category, balance through the month, and three months side by side, all drawn as hand-made SVG charts from the ledger's own figures.

## How it works

Static files under `app/` — no build step, no network requests, vanilla JavaScript and CSS only. Open `app/index.html` from any static server:

```
node serve.ts        # serves app/ at http://localhost:8080
```

Every figure comes from one list of transactions in `app/data.js`, so the dashboard, budgets, bills and reports can never disagree. Changes are kept in `localStorage`; "Reset November to the family's real figures" in the footer restores the seed data.

## Layout

- `app/index.html` — page shell, navigation, footer
- `app/app.js` — hash router and event wiring
- `app/views.js` — the six page renderers
- `app/store.js` — state, localStorage, derived figures, edits
- `app/data.js` — the household's real November figures
- `app/charts.js` — hand-drawn SVG charts
- `app/format.js` — money and date formatting
- `app/style.css` — the whole look
- `main.ts` — entrypoint: copies `app/` and `screenshots/` to the output and writes `dossier.json`
- `screenshots/` — four screenshots of the site running (dashboard, transactions, budgets on a phone, reports)
