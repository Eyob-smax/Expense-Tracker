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
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../features/expense/expenseSlice";
import type { TAppDispatch, TRootState } from "../app/store";
import { useEffect } from "react";
import { getCalculatedDate } from "../utils/util";
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
  const { elRef, visibleHeight } = useResizer<HTMLDivElement>();
  const { error, loading } = useRegisterUser();
  const dispatch = useDispatch<TAppDispatch>();
  const {
    expenses,
    isLoading,
    error: expenseError,
  } = useSelector((state: TRootState) => state.expense);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

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
          <ExpenseCard
            amount={"2,500"}
            label={getCalculatedDate("today")}
            percentageChange={{ color: "#E83808", value: "10" }}
            className="w-[300px] bg-[#F0F2F5] shadow-md rounded-lg px-6 py-4 mt-3"
          />
          <ExpenseCard
            amount={"2,500"}
            label={getCalculatedDate("before", 1)}
            percentageChange={{ color: "#088738", value: "+30" }}
            className="w-[300px] bg-[#F0F2F5] shadow-md rounded-lg px-6 py-4 mt-3"
          />
          <ExpenseCard
            amount={"2,500"}
            label={getCalculatedDate("before", 2)}
            percentageChange={{ color: "#088738", value: "+10" }}
            className="w-[300px] bg-[#F0F2F5] shadow-md rounded-lg px-6 py-4 mt-3"
          />
        </div>
        <h1 className="text-[20px] mt-5 font-bold">Recent Transactions</h1>
        <div className="flex items-center justify-start gap-5 mt-1">
          <div className="rounded-[15px] text-sm w-fit   py-[3px] px-5 mt-2 bg-[#F0F2F5] space-x-3">
            <select className=" appearance-none ">
              <option value="Sort_by_date">Sort by date</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
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
