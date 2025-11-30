"use client";

import { useTheme } from "next-themes";

export default function ThemeHandler() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex justify-end bg-white dark:bg-gray-900">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 m-2 rounded bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
