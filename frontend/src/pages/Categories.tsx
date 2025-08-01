import ButtonWithLink from "../components/ButtonWithLink";
import Header from "../components/Header";
import TableComponent from "../components/TableComponent";
import useCheckAuth from "../hooks/useCheckAuth";
import { ProfileIcon } from "../utils/constants";

const categoriesHeaderLinks = [
  {
    label: "Expenses",
    path: "/expenses",
  },
  {
    label: "Analytics",
    path: "/analytics",
  },
  {
    label: "Settings",
    path: "/settings",
  },
  ProfileIcon,
];

export default function Categories() {
  useCheckAuth();

  return (
    <div>
      <Header title="Categories" linksOption={categoriesHeaderLinks} />
      <div className="flex items-center justify-between  py-3 w-[80%] mx-auto text-center">
        <h1 className="text-[22px] font-bold">Categories</h1>
        <ButtonWithLink to="new">Add Category</ButtonWithLink>
      </div>
      <p className="w-[80%]  mx-auto text-left font-extralight">
        Manage your expense categories and set budgets
      </p>
      <TableComponent
        className="border w-[80%] mx-auto border-[#dbe0e5] mt-3 rounded-2xl overflow-y-auto shadow-sm"
        bodyArrays={[
          ["Food", "$200", "🍔", "Edit/Delete"],
          ["Transport", "$150", "🚗", "Edit/Delete"],
          ["Entertainment", "$100", "🎬", "Edit/Delete"],
          ["Utilities", "$80", "💡", "Edit/Delete"],
          ["Health", "$120", "🏥", "Edit/Delete"],
          ["Shopping", "$300", "🛍️", "Edit/Delete"],
          ["Food", "$200", "🍔", "Edit/Delete"],
        ]}
        headerArrays={["category", "budget", "icon", "actions"]}
      />
    </div>
  );
}
