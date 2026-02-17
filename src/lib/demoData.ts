import { Expense, AdditionalExpense } from "@/store/useSplitBillStore";

export const demoData = {
  activityName: "🍕 Makan Bareng Bestie",
  people: ["Agus", "Budi", "Cindy", "Dedi"],
  expenses: [
    {
      id: "demo-1",
      item: "Pizza Margherita Large",
      amount: 120000,
      who: ["Agus", "Budi", "Cindy", "Dedi"],
      paidBy: "Agus",
    },
    {
      id: "demo-2",
      item: "Pasta Carbonara",
      amount: 65000,
      who: ["Budi", "Cindy"],
      paidBy: "Agus",
    },
    {
      id: "demo-3",
      item: "Iced Tea (4 pcs)",
      amount: 40000,
      who: ["Agus", "Budi", "Cindy", "Dedi"],
      paidBy: "Agus",
    },
  ] as Expense[],
  additionalExpenses: [
    {
      id: "demo-tax",
      name: "Tax (10%)",
      amount: 22500,
      who: ["Agus", "Budi", "Cindy", "Dedi"],
      paidBy: "Agus",
      splitType: "proportionally",
    },
    {
      id: "demo-service",
      name: "Service Charge",
      amount: 15000,
      who: ["Agus", "Budi", "Cindy", "Dedi"],
      paidBy: "Agus",
      splitType: "equally",
    },
  ] as AdditionalExpense[],
};
