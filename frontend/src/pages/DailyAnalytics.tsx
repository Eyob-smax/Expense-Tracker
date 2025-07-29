import AnalyticsGraph from "../components/AnalyticsGraph";

const catData = [
  { category: "Food", value: 400 },
  { category: "Transport", value: 200 },
  { category: "Utilities", value: 300 },
  { category: "Entertainment", value: 150 },
  { category: "Healthcare", value: 250 },
];

const data = [
  { label: "1pm", value: 300 },
  { label: "2pm", value: 250 },
  { label: "3pm", value: 150 },
  { label: "4pm", value: 220 },
  { label: "5pm", value: 270 },
  { label: "6pm", value: 60 },
];
export default function DailyAnalytics() {
  return (
    <>
      <AnalyticsGraph
        data={data}
        categoryData={catData}
        lineGraphLabel="Total Spent of the day"
        spendingAmount="$2,500"
        period={data.length.toString() + " daily expenses"}
        percentageChange="+15%"
      />
    </>
  );
}
