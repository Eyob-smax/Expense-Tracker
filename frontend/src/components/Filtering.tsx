import type { TExpense } from "../types/types";
import dayjs from "dayjs";
import { type Dispatch, type SetStateAction } from "react";
export default function Filtering({
  expenses,
  setFilteredExpenses,
  className,
  ...rest
}: {
  expenses: TExpense[];
  setFilteredExpenses: Dispatch<SetStateAction<TExpense[]>>; // Use Dispatch<SetStateAction> for setState
  rest?: React.ComponentProps<"div">;
  className?: string;
}) {
  const handleDateFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    const filtered =
      expenses?.filter((expense: TExpense) => {
        const expenseDate = dayjs(expense.date);
        const today = dayjs();

        switch (value) {
          case "3_days":
            return expenseDate.isAfter(today.subtract(3, "day"), "day");
          case "5_days":
            return expenseDate.isAfter(today.subtract(5, "day"), "day");
          case "7_days":
            return expenseDate.isAfter(today.subtract(7, "day"), "day");
          case "15_days":
            return expenseDate.isAfter(today.subtract(15, "day"), "day");
          case "this_month":
            return expenseDate.isSame(today, "month");
          default:
            return true;
        }
      }) || [];
    setFilteredExpenses(filtered);
  };

  return (
    <div {...rest} className={className}>
      <div className="rounded-[15px] text-sm w-fit py-[3px] px-5 mt-2 bg-[#F0F2F5] space-x-3">
        <select
          className="appearance-none"
          onChange={handleDateFilterChange}
          aria-label="Filter expenses by date"
        >
          <option value="all">All Expenses</option>
          <option value="3_days">Last three days</option>
          <option value="5_days">Last five days</option>
          <option value="7_days">Last seven days</option>
          <option value="15_days">Last fifteen days</option>
          <option value="this_month">This month</option>
        </select>
        <span className="transition-transform rotate-90">▼</span>
      </div>
      <div className="text-sm rounded-[15px] w-fit py-[3px] px-5 mt-2 bg-[#F0F2F5] space-x-3">
        <select
          className="appearance-none"
          aria-label="Sort expenses by category or time"
        >
          <option value="all">Sort by Category</option>
          <option value="this_week">Newest First</option>
          <option value="this_month">By Category</option>
        </select>
        <span className="transition-transform rotate-90">▼</span>
      </div>
    </div>
  );
}
