
export interface Expense {
  id: string;
  name: string;
  amount: number;
}

export interface FinancialData {
  income: number;
  expenses: Expense[];
}
