import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export const { actions, reducer } = authSlice;
export type TAuthState = typeof initialState;
