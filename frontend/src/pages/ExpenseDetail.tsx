import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import useCheckAuth from "../hooks/useCheckAuth";
import { ProfileIcon } from "../utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { TAppDispatch, TRootState } from "../app/store";
import type { TCategory, TExpense } from "../types/types";
import { fetchCategories } from "../features/category/categorySlice";
import {
  deleteExpenseById,
  fetchExpenses,
} from "../features/expense/expenseSlice";
import LoadingScreen from "./LoadingScreen";
import Swal from "sweetalert2";

const ExpenseDetailLinksOption = [
  { label: "Home", path: "/" },
  { label: "Expenses", path: "/expenses" },
  { label: "Settings", path: "/settings" },
  { label: "Analytics", path: "/analytics" },
  ProfileIcon,
];
export default function ExpenseDetail() {
  useCheckAuth();
  const id = useParams().id;
  const dispatch = useDispatch<TAppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    expenses,
    isLoading: load,
    error: err,
  } = useSelector((state: TRootState) => state.expense);
  const {
    categories,
    isLoading: catLoading,
    error: catError,
  } = useSelector((state: TRootState) => state.category);
  const [currentExpense, setCurrentExpense] = useState<TExpense | null>(
    expenses.find((expense) => expense.expense_id === id) || null
  );

  const deleteExpense = async () => {
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No expense ID provided",
      });
      return;
    }

    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: `You are about to delete this expense: ${
        currentExpense?.name || "Unnamed Expense"
      }`,
      confirmButtonText: "Delete",
      confirmButtonColor: "red",
      showConfirmButton: true,
      showCancelButton: true,
    });

    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      await dispatch(deleteExpenseById(id)).unwrap();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Expense deleted successfully",
        timer: 1500,
      });
      navigate("/expenses", { replace: true });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          typeof err === "string"
            ? err
            : (err as any)?.message || "Failed to delete expense",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  useEffect(() => {
    setCurrentExpense(
      expenses.find((expense) => expense.expense_id === id) || null
    );
  }, [expenses, id]);

  if (isLoading || catLoading || load) {
    return <LoadingScreen />;
  }

  if (err || catError) {
    Swal.fire({
      icon: "error",
      title: "Network Error",
      text: "Error fetching expense data",
    });
  }
  return (
    <div>
      <Header title="Expense Tracker" linksOption={ExpenseDetailLinksOption} />

      <div className="mt-5 w-[90%]  mx-auto">
        <h2 className="text-sm md:w-[80%] mx-auto">
          Expenses/{" "}
          <span className="font-semibold">{currentExpense?.name}</span>
        </h2>
        <h1 className="text-[22px] md:w-[80%] mx-auto mt-5 font-bold">
          {currentExpense?.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] mx-auto gap-x-5 mt-3 w-[100%] md:w-[80%]">
          <div className="py-4 mt-5 border-t-2 border-t-[#E5E8EB]">
            <p className="text-sm text-[#6B7280]">Amount</p>
            <p className="text-stone-800 text-sm font-semibold">
              {currentExpense?.amount}
            </p>
          </div>
          <div className="py-4 md:col-span-2 mt-5 border-t-2 border-t-[#E5E8EB]">
            <p className="text-sm text-[#6B7280]">Date</p>
            <p className="text-stone-800 text-sm font-semibold">
              {currentExpense?.date}
            </p>
          </div>
          <div className="py-4 mt-5 border-t-2 border-t-[#E5E8EB]">
            <p className="text-sm text-[#6B7280]">Category</p>
            <p className="text-stone-800 text-sm font-semibold space-y-1 space-x-1 ">
              {currentExpense?.category_IDs.map((categoryId: string) => {
                const cat = categories.find(
                  (cat: TCategory) => cat.category_id === categoryId
                );
                return cat ? (
                  <span
                    className="flex items-center gap-2 px-2 py-1  rounded-md border-stone-300 border-1 text-black w-fit"
                    key={cat.category_id}
                  >
                    {cat.cat_name}
                  </span>
                ) : null;
              })}
            </p>
          </div>
          <div className="py-4 md:col-span-2 mt-5 border-t-2 border-t-[#E5E8EB]">
            <p className="text-sm text-[#6B7280]">Description</p>
            <p className="text-stone-800 text-sm font-semibold ">
              {currentExpense?.description || "-"}
            </p>
          </div>
          <div className="pt-4 mt-5 border-t-2 border-t-[#E5E8EB]">
            <p className="text-sm text-[#6B7280]">Neccessity</p>
            <p
              className={`${
                currentExpense?.priority === "Low"
                  ? "text-black"
                  : currentExpense?.priority === "High"
                  ? "text-red-500"
                  : "text-yellow-500"
              } font-semibold `}
            >
              {currentExpense?.priority || "Medium"}
            </p>
          </div>
        </div>
        <div className="flex justify-center md:justify-end gap-x-8 md:gap-x-4 mt-5 w-[80%] mx-auto">
          <Button className="bg-stone-800 text-white">Edit</Button>
          <Button onClick={deleteExpense} className="bg-blue-500 text-white">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
