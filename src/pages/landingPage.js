import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/themeProvider";
import {
  GlobeAltIcon,
  HeartIcon,
  UserIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import CountryService from "../services/CountryService.js";
import { fetchCountryImages } from "../services/upsplashService.js";
import { fetchVideoByCountry } from "../services/youtubeService.js";
import { supabase } from "../supabase/clinet.js";

const LandingPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [heroImage, setHeroImage] = useState("");
  const [featuredCountries, setFeaturedCountries] = useState([]);
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const session = await supabase.auth.getSession();
      setIsLoggedIn(session.data.session !== null);
    };
    checkLoginStatus();
  }, []);

  // Fetch hero background image
  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const images = await fetchCountryImages("world", 1);
        if (images.length > 0) {
          setHeroImage(images[0].urls.regular);
        }
      } catch (error) {
        console.error("Error fetching hero image:", error);
      }
    };
    fetchHeroImage();
  }, []);

  // Fetch featured countries
  useEffect(() => {
    const fetchFeaturedCountries = async () => {
      try {
        const response = await CountryService.getAllCountries();
        const countries = response.data
          .sort(() => Math.random() - 0.5) // Shuffle for variety
          .slice(0, 4); // Limit to 4
        const countriesWithImages = await Promise.all(
          countries.map(async (country) => {
            const images = await fetchCountryImages(
              `Scenic tourist attractions in ${country.name.common}`,
              1
            );
            return {
              ...country,
              image:
                images[0]?.urls.regular || "https://via.placeholder.com/300",
            };
          })
        );
        setFeaturedCountries(countriesWithImages);
      } catch (error) {
        console.error("Error fetching featured countries:", error);
      }
    };
    fetchFeaturedCountries();
  }, []);

  // Fetch featured video
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const video = await fetchVideoByCountry("Italy"); // Example country
        setFeaturedVideo(video);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };
    fetchVideo();
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, delay: i * 0.1 },
    }),
  };

  return (
    <div
      className={`min-h-screen mt-16 ${
        darkMode
          ? "dark bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100"
      } transition-colors duration-500`}
    >
      {/* Hero Section */}
      <section
        className="pt-24 pb-20 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage || "/world-map.jpg"})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/60 to-purple-600/60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight"
          >
            Discover the World with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
              Globe Peek
            </span>
          </motion.h1>
          <motion.p
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 text-lg md:text-2xl text-white/90 max-w-3xl mx-auto"
          >
            Explore countries, save your favorites, and embark on a personalized
            global adventure. Join our vibrant community today!
          </motion.p>
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="mt-10 flex justify-center gap-4"
          >
            <button
              onClick={() => navigate("/register")}
              className={`px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-lg font-semibold ${
                isLoggedIn ? "hidden" : ""
              }`}
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/countries")}
              className="px-8 py-4 bg-gradient-to-r from-white to-gray-100 dark:from-gray-800 dark:to-gray-700 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg shadow-lg hover:bg-indigo-50 dark:hover:bg-gray-600 transition-all duration-300 text-lg font-semibold"
            >
              Explore Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Countries Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-16">
            Discover Popular Destinations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCountries.map((country, index) => (
              <motion.div
                key={country.cca3}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/${country.name.common}`)}
              >
                <img
                  src={country.image}
                  alt={`Scenic view of ${country.name.common}`}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {country.name.common}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {country.region}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      {featuredVideo && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-16">
              <span className="text-5xl mr-2">✨</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Experience Italy
              </span>
            </h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${featuredVideo.videoId}`}
                  title={featuredVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-[560px] rounded-xl shadow-lg"
                ></iframe>
              </div>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 text-center">
                {featuredVideo.title} by {featuredVideo.channelTitle}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-16">
            Why{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Globe Peek
            </span>{" "}
            Stands Out
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: GlobeAltIcon,
                title: "Explore Countries",
                description:
                  "Dive into rich details about every country, from culture to geography.",
                color: "text-indigo-600 dark:text-indigo-400",
              },
              {
                icon: HeartIcon,
                title: "Save Favorites",
                description:
                  "Bookmark your favorite countries and access them anytime.",
                color: "text-red-600 dark:text-red-400",
              },
              {
                icon: UserIcon,
                title: "Personal Profile",
                description:
                  "Customize your profile to track your global exploration.",
                color: "text-green-600 dark:text-green-400",
              },
              {
                icon: MapIcon,
                title: "Interactive Maps",
                description:
                  "Visualize countries with dynamic maps and scenic views.",
                color: "text-blue-600 dark:text-blue-400",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <feature.icon
                  className={`w-12 h-12 ${feature.color} mx-auto mb-4`}
                />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white text-center">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-16">
            Loved by Explorers Worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Globe Peek transformed how I explore countries. It’s intuitive and fun!",
                author: "Emma Wilson",
                role: "Travel Enthusiast",
              },
              {
                quote:
                  "The ability to save favorites and customize my profile is a game-changer.",
                author: "Liam Chen",
                role: "Geography Student",
              },
              {
                quote:
                  "The interactive maps make learning about the world so engaging!",
                author: "Sofia Martinez",
                role: "Educator",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.quote}"
                </p>
                <p className="mt-4 text-sm font-semibold text-gray-800 dark:text-white">
                  — {testimonial.author}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Ready to Discover the Globe?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-white/90 max-w-2xl mx-auto"
          >
            Sign up now to unlock a world of exploration with Globe Peek. Your
            journey starts here!
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={() => navigate("/signup")}
            className="mt-8 px-10 py-4 bg-white text-indigo-600 rounded-lg shadow-lg hover:bg-indigo-50 transition-all duration-300 text-lg font-semibold"
          >
            Join Now
          </motion.button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
          >
            Stay in the Loop
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Subscribe to our newsletter for updates, travel tips, and exclusive
            content.
          </motion.p>
          <motion.form
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex justify-center gap-4 max-w-lg mx-auto"
            onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.email.value;
              try {
                const { error } = await supabase
                  .from("newsletter")
                  .insert([{ email }]);
                if (error) throw error;
                alert("Subscribed successfully!");
              } catch (error) {
                alert("Error subscribing");
                console.error(error);
              }
            }}
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-md"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              Subscribe
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
