// The Kitchen Table Ledger — seed data for November 2026.
// One source of truth: every page (dashboard, budgets, bills, reports)
// derives its figures from these transactions, so the numbers always agree.
export const HOUSEHOLD = {
  name: "The Alvarez Household",
  members: "Rosa & Marco, with Sofia (9) and Leo (6)",
  month: "November 2026",
  monthLabel: "November 2026",
  todayLabel: "Thursday 26 November 2026",
  openingBalance: 2140, // money in the checking account on 31 October
  currency: "USD",
};

export const CATEGORIES = [
  { id: "housing", name: "Housing", color: "#1e5b44" },
  { id: "utilities", name: "Utilities", color: "#2f7d6b" },
  { id: "groceries", name: "Groceries", color: "#e86a33" },
  { id: "transport", name: "Transport", color: "#3a6ea5" },
  { id: "dining", name: "Dining out", color: "#b56576" },
  { id: "kids", name: "Kids & school", color: "#8a6d3b" },
  { id: "health", name: "Health", color: "#5b8c5a" },
  { id: "fun", name: "Fun & treats", color: "#e9b44c" },
  { id: "other", name: "Other", color: "#7a6a58" },
  { id: "savings", name: "Set aside", color: "#1e5b44" },
];

// Monthly spending limits the family agreed at the kitchen table on 1 November.
export const BUDGETS = [
  { category: "housing", limit: 1850 },
  { category: "utilities", limit: 350 },
  { category: "groceries", limit: 720 },
  { category: "transport", limit: 380 },
  { category: "dining", limit: 200 },
  { category: "kids", limit: 300 },
  { category: "health", limit: 150 },
  { category: "fun", limit: 200 },
  { category: "other", limit: 150 },
];

// kind: "income" | "expense" | "transfer" (transfer = moved to a savings goal)
export const SEED_TRANSACTIONS = [
  { id: "t01", date: "2026-11-01", label: "Rosa's salary — teaching, Riverside School", category: "income", kind: "income", amount: 3900, note: "Paid into checking" },
  { id: "t02", date: "2026-11-01", label: "Rent — the flat on Willow Lane", category: "housing", kind: "expense", amount: 1850, note: "Standing order" },
  { id: "t03", date: "2026-11-01", label: "Emergency fund — monthly auto-transfer", category: "savings", kind: "transfer", amount: 800, note: "Moves to the emergency pot" },
  { id: "t04", date: "2026-11-02", label: "Mercado Central — weekly groceries", category: "groceries", kind: "expense", amount: 142, note: "" },
  { id: "t05", date: "2026-11-03", label: "Petrol — Shell on the ring road", category: "transport", kind: "expense", amount: 45, note: "" },
  { id: "t06", date: "2026-11-04", label: "Pharmacy — cough syrup and plasters", category: "health", kind: "expense", amount: 34, note: "Leo's cough" },
  { id: "t07", date: "2026-11-05", label: "Sofia's swimming lessons — November term", category: "kids", kind: "expense", amount: 120, note: "Thursdays, 4pm" },
  { id: "t08", date: "2026-11-06", label: "SuperMart — weekly shop", category: "groceries", kind: "expense", amount: 96, note: "" },
  { id: "t09", date: "2026-11-07", label: "Pizza night — Friday treat", category: "dining", kind: "expense", amount: 52, note: "" },
  { id: "t10", date: "2026-11-08", label: "Electric bill — October usage", category: "utilities", kind: "expense", amount: 132, note: "Direct debit" },
  { id: "t11", date: "2026-11-08", label: "Marco's market stall — Saturday takings", category: "income", kind: "income", amount: 120, note: "Honey and jam stall" },
  { id: "t12", date: "2026-11-09", label: "Haircuts — Rosa and Leo", category: "other", kind: "expense", amount: 56, note: "" },
  { id: "t13", date: "2026-11-09", label: "Petrol", category: "transport", kind: "expense", amount: 38, note: "" },
  { id: "t14", date: "2026-11-10", label: "Internet — fibre, monthly", category: "utilities", kind: "expense", amount: 65, note: "Direct debit" },
  { id: "t15", date: "2026-11-10", label: "Cinema — family film, four tickets", category: "fun", kind: "expense", amount: 36, note: "Saturday matinee" },
  { id: "t16", date: "2026-11-11", label: "Mercado Central — weekly groceries", category: "groceries", kind: "expense", amount: 187, note: "Stocked up for Sofia's birthday" },
  { id: "t17", date: "2026-11-12", label: "Water bill", category: "utilities", kind: "expense", amount: 48, note: "Direct debit" },
  { id: "t18", date: "2026-11-12", label: "School supplies — notebooks and pens", category: "kids", kind: "expense", amount: 68, note: "" },
  { id: "t19", date: "2026-11-13", label: "Lunch with Rosa's mum", category: "dining", kind: "expense", amount: 38, note: "Her treat, our turn next time" },
  { id: "t20", date: "2026-11-14", label: "Bus passes — Rosa and Marco", category: "transport", kind: "expense", amount: 64, note: "Monthly passes" },
  { id: "t21", date: "2026-11-15", label: "Marco's salary — bus driving, City Transit", category: "income", kind: "income", amount: 2500, note: "Paid into checking" },
  { id: "t22", date: "2026-11-15", label: "Phone — two lines, monthly", category: "utilities", kind: "expense", amount: 86, note: "Direct debit" },
  { id: "t23", date: "2026-11-15", label: "Holiday fund — monthly transfer", category: "savings", kind: "transfer", amount: 300, note: "Moves to the holiday pot" },
  { id: "t24", date: "2026-11-15", label: "Books — Sofia and Leo", category: "fun", kind: "expense", amount: 24, note: "Second-hand book fair" },
  { id: "t25", date: "2026-11-16", label: "SuperMart — weekly shop", category: "groceries", kind: "expense", amount: 74, note: "" },
  { id: "t26", date: "2026-11-17", label: "Dentist copay — Marco's check-up", category: "health", kind: "expense", amount: 60, note: "" },
  { id: "t27", date: "2026-11-18", label: "Car insurance — monthly", category: "transport", kind: "expense", amount: 112, note: "Direct debit" },
  { id: "t28", date: "2026-11-18", label: "Leo's new shoes", category: "kids", kind: "expense", amount: 45, note: "Grew out of the old pair" },
  { id: "t29", date: "2026-11-19", label: "Petrol", category: "transport", kind: "expense", amount: 52, note: "" },
  { id: "t30", date: "2026-11-20", label: "Gym — Rosa's membership", category: "health", kind: "expense", amount: 45, note: "Direct debit" },
  { id: "t31", date: "2026-11-20", label: "Tacos — Friday night", category: "dining", kind: "expense", amount: 41, note: "" },
  { id: "t32", date: "2026-11-21", label: "Farmers market — vegetables and eggs", category: "groceries", kind: "expense", amount: 121, note: "" },
  { id: "t33", date: "2026-11-22", label: "Streaming — films and shows", category: "fun", kind: "expense", amount: 18, note: "Monthly" },
  { id: "t34", date: "2026-11-22", label: "Board game — Ticket to Ride", category: "fun", kind: "expense", amount: 58, note: "Rainy Sundays" },
  { id: "t35", date: "2026-11-23", label: "Parking — city centre", category: "transport", kind: "expense", amount: 28, note: "" },
  { id: "t36", date: "2026-11-24", label: "SuperMart — weekly shop", category: "groceries", kind: "expense", amount: 88, note: "" },
  { id: "t37", date: "2026-11-25", label: "Bakery and coffee", category: "dining", kind: "expense", amount: 29, note: "" },
  { id: "t38", date: "2026-11-26", label: "Gift for Grandma — her birthday", category: "other", kind: "expense", amount: 40, note: "A scarf, her favourite colour" },
];

// Recurring bills. A paid bill has a matching transaction above; an unpaid one
// is still to come, and marking it paid adds its transaction.
export const SEED_BILLS = [
  { id: "b01", name: "Rent — the flat on Willow Lane", amount: 1850, due: "2026-11-01", paid: true, txId: "t02", category: "housing", repeat: "Monthly" },
  { id: "b02", name: "Electric bill", amount: 132, due: "2026-11-08", paid: true, txId: "t10", category: "utilities", repeat: "Monthly" },
  { id: "b03", name: "Internet — fibre", amount: 65, due: "2026-11-10", paid: true, txId: "t14", category: "utilities", repeat: "Monthly" },
  { id: "b04", name: "Water bill", amount: 48, due: "2026-11-12", paid: true, txId: "t17", category: "utilities", repeat: "Monthly" },
  { id: "b05", name: "Phone — two lines", amount: 86, due: "2026-11-15", paid: true, txId: "t22", category: "utilities", repeat: "Monthly" },
  { id: "b06", name: "Car insurance", amount: 112, due: "2026-11-18", paid: true, txId: "t27", category: "transport", repeat: "Monthly" },
  { id: "b07", name: "Gym — Rosa's membership", amount: 45, due: "2026-11-20", paid: true, txId: "t30", category: "health", repeat: "Monthly" },
  { id: "b08", name: "Streaming — films and shows", amount: 18, due: "2026-11-22", paid: true, txId: "t33", category: "fun", repeat: "Monthly" },
  { id: "b09", name: "Credit card — November statement", amount: 240, due: "2026-11-28", paid: false, txId: null, category: "other", repeat: "Monthly" },
  { id: "b10", name: "Music lessons — Sofia's piano", amount: 95, due: "2026-11-29", paid: false, txId: null, category: "kids", repeat: "Monthly" },
  { id: "b11", name: "Rent — December, coming up", amount: 1850, due: "2026-12-01", paid: false, txId: null, category: "housing", repeat: "Monthly" },
];

export const SEED_GOALS = [
  { id: "g1", name: "Emergency fund", why: "Six months of rent and bills, so a bad month never becomes a crisis.", goal: 10000, saved: 7640, monthly: 800 },
  { id: "g2", name: "Summer holiday by the sea", why: "Two weeks at the coast in July — the kids have already picked the beach.", goal: 2400, saved: 1150, monthly: 300 },
  { id: "g3", name: "New washing machine", why: "The old one leaks. A quiet, efficient one before winter.", goal: 650, saved: 410, monthly: 100 },
  { id: "g4", name: "Sofia's bike", why: "A red bike with a basket, for riding to school in spring.", goal: 320, saved: 320, monthly: 0 },
];

// Past months, for the reports page's comparison chart.
export const PAST_MONTHS = [
  { month: "Sep 2026", income: 6480, spent: 3740 },
  { month: "Oct 2026", income: 6520, spent: 3905 },
  { month: "Nov 2026", income: 6520, spent: 3992 },
];
