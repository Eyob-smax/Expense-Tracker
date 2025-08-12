import type { TCategory, TExpense } from "../types/types";
import dayjs from "dayjs";
import { type Dispatch, type SetStateAction } from "react";
export default function Filtering({
  expenses,
  setFilteredExpenses,
  className,
  categories,
  ...rest
}: {
  expenses: TExpense[];
  setFilteredExpenses: Dispatch<SetStateAction<TExpense[]>>; // Use Dispatch<SetStateAction> for setState
  rest?: React.ComponentProps<"div">;
  categories?: TCategory[];
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

  function handleCategoryFilterChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const value = event.target.value;
    console.log("Selected category:", value);
    const filtered =
      expenses?.filter((expense: TExpense) => {
        if (value === "all") return true;
        return expense.category_IDs.includes(value);
      }) || [];
    setFilteredExpenses(filtered);
  }

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
          onChange={handleCategoryFilterChange}
        >
          {
            <>
              <option value="all">All Categories</option>
              {categories?.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.cat_name}
                </option>
              ))}
            </>
          }
        </select>
        <span className="transition-transform rotate-90">▼</span>
      </div>
    </div>
  );
}
