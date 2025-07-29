import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { Link } from "react-router-dom";
export default function UserForm({
  type = "signup",
}: {
  type?: "login" | "signup";
}) {
  return (
    <div className="flex items-center justify-center h-screen  w-[80%] mx-auto gap-x-10">
      <div className="flex-1 px-5 py-8 bg-white  rounded-lg shadow-md w-96 ">
        <h1 className="text-center font-bold text-[35px] mb-5">
          {type === "signup" ? "Sign up" : "Login"}
        </h1>
        {type === "signup" && (
          <div className="flex flex-col space-y-4 items-start leading-1 mb-5">
            <label
              htmlFor="Username"
              className="text-[15px] font-semibold text-stone-600"
            >
              User name
            </label>
            <Input className="" id="Username" placeholder="example@gmail.com" />
          </div>
        )}
        <div className="flex flex-col space-y-4 items-start leading-0 mb-5">
          <label
            htmlFor="email"
            className="text-[15px] font-semibold  text-stone-600"
          >
            Email
          </label>
          <Input className="" id="email" placeholder="example@gmail.com " />
        </div>
        <div className="flex flex-col space-y-4 items-start leading-1 mb-5">
          <label
            htmlFor="password"
            className="text-[15px] font-semibold text-stone-600"
          >
            Password
          </label>
          <Input className="" id="password" placeholder="example@gmail.com" />
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
          <Button className="flex-grow border border-gray-300">
            <FaGoogle /> Google
          </Button>
          <Button className="flex-grow border border-gray-300">
            <FaGithub /> Github
          </Button>
        </div>

        <div>
          <Button className="w-full mt-4 bg-stone-800 text-white ">
            {type === "signup" ? "Sign up" : "Login"}
          </Button>
        </div>
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
