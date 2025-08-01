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
