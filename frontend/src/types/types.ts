export interface User {
  username: string;
  email: string;
  profilePicture: string;
}

export interface TInitialAuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface TExpense {
  expense_id: string;
  description?: string;
  amount: number;
  date: string;
  name: string;
  currency?: string;
  user_id: string;
  quantity?: number;
  category_IDs: string[];
}

export interface TExpenseInitialState {
  expenses: TExpense[];
  isLoading: boolean;
  error: string | null;
}

export interface TCategory {
  user_id: string;
  category_id: string;
  icon: string;
  cat_name: string;
  relevance: "high" | "medium" | "low";
}

export interface TCategoryInitialState {
  categories: TCategory[];
  isLoading: boolean;
  error: string | null;
}
