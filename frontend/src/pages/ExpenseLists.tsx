import ButtonWithLink from "../components/ButtonWithLink";
import Header from "../components/Header";
import TableComponent from "../components/TableComponent";
import { Input } from "../components/ui/input";
import { ProfileIcon } from "../utils/constants";
import { useResizer } from "../hooks/useResizer";
import { v4 as uuidv4 } from "uuid";
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

  return (
    <div>
      <Header
        key={uuidv4()}
        title="Expense Tracker"
        linksOption={ExpenseListsHeaders}
      />
      <div className="flex items-center justify-between p-3 w-[80%] mx-auto text-center">
        <h1 className="font-bold text-[22px]">All Expenses</h1>
        <ButtonWithLink to="new">New Expense</ButtonWithLink>
      </div>

      <div className=" w-[90%] mx-auto">
        <Input
          type="text"
          className="bg-[#F2F2F5] text-sm border-1 border-[#dbe0e5]"
          placeholder="Search Expenses"
        />

        <TableComponent
          key={uuidv4()}
          ref={elRef}
          headerArrays={["Date", "Category", "Description", "Amount", "Status"]}
          bodyArrays={[
            ["2023-03-01", "Food", "Lunch at Cafe", "$50", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
            ["2023-03-01", "Food", "Lunch at Cafe", "$50", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
            ["2023-03-01", "Food", "Lunch at Cafe", "$50", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
            ["2023-03-01", "Food", "Lunch at Cafe", "$50", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
            ["2023-03-01", "Food", "Lunch at Cafe", "$50", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
            ["2023-03-02", "Transport", "Taxi to Airport", "$20", "Completed"],
          ]}
          className="border border-[#dbe0e5] mt-3 rounded-2xl overflow-y-auto"
          style={{ maxHeight: `${visibleHeight}px` }}
        />
      </div>
    </div>
  );
}
