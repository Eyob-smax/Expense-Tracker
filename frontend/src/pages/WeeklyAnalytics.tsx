import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import AnalyticsGraph from "../components/AnalyticsGraph";
import LoadingScreen from "./LoadingScreen";
import type { TAppDispatch, TRootState } from "../app/store";
import { fetchExpenses } from "../features/expense/expenseSlice";
import { fetchCategories } from "../features/category/categorySlice";

export default function WeeklyAnalytics() {
  const { expenses, isLoading: expenseLoading } = useSelector(
    (state: TRootState) => state.expense
  );
  const { categories, isLoading: categoryLoading } = useSelector(
    (state: TRootState) => state.category
  );
  const dispatch = useDispatch<TAppDispatch>();

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchCategories());
  }, [dispatch]);

  const data = useMemo(() => {
    const today = dayjs();
    const sevenDaysAgo = today.subtract(6, "day");

    const init: Record<string, { label: string; value: number }> = {};
    for (let i = 0; i < 7; i++) {
      const day = sevenDaysAgo.add(i, "day");
      init[day.format("YYYY-MM-DD")] = {
        label: day.format("ddd"),
        value: 0,
      };
    }

    expenses.forEach((item) => {
      const created = dayjs(item?.date || new Date());
      if (created.isBefore(sevenDaysAgo) || created.isAfter(today)) return;

      const key = created.format("YYYY-MM-DD");
      const value = item.amount * (item.quantity || 1);

      if (init[key]) {
        init[key].value += value;
      }
    });

    return Object.values(init);
  }, [expenses]);

  const catData = useMemo(() => {
    const today = dayjs();
    const sevenDaysAgo = today.subtract(6, "day");

    return categories
      .map((category) => {
        const value = expenses.reduce((acc, expense) => {
          const created = dayjs(expense?.date || new Date());
          if (
            created.isBefore(sevenDaysAgo) ||
            created.isAfter(today) ||
            !expense.category_IDs.includes(category.category_id)
          ) {
            return acc;
          }
          return acc + expense.amount * (expense.quantity || 1);
        }, 0);

        return { category: category.cat_name, value };
      })
      .filter((cat) => cat.value > 0);
  }, [categories, expenses]);

  if (expenseLoading || categoryLoading) {
    return <LoadingScreen />;
  }

  const totalSpent = data.reduce((sum, { value }) => sum + value, 0);

  return (
    <AnalyticsGraph
      data={data}
      categoryData={catData}
      lineGraphLabel="Total Spent in the Last 7 Days"
      spendingAmount={`${totalSpent}${expenses[0]?.currency || ""}`}
      period={`${data.length} weekly expenses`}
      percentageChange="-5%"
    />
  );
}
