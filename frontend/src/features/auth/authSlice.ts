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
  async (_, { rejectWithValue, dispatch }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:5173/overview",
      },
    });
    if (error) {
      return rejectWithValue(error.message);
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return rejectWithValue(
        userError?.message || "Failed to fetch user data."
      );
    }

    dispatch(
      setLoginData({
        username:
          userData.user.user_metadata?.user_name ||
          userData.user.user_metadata?.name,
        email: userData.user.email,
        profilePicture: userData.user.user_metadata?.avatar_url,
      })
    );

    return data;
  }
);

export const signUpWithGoogle = createAsyncThunk(
  "auth/signupWithGoogle",
  async (_, { rejectWithValue, dispatch }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/overview",
      },
    });

    if (error) {
      return rejectWithValue(error.message);
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return rejectWithValue(
        userError?.message || "Failed to fetch user data."
      );
    }

    dispatch(
      setLoginData({
        username:
          userData.user.user_metadata?.user_name ||
          userData.user.user_metadata?.name,
        email: userData.user.email,
        profilePicture: userData.user.user_metadata?.avatar_url,
      })
    );
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
  extraReducers: (builder) => {},
});

export const { actions, reducer } = authSlice;
export const { setLoginData, setLogout } = authSlice.actions;
export type TAuthState = typeof initialState;
