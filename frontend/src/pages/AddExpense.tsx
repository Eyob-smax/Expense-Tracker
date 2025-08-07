import { useFetcher, useActionData, useNavigation } from "react-router-dom";
import Header from "../components/Header";
import { ProfileIcon } from "../utils/constants";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { TAppDispatch, TRootState } from "../app/store";
import { useEffect, useState } from "react";
import { fetchCategories } from "../features/category/categorySlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

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
  const [categoryIds, setCategories] = useState<string[]>([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
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

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [categories]);
  useEffect(() => {
    if (fetcher.data && fetcher.data.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: fetcher.data.error,
      });
    } else if (fetcher.data && fetcher.data.success) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Expense added successfully!",
      });
      navigate("/expenses");
    }
  }, [fetcher.data, navigate]);

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedValue = event.target.value;
    if (
      selectedValue &&
      selectedValue !== "choose category" &&
      !categoryIds.includes(selectedValue)
    ) {
      setCategories((prev: string[]) => [...prev, selectedValue]);
    }
  }

  return (
    <div>
      <Header title="Expense Tracker" linksOption={addExpenselinksOption} />
      <h1 className="text-[22px] font-bold sm:pt-5 pt-5 sm:pb-5 pb-5 w-[80%] mx-auto">
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
          <Input
            name="name"
            type="text"
            id="name"
            placeholder="Groceries"
            required
          />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="price">
            Price
          </label>
          <Input
            name="price"
            id="price"
            type="number"
            placeholder="$15"
            required
          />
        </div>
        <div className="flex self-start flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="categoryIds">
            Categories
          </label>
          <select
            id="categoryIds"
            className="text-sm border-1 border-stone-800 p-2 rounded-md"
            onChange={handleCategoryChange}
          >
            <option value="choose category" disabled selected>
              Choose category
            </option>
            {isLoading ? (
              <option value="" disabled>
                Loading categories...
              </option>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.cat_name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No categories available
              </option>
            )}
          </select>
          {categoryIds.length > 0 && screenWidth < 600 && (
            <div className="flex gap-x-1 gap-y-2 flex-wrap max-w-[70%]">
              {categoryIds.map((id: string) => (
                <div
                  className="flex items-center gap-2 px-1 rounded-md border-stone-300 border-1 text-black"
                  key={id}
                >
                  <Button
                    type="button"
                    onClick={() =>
                      setCategories((prev) =>
                        prev.filter((catId) => catId !== id)
                      )
                    }
                  >
                    {categories.find((cat) => cat.category_id === id)
                      ?.cat_name || "Unknown Category"}
                    <FaTimes className="text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
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
            required
          />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="quantity">
            Quantity
          </label>
          <Input
            name="quantity"
            type="number"
            id="quantity"
            defaultValue={1}
            required
          />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="currency">
            Currency
          </label>
          <Input
            name="currency"
            type="text"
            id="currency"
            defaultValue="USD"
            required
          />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="priority">
            Priority
          </label>
          <Input
            name="priority"
            type="text"
            id="priority"
            defaultValue="Low"
            required
          />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
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
        <Input
          type="hidden"
          name="categoryIds"
          value={JSON.stringify(categoryIds)}
        />
      </fetcher.Form>
      {screenWidth > 600 && categoryIds.length > 0 && (
        <div className="absolute top-[19%] text-sm  p-2 rounded-md left-[83%] w-[200px] space-y-3 space-x-3">
          {categoryIds.map((id: string) => (
            <div
              className="flex items-center gap-2 px-1 rounded-md border-stone-300 border-1 text-black"
              key={id}
            >
              <Button
                type="button"
                onClick={() =>
                  setCategories((prev) => prev.filter((catId) => catId !== id))
                }
              >
                {categories.find((cat) => cat.category_id === id)?.cat_name ||
                  "Unknown Category"}
                <FaTimes className="text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
