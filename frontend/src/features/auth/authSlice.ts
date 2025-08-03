import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { TInitialAuthState } from "../../types/types";
import { supabase } from "../../supabase/supabaseClient";

const initialState: TInitialAuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const signUpWithGithub = createAsyncThunk(
  "auth/signupWithGithub",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:5173/overview",
      },
    });
    if (error) {
      return rejectWithValue(error.message);
    }

    return data;
  }
);

export const signUpWithGoogle = createAsyncThunk(
  "auth/signupWithGoogle",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/overview",
      },
    });

    if (error) {
      return rejectWithValue(error.message);
    }

    return data;
  }
);

export const logOutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue, dispatch }) => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return rejectWithValue(error.message);
    }
    dispatch(setLogout());
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginData: (state, action) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpWithGithub.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithGithub.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signUpWithGithub.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signUpWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithGoogle.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signUpWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logOutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { actions, reducer } = authSlice;
export const { setLoginData, setLogout } = authSlice.actions;
export type TAuthState = typeof initialState;
