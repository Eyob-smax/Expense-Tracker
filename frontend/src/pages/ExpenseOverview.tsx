import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import Header from "../components/Header";
import ExpenseCard from "../components/ExpenseCard";
import TableComponent from "../components/TableComponent";
import ButtonWithLink from "../components/ButtonWithLink";
import { ProfileIcon } from "../utils/constants";
import { useResizer } from "../hooks/useResizer";
import { useRegisterUser } from "../hooks/useRegisterUser";
import LoadingScreen from "./LoadingScreen";

import type { TExpense } from "../types/types";
import type { TAppDispatch, TRootState } from "../app/store";
import { setExpenses } from "../features/expense/expenseSlice";
import { ThemeContext } from "../hooks/useThemeContext";

const overviewLinks = [
  { label: "Expenses", path: "/expenses" },
  { label: "Categories", path: "/categories" },
  { label: "Analytics", path: "/analytics" },
  { label: "Settings", path: "/settings" },
  { label: "About", path: "/about" },
  ProfileIcon,
];

export default function ExpenseOverview() {
  const dispatch = useDispatch<TAppDispatch>();
  const navigate = useNavigate();
  const { elRef, visibleHeight } = useResizer<HTMLDivElement>();
  const { error, loading } = useRegisterUser();
  const { data: fetchedExpenses, error: expenseError } = useLoaderData();
  const isLoading = useNavigation().state === "loading";
  const { expenses, isLoading: expenseLoading } = useSelector(
    (state: TRootState) => state.expense
  );
  const [filteredExpenses, setFilteredExpenses] = useState<TExpense[]>([]);

  const { theme } = useContext(ThemeContext);

  // Only colors, no layout changes
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-[#F0F2F5]";
  const buttonBg =
    theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white";

  useEffect(() => {
    setFilteredExpenses(fetchedExpenses || []);
  }, [fetchedExpenses]);

  useEffect(() => {
    if (fetchedExpenses) {
      dispatch(setExpenses(fetchedExpenses));
    }
  }, [fetchedExpenses, dispatch]);

  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: error });
    navigate("/");
  }

  if (expenseError) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: expenseError.message,
    });
  }

  if (loading || isLoading || expenseLoading) {
    return <LoadingScreen />;
  }

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      } min-h-screen`}
    >
      <Header linksOption={overviewLinks} title="Expense Tracker" />

      <main className={`w-[80%] mx-auto mt-3 mb-5`}>
        <h1 className={`text-[22px] font-bold ${textPrimary}`}>Overview</h1>
        <p className={`mt-2 font-extralight ${textSecondary}`}>
          Here you can find a summary of your expenses.
        </p>

        <div className="flex items-center justify-start gap-8">
          {expenses?.slice(0, 5)?.map((expense, i) => (
            <ExpenseCard
              key={expense.expense_id}
              amount={
                (expense?.quantity &&
                  (expense.amount * expense?.quantity).toString()) ||
                "0"
              }
              label={dayjs(expense.date).format("MMM DD, YYYY")}
              percentageChange={{
                color: "#E83808",
                value:
                  i !== 0 && expenses[i - 1]?.amount !== 0
                    ? (
                        ((expenses[i]?.amount - expenses[i - 1]?.amount) /
                          expenses[i - 1]?.amount) *
                        100
                      ).toFixed(1)
                    : "0",
              }}
              className={`w-[300px] ${cardBg} shadow-md rounded-lg px-6 py-4 mt-3`}
            />
          ))}
        </div>

        <h1 className={`text-[20px] mt-5 font-bold ${textPrimary}`}>
          Recent Transactions
        </h1>

        <TableComponent
          pathForBody="/expense"
          ref={elRef}
          style={{ maxHeight: visibleHeight + "px" }}
          className={` mt-3 rounded-2xl overflow-y-scroll`}
          bodyArrays={filteredExpenses.slice(0, 5)}
          headerArrays={[
            "Date",
            "Title",
            "Description",
            "Total Amount",
            "Priority",
            "Detail",
          ]}
        />

        <ButtonWithLink
          className={`${buttonBg} mt-4 px-4 py-2 rounded`}
          to="/expenses"
        >
          View All Transactions
        </ButtonWithLink>
      </main>
    </div>
  );
}
