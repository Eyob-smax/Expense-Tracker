import { useLoaderData, useNavigation } from "react-router-dom";
import ButtonWithLink from "../components/ButtonWithLink";
import Header from "../components/Header";
import TableComponent from "../components/TableComponent";
import useCheckAuth from "../hooks/useCheckAuth";
import { ProfileIcon } from "../utils/constants";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { TAppDispatch } from "../app/store";
import { setCategories } from "../features/category/categorySlice";
import LoadingScreen from "./LoadingScreen";

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
  const dispatch = useDispatch<TAppDispatch>();
  const { data: categoriesData, error: categoriesError } = useLoaderData();
  const isLoading = useNavigation().state === "loading";

  if (categoriesError) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: categoriesError.message,
    });
  }

  useEffect(() => {
    if (categoriesData) {
      dispatch(setCategories(categoriesData));
    }
  }, [categoriesData, dispatch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

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
        bodyArrays={categoriesData || []}
        forWhich="category"
        headerArrays={["category", "user_id", "icon", "actions"]}
      />
    </div>
  );
}
