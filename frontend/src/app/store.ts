import { configureStore } from "@reduxjs/toolkit";
import { reducer as authReducer } from "../features/auth/authSlice";
import { reducer as expenseReducer } from "../features/expense/expenseSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    expense: expenseReducer,
  },
});
export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
