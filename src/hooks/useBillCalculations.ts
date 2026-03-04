import {
  useSplitBillStore,
  Expense,
  AdditionalExpense,
} from "@/store/useSplitBillStore";

export interface BillItem {
  name: string;
  share: number;
  method: "equal" | "prop";
  isAdditional: boolean;
}

export interface PersonBalance {
  spent: number;
  baseSpent: number;
  paid: number;
  items: BillItem[];
}

export type BillBalances = Record<string, PersonBalance>;

export interface SettlementInstruction {
  from: string;
  to: string;
  amount: number;
}

export interface CalculationResult {
  balances: BillBalances;
  totalSpent: number;
  settlementInstructions: SettlementInstruction[];
  badges: Record<string, string[]>;
}

export interface SplitBillData {
  people: string[];
  expenses: Expense[];
  additionalExpenses: AdditionalExpense[];
}

export const useBillCalculations = (
  data?: SplitBillData,
): CalculationResult => {
  const store = useSplitBillStore();

  const calculateBalances = () => {
    const people = data ? data.people : store.people;
    const expenses = data ? data.expenses : store.expenses;
    const additionalExpenses = data
      ? data.additionalExpenses
      : store.additionalExpenses;

    // Calculate Totals per Person
    const balances = people.reduce((acc, name) => {
      acc[name] = { spent: 0, paid: 0, baseSpent: 0, items: [] };
      return acc;
    }, {} as BillBalances);

    // 1. Process Main Expenses
    expenses.forEach((exp) => {
      // Add to paid amount for the person who paid
      if (balances[exp.paidBy]) {
        balances[exp.paidBy].paid += exp.amount;
      }

      // Distribute share to everyone in the 'who' list
      const share = exp.amount / (exp.who.length || 1);
      exp.who.forEach((person) => {
        if (balances[person]) {
          balances[person].spent += share;
          balances[person].baseSpent += share;
          balances[person].items.push({
            name: exp.item,
            share,
            method: "equal",
            isAdditional: false,
          });
        }
      });
    });

    // 2. Process Additional Expenses (Tax, Service, etc.)
    additionalExpenses.forEach((adx) => {
      // Add to paid amount for the person who paid (if specified)
      if (adx.paidBy && balances[adx.paidBy]) {
        balances[adx.paidBy].paid += adx.amount;
      }

      if (adx.splitType === "proportionally") {
        // Calculate base subtotal of people involved in this specific additional expense
        const involvedBaseSubtotal = adx.who.reduce((acc, person) => {
          return acc + (balances[person]?.baseSpent || 0);
        }, 0);

        // Distribute proportionally based on baseSpent
        adx.who.forEach((person) => {
          if (balances[person] && involvedBaseSubtotal > 0) {
            const personBaseSubtotal = balances[person].baseSpent;
            const proportionalShare =
              (personBaseSubtotal / involvedBaseSubtotal) * adx.amount;
            balances[person].spent += proportionalShare;
            balances[person].items.push({
              name: adx.name,
              share: proportionalShare,
              method: "prop",
              isAdditional: true,
            });
          } else if (balances[person] && involvedBaseSubtotal === 0) {
            // Fallback to equal if no one has spent anything yet
            const share = adx.amount / adx.who.length;
            balances[person].spent += share;
            balances[person].items.push({
              name: adx.name,
              share,
              method: "equal",
              isAdditional: true,
            });
          }
        });
      } else {
        // Distribute equally
        const share = adx.amount / (adx.who.length || 1);
        adx.who.forEach((person) => {
          if (balances[person]) {
            balances[person].spent += share;
            balances[person].items.push({
              name: adx.name,
              share,
              method: "equal",
              isAdditional: true,
            });
          }
        });
      }
    });

    const totalSpent = Object.values(balances).reduce(
      (acc, b) => acc + b.spent,
      0,
    );

    // Settlement Algorithm (Who owes Whom)
    const settlementInstructions: SettlementInstruction[] = [];
    const netBalances = Object.entries(balances).map(([name, b]) => ({
      name,
      balance: b.paid - b.spent, // Positive means they are owed money, negative means they owe money
    }));

    // CRITICAL: Work on a copy of netBalances for settlement 
    // to avoid mutating the original values needed for badges
    const settlementBalances = netBalances.map(b => ({ ...b }));

    const creditors = settlementBalances
      .filter((b) => b.balance > 0.01)
      .sort((a, b) => b.balance - a.balance);
    const debtors = settlementBalances
      .filter((b) => b.balance < -0.01)
      .sort((a, b) => a.balance - b.balance);

    let creditorIdx = 0;
    let debtorIdx = 0;

    while (creditorIdx < creditors.length && debtorIdx < debtors.length) {
      const creditor = creditors[creditorIdx];
      const debtor = debtors[debtorIdx];
      const amount = Math.min(creditor.balance, Math.abs(debtor.balance));

      if (amount > 0.01) {
        settlementInstructions.push({
          from: debtor.name,
          to: creditor.name,
          amount: amount,
        });
      }

      creditor.balance -= amount;
      debtor.balance += amount;

      if (creditor.balance < 0.01) creditorIdx++;
      if (Math.abs(debtor.balance) < 0.01) debtorIdx++;
    }

    // Identify Badges
    const badges: Record<string, string[]> = {};
    people.forEach((name) => (badges[name] = []));

    if (people.length >= 2) {
      const activeSpenders = netBalances
        .filter((b) => balances[b.name].spent > 0.1) // Use slightly higher threshold for safety
        .sort((a, b) => balances[b.name].spent - balances[a.name].spent);

      if (activeSpenders.length > 0) {
        // 1. Si Paling Traktir (Paid the most)
        const topPayer = [...activeSpenders].sort((a, b) => {
          const paidA = balances[a.name].paid;
          const paidB = balances[b.name].paid;
          return paidB - paidA;
        })[0];
        
        if (topPayer && balances[topPayer.name].paid > 0.01) {
          badges[topPayer.name].push("Si Paling Traktir");
        }

        // 2. Si Paling Sultan (Spent the most)
        const topSpender = activeSpenders[0];
        if (topSpender && badges[topSpender.name].length === 0) {
          badges[topSpender.name].push("Si Paling Sultan");
        }

        // 3. Si Paling Hemat (Spent the least among active)
        // Refinement: Find the first person from the bottom up who doesn't have a badge yet.
        // This ensures the badge appears even if the absolute lowest spender already has one.
        const potentialLowestSpenders = [...activeSpenders].reverse();
        const lowestSpenderCandidate = potentialLowestSpenders.find(
          (s) => s.name !== topSpender?.name && badges[s.name].length === 0
        );

        if (lowestSpenderCandidate && activeSpenders.length >= 2) {
          badges[lowestSpenderCandidate.name].push("Si Paling Hemat");
        }
      }
    }

    return { balances, totalSpent, settlementInstructions, badges };
  };

  return calculateBalances();
};
