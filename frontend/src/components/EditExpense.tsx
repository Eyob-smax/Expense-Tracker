import { useFetcher } from "react-router-dom";
import type { TExpense } from "../types/types";
import { Input } from "./ui/input";
import { useSelector } from "react-redux";
import type { TRootState } from "../app/store";
import { FaTimes } from "react-icons/fa";
import { Button } from "./ui/button";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function EditExpense({
  currentExpense,
  onClose,
}: {
  currentExpense: TExpense;
  onClose: () => void;
}) {
  const { categories, isLoading } = useSelector(
    (state: TRootState) => state.category
  );
  const [categoryIds, setCategories] = useState<string[]>(
    currentExpense.category_IDs || []
  );
  const fetcher = useFetcher({
    key: `edit-expense-${currentExpense.expense_id}`,
  });
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.value;
    if (
      selectedCategoryId &&
      selectedCategoryId !== "choose category" &&
      !categoryIds.includes(selectedCategoryId)
    ) {
      setCategories((prev) => [...prev, selectedCategoryId]);
    }
  };

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCategories(currentExpense.category_IDs || []);
  }, [currentExpense]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Expense updated successfully",
          timer: 1500,
        }).then(() => {
          onClose();
        });
      } else if (fetcher.data.error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: fetcher.data.error || "Failed to update expense",
        });
      }
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <div className="w-[90%] overflow-auto md:w-[80%] mx-auto z-100 bg-white inset-0 h-[80%] absolute top-[12%] bottom-[10%]">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Edit Expense</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>

      <fetcher.Form
        action={`/expenses/${currentExpense.expense_id}`}
        method="post"
        className="w-[70%] mx-[10%] my-3 md:grid md:grid-cols-2 gap-x-5 space-y-5"
      >
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="title">
            Title
          </label>
          <Input
            name="title"
            id="title"
            type="text"
            placeholder="Groceries"
            defaultValue={currentExpense.name}
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
            defaultValue={currentExpense.amount}
            required
          />
        </div>
        <div className="flex self-start flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="categoryIds">
            Categories
          </label>
          <select
            id="categoryIds"
            defaultValue="choose category"
            className="text-sm border-1 border-stone-800 p-2 rounded-md"
            onChange={handleCategoryChange}
          >
            <option value="choose category" disabled>
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
          <Input
            name="description"
            id="description"
            type="text"
            placeholder="Enter description"
            defaultValue={currentExpense.description || "-"}
          />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="date">
            Date
          </label>
          <Input
            name="date"
            id="date"
            type="date"
            defaultValue={currentExpense.date}
          />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="priority">
            Priority
          </label>
          <select
            name="priority"
            id="priority"
            defaultValue={currentExpense.priority || "Medium"}
            className="text-sm border-1 border-stone-800 p-2 rounded-md"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="quantity">
            Quantity
          </label>
          <Input
            name="quantity"
            id="quantity"
            type="text"
            placeholder="Enter quantity"
            defaultValue={currentExpense.quantity || "1"}
          />
        </div>
        <div className="flex flex-col gap-y-2 w-full md:w-[70%]">
          <label className="font-semibold" htmlFor="currency">
            Currency
          </label>
          <Input
            name="currency"
            id="currency"
            type="text"
            placeholder="Enter currency"
            defaultValue={currentExpense.currency || "-"}
          />
        </div>
        <Input
          type="hidden"
          name="categoryIds"
          value={JSON.stringify(categoryIds)}
        />
        <div className="flex flex-col my-auto gap-y-2 w-full md:w-[70%]">
          <Button
            type="submit"
            className="bg-stone-800 w-full mt-4 text-white px-4 py-2 rounded-md"
            disabled={fetcher.state !== "idle"} // Disable during submission
          >
            {fetcher.state === "submitting" ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </fetcher.Form>
      {screenWidth > 600 && categoryIds.length > 0 && (
        <div className="absolute top-[19%] text-sm p-2 rounded-md left-[73%] w-[200px] space-y-3 space-x-3">
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

export default React.memo(EditExpense);
