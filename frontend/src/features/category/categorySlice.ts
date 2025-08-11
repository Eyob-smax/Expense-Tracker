import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { TCategory, TCategoryInitialState } from "../../types/types";
import { supabase } from "../../supabase/supabaseClient";

const initialState: TCategoryInitialState = {
  categories: [],
  isLoading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.from("category").select("*");

    if (error) {
      console.error("Error fetching categories:", error);
      return rejectWithValue("Failed to fetch categories");
    }

    return data;
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (categoryData: Partial<TCategory>, { rejectWithValue }) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return rejectWithValue("User not authenticated");
    }

    const { data, error } = await supabase
      .from("category")
      .insert({
        ...categoryData,
        user_id: userData.user.id,
      })
      .select("*");
    if (!error) {
      return rejectWithValue("Failed to add category");
    }
    if (!data || (data as TCategory[]).length === 0) {
      return rejectWithValue("No category data returned");
    }
    return data[0] as TCategory;
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("category")
      .delete()
      .match({ categoryId });

    if (error) {
      console.error("Error deleting category:", error);
      return rejectWithValue("Failed to delete category");
    }

    return data;
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (
    categoryData: { id: string; data: Partial<TCategory> },
    { rejectWithValue }
  ) => {
    const { data, error } = await supabase
      .from("category")
      .update({
        cat_name: categoryData.data.cat_name,
        relevance: categoryData.data.relevance,
        icon: categoryData.data.icon,
      })
      .eq("category_id", categoryData.id)
      .select("*");

    if (error) {
      return rejectWithValue("Failed to update category");
    }

    if (!data || data.length === 0) {
      return rejectWithValue("No category data returned");
    }

    if (data[0] === null) {
      return rejectWithValue("Category not found");
    }

    return data[0] as TCategory;
  }
);

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (categoryId: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("category")
      .select("*")
      .eq("category_id", categoryId);

    if (error) {
      console.error("Error fetching category by ID:", error);
      return rejectWithValue("Failed to fetch category");
    }

    return data[0];
  }
);

export const deleteCategoryById = createAsyncThunk(
  "categories/deleteCategoryById",
  async (categoryId: string, { rejectWithValue }) => {
    const { error } = await supabase
      .from("category")
      .delete()
      .eq("category_id", categoryId);

    if (error) {
      return rejectWithValue("Failed to delete category");
    }

    return categoryId;
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCategory = action.payload as TCategory;
        state.categories = state.categories.map((category) => {
          if (category.category_id === updatedCategory.category_id) {
            return { ...category, ...updatedCategory };
          }
          return category;
        });
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;

        state.categories = state.categories.filter((category) => {
          if (action.payload && category.category_id) {
            return (
              category.category_id !== (action.payload as TCategory).category_id
            );
          }
          return true;
        });
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategoryById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.categories = state.categories.filter(
          (category) => category.category_id !== payload
        );
      })
      .addCase(deleteCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { actions: categoryActions, reducer: categoryReducer } =
  categorySlice;
export const { setCategories } = categorySlice.actions;
