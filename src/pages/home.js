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

    if (start > 2) {
      range.unshift("...");
    }
    if (end < totalPages - 1) {
      range.push("...");
    }

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
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors">

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-6 items-center">
          <input
            type="text"
            placeholder="Search country by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-3 rounded-lg border w-full max-w-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            onChange={handleRegionChange}
            value={regionFilter}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Regions</option>
            {regions.map((region, index) => (
              <option key={index} value={region}>
                {region}
              </option>
            ))}
          </select>
          <select
            onChange={handleLanguageChange}
            value={languageFilter}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Filters
          </button>
        </div>

        {/* Auto-suggestions */}
        {suggestions.length > 0 && (
          <div className="flex justify-center">
            <ul className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 w-full max-w-sm rounded-lg shadow-lg">
              {suggestions.map((name, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(name)}
                  className="p-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 text-sm dark:text-white"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Country Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10 mt-4">
          {currentCountries.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center space-x-2 gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              Previous
            </button>

            {getPaginationRange(currentPage, totalPages).map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && goToPage(page)}
                disabled={page === "..."}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : page === "..."
                    ? "bg-transparent text-gray-500 cursor-default"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
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
