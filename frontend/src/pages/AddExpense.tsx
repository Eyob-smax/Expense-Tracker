import { useFetcher, useActionData, useNavigation } from "react-router-dom";
import Header from "../components/Header";
import { ProfileIcon } from "../utils/constants";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { TAppDispatch, TRootState } from "../app/store";
import { useEffect } from "react";
import { fetchCategories } from "../features/category/categorySlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const addExpenselinksOption = [
  { label: "Home", path: "/" },
  { label: "Expenses", path: "/expenses" },
  { label: "Settings", path: "/settings" },
  { label: "Analytics", path: "/analytics" },
  ProfileIcon,
];

export default function AddExpense() {
  const fetcher = useFetcher();
  const { categories, isLoading } = useSelector(
    (state: TRootState) => state.category
  );
  const dispatch = useDispatch<TAppDispatch>();
  const navigate = useNavigate();
  const actionData = useActionData() as { error?: string } | undefined;
  const navigation = useNavigation();

  useEffect(() => {
    if (categories.length === 0) {
      (async () => {
        try {
          await dispatch(fetchCategories()).unwrap();
        } catch (err) {
          console.error("Failed to fetch categories:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch categories.",
          });
          navigate("/categories");
        }
      })();
    }
  }, [categories, dispatch, navigate]);

  if (fetcher.data && fetcher.data.error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: fetcher.data.error,
    });
    return null;
  }

  if (fetcher.data && fetcher.data.success) {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Expense added successfully!",
    });
    navigate("/expenses");
  }

  return (
    <div>
      <Header title="Expense Tracker" linksOption={addExpenselinksOption} />
      <h1 className="text-[22px] font-bold sm:pt-5 pt-10 sm:pb-5 pb-14 w-[80%] mx-auto">
        Add Expense
      </h1>
      {actionData?.error && (
        <div style={{ color: "red" }}>{actionData.error}</div>
      )}

      <fetcher.Form
        method="POST"
        action="/expenses/new"
        className="w-[80%] md:grid md:grid-cols-2 gap-x-5 mx-auto space-y-5"
      >
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="name">
            Title
          </label>
          <Input name="name" type="text" id="name" placeholder="Groceries" />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="price">
            Price
          </label>
          <Input name="price" id="price" type="number" placeholder="$15" />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="categoryIds">
            Categories
          </label>
          <select
            name="categoryIds"
            id="categoryIds"
            className="text-sm border-1 border-stone-800 p-2 rounded-md"
          >
            {isLoading ? (
              <option value="">Loading categories...</option>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.cat_name}
                </option>
              ))
            ) : (
              <option value="">No categories available</option>
            )}
          </select>
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="description">
            Description
          </label>
          <Input name="description" id="description" placeholder="Optional" />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="date">
            Date
          </label>
          <Input
            name="date"
            type="date"
            id="date"
            defaultValue={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="quantity">
            Quantity
          </label>
          <Input name="quantity" type="number" id="quantity" defaultValue={1} />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="currency">
            currency
          </label>
          <Input name="currency" type="text" id="currency" defaultValue="USD" />
        </div>
        <div className="w-full mt-5 flex flex-col md:w-[70%]">
          <Button
            variant="secondary"
            className="bg-stone-800 text-white"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "loading" || fetcher.state === "submitting"
              ? "Adding..."
              : "Create"}
          </Button>
        </div>
      </fetcher.Form>
    </div>
  );
}
