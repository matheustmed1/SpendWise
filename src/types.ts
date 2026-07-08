export type Account = string;

export interface AccountInfo {
  id: string;
  name: string;
  color: string;
}

export type Frequency = 'Daily' | 'Weekly' | 'Monthly';

export interface CategoryInfo {
  id: string;
  name: string;
}

export interface SubcategoryInfo {
  id: string;
  categoryId: string;
  name: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  subcategory: string;
  account: Account;
  date: string;
  description: string;
  user: string;
  isRecurring?: boolean;
  frequency?: Frequency;
  nextOccurrence?: string;
  isInstallment?: boolean;
  installmentsCount?: number;
  tags?: string[];
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  account: Account;
  date: string;
  user: string;
  isRecurring?: boolean;
  frequency?: Frequency;
  nextOccurrence?: string;
  notes?: string;
  paymentMethod?: string;
  installmentsCount?: number;
  tags?: string[];
}

export interface Budget {
  category: string;
  subcategory?: string;
  amount: number;
}

export interface Investment {
  id: string;
  name: string;
  symbol?: string;
  initialAmount: number;
  currentValue: number;
  date: string;
  user: string;
  account: Account;
  targetAmount?: number;
  targetDate?: string;
}

export interface InvestmentHistory {
  id: string;
  investmentId: string;
  value: number;
  date: string;
}

export interface ExpenseSummary {
  total: number;
  byCategory: Record<string, number>;
  byAccount: Record<Account, number>;
}

export interface Notification {
  id: string;
  type: 'warning' | 'danger';
  message: string;
  category: string;
  subcategory?: string;
  percent: number;
}

export interface Liability {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  user: string;
  account?: Account;
}
