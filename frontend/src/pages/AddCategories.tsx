import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ProfileIcon } from "../utils/constants";

export default function AddCategories() {
  return (
    <div>
      <Header
        title="Expense Tracker"
        linksOption={[
          { label: "Home", path: "/" },
          { label: "Expenses", path: "/expenses" },
          { label: "Settings", path: "/settings" },
          { label: "Analytics", path: "/analytics" },
          { label: "Categories", path: "/categories" },
          ProfileIcon,
        ]}
      />
      <div className="w-[80%] mx-auto mt-10 space-y-5">
        <h1 className="text-2xl mb-8 font-bold">New Category</h1>

        <div className="flex md:w-1/2 flex-col space-y-2">
          <label className="text-sm font-semibold" htmlFor="category-name">
            Category Name
          </label>
          <Input
            type="text"
            id="category-name"
            placeholder="Food & Drinks"
            className="border  border-gray-300 p-2 rounded-md w-full"
          />
        </div>
        <div className="md:w-1/2 flex flex-col space-y-2">
          <label className="text-sm font-semibold" htmlFor="category-name">
            Icon
          </label>
          <Input
            type="text"
            id="category-icon"
            placeholder="Optional: e.g., 🍕"
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>

        <div className="flex justify-start gap-x-4 mt-8">
          <Button className="bg-[#EBF2EB] text-stone-800 font-semibold">
            Cancel
          </Button>
          <Button className="bg-blue-500 text-white">Create</Button>
        </div>
      </div>
    </div>
  );
}
