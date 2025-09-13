import { createContext } from "react";
type TTheme = "system" | "dark" | "light";

export const ThemeContext = createContext<{
  theme: string;
  setTheme?: (changeTheme: TTheme) => void;
}>({
  theme: "",
});
