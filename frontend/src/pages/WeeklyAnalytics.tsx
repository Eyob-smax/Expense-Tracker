import AnalyticsGraph from "../components/AnalyticsGraph";

const catData = [
  { category: "Food", value: 400 },
  { category: "Transport", value: 200 },
  { category: "Utilities", value: 300 },
  { category: "Entertainment", value: 150 },
  { category: "Healthcare", value: 250 },
];

const data = [
  { label: "Mon", value: 300 },
  { label: "Tue", value: 250 },
  { label: "Wed", value: 150 },
  { label: "Thu", value: 220 },
];

export default function WeeklyAnalytics() {
  return (
    <AnalyticsGraph
      data={data}
      categoryData={catData}
      lineGraphLabel="Total Spent of the week"
      spendingAmount="$5,000"
      period={data.length.toString() + " weekly expenses"}
      percentageChange="-5%"
    />
  );
}
