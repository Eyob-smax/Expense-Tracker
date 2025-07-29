import type { ComponentProps } from "react";
import { Table } from "./ui/table";

type TTableProps = {
  headerArrays: string[];
  bodyArrays: string[][];
};

export default function TableComponent({
  headerArrays,
  bodyArrays,
  ...rest
}: TTableProps & ComponentProps<"div">) {
  return (
    <div {...rest}>
      <Table className="transaction_table ">
        <thead className="text-[#121417] text-left transaction_table_head">
          <tr>
            {headerArrays.map((header, index) => (
              <th key={index} className="px-4 py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[#61758A] ">
          {bodyArrays.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-[#E4E7EC]">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
