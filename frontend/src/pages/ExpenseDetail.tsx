import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { ProfileIcon } from "../utils/constants";

const ExpenseDetailLinksOption = [
  { label: "Home", path: "/" },
  { label: "Expenses", path: "/expenses" },
  { label: "Settings", path: "/settings" },
  { label: "Analytics", path: "/analytics" },
  ProfileIcon,
];
export default function ExpenseDetail() {
  return (
    <div>
      <Header title="Expense Tracker" linksOption={ExpenseDetailLinksOption} />

      <div className="mt-10 w-[90%]  mx-auto">
        <h2 className="text-sm md:w-[80%] mx-auto">
          Expenses/ <span className="font-semibold">Coffee</span>
        </h2>
        <h1 className="text-[22px] md:w-[80%] mx-auto mt-5 font-bold">
          Coffee
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] mx-auto gap-x-5 mt-5 w-[100%] md:w-[80%]">
          <div className="py-4 mt-5 border-t-2 border-t-[#E5E8EB]">
            <p className="text-sm text-[#6B7280]">Amount</p>
            <p className="text-stone-800 text-sm font-semibold">$2.5</p>
          </div>
          <div className="py-4 md:col-span-2 mt-5 border-t-2 border-t-[#E5E8EB]">
            <p className="text-sm text-[#6B7280]">Date</p>
            <p className="text-stone-800 text-sm font-semibold">02-01-2025</p>
          </div>
          <div className="py-4 mt-5 border-t-2 border-t-[#E5E8EB]">
            <p className="text-sm text-[#6B7280]">Category</p>
            <p className="text-stone-800 text-sm font-semibold">
              Food & Drinks
            </p>
          </div>
          <div className="py-4 md:col-span-2 mt-5 border-t-2 border-t-[#E5E8EB]">
            <p className="text-sm text-[#6B7280]">Description</p>
            <p className="text-stone-800 text-sm font-semibold ">
              Morning coffee at a local cafe
            </p>
          </div>
          <div className="pt-4 mt-5 border-t-2 border-t-[#E5E8EB]">
            <p className="text-sm text-[#6B7280]">Neccessity</p>
            <p className=" text-[red] font-semibold ">High</p>
          </div>
        </div>
        <div className="flex justify-center md:justify-end gap-x-8 md:gap-x-4 mt-5 w-[80%] mx-auto">
          <Button className="bg-stone-800 text-white">Edit</Button>
          <Button className="bg-blue-500 text-white">Delete</Button>
        </div>
      </div>
    </div>
  );
}
