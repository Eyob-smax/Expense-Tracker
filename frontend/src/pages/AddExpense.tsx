import { useFetcher } from "react-router-dom";
import Header from "../components/Header";
import { ProfileIcon } from "../utils/constants";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
const addExpenselinksOption = [
  { label: "Home", path: "/" },
  { label: "Expenses", path: "/expenses" },
  { label: "Settings", path: "/settings" },
  { label: "Analytics", path: "/analytics" },
  ProfileIcon,
];
export default function AddExpense() {
  const fetcher = useFetcher();
  return (
    <div>
      <Header title="Expense Tracker" linksOption={addExpenselinksOption} />
      <h1 className="text-[22px] font-bold sm:pt-5 pt-10 sm:pb-5 pb-14 w-[80%] mx-auto">
        Add Expense
      </h1>
      <fetcher.Form className="w-[80%] mx-auto space-y-5">
        <div className="flex flex-col gap-y-2 w-full md:w-1/2">
          <label className="font-semibold" htmlFor="amount">
            Amount
          </label>
          <Input id="amount" placeholder="$15" />
        </div>
        <div className="flex flex-col gap-y-2  w-full md:w-1/2">
          <label className="font-semibold" htmlFor="category">
            Category
          </label>
          <Input id="category" placeholder="entertainment" />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-1/2">
          <label className="font-semibold" htmlFor="description">
            Description
          </label>
          <Input id="description" placeholder="optional" />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-1/2">
          <label className="font-semibold" htmlFor="date">
            Date
          </label>
          <Input type="date" id="date" defaultValue={new Date().getDate()} />
        </div>

        <div className=" w-full md:w-1/2 flex flex-col">
          <Button
            variant={"secondary"}
            className="bg-stone-800 text-white text-right  "
          >
            Create
          </Button>
        </div>
      </fetcher.Form>
    </div>
  );
}
