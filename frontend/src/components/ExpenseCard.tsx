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
  return (
    <div {...rest}>
      <h2 className="text-sm ">{label}</h2>
      <h1 className="text-gray-600 mt-2 font-bold text-xl">${amount}</h1>
      {percentageChange && (
        <p className="text-gray-600 mt-2">
          <span style={{ color: percentageChange.color }}>
            {percentageChange.value}%
          </span>
        </p>
      )}
    </div>
  );
}
