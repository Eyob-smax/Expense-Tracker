import { useContext, type ComponentProps } from "react";
import { Table } from "./ui/table";
import type { TCategory, TExpense } from "../types/types";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ThemeContext } from "../hooks/useThemeContext";

type TTableProps = {
  headerArrays: string[];
  bodyArrays: TExpense[] | TCategory[];
  forWhich?: "expense" | "category";
  pathForBody: "/expense" | "/categories/:id" | "/detail";
};

export default function TableComponent({
  headerArrays,
  bodyArrays,
  forWhich = "expense",
  pathForBody = "/detail",
  ...rest
}: TTableProps & ComponentProps<"div">) {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const colors =
    theme === "dark"
      ? [
          "bg-gray-800 text-gray-100",
          "bg-gray-700 text-gray-100",
          "bg-gray-600 text-gray-100",
          "bg-gray-500 text-gray-100",
        ]
      : [
          "bg-white text-gray-900",
          "bg-zinc-100 text-gray-900",
          "bg-amber-50 text-gray-900",
          "bg-gray-100 text-gray-900",
        ];

  let colorIndex = 0;
  const dateColorMap: Record<string, string> = {};

  const navigateToDetails = (id: string | number) => {
    switch (pathForBody) {
      case "/detail":
        navigate(`${id}`);
        break;
      case "/categories/:id":
        navigate(`/categories/${id}`);
        break;
      case "/expense":
        navigate(`/expenses/${id}`);
        break;
    }
  };

  const getRowColor = (dateStr: string) => {
    if (!dateColorMap[dateStr]) {
      dateColorMap[dateStr] = colors[colorIndex % colors.length];
      colorIndex++;
    }
    return dateColorMap[dateStr];
  };

  const getPriorityClass = (priority: string) => {
    if (theme === "dark") {
      switch (priority) {
        case "High":
          return "text-red-400";
        case "Medium":
          return "text-yellow-400";
        default:
          return "text-green-400";
      }
    } else {
      switch (priority) {
        case "High":
          return "text-red-500";
        case "Medium":
          return "text-yellow-500";
        default:
          return "text-green-500";
      }
    }
  };

  const tableClasses =
    theme === "dark"
      ? "transaction_table border border-gray-700 rounded-2xl overflow-hidden"
      : "transaction_table border border-gray-200 rounded-2xl overflow-hidden";

  const headerClasses =
    theme === "dark"
      ? "transaction_table_head bg-gray-800 text-gray-50 text-left"
      : "transaction_table_head bg-gray-100 text-gray-900 text-left";

  const textClasses = theme === "dark" ? "text-gray-300" : "text-gray-700";

  return (
    <div {...rest}>
      <Table className={tableClasses}>
        <thead className={headerClasses}>
          <tr>
            {headerArrays.map((header) => (
              <th key={header} className="px-4 py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={textClasses}>
          {forWhich === "expense"
            ? (bodyArrays as TExpense[]).map((row) => {
                const dateKey = new Date(row.date).toDateString();
                return (
                  <tr
                    key={row.expense_id}
                    className={`border-b ${
                      theme === "dark" ? "border-gray-700" : "border-gray-200"
                    } ${getRowColor(dateKey)}`}
                  >
                    <td className="px-4 py-2 max-w-[80px] overflow-hidden text-ellipsis">
                      {new Date(row.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2 max-w-[80px] overflow-hidden text-ellipsis">
                      {row.name}
                    </td>
                    <td className="px-4 py-2 max-w-[120px] overflow-hidden text-ellipsis">
                      {row.description || "-"}
                    </td>
                    <td className="px-4 py-2 max-w-[50px] overflow-hidden text-ellipsis">
                      {Number(row.amount) * Number(row.quantity)}
                    </td>
                    <td
                      className={`px-4 py-2 max-w-[50px] overflow-hidden text-ellipsis ${getPriorityClass(
                        row.priority
                      )}`}
                    >
                      {row.priority}
                    </td>
                    <td className="px-4 py-2 max-w-[50px] overflow-hidden text-ellipsis">
                      <Button
                        onClick={() => navigateToDetails(row.expense_id)}
                        className={`${
                          theme === "dark"
                            ? "bg-stone-600 text-gray-100"
                            : "bg-stone-800 text-white"
                        } px-4 py-1 rounded-md cursor-pointer`}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })
            : (bodyArrays as TCategory[]).map((row) => (
                <tr
                  key={row.category_id}
                  className={`border-b ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <td className="px-4 py-2">{row.cat_name}</td>
                  <td className="px-4 py-2">{row.relevance}</td>
                  <td className="px-4 py-2">{row.icon}</td>
                  <td className="px-4 py-2 max-w-[50px] overflow-hidden text-ellipsis">
                    <Button
                      onClick={() => navigateToDetails(row.category_id)}
                      className={`${
                        theme === "dark"
                          ? "bg-stone-600 text-gray-100"
                          : "bg-stone-800 text-white"
                      } px-4 py-1 rounded-md cursor-pointer`}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
        </tbody>
      </Table>
    </div>
  );
}
