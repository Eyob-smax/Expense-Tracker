import type { ComponentProps } from "react";
import { Table } from "./ui/table";
import type { TCategory, TExpense } from "../types/types";

type TTableProps = {
  headerArrays: string[];
  bodyArrays: TExpense[] | TCategory[];
  forWhich?: "expense" | "category";
};

export default function TableComponent({
  headerArrays,
  bodyArrays,
  forWhich = "expense",
  ...rest
}: TTableProps & ComponentProps<"div">) {
  return (
    <div {...rest}>
      <Table className="transaction_table ">
        <thead className="text-[#121417] text-left transaction_table_head">
          <tr>
            {headerArrays.map((header) => (
              <th key={header} className="px-4 py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        {forWhich === "expense" ? (
          <tbody className="text-[#61758A] ">
            {(bodyArrays as TExpense[]).map((row) => (
              <tr key={row.expense_id} className="border-b border-[#E4E7EC]">
                <td className="px-4 py-2">
                  {new Date(row.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2">{row.description || "-"}</td>
                <td className="px-4 py-2">{row.amount}</td>
                <td className="px-4 py-2">{row.currency}</td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody className="text-[#61758A] ">
            {(bodyArrays as TCategory[]).map((row: TCategory) => (
              <tr key={row.category_id} className="border-b border-[#E4E7EC]">
                <td className="px-4 py-2">{row.cat_name}</td>
                <td className="px-4 py-2">{row.user_id}</td>
                <td className="px-4 py-2">{row.icon}</td>
                <td className="px-4 py-2">Edit/Delete</td>
              </tr>
            ))}
          </tbody>
        )}
      </Table>
    </div>
  );
}
