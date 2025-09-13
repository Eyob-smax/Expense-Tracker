import { useTheme } from "../hooks/useTheme";
import { ThemeContext } from "../hooks/useThemeContext";

type TContextChild = {
  children: React.ReactNode;
};

export default function ContextProvider({ children }: TContextChild) {
  const { theme, setTheme } = useTheme();

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
