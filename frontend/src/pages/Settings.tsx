import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { Switch } from "../components/ui/switch";
import { ProfileIcon } from "../utils/constants";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutUser } from "../features/auth/authSlice";
import type { TAppDispatch } from "../app/store";
import Swal from "sweetalert2";
import { ThemeContext } from "../hooks/useThemeContext";

const SettingHeaderLists = [
  { path: "/expenses", label: "Expenses" },
  { label: "Home", path: "/" },
  { label: "Analytics", path: "/analytics" },
  { label: "Overview", path: "/overview" },
  { label: "Categories", path: "/categories" },
  { label: "About", path: "/about" },
  ProfileIcon,
];

export default function Settings() {
  const { setTheme, theme } = useContext(ThemeContext);

  const [emailChecked, setEmailChecked] = useState(false);
  const [darkModeChecked, setDarkModeChecked] = useState(theme === "dark");
  const dispatch = useDispatch<TAppDispatch>();
  const navigate = useNavigate();
  const logout = async () => {
    const { isConfirmed } = await Swal.fire({
      icon: "question",
      title: "Are you sure",
      text: "You're about to log out!",
      confirmButtonText: "Log out",
      confirmButtonColor: "red",
      cancelButtonText: "Stay",
      showCancelButton: true,
    });
    if (!isConfirmed) return;
    dispatch(logOutUser());
    navigate("/login");
  };

  useEffect(() => {
    if (darkModeChecked) {
      setTheme!("dark");
    } else {
      setTheme!("light");
    }
  }, [darkModeChecked, setTheme]);

  return (
    <div>
      <Header title="Expense Tracker" linksOption={SettingHeaderLists} />
      <h1 className="font-bold text-[22px] mt-8 mb-4 px-4 md:w-[80%] mx-auto">
        Settings
      </h1>
      <div className="w-full md:w-1/2 md:ml-32 px-4">
        <h2 className="font-bold text-[16px] mt-8 mb-4">Notification</h2>
        <div className="flex px-3  items-center justify-between mx-auto mb-8">
          <div className="space-y-1">
            <h3 className="font-semibold text-[15px]">Daily Email Summary</h3>
            <p className="text-[14px]">
              Get a daily summary of your expenses via email.
            </p>
          </div>
          <Switch
            checked={emailChecked}
            onCheckedChange={setEmailChecked}
            className={
              emailChecked
                ? "bg-stone-500  border-1 shadow-md shadow-slate-900/5 border-[#E5E8EB]"
                : "bg-[#F0F2F5] border-1 shadow-md shadow-slate-900/5 border-[#E5E8EB]"
            }
          />
        </div>
        <h2 className="font-bold text-[16px] mt-8 mb-4">Appearance</h2>
        <div className="flex px-3  items-center justify-between mx-auto mb-8">
          <div className="space-y-1">
            <h3 className="font-semibold text-[15px]">Dark mode</h3>
          </div>
          <Switch
            checked={darkModeChecked}
            onCheckedChange={setDarkModeChecked}
            className={
              darkModeChecked
                ? "bg-stone-500  border-1 shadow-md shadow-slate-900/5 border-[#E5E8EB]"
                : "bg-[#F0F2F5] border-1 shadow-md shadow-slate-900/5 border-[#E5E8EB]"
            }
          />
        </div>
        <h2 className="font-bold text-[16px] mt-8 mb-4">Account</h2>
        <div
          onClick={logout}
          className="flex px-3 cursor-pointer items-center justify-between mx-auto mb-8"
        >
          <div className="space-y-1">
            <h3 className="font-semibold text-[15px] text-red-500">Log out</h3>
          </div>
          <ArrowRight />
        </div>
      </div>
    </div>
  );
}
