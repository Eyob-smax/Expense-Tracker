import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import AnalyticsGraph from "../components/AnalyticsGraph";
import LoadingScreen from "./LoadingScreen";
import type { TAppDispatch, TRootState } from "../app/store";
import { fetchExpenses } from "../features/expense/expenseSlice";
import { fetchCategories } from "../features/category/categorySlice";

export default function DailyAnalytics() {
  const dispatch = useDispatch<TAppDispatch>();

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchCategories());
  }, [dispatch]);

  const { categories, isLoading: categoryLoading } = useSelector(
    (state: TRootState) => state.category
  );
  const { expenses, isLoading: expenseLoading } = useSelector(
    (state: TRootState) => state.expense
  );

  const today = useMemo(() => new Date(), []);

  const isSameDay = (date1: Date, date2: Date) =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  const catData = useMemo(() => {
    return categories.map((category) => {
      const value = expenses.reduce((acc, expense) => {
        const created = new Date(expense?.created_at || Date.now());
        if (
          isSameDay(created, today) &&
          expense.category_IDs.includes(category.category_id)
        ) {
          acc += expense.amount * (expense.quantity || 1);
        }
        return acc;
      }, 0);

      return { category: category.cat_name, value };
    });
  }, [categories, expenses, today]);

  const data = useMemo(() => {
    const hourlyMap = expenses.reduce<
      Record<string, { label: string; value: number; interval: string }>
    >((acc, item) => {
      const created = new Date(item?.created_at || Date.now());

      if (!isSameDay(created, today)) return acc;

      const hour = created.getHours(); // local hours
      const hourKey = hour.toString();
      const value = item.amount * (item.quantity || 1);
      const interval = hour < 12 ? "Morning" : "Afternoon";

      if (!acc[hourKey]) {
        acc[hourKey] = { label: hourKey, value, interval };
      } else {
        acc[hourKey].value += value;
      }

      return acc;
    }, {});
    return Object.values(hourlyMap).sort(
      (a, b) => Number(a.label) - Number(b.label)
    );
  }, [expenses, today]);

  if (categoryLoading || expenseLoading) {
    return <LoadingScreen />;
  }

  const totalSpent = data.reduce((sum, { value }) => sum + value, 0);

  return (
    <AnalyticsGraph
      data={data}
      categoryData={catData}
      lineGraphLabel="Total Spent of the day"
      spendingAmount={`${totalSpent}${expenses[0]?.currency || ""}`}
      period={`${data.length} daily expenses`}
      percentageChange="+15%"
    />
  );
}
