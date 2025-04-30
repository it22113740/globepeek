import React from "react";
import { useTheme } from "../context/themeProvider";
import { FaSun, FaMoon } from "react-icons/fa";


const NavBar = () => {
  const { darkMode, toggleTheme } = useTheme();


  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 shadow-lg ${
        darkMode
          ? "dark bg-gray-900"
          : "bg-gradient-to-r from-indigo-600 to-blue-500"
      } transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo/Title */}
        <a className="flex items-center gap-2 cursor-pointer" href="/">
          <span className="text-3xl">🌍</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-gray-100 tracking-tight">
            Globe Peek
          </h1>
        </a>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 dark:bg-gray-800 text-white dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-700 transition duration-200 shadow-md"
          aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
        >
          <span className="text-lg">
            {darkMode ? <FaSun /> : <FaMoon />}
          </span>
          <span className="hidden sm:block text-sm font-medium">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;