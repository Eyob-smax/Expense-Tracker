import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../supabase/supabaseClient";
import type { TExpense, TExpenseInitialState } from "../../types/types";

const initialState: TExpenseInitialState = {
  expenses: [],
  isLoading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.from("expense").select("*");

    if (error) {
      console.error("Error fetching expenses:", error);
      return rejectWithValue("Failed to fetch expenses");
    }

    return data;
  }
);

export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (expenseData: Partial<TExpense>, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("expense")
      .insert({
        ...expenseData,
      })
      .select("*");
    if (error) {
      return rejectWithValue("Failed to add expense");
    }
    return data ? data[0] : null;
  }
);

export const deleteExpenses = createAsyncThunk(
  "expenses/removeExpense",
  async (id: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("expense")
      .delete()
      .match({ id });

    if (error) {
      console.error("Error removing expense:", error);
      return rejectWithValue("Failed to remove expense");
    }
    if (!data) {
      return rejectWithValue("Expense not found");
    }
    return { id };
  }
);
export const fetchExpenseById = createAsyncThunk(
  "expenses/fetchExpenseById",
  async (id: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("expense")
      .select("*")
      .eq("id", id);

    if (error) {
      console.error("Error fetching expense by ID:", error);
      return rejectWithValue("Failed to fetch expense");
    }
    if (!data || data.length === 0) {
      return rejectWithValue("Expense not found");
    }
    return data;
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async (
    { id, ...updates }: { id: string; updates: Partial<TExpense> },
    { rejectWithValue }
  ) => {
    const { data, error } = await supabase
      .from("expense")
      .update(updates)
      .match({ expense_id: id });

    if (error) {
      console.error("Error updating expense:", error);
      return rejectWithValue("Failed to update expense");
    }
    if (!data) {
      return rejectWithValue("Expense not found");
    }
    return data;
  }
);

export const deleteExpenseById = createAsyncThunk(
  "expenses/deleteExpenseById",
  async (id: string, { rejectWithValue }) => {
    if (!id || typeof id !== "string") {
      return rejectWithValue("Invalid expense ID");
    }

    try {
      const { error } = await supabase
        .from("expense")
        .delete()
        .eq("expense_id", id);

      if (error) {
        return rejectWithValue(error.message || "Failed to delete expense");
      }

      return [id];
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!action.payload) {
          state.error = "Failed to add expense";
        } else {
          state.expenses.push(action.payload);
        }
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id } = action.payload;
        state.expenses = state.expenses.filter(
          (expense) => expense.expense_id !== id
        );
      })
      .addCase(deleteExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchExpenseById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteExpenseById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteExpenseById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.expenses = state.expenses.filter(
          (expense: TExpense) => expense.expense_id !== (payload as string[])[0]
        );
      })
      .addCase(deleteExpenseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const reducer = expenseSlice.reducer;
export const { setExpenses } = expenseSlice.actions;
