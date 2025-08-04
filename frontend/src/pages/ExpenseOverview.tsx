import { FaSearch } from "react-icons/fa";
import Header from "../components/Header";
import { Input } from "../components/ui/input";
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
import { useLoaderData, useNavigation } from "react-router-dom";
import type { TExpense } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import type { TAppDispatch, TRootState } from "../app/store";
import { setExpenses } from "../features/expense/expenseSlice";
const overviewLinks = [
  { label: "catagories", path: "/categories" },
  { label: "analytics", path: "/analytics" },
  { label: "settings", path: "/settings" },
  { label: "About", path: "/about" },
  {
    label: "search",
    path: "non-existing-path",
    element: (
      <div className="flex  border-black items-center space-x-2 px-3 rounded-[10px] bg-[#F0F2F5] text-[#61758A] w-[200px]">
        <FaSearch />
        <Input
          placeholder="Search Expenses"
          className="border-none outline-none focus:outline-none"
        />
      </div>
    ),
  },
  ProfileIcon,
];

export default function ExpenseOverview() {
  const dispatch = useDispatch<TAppDispatch>();
  const { elRef, visibleHeight } = useResizer<HTMLDivElement>();
  const { error, loading } = useRegisterUser();
  const { data: fetchedExpenses, error: expenseError } = useLoaderData();
  const isLoading = useNavigation().state === "loading";
  const { expenses } = useSelector((state: TRootState) => state.expense);
  dispatch(setExpenses(fetchedExpenses));

  const handleDateFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    const filteredExpenses = expenses.filter((expense: TExpense) => {
      const expenseDate = dayjs(expense.date);
      const today = dayjs();

      switch (value) {
        case "3_days":
          return (
            expenseDate.isSame(today.subtract(3, "day"), "day") ||
            expenseDate.isAfter(today.subtract(3, "day"), "day")
          );
        case "5_days":
          return (
            expenseDate.isSame(today.subtract(5, "day"), "day") ||
            expenseDate.isAfter(today.subtract(5, "day"), "day")
          );
        case "7_days":
          return (
            expenseDate.isSame(today.subtract(7, "day"), "day") ||
            expenseDate.isAfter(today.subtract(7, "day"), "day")
          );
        case "15_days":
          return (
            expenseDate.isSame(today.subtract(15, "day"), "day") ||
            expenseDate.isAfter(today.subtract(15, "day"), "day")
          );
        case "this_month":
          return (
            expenseDate.isSame(today.startOf("month"), "day") ||
            expenseDate.isAfter(today.startOf("month"), "day")
          );
        default:
          return true;
      }
    });

    console.log("Filtered Expenses:", filteredExpenses);
    dispatch(setExpenses(filteredExpenses));
  };

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error,
    });
  }

  if (expenseError) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: expenseError,
    });
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <Header
        key={uuidv4()}
        linksOption={overviewLinks}
        title="Expense Tracker"
      />
      <main className="w-[80%] mx-auto mt-5">
        <h1 className="text-[22px] font-bold">Overview</h1>
        <p className="mt-2 font-extralight">
          Here you can find a summary of your expenses.
        </p>
        <div className="flex items-center justify-start gap-8">
          {expenses.slice(0, 5).map((expense: TExpense) => (
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
        <div className="flex items-center justify-start gap-5 mt-1">
          <div className="rounded-[15px] text-sm w-fit   py-[3px] px-5 mt-2 bg-[#F0F2F5] space-x-3">
            <select
              className=" appearance-none "
              onChange={handleDateFilterChange}
            >
              <option value="Sort_by_date">Sort by date</option>
              <option value="3_days">Last three days</option>
              <option value="5_days">Last five days</option>
              <option value="7_days">Last seven days</option>
              <option value="15_days">Last fifteen days</option>
              <option value="this_month">This month</option>
            </select>
            <span className="transition-transform rotate-90">▼</span>
          </div>
          <div className="text-sm rounded-[15px] w-fit   py-[3px] px-5 mt-2 bg-[#F0F2F5] space-x-3">
            <select className=" appearance-none ">
              <option value="Sort_by_date">Sort by Category</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
            </select>
            <span className="transition-transform rotate-90">▼</span>
          </div>
        </div>
        <TableComponent
          ref={elRef}
          style={{ maxHeight: visibleHeight.toString() + "px" }}
          className="border-1 border-[#dbe0e5] mt-3 rounded-2xl overflow-y-scroll"
          bodyArrays={expenses}
          headerArrays={["Date", "Category", "Description", "Amount", "Status"]}
        />
        <ButtonWithLink to="/expenses">View All Transactions</ButtonWithLink>
      </main>
    </div>
  );
}
