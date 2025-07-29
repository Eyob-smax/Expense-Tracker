import AnalyticsGraph from "../components/AnalyticsGraph";

const catData = [
  { category: "Food", value: 400 },
  { category: "Transport", value: 200 },
  { category: "Utilities", value: 300 },
  { category: "Entertainment", value: 150 },
  { category: "Healthcare", value: 250 },
];

const data = [
  { label: "Jan", value: 3000 },
  { label: "Feb", value: 2500 },
  { label: "Mar", value: 1500 },
  { label: "Apr", value: 2200 },
  { label: "May", value: 2700 },
  { label: "Jun", value: 600 },
  { label: "Jul", value: 800 },
  { label: "Aug", value: 900 },
  { label: "Sep", value: 1100 },
  { label: "Oct", value: 1300 },
  { label: "Nov", value: 1400 },
  { label: "Dec", value: 1600 },
];

export default function MonthlyAnalytics() {
  return (
    <AnalyticsGraph
      data={data}
      categoryData={catData}
      lineGraphLabel="Total Spent of the month"
      spendingAmount="$10,000"
      period={data.length.toString() + " monthly expenses"}
      percentageChange="+10%"
    />
  );
}
