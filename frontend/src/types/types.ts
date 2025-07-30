export interface User {
  username: string;
  password: string;
  email: string;
}

export interface TInitialAuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
