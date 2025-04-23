import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CountryService from "../services/CountryService";
import DetailItem from "../components/Country/detailItem";
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
import { fetchCountryImages } from "../services/upsplashService";
import { fetchVideoByCountry } from "../services/youtubeService";
import FavoriteButton from "../components/Country/favouriteButton";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

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

          fetchCountryImages(data.name.common, 5) // fetch 5 images
            .then((images) => {
              setImages(images); // whole array of images
            })
            .catch((error) =>
              console.error("Error fetching country images:", error)
            );

            fetchVideoByCountry(data.name.common)
            .then((video) => {
              setVideo(video); // whole array of images
              console.log("Vedio",video.videoId)
            })
            .catch((error) =>
              console.error("Error fetching country images:", error)
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
    doc.setFontSize(16);
    doc.text(`${country.name.common} - Country Information`, 10, 10);

    doc.setFontSize(12);
    doc.text(`Population: ${country.population?.toLocaleString()}`, 10, 30);
    doc.text(`Region: ${country.region}`, 10, 40);
    doc.text(`Capital: ${country.capital?.[0] || "N/A"}`, 10, 50);
    doc.text(
      `Currency: ${Object.values(country.currencies || {})[0]?.name || "N/A"}`,
      10,
      60
    );
    doc.text(
      `Languages: ${Object.values(country.languages || {}).join(", ")}`,
      10,
      70
    );
    doc.text(`Area: ${country.area?.toLocaleString()} km²`, 10, 80);
    doc.text(`Timezones: ${country.timezones?.join(", ")}`, 10, 90);
    doc.text(`Top-level domain: ${country.tld?.join(", ")}`, 10, 100);
    doc.text(`Driving Side: ${country.car?.side}`, 10, 110);

    doc.save(`${country.name.common}_info.pdf`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Page link copied to clipboard!");
  };

  if (!country) {
    return (
      <div className={`${darkMode ? "dark" : ""} bg-gray-100 dark:bg-gray-800`}>
        <div className="max-w-5xl mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
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
    <div className={`${darkMode ? "dark" : ""} bg-gray-100 dark:bg-gray-800`}>
      <div className="container mx-auto p-6 bg-white dark:bg-gray-900 shadow-xl rounded-lg">
        <div className="mb-6 flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            Back
          </Link>

          <div className="flex gap-4">
            <button
              onClick={handleCopyLink}
              className="text-sm text-blue-600 hover:underline"
            >
              Share{" "}
              <ArrowTopRightOnSquareIcon className="inline w-4 h-4 ml-1" />
            </button>
            <button
              onClick={handleExportPDF}
              className="text-sm text-green-600 hover:underline"
            >
              Export PDF
            </button>
            <FavoriteButton countryName={country.name.common} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out">
          {/* Flag Section */}
          <img
            src={country.flags?.png}
            alt={`Flag of ${country.name?.common}`}
            className="w-full md:w-72 h-48 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg"
          />

          {/* Details Section */}
          <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {country.name?.common}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5">
              <DetailItem
                icon={<UsersIcon className="w-5 h-5 text-indigo-600" />}
                label="Population"
                value={country.population?.toLocaleString()}
              />
              <DetailItem
                icon={<GlobeAltIcon className="w-5 h-5 text-green-600" />}
                label="Region"
                value={`${country.region} | Subregion: ${
                  country.subregion || "N/A"
                }`}
              />
              <DetailItem
                icon={<BuildingLibraryIcon className="w-5 h-5 text-red-600" />}
                label="Capital"
                value={country.capital?.[0] || "N/A"}
              />
              <DetailItem
                icon={
                  <CurrencyDollarIcon className="w-5 h-5 text-yellow-600" />
                }
                label="Currency"
                value={
                  Object.values(country.currencies || {})[0]?.name || "N/A"
                }
              />
              <div className="col-span-1 sm:col-span-2 flex items-center text-gray-700 dark:text-gray-300">
                <LanguageIcon className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-medium">Language:</span>
                {country.languages ? (
                  <select
                    className="ml-2 border dark:border-gray-600 px-3 py-1 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    onChange={(e) => setSelectedLang(e.target.value)}
                  >
                    {Object.entries(country.languages).map(([code, lang]) => (
                      <option key={code} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="ml-2">N/A</span>
                )}
              </div>
              <DetailItem
                icon={<MapPinIcon className="w-5 h-5 text-orange-500" />}
                label="Area"
                value={`${country.area?.toLocaleString()} km²`}
              />
              <DetailItem
                icon={<ClockIcon className="w-5 h-5 text-teal-500" />}
                label="Timezones"
                value={country.timezones?.join(", ")}
              />
              <DetailItem
                icon={
                  <GlobeAsiaAustraliaIcon className="w-5 h-5 text-blue-500" />
                }
                label="Top-level domain"
                value={country.tld?.join(", ")}
              />
              <DetailItem
                icon={<TruckIcon className="w-5 h-5 text-gray-600" />}
                label="Driving Side"
                value={country.car?.side}
              />
            </div>

            {/* Border Countries */}
            {borderCountries.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Neighboring Countries:
                </h2>
                <div className="flex flex-wrap gap-2">
                  {borderCountries.map((name, idx) => (
                    <Link
                      key={idx}
                      to={`/country/${name}`}
                      className="text-sm bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white px-3 py-1 rounded-md hover:bg-blue-200 dark:hover:bg-blue-600 transition"
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white mb-4">
            <MapIcon className="w-6 h-6 text-blue-600" />
            Location on Map
          </h2>
          <div className="w-full h-[400px]">
            <iframe
              title="country-map"
              width="100%"
              height="100%"
              loading="lazy"
              className="rounded-lg border"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                lng - 1
              }%2C${lat - 1}%2C${lng + 1}%2C${
                lat + 1
              }&layer=mapnik&marker=${lat}%2C${lng}`}
            ></iframe>
          </div>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
            Map data ©{" "}
            <a href="https://www.openstreetmap.org/">OpenStreetMap</a>{" "}
            contributors
          </p>
        </div>

        {/* Chart */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Population Comparison
          </h2>
          <div className="w-full h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={populationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="80%"
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {populationData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {images.length > 0 && (
            <div className="mt-6">
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
                    />
                  </div>
                ))}
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
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                Photos from{" "}
                <a href="https://unsplash.com" className="underline">
                  Unsplash
                </a>
              </p>
            </div>
          )}
          {video && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Unveiling the Beauty of {country.name?.common}
            </h2>
            <div className="w-full">
              <iframe
                title="country-video"
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default SingleCountry;
