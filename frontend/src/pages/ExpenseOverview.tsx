import Header from "../components/Header";
import ExpenseCard from "../components/ExpenseCard";
import { v4 as uuidv4 } from "uuid";
import TableComponent from "../components/TableComponent";
import { ProfileIcon } from "../utils/constants";
import ButtonWithLink from "../components/ButtonWithLink";
import { useResizer } from "../hooks/useResizer";
import { useRegisterUser } from "../hooks/useRegisterUser";
import Swal from "sweetalert2";
import LoadingScreen from "./LoadingScreen";
import dayjs from "dayjs";
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import type { TExpense } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import type { TAppDispatch, TRootState } from "../app/store";
import { setExpenses } from "../features/expense/expenseSlice";
import { useEffect, useState } from "react";

const overviewLinks = [
  { label: "Expenses", path: "/expenses" },
  { label: "categories", path: "/categories" },
  { label: "analytics", path: "/analytics" },
  { label: "settings", path: "/settings" },
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
  const { expenses } = useSelector((state: TRootState) => state.expense);
  const [filteredExpenses, setFilteredExpenses] = useState<TExpense[]>([]);

  useEffect(() => {
    setFilteredExpenses(fetchedExpenses || []);
  }, [fetchedExpenses]);

  useEffect(() => {
    if (fetchedExpenses) {
      dispatch(setExpenses(fetchedExpenses));
    }
  }, [fetchedExpenses, dispatch]);

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error,
    });
    navigate("/");
  }

  if (expenseError) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: expenseError.message,
    });
  }

  if (loading || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <Header
        key={uuidv4()}
        linksOption={overviewLinks}
        title="Expense Tracker"
      />
      <main className="w-[80%] mx-auto mt-3 mb-5">
        <h1 className="text-[22px] font-bold ">Overview</h1>
        <p className="mt-2 font-extralight">
          Here you can find a summary of your expenses.
        </p>
        <div className="flex items-center justify-start gap-8">
          {expenses?.slice(0, 5)?.map((expense: TExpense) => (
            <ExpenseCard
              key={expense.expense_id}
              amount={expense.amount.toString()}
              label={dayjs(expense.date).format("MMM DD, YYYY")}
              percentageChange={{ color: "#E83808", value: "10" }}
              className="w-[300px] bg-[#F0F2F5] shadow-md rounded-lg px-6 py-4 mt-3"
            />
          ))}
        </div>
        <h1 className="text-[20px] mt-5 font-bold">Recent Transactions</h1>

        <TableComponent
          pathForBody="/expense"
          ref={elRef}
          style={{ maxHeight: visibleHeight.toString() + "px" }}
          className="border-1 border-[#dbe0e5] mt-3 rounded-2xl overflow-y-scroll"
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
        <ButtonWithLink to="/expenses">View All Transactions</ButtonWithLink>
        <div className="h-4 w-1"></div>
      </main>
    </div>
  );
}
