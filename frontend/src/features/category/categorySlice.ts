import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../supabase/supabaseClient";

const initialState = {
  categories: [],
};

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async () => {
    const { data } = await supabase.from("categories").select("*");
    console.log("Fetched categories:", data);
    return data;
  }
);

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (categoryData) => {
    const { data } = await supabase.from("categories").insert([categoryData]);
    console.log("Added category:", data);
    return data![0];
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = categorySlice.actions;

export default categorySlice.reducer;
export type TCategoryState = typeof initialState;
