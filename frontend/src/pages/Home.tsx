import { useEffect } from "react";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabase/supabaseClient";
import type { TAppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { setLoginData } from "../features/auth/authSlice";
import useSetUser from "../hooks/useSetUser";
import Swal from "sweetalert2";
const headerLinks = [
  { label: "Overview", path: "/overview" },
  { label: "Analytics", path: "analytics" },
  { label: "settings", path: "settings" },
  { label: "About", path: "/about" },
  { label: "Login", path: "/login" },
];

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch<TAppDispatch>();
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (_event === "PASSWORD_RECOVERY") {
          Swal.fire({
            icon: "success",
            title: "Password Recovery Email Sent",
            text: "Please check your email for further instructions.",
          });
          navigate("/update-password");
        }
        if (session?.user) {
          dispatch(
            setLoginData({
              username:
                session.user.user_metadata?.user_name ||
                session.user.user_metadata?.name,
              email: session.user.email,
              profilePicture: session.user.user_metadata?.avatar_url,
            })
          );
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [dispatch]);

  useSetUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Header
        key={uuidv4()}
        linksOption={headerLinks}
        title="Expense Tracker"
      />
      <main className="flex-1 flex-col md:flex md:flex-row items-center justify-center w-[80%]  sm:w-[65%]">
        <div className="p-4 flex items-center justify-center">
          <img src="src\assets\homePageBg.png" alt="Expense Tracker" />
        </div>
        <div className="text-left font-inter text-[#121417]">
          <h1 className="font-semibold text-[25px] sm:text-[48px]  leading-tight">
            Track Your Expenses, Achieve Your Goals
          </h1>
          <p>
            Gain insights into your spending habits, set budgets, and reach your
            financial milestones with our intuitive expense tracker.
          </p>
          <Link to={"/signup"}>
            <Button className="bg-blue-500 w-full cursor-pointer shadow-md font-bold  text-white px-4 py-2 rounded mt-4">
              Get Started
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
