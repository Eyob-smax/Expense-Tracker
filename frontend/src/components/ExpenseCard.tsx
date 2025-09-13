import { useContext } from "react";
import { ThemeContext } from "../hooks/useThemeContext";

type TCardProps = {
  amount: string;
  label: string;
  percentageChange?: { color: string; value: string };
};

export default function ExpenseCard({
  amount,
  label,
  percentageChange,
  ...rest
}: TCardProps & React.ComponentProps<"div">) {
  const { theme } = useContext(ThemeContext);

  return (
    <div {...rest}>
      <h2 className="text-sm ">{label}</h2>
      <h1
        className={`${
          theme === "light" ? "text-gray-600" : "text-gray-100"
        } mt-2 font-bold text-xl`}
      >
        ${amount}
      </h1>
      {percentageChange && (
        <p
          className={`${
            theme === "light" ? "text-gray-600" : "text-gray-100"
          } mt-2`}
        >
          <span style={{ color: percentageChange.color }}>
            {percentageChange.value}%
          </span>
        </p>
      )}
    </div>
  );
}
