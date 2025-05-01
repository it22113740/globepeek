import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/themeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/clinet.js';

const NavBar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getProfile = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      navigate('/');
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, country')
      .eq('id', user.id)
      .single();

    if (data) setProfile(data);
    if (error) console.error(error);
    setLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setProfile(null); // Clear profile from state
      navigate('/login');
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    getProfile();
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 shadow-lg ${
        darkMode
          ? 'dark bg-gray-900'
          : 'bg-gradient-to-r from-indigo-600 to-blue-500'
      } transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo/Title */}
        <a className="flex items-center gap-2 cursor-pointer" href="/">
          <span className="text-3xl">🌍</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-gray-100 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white dark:from-indigo-400 dark:to-purple-400">
            Globe Peek
          </span>
          </h1>
        </a>

        {/* Right Section: Theme Toggle + Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/20 dark:bg-gray-800 text-white dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-700 transition duration-200 shadow-md"
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            <span className="text-lg">{darkMode ? <FaSun /> : <FaMoon />}</span>
            <span className="hidden sm:block text-sm font-medium">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          {/* Avatar Dropdown */}
          {!loading && profile && (
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} // For mobile tap
            >
              <motion.img
                src={
                  profile.avatar_url ||
                  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp'
                }
                alt="User avatar"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/50 dark:border-gray-700 object-cover cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl ${
                      darkMode
                        ? 'bg-gray-800 text-gray-200'
                        : 'bg-white text-gray-800'
                    } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-100 dark:hover:bg-gray-700 transition duration-200 ${
                          darkMode ? 'text-gray-200' : 'text-gray-700'
                        }`}
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-100 dark:hover:bg-gray-700 transition duration-200 ${
                          darkMode ? 'text-gray-200' : 'text-gray-700'
                        }`}
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;