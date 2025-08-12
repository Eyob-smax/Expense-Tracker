import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { ProfileIcon } from "../utils/constants";
import { use, useEffect, useState } from "react";
import useCheckAuth from "../hooks/useCheckAuth";

const LinkOptions = [
  { tabIndex: 1, label: "Daily", path: "/analytics/daily" },
  { tabIndex: 2, label: "Weekly", path: "/analytics/weekly" },
  { tabIndex: 3, label: "Monthly", path: "/analytics/monthly" },
];

const headerLinksOption = [
  { label: "Home", path: "/" },
  { label: "Expenses", path: "/expenses" },
  { label: "Settings", path: "/settings" },
  { label: "Analytics", path: "/analytics" },
  ProfileIcon,
];

export default function AnalyticsOverview() {
  const [activeTab, setActiveTab] = useState("daily");
  const navigate = useNavigate();
  useCheckAuth();

  useEffect(() => {
    navigate("/analytics/daily");
  }, [navigate]);

  return (
    <div>
      <Header title="Expenses Tracker" linksOption={headerLinksOption} />
      <div className="mt-4 w-[80%] mx-auto">
        <h1 className="text-2xl font-semibold">Analytics & Reports</h1>
        <nav className="mt-3">
          <ul className="flex items-center justify-between gap-x-3 bg-[#F0F2F5] text-white text-sm rounded-lg px-1 py-[4px]">
            {LinkOptions.map((option) => (
              <Link
                onClick={() => setActiveTab(option.label.toLowerCase())}
                key={option.tabIndex}
                className={`flex-1 ${
                  activeTab === option.label.toLowerCase()
                    ? "bg-white  rounded-md  text-[#61738A]"
                    : "text-white"
                }`}
                to={option.path}
              >
                <li className="px-4 flex-1 text-center py-1 text-[#61738A]">
                  {option.label}
                </li>
              </Link>
            ))}
          </ul>
          <div>
            <Outlet />
          </div>
        </nav>
      </div>
    </div>
  );
}
