import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useFetcher, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  setLoginData,
  signUpWithGithub,
  signUpWithGoogle,
} from "../features/auth/authSlice";
import type { TAppDispatch, TRootState } from "../app/store";
import { supabase } from "../supabase/supabaseClient";
import LoadingScreen from "./LoadingScreen";
export default function UserForm({
  type = "signup",
}: {
  type?: "login" | "signup";
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fetcher = useFetcher();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<TAppDispatch>();
  const navigate = useNavigate();

  const { error } = useSelector((state: TRootState) => state.auth);
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/overview");
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (fetcher.data?.success) {
      const userData = {
        username: fetcher.data.user.username,
        email: fetcher.data.user.email,
        profilePicture: fetcher.data.user.profilePicture,
      };
      dispatch(setLoginData(userData));
      if (type === "signup") {
        Swal.fire({
          icon: "success",
          title: "Confirm your email!!",
          text: "User registered successfully, please click the confirm your email link sent to your email address.",
        });
      }
      navigate("/overview");
    } else if (fetcher.data?.error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: fetcher.data.error,
      });
    }
  }, [fetcher.data, dispatch, navigate, type]);

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error,
    });
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex items-center justify-center h-screen  w-[80%] mx-auto gap-x-10">
      <div className="flex-1 px-5 py-8 bg-white  rounded-lg shadow-md w-96 ">
        <h1 className="text-center font-bold text-[35px] mb-5">
          {type === "signup" ? "Sign up" : "Login"}
        </h1>
        <fetcher.Form method="post">
          {type === "signup" && (
            <div className="flex flex-col space-y-4 items-start leading-1 mb-5">
              <label
                htmlFor="username"
                className="text-[15px] font-semibold text-stone-600"
              >
                User name
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className=""
                name="username"
                id="username"
                placeholder="John Doe"
              />
            </div>
          )}
          <div className="flex flex-col space-y-4 items-start leading-0 mb-5">
            <label
              htmlFor="email"
              className="text-[15px] font-semibold  text-stone-600"
            >
              Email
            </label>
            <Input
              className=""
              id="email"
              placeholder="example@gmail.com"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-4 items-start leading-1 mb-5">
            <label
              htmlFor="password"
              className="text-[15px] font-semibold text-stone-600"
            >
              Password
            </label>
            <Input
              className=""
              id="password"
              name="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 mt-4 justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms" className="ml-2 text-[13px]">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-500">
                  Terms of Service
                </Link>
              </label>
            </div>
            {type === "login" && (
              <div>
                <Link
                  to="/password-recovery"
                  className=" text-sm font-semibold text-stone-600"
                >
                  Forgot password?
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center mt-5 mb-3">
            <div className="flex items-center w-full max-w-md font-semibold">
              <div className="flex-grow border-t border-stone-900"></div>
              <span className="mx-4 text-gray-700 whitespace-nowrap">
                or with
              </span>
              <div className="flex-grow border-t border-stone-900"></div>
            </div>
          </div>

          <div className="w-full flex items-center justify-center space-x-4">
            <Button
              type="button"
              onClick={() => dispatch(signUpWithGoogle())}
              className="flex-grow border border-gray-300"
            >
              <FaGoogle /> Google
            </Button>
            <Button
              type="button"
              onClick={() => dispatch(signUpWithGithub())}
              className="flex-grow border border-gray-300"
            >
              <FaGithub /> Github
            </Button>
          </div>
          <Input type="hidden" name="type" value={type} />

          <div>
            <Button
              type="submit"
              className="w-full mt-4 bg-stone-800 text-white "
            >
              {fetcher.state === "submitting" && type === "signup"
                ? "Sending confirmation email..."
                : type === "login"
                ? "Login"
                : "Sign up"}
            </Button>
          </div>
        </fetcher.Form>
      </div>

      <div className="h-[75vh] w-[5px] bg-black"></div>
      <div className="w-[50%] hidden  md:flex flex-col items-start justify-center space-y-4 mt-10">
        <h1 className="font-bold text-5xl">
          Start Building Better Money Habits Today
        </h1>
        <img className="max-w-xs" src="src/assets/signup.png" alt="" />
      </div>
    </div>
  );
}
