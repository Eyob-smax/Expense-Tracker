import { useEffect, useState } from "react";

type TTheme = "system" | "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<TTheme>("system");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as TTheme | null;
      if (stored) {
        setTheme(stored);
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    let applied: "light" | "dark";

    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      applied = prefersDark ? "dark" : "light";
    } else {
      applied = theme;
    }

    root.classList.add(applied);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, error, setTheme };
}
