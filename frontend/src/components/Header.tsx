import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import type { JSX } from "react";
import { v4 as uuidv4 } from "uuid";
type THeaderProps = {
  title: string;
  linksOption: Array<{
    label: string;
    path: string;
    element?: JSX.Element;
    specialStyle?: string;
  }>;
};

export default function Header({ title, linksOption }: THeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-3 py-2 border-b-[2px] border-b-[#E5E8EB]">
      <div>
        <h1 className="font-semibold">{title}</h1>
      </div>
      <FaBars className="sm:hidden text-2xl cursor-pointer" />
      <nav className="hidden sm:flex  ">
        <ul className="flex text-[#121417] font-semibold  items-center space-x-4">
          {linksOption.map(({ label, path, element, specialStyle }) => {
            if (label === "Login" || label === "Sign up") {
              return (
                <Link key={uuidv4()} to={path}>
                  <Button
                    key={uuidv4()}
                    className={
                      specialStyle ? specialStyle : "bg-stone-800 text-white"
                    }
                  >
                    {element ? element : label}
                  </Button>
                </Link>
              );
            }
            return element ? (
              element
            ) : (
              <Link
                to={path}
                className="hover:border-b-1 duration-75"
                key={uuidv4()}
              >
                {element ? element : label}
              </Link>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
