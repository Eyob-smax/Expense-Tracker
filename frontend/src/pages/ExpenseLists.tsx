import ButtonWithLink from "../components/ButtonWithLink";
import Header from "../components/Header";
import TableComponent from "../components/TableComponent";
import { Input } from "../components/ui/input";
import { ProfileIcon } from "../utils/constants";
import { useResizer } from "../hooks/useResizer";
import { v4 as uuidv4 } from "uuid";
import type { TAppDispatch, TRootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, type ChangeEvent } from "react";
import { fetchExpenses } from "../features/expense/expenseSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import type { TExpense } from "../types/types";
import Filtering from "../components/Filtering";
import LoadingScreen from "./LoadingScreen";
const ExpenseListsHeaders = [
  { label: "Analytics", path: "/analytics" },
  { label: "Overview", path: "/overview" },
  { label: "Categories", path: "/categories" },
  { label: "Settings", path: "/settings" },
  { label: "About", path: "/about" },
  ProfileIcon,
];

export default function ExpenseLists() {
  const { elRef, visibleHeight } = useResizer<HTMLDivElement>();
  const { expenses, isLoading: expenseLoading } = useSelector(
    (state: TRootState) => state.expense
  );
  const dispatch = useDispatch<TAppDispatch>();
  const navigate = useNavigate();
  const [filteredExpenses, setFilteredExpenses] = useState<TExpense[]>([]);
  const { categories, isLoading } = useSelector(
    (state: TRootState) => state.category
  );

  function searchExpense(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toLowerCase();
    setFilteredExpenses(
      expenses.filter((expense) => {
        const nameFilter = expense.name.toLowerCase().includes(value);
        const descriptionFilter = expense.description
          ?.toLowerCase()
          .includes(value);
        const amountFilter = expense.amount === Number(value);
        return nameFilter || descriptionFilter || amountFilter ? true : false;
      })
    );
  }

  useEffect(() => {
    (async () => {
      try {
        await dispatch(fetchExpenses()).unwrap();
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch expenses.",
        });
        navigate("/overview");
      }
    })();
  }, [dispatch, navigate]);

  useEffect(() => {
    setFilteredExpenses(expenses || []);
  }, [expenses]);

  if (isLoading || expenseLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <Header
        key={uuidv4()}
        title="Expense Tracker"
        linksOption={ExpenseListsHeaders}
      />
      <div className="flex items-center justify-between p-3 w-[80%] mx-auto text-center">
        <h1 className="font-bold text-[22px]">All Expenses</h1>
        <ButtonWithLink
          className="bg-blue-500 text-white px-4 py-2 rounded"
          to="new"
        >
          New Expense
        </ButtonWithLink>
      </div>
      <Filtering
        expenses={expenses}
        categories={categories}
        setFilteredExpenses={setFilteredExpenses}
        className="flex items-center justify-start gap-5  w-[90%] mx-auto mb-3"
      />

      <div className=" w-[90%] mx-auto">
        <Input
          type="text"
          className="bg-[#F2F2F5] text-sm border-1 border-[#dbe0e5]"
          placeholder="Search Expenses"
          onChange={searchExpense}
        />

        <TableComponent
          ref={elRef}
          headerArrays={[
            "Date",
            "Title",
            "Description",
            "Total Amount",
            "Priority",
            "Detail",
          ]}
          bodyArrays={filteredExpenses}
          className="border border-[#dbe0e5] mt-3 rounded-2xl overflow-y-auto"
          style={{ maxHeight: `${visibleHeight}px` }}
          pathForBody={"/detail"}
        />
      </div>
    </div>
  );
}
