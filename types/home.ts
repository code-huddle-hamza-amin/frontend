export interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'cash' | 'bank' | 'card';
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  category: string;
  subcategory: string;
  amount: number;
  is_income: boolean;
  date: string;
  time: string;
  description?: string;
  wallet_id: string;
  icon: string;
  color: string;
  receipt_url?: string;
}

export interface SetupItem {
  id: string;
  name: string;
  icon: string;
  is_completed: boolean;
  action_url?: string;
}

export interface QuickAction {
  id: string;
  name: string;
  icon: string;
  color: string;
  action: string;
}

export interface SpendingTrend {
  date: string;
  income: number;
  expense: number;
}

export interface HomeData {
  user: {
    id: string;
    name: string;
    email: string;
    profile_picture?: string;
  };
  wallets: Wallet[];
  recent_transactions: Transaction[];
  setup_items: SetupItem[];
  quick_actions: QuickAction[];
  spending_trends: SpendingTrend[];
  total_balance: number;
  monthly_income: number;
  monthly_expense: number;
} 