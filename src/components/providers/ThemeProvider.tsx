"use client";

import React, { useEffect, useState } from "react";
import { useThemeStore } from "@/lib/stores/themeStore";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Apply light mode immediately on mount to prevent FOUC
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (currentTheme: string) => {
      root.classList.remove("light", "dark");

      if (currentTheme === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(currentTheme);
      }

      // Also set color-scheme for scrollbars and system UI
      if (
        currentTheme === "dark" ||
        (currentTheme === "system" && mediaQuery.matches)
      ) {
        root.style.colorScheme = "dark";
      } else {
        root.style.colorScheme = "light";
      }
    };

    // Apply theme immediately
    applyTheme(theme);

    // Listen for system theme changes if set to system
    const listener = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme]);

  // Render children immediately, theme will be applied via useEffect
  return <>{children}</>;
};
