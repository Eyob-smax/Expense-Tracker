import Header from "../components/Header";
import type { TCategory } from "../types/types";
import { ProfileIcon } from "../utils/constants";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import Overlay from "../components/Overlay";
import EditExpense from "../components/EditExpense";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { TAppDispatch, TRootState } from "../app/store";
import {
  deleteCategoryById,
  fetchCategories,
} from "../features/category/categorySlice";
import Swal from "sweetalert2";

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

export default function CategoriesDetail() {
  const id = useParams().id;
  const navigate = useNavigate();
  const [isEditModal, setEditModal] = useState(false);
  const dispatch = useDispatch<TAppDispatch>();
  const { categories, error } = useSelector(
    (state: TRootState) => state.category
  );
  const [currentCategory, setCurrentCategory] = useState<TCategory | null>(
    categories.find((category: TCategory) => category.category_id === id) ||
      null
  );

  function afterEdit() {
    dispatch(fetchCategories());
    setEditModal(false);
    navigate(`/categories`);
  }

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setCurrentCategory(
      categories.find((category) => category.category_id === id) || null
    );
  }, [categories, id]);

  async function deleteCategory() {
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No category ID provided",
      });
      return;
    }

    try {
      const { isConfirmed } = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "This action cannot be undone.",
        showCancelButton: true,
      });

      if (!isConfirmed) {
        return;
      }

      await dispatch(deleteCategoryById(id)).unwrap();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your category has been deleted.",
      });
      navigate("/categories");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "An unexpected error occurred while deleting the category" +
          (err as Error).message,
      });
      return;
    }
  }

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error,
    });
  }

  return (
    <div>
      <Header
        title="Expense Tracker - Category Details"
        linksOption={categoriesHeaderLinks}
      />
      <div className="mt-5 w-[90%]  mx-auto">
        <h2 className="text-sm md:w-[80%] mx-auto">
          Category/{" "}
          <span className="font-semibold">{currentCategory?.cat_name}</span>
        </h2>
        <h1 className="text-[22px] md:w-[80%] mx-auto mt-5 font-bold">
          Edit Category
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] mx-auto gap-x-5 mt-3 w-[100%] md:w-[80%]">
          <div className="py-4 md:col-span-2 mt-5 border-t-2 border-t-[#E5E8EB]">
            <p className="text-sm text-[#6B7280]">Category name</p>
            <p className="text-stone-800 text-sm font-semibold">
              {currentCategory?.cat_name}
            </p>
          </div>

          <div className="pt-4 mt-5 border-t-2 border-t-[#E5E8EB]">
            <p className="text-sm text-[#6B7280]">Relevance</p>
            <p
              className={`${
                currentCategory?.relevance === "Low"
                  ? "text-black"
                  : currentCategory?.relevance === "High"
                  ? "text-red-500"
                  : "text-yellow-500"
              } font-semibold `}
            >
              {currentCategory?.relevance || "Medium"}
            </p>
          </div>
          <div className="py-4 md:col-span-2 mt-5 border-t-2 border-t-[#E5E8EB]">
            <p className="text-sm text-[#6B7280]">Icon</p>
            <p className="text-stone-800 text-sm font-semibold">
              {currentCategory?.icon || "-"}
            </p>
          </div>
        </div>

        <div className="flex justify-center md:justify-end gap-x-8 md:gap-x-4 mt-5 w-[80%] mx-auto">
          <Button
            onClick={() => setEditModal(true)}
            className="bg-stone-800 text-white"
          >
            Edit
          </Button>
          <Button onClick={deleteCategory} className="bg-blue-500 text-white">
            Delete
          </Button>
        </div>
      </div>
      {isEditModal && currentCategory && (
        <>
          <Overlay />

          <EditExpense
            currentCategory={currentCategory}
            forWhich="category"
            onClose={afterEdit}
          />
        </>
      )}
    </div>
  );
}
