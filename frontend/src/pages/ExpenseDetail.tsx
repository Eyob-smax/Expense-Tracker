import { useContext, useEffect, useState } from "react";
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
import EditExpense from "../components/EditExpense";
import Overlay from "../components/Overlay";
import { ThemeContext } from "../hooks/useThemeContext";

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
  const [isEditModal, setEditModal] = useState(false);

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

  const { theme } = useContext(ThemeContext);

  // Theme-aware color classes
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const textPrimary = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const badgeBg =
    theme === "dark"
      ? "bg-gray-700 text-gray-100"
      : "bg-gray-100 text-gray-900";
  const buttonEdit =
    theme === "dark" ? "bg-stone-600 text-gray-100" : "bg-stone-800 text-white";
  const buttonDelete =
    theme === "dark" ? "bg-blue-600 text-gray-100" : "bg-blue-500 text-white";

  const deleteExpense = async () => {
    if (!id)
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "No expense ID provided",
      });

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
            : (err as { message?: string })?.message ||
              "Failed to delete expense",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchExpenses());
  }, [dispatch]);

  useEffect(() => {
    setCurrentExpense(
      expenses.find((expense) => expense.expense_id === id) || null
    );
  }, [expenses, id]);

  if (isLoading || catLoading || load) return <LoadingScreen />;

  if (err || catError) {
    Swal.fire({
      icon: "error",
      title: "Network Error",
      text: "Error fetching expense data",
    });
  }

  return (
    <div className={`${cardBg} min-h-screen`}>
      <Header title="Expense Tracker" linksOption={ExpenseDetailLinksOption} />

      <div className="mt-5 w-[90%] mx-auto">
        <h2 className={`text-sm md:w-[80%] mx-auto ${textSecondary}`}>
          Expenses/{" "}
          <span className="font-semibold">{currentExpense?.name}</span>
        </h2>
        <h1
          className={`text-[22px] md:w-[80%] mx-auto mt-5 font-bold ${textPrimary}`}
        >
          {currentExpense?.name}
        </h1>

        <div
          className={`grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] mx-auto gap-x-5 mt-3 w-[100%] md:w-[80%]`}
        >
          <div className={`py-4 mt-5 border-t-2 ${borderColor}`}>
            <p className={`text-sm ${textSecondary}`}>Amount</p>
            <p className={`text-sm font-semibold ${textPrimary}`}>
              {currentExpense?.amount}
            </p>
          </div>

          <div className={`py-4 md:col-span-2 mt-5 border-t-2 ${borderColor}`}>
            <p className={`text-sm ${textSecondary}`}>Date</p>
            <p className={`text-sm font-semibold ${textPrimary}`}>
              {currentExpense?.date}
            </p>
          </div>

          <div className={`py-4 mt-5 border-t-2 ${borderColor}`}>
            <p className={`text-sm ${textSecondary}`}>Category</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {currentExpense?.category_IDs.map((categoryId: string) => {
                const cat = categories.find(
                  (c: TCategory) => c.category_id === categoryId
                );
                return cat ? (
                  <span
                    key={cat.category_id}
                    className={`flex items-center gap-2 px-2 py-1 rounded-md ${badgeBg} w-fit`}
                  >
                    {cat.cat_name}
                  </span>
                ) : null;
              })}
            </div>
          </div>

          <div className={`py-4 md:col-span-2 mt-5 border-t-2 ${borderColor}`}>
            <p className={`text-sm ${textSecondary}`}>Description</p>
            <p className={`text-sm font-semibold ${textPrimary}`}>
              {currentExpense?.description || "-"}
            </p>
          </div>

          <div className={`pt-4 mt-5 border-t-2 ${borderColor}`}>
            <p className={`text-sm ${textSecondary}`}>Necessity</p>
            <p
              className={`font-semibold ${
                currentExpense?.priority === "Low"
                  ? theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-800"
                  : currentExpense?.priority === "High"
                  ? theme === "dark"
                    ? "text-red-400"
                    : "text-red-500"
                  : theme === "dark"
                  ? "text-yellow-400"
                  : "text-yellow-500"
              }`}
            >
              {currentExpense?.priority || "Medium"}
            </p>
          </div>
        </div>

        <div className="flex justify-center md:justify-end gap-x-8 md:gap-x-4 mt-5 w-[80%] mx-auto">
          <Button
            onClick={() => setEditModal(true)}
            className={`${buttonEdit}`}
          >
            Edit
          </Button>
          <Button onClick={deleteExpense} className={`${buttonDelete}`}>
            Delete
          </Button>
        </div>
      </div>

      {isEditModal && currentExpense && (
        <>
          <Overlay />
          <EditExpense
            currentExpense={currentExpense}
            onClose={() => setEditModal(false)}
          />
        </>
      )}
    </div>
  );
}
