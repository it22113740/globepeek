import React from "react";
import { useTheme } from "../context/themeProvider";
import { FaSun, FaMoon } from "react-icons/fa"; // Icons

const NavBar = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className={`${darkMode ? "dark" : ""} bg-gray-100 dark:bg-gray-800 py-4`}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-white text-center w-full">
          🌍 Globe Peek
        </h1>
        <button
          onClick={toggleTheme}
          className="absolute right-6 px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-300 flex items-center gap-2"
        >
          {/* 🌙 Icon when in light mode, 🌞 icon when in dark mode */}
          <span className="block md:hidden">
            {darkMode ? <FaSun /> : <FaMoon />}
          </span>
          {/* Text label on md+ screens only */}
          <span className="hidden md:block">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
