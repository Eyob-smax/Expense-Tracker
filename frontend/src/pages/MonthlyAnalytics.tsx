import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import AnalyticsGraph from "../components/AnalyticsGraph";
import LoadingScreen from "./LoadingScreen";
import type { TAppDispatch, TRootState } from "../app/store";
import { fetchExpenses } from "../features/expense/expenseSlice";
import { fetchCategories } from "../features/category/categorySlice";

export default function MonthlyAnalytics() {
  const dispatch = useDispatch<TAppDispatch>();

  const { expenses, isLoading: expenseLoading } = useSelector(
    (state: TRootState) => state.expense
  );
  const { categories, isLoading: categoryLoading } = useSelector(
    (state: TRootState) => state.category
  );

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchCategories());
  }, [dispatch]);

  const data = useMemo(() => {
    const today = dayjs();
    const startOfMonth = today.startOf("month");
    const endOfMonth = today.endOf("month");
    const totalDays = endOfMonth.date();
    const intervalSize = Math.ceil(totalDays / 10);

    const init: Record<string, { label: string; value: number }> = {};
    for (let i = 0; i < 10; i++) {
      const startDay = i * intervalSize + 1;
      const endDay = Math.min((i + 1) * intervalSize, totalDays);
      const label = `${startDay}-${endDay}`;
      init[label] = { label, value: 0 };
    }

    expenses.forEach((expense) => {
      const created = dayjs(expense?.date || new Date());
      if (created.isBefore(startOfMonth) || created.isAfter(endOfMonth)) return;

      const day = created.date();
      const intervalIndex = Math.min(Math.floor((day - 1) / intervalSize), 9);
      const label = Object.keys(init)[intervalIndex];
      const value = expense.amount * (expense.quantity || 1);
      init[label].value += value;
    });

    return Object.values(init);
  }, [expenses]);

  const catData = useMemo(() => {
    const today = dayjs();
    const startOfMonth = today.startOf("month");
    const endOfMonth = today.endOf("month");

    return categories.map((category) => {
      const value = expenses.reduce((acc, expense) => {
        const created = dayjs(expense?.date || new Date());
        if (
          created.isBefore(startOfMonth) ||
          created.isAfter(endOfMonth) ||
          !expense.category_IDs.includes(category.category_id)
        ) {
          return acc;
        }
        return acc + expense.amount * (expense.quantity || 1);
      }, 0);

      return { category: category.cat_name, value };
    });
  }, [categories, expenses]);

  if (expenseLoading || categoryLoading) {
    return <LoadingScreen />;
  }

  const totalSpent = data.reduce((sum, { value }) => sum + value, 0);

  return (
    <AnalyticsGraph
      data={data}
      categoryData={catData}
      lineGraphLabel="Total Spent This Month (Grouped by 10 Intervals)"
      spendingAmount={`${totalSpent}${expenses[0]?.currency || ""}`}
      period="10 intervals of the month"
      percentageChange="+10%"
    />
  );
}
