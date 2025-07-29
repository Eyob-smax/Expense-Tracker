import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type TAnalyticsGraphProps = {
  data: { label: string; value: number }[];
  categoryData: { category: string; value: number }[];
  lineGraphLabel: string;
  spendingAmount: string;
  period: string;
  percentageChange: string;
};

export default function AnalyticsGraph({
  data,
  categoryData,
  lineGraphLabel,
  spendingAmount,
  period,
  percentageChange,
}: TAnalyticsGraphProps) {
  return (
    <div className="mt-5 flex flex-col md:flex-row   items-center gap-2 ">
      <div className="bg-white border-1  border-[#DBE0E5] shadow-md rounded-lg p-4 w-full md:w-1/2 ">
        <p className="text-sm text-gray-500">{lineGraphLabel}</p>
        <h2 className="text-3xl font-bold text-black mt-1">{spendingAmount}</h2>
        <p className="text-sm text-gray-400 mt-1">
          Last {period}{" "}
          <span
            className={
              percentageChange.includes("+")
                ? "text-green-500 font-semibold"
                : "text-red-500 font-semibold"
            }
          >
            {percentageChange}
          </span>
        </p>

        <div className="mt-4 h-28 ">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <filter
                  id="shadow"
                  x="-20%"
                  y="-20%"
                  width="150%"
                  height="300%"
                >
                  <feDropShadow
                    dx="0"
                    dy="5"
                    stdDeviation="3"
                    floodColor="#64748B"
                    floodOpacity="0.9"
                  />
                </filter>
              </defs>
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#64748B"
                strokeWidth={1.5}
                dot={false}
                filter="url(#shadow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between text-xs text-gray-400 font-semibold mt-2">
          {data.map((item) => (
            <span key={item.label}>{item.label}</span>
          ))}
        </div>
      </div>
      <div className=" bg-white border-1  border-[#DBE0E5] shadow-md rounded-lg p-4 w-full md:w-1/2">
        <h2 className="text-lg font-semibold ">Category Spending</h2>
        <div className="mt-4 h-48 ">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#DBE0E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
