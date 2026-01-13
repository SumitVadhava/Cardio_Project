"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored) {
        setTheme(stored);
        document.documentElement.setAttribute("data-theme", stored);
        return;
      }

      const prefersLight = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      const initial: Theme = prefersLight ? "light" : "dark";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    } catch (e) {
      /* ignore in SSR or private mode */
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, setTheme, toggleTheme } as const;
}
