import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { TInitialAuthState, User } from "../../types/types";
import { supabase } from "../../supabase/supabaseClient";

const initialState: TInitialAuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const signUp = createAsyncThunk("auth/signup", async (userData: User) => {
  const { data, error } = await supabase.auth.signUp(userData);
  console.log(data ?? error);
  return data;
});

const login = createAsyncThunk(
  "auth/login",
  async (userData: Omit<User, "username">) => {
    const { data, error } = await supabase.auth.signInWithPassword(userData);
    // console.log(data ?? error);
    return data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, { payload }) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        // state.user = payload;
      });
  },
});

export const { actions, reducer } = authSlice;
export { signUp, login };
export type TAuthState = typeof initialState;
