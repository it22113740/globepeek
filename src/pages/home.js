import React, { useEffect, useState } from "react";
import CountryService from "../services/CountryService";
import CountryCard from "../components/Country/countryCard";
import { useTheme } from "../context/themeProvider";

const ITEMS_PER_PAGE = 20;

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [regionFilter, setRegionFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const { darkMode } = useTheme();

  useEffect(() => {
    CountryService.getAllCountries()
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const getPaginationRange = (currentPage, totalPages, maxVisible = 5) => {
    const delta = Math.floor(maxVisible / 2);
    let start = Math.max(2, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);

    if (currentPage <= delta) {
      end = Math.min(totalPages - 1, maxVisible);
    }

    if (currentPage + delta >= totalPages) {
      start = Math.max(2, totalPages - maxVisible + 1);
    }

    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (start > 2) range.unshift("...");
    if (end < totalPages - 1) range.push("...");

    return [1, ...range, totalPages];
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);

    if (value.length > 0) {
      const filtered = countries
        .filter((country) =>
          country.name.common.toLowerCase().includes(value.toLowerCase())
        )
        .map((c) => c.name.common)
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name) => {
    setSearchQuery(name);
    setSuggestions([]);
    setCurrentPage(1);
  };

  const handleRegionChange = (e) => {
    setRegionFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleLanguageChange = (e) => {
    setLanguageFilter(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setRegionFilter("");
    setLanguageFilter("");
    setSuggestions([]);
    setCurrentPage(1);
  };

  const filteredCountries = countries.filter((country) => {
    const matchName = country.name.common
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchRegion = regionFilter ? country.region === regionFilter : true;
    const matchLanguage = languageFilter
      ? Object.values(country.languages || {}).includes(languageFilter)
      : true;
    return matchName && matchRegion && matchLanguage;
  });

  const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCountries = filteredCountries.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const regions = [...new Set(countries.map((c) => c.region))].filter(Boolean);
  const allLanguages = [
    ...new Set(countries.flatMap((c) => Object.values(c.languages || {}))),
  ].filter(Boolean);

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "dark bg-gray-900"
          : "bg-gradient-to-br from-indigo-50 to-blue-100"
      } pt-16 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Explore the World
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Discover countries by name, region, or language
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 sticky top-16 z-30">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search country by name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              />
              {suggestions.length > 0 && (
                <ul className="absolute top-full mt-2 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden z-20">
                  {suggestions.map((name, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(name)}
                      className="px-4 py-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <select
              value={regionFilter}
              onChange={handleRegionChange}
              className="w-full sm:w-48 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            >
              <option value="">All Regions</option>
              {regions.map((region, index) => (
                <option key={index} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <select
              value={languageFilter}
              onChange={handleLanguageChange}
              className="w-full sm:w-48 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            >
              <option value="">All Languages</option>
              {allLanguages.map((lang, index) => (
                <option key={index} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 shadow-md"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Country Grid */}
        {currentCountries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {currentCountries.map((country) => (
              <div
                key={country.cca3}
                className="transform transition-transform duration-300 hover:scale-105"
              >
                <CountryCard country={country} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-300">
              No countries found. Try adjusting your filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition duration-200"
            >
              Previous
            </button>

            {getPaginationRange(currentPage, totalPages).map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && goToPage(page)}
                disabled={page === "..."}
                className={`px-4 py-2 rounded-lg ${
                  page === currentPage
                    ? "bg-indigo-600 text-white"
                    : page === "..."
                    ? "bg-transparent text-gray-500 dark:text-gray-400 cursor-default"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                } transition duration-200`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;