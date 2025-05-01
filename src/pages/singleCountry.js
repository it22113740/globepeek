import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CountryService from "../services/CountryService";
import { fetchCountryImages } from "../services/upsplashService";
import { fetchVideoByCountry } from "../services/youtubeService";
import FavoriteButton from "../components/Country/favouriteButton";
import WeatherCard from "../components/Country/weatherCard";
import {
  UsersIcon,
  GlobeAltIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon,
  LanguageIcon,
  ArrowLeftIcon,
  MapIcon,
  ArrowTopRightOnSquareIcon,
  MapPinIcon,
  ClockIcon,
  GlobeAsiaAustraliaIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { jsPDF } from "jspdf";
import { useTheme } from "../context/themeProvider";
import TopDestinations from "../components/Country/topDestinations";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    {icon}
    <div>
      <span className="font-semibold text-gray-800 dark:text-gray-200">
        {label}:
      </span>
      <span className="text-gray-600 dark:text-gray-400 ml-1">
        {value || "N/A"}
      </span>
    </div>
  </div>
);

const SingleCountry = () => {
  const { countryName } = useParams();
  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [selectedLang, setSelectedLang] = useState("");
  const [video, setVideo] = useState(null);
  const [images, setImages] = useState([]);
  const { darkMode } = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (img) => {
    setSelectedImage(img);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    CountryService.getCountryByName(countryName)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          setCountry(data);

          fetchCountryImages(`Scenic tourist attractions in ${data.name.common}`, 5)
            .then((images) => setImages(images))
            .catch((error) =>
              console.error("Error fetching country images:", error)
            );

          fetchVideoByCountry(data.name.common)
            .then((video) => setVideo(video))
            .catch((error) =>
              console.error("Error fetching country video:", error)
            );

          if (data.borders?.length) {
            Promise.all(
              data.borders.map((code) => CountryService.getCountryByCode(code))
            ).then((responses) => {
              const names = responses.map((r) => r.data[0]?.name.common);
              setBorderCountries(names);
            });
          } else {
            setBorderCountries([]);
          }
        }
      })
      .catch((error) => console.error("Error fetching country:", error));
  }, [countryName]);

  const [lat, lng] = country?.latlng || [0, 0];

  const handleExportPDF = () => {
    const doc = new jsPDF();
  
    // Set title
    doc.setFontSize(18);
    doc.text(`${country.name.common} - Country Information`, 10, 10);
  
    // Set country flag
    if (country.flags?.png) {
      doc.addImage(country.flags.png, "PNG", 10, 20, 30, 20);
    }
  
    // Add country population
    doc.setFontSize(12);
    doc.text(`Population: ${country.population?.toLocaleString() || "N/A"}`, 10, 50);
    
    // Region and subregion
    doc.text(`Region: ${country.region}`, 10, 60);
    doc.text(`Subregion: ${country.subregion || "N/A"}`, 10, 70);
  
    // Capital city
    doc.text(`Capital: ${country.capital?.[0] || "N/A"}`, 10, 80);
  
    // Currency and language
    doc.text(`Currency: ${Object.values(country.currencies || {})[0]?.name || "N/A"}`, 10, 90);
    doc.text(`Languages: ${Object.values(country.languages || {}).join(", ") || "N/A"}`, 10, 100);
    
    // Area and timezones
    doc.text(`Area: ${country.area?.toLocaleString()} km²`, 10, 110);
    doc.text(`Timezones: ${country.timezones?.join(", ") || "N/A"}`, 10, 120);
  
    // Top-level domain and driving side
    doc.text(`Top-level domain: ${country.tld?.join(", ") || "N/A"}`, 10, 130);
    doc.text(`Driving Side: ${country.car?.side || "N/A"}`, 10, 140);
  
    // Neighboring countries
    if (borderCountries.length > 0) {
      doc.text("Neighboring Countries:", 10, 150);
      borderCountries.forEach((name, index) => {
        doc.text(`- ${name}`, 10, 160 + (index * 10));
      });
    }
  
    // Map link (optional)
    doc.text("Location on the map: ", 10, 180);
    doc.text("https://www.openstreetmap.org", 10, 190);
  
    // Add Footer for company name, if needed
    doc.setFontSize(8);
    doc.text("Generated by Your Application", 10, 200);
  
    // Save the PDF with the country's name
    doc.save(`${country.name.common}_info.pdf`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Page link copied to clipboard!");
  };

  if (!country) {
    return (
      <div
        className={`min-h-screen ${
          darkMode
            ? "dark bg-gray-900"
            : "bg-gradient-to-br from-indigo-100 to-blue-100"
        }`}
      >
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const populationData = borderCountries.map((name, index) => ({
    name,
    value: Math.floor(Math.random() * 100_000_000),
  }));
  populationData.push({ name: country.name.common, value: country.population });

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "dark bg-gray-900"
          : "bg-gradient-to-br from-indigo-100 to-blue-100"
      } pt-16`}
    >
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero Section */}
        <div
          className="relative h-96 bg-cover bg-center rounded-xl overflow-hidden shadow-xl"
          style={{
            backgroundImage: `url(${
              images[0]?.urls?.regular || country.flags?.png
            })`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent flex flex-col justify-center items-center text-white">
            <img
              src={country.flags?.png}
              alt={`Flag of ${country.name?.common}`}
              className="w-24 h-16 rounded shadow-lg mb-4"
            />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              {country.name?.common}
            </h1>
            <p className="text-lg mt-2">
              {country.region} | {country.subregion || "N/A"}
            </p>
          </div>
        </div>

        {/* Navigation and Actions */}
        <div className="flex justify-between items-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex gap-4">
            <button
              onClick={handleCopyLink}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              Share <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={handleExportPDF}
              className="text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              Export PDF
            </button>
            <FavoriteButton countryName={country.name.common} />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          {/* Details Section */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                Country Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <DetailItem
                    icon={<UsersIcon className="w-6 h-6 text-indigo-600" />}
                    label="Population"
                    value={country.population?.toLocaleString()}
                  />
                </div>
                <div className="w-full">
                  <DetailItem
                    icon={<GlobeAltIcon className="w-6 h-6 text-green-600" />}
                    label="Region"
                    value={`${country.region} | Subregion: ${
                      country.subregion || "N/A"
                    }`}
                  />
                </div>
                <div className="w-full">
                  <DetailItem
                    icon={
                      <BuildingLibraryIcon className="w-6 h-6 text-red-600" />
                    }
                    label="Capital"
                    value={country.capital?.[0] || "N/A"}
                  />
                </div>
                <div className="w-full">
                  <DetailItem
                    icon={
                      <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
                    }
                    label="Currency"
                    value={
                      Object.values(country.currencies || {})[0]?.name || "N/A"
                    }
                  />
                </div>
                <div className="col-span-1 md:col-span-2 w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <LanguageIcon className="w-6 h-6 text-purple-600 mr-2" />
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        Language:
                      </span>
                    </div>
                    {country.languages ? (
                      <select
                        className="border dark:border-gray-600 px-3 py-1 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none w-full sm:w-auto"
                        onChange={(e) => setSelectedLang(e.target.value)}
                      >
                        {Object.entries(country.languages).map(
                          ([code, lang]) => (
                            <option key={code} value={lang}>
                              {lang}
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400 ml-2">
                        N/A
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full">
                  <DetailItem
                    icon={<MapPinIcon className="w-6 h-6 text-orange-500" />}
                    label="Area"
                    value={`${country.area?.toLocaleString()} km²`}
                  />
                </div>
                <div className="w-full">
                  <DetailItem
                    icon={<ClockIcon className="w-6 h-6 text-teal-500" />}
                    label="Timezones"
                    value={country.timezones?.join(", ")}
                  />
                </div>
              </div>

              {/* Border Countries */}
              {borderCountries.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Neighboring Countries
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {borderCountries.map((name, idx) => (
                      <Link
                        key={idx}
                        to={`/country/${name}`}
                        className="px-4 py-2 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white rounded-md hover:bg-blue-200 dark:hover:bg-blue-600 transition"
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map Section */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                <MapIcon className="w-6 h-6 text-blue-600" />
                Location on Map
              </h2>
              <div className="w-full h-[400px] rounded-lg overflow-hidden">
                <iframe
                  title="country-map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  className="border-0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    lng - 1
                  }%2C${lat - 1}%2C${lng + 1}%2C${
                    lat + 1
                  }&layer=mapnik&marker=${lat}%2C${lng}`}
                ></iframe>
              </div>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                Map data ©{" "}
                <a href="https://www.openstreetmap.org/" className="underline">
                  OpenStreetMap
                </a>{" "}
                contributors
              </p>
            </div>

            {/* Population Chart */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Population Comparison
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={populationData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    {populationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sidebar (Sticky Actions) */}
          <div className="hidden lg:block sticky top-20">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Quick Actions
              </h3>
              <button
                onClick={handleCopyLink}
                className="block w-full text-left py-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Share
              </button>
              <button
                onClick={handleExportPDF}
                className="block w-full text-left py-2 text-green-600 dark:text-green-400 hover:underline"
              >
                Export PDF
              </button>
              <FavoriteButton countryName={country.name.common} />
              <h4 className="mt-4 font-semibold text-gray-800 dark:text-white">
                Quick Facts
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Population: {country.population?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Capital: {country.capital?.[0] || "N/A"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Area: {country.area?.toLocaleString()} km²
              </p>
            </div>
            {/* 🌤️ Weather Section */}
            <WeatherCard capital={country.capital?.[0]} />
            <TopDestinations country={country.name.common} lat={country.latlng[0]} lon={country.latlng[1]} />
          </div>
        </div>

        {/* Media Gallery */}
        {images.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Scenic Views of {country.name?.common}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => openModal(img.urls.full)}
                >
                  <img
                    src={img.urls.regular}
                    alt={img.alt_description || `${country.name.common} view`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
              Photos from{" "}
              <a href="https://unsplash.com" className="underline">
                Unsplash
              </a>
            </p>
          </div>
        )}

        {/* Video Section */}
        {video && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Unveiling the Beauty of {country.name?.common}
            </h2>
            <div className="w-full h-[400px] rounded-lg overflow-hidden">
              <iframe
                title="country-video"
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {isModalOpen && selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
            onClick={closeModal}
          >
            <div className="relative max-w-4xl w-full p-4">
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="w-full max-h-[90vh] object-contain rounded-lg shadow-lg"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white text-xl bg-black/50 rounded-full px-3 py-1 hover:bg-black"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleCountry;
