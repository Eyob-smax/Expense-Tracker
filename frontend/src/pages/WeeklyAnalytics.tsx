import { useDispatch, useSelector } from "react-redux";
import AnalyticsGraph from "../components/AnalyticsGraph";
import type { TAppDispatch, TRootState } from "../app/store";
import { useCallback, useEffect, useMemo } from "react";
import { fetchExpenses } from "../features/expense/expenseSlice";
import { fetchCategories } from "../features/category/categorySlice";
import LoadingScreen from "./LoadingScreen";

const catData = [
  { category: "Food", value: 400 },
  { category: "Transport", value: 200 },
  { category: "Utilities", value: 300 },
  { category: "Entertainment", value: 150 },
  { category: "Healthcare", value: 250 },
];

const data = [
  { label: "Mon", value: 300 },
  { label: "Tue", value: 250 },
  { label: "Wed", value: 150 },
  { label: "Thu", value: 220 },
];

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

  const catData = useMemo(
    () =>
      categories.map((category) => ({
        category: category.cat_name,
        value: expenses
          .filter((expense) =>
            expense.category_IDs.includes(category.category_id)
          )
          .reduce((acc, expense) => acc + expense.amount, 0),
      })),
    [categories, expenses]
  );

  if (expenseLoading || categoryLoading) {
    return <LoadingScreen />;
  }

  return (
    <AnalyticsGraph
      data={data}
      categoryData={catData}
      lineGraphLabel="Total Spent of the week"
      spendingAmount="$5,000"
      period={data.length.toString() + " weekly expenses"}
      percentageChange="-5%"
    />
  );
}
