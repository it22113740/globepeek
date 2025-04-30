
import React from 'react';
import { useTheme } from '../context/themeProvider'; // Adjust path as needed
import { motion } from 'framer-motion';
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

export const Footer = () => {
  const { darkMode } = useTheme();

  const linkVariants = {
    hover: { scale: 1.1, color: '#ffffff', transition: { duration: 0.2 } },
  };

  const iconVariants = {
    hover: { scale: 1.2, rotate: 5, transition: { duration: 0.2 } },
  };

  return (
    <footer
      className={`py-12 ${
        darkMode
          ? 'dark bg-gradient-to-b from-gray-950 to-gray-900'
          : 'bg-gradient-to-b from-gray-900 to-gray-800'
      } transition-colors duration-500`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6">
          {[
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
            { href: '/privacy', label: 'Privacy Policy' },
            { href: '/terms', label: 'Terms of Service' },
            { href: '/faq', label: 'FAQs' },
          ].map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="text-gray-300 text-sm sm:text-base hover:text-white transition duration-200"
              variants={linkVariants}
              whileHover="hover"
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-4 sm:gap-6 mb-6">
          {[
            {
              href: 'https://twitter.com',
              icon: <FaTwitter className="w-5 h-5 sm:w-6 sm:h-6" />,
              label: 'Twitter',
            },
            {
              href: 'https://facebook.com',
              icon: <FaFacebook className="w-5 h-5 sm:w-6 sm:h-6" />,
              label: 'Facebook',
            },
            {
              href: 'https://instagram.com',
              icon: <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6" />,
              label: 'Instagram',
            },
          ].map((social) => (
            <motion.a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition duration-200"
              variants={iconVariants}
              whileHover="hover"
              aria-label={social.label}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>

        {/* Copyright Notice */}
        <p className="text-gray-400 text-xs sm:text-sm">
          © {new Date().getFullYear()} Globe Peek. All rights reserved.
        </p>
      </div>
    </footer>
  );
};