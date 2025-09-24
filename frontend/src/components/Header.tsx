import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { useContext, type JSX } from "react";
import { ThemeContext } from "../hooks/useThemeContext";
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
  const { theme } = useContext(ThemeContext);

  return (
    <header className="w-full flex items-center justify-between px-3 py-2 border-b-[2px] border-b-[#E5E8EB]">
      <div>
        <h1 className="font-semibold">{title}</h1>
      </div>
      <FaBars className="sm:hidden text-2xl cursor-pointer" />
      <nav className="hidden sm:flex  ">
        <ul
          className={`flex ${
            theme === "light" || theme === "system"
              ? "text-[#121417]"
              : "text-[#f5f7fa]"
          } font-semibold items-center space-x-4`}
        >
          {linksOption.map(({ label, path, element, specialStyle }) => {
            const uniqueKey = `${label}-${path}`;
            return (
              <li key={uniqueKey}>
                {label === "Login" || label === "Sign up" ? (
                  <NavLink to={path}>
                    <Button
                      className={
                        specialStyle
                          ? specialStyle
                          : theme === "light" || theme === "system"
                          ? "bg-white text-stone-800 border border-stone-800"
                          : "bg-stone-800 text-white"
                      }
                    >
                      {element ? element : label}
                    </Button>
                  </NavLink>
                ) : element ? (
                  <>{element}</>
                ) : (
                  <NavLink to={path} className="hover:border-b-1 duration-75">
                    {label}
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
