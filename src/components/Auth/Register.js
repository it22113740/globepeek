
import { useState } from 'react';
import { supabase } from '../../supabase/clinet.js';
import { useTheme } from '../../context/themeProvider.js';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert('Registration successful! Check your email for confirmation.');
      navigate('/login'); // Redirect to login page after signup
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      alert('Google sign-up failed: ' + error.message);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center pt-20 pb-16 px-4 ${
        darkMode
          ? 'dark bg-gradient-to-br from-gray-900 to-gray-800'
          : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'
      } transition-colors duration-500`}
    >
      <motion.form
        variants={formVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleRegister}
        className={`p-8 rounded-2xl shadow-xl w-full max-w-md ${
          darkMode ? 'bg-gray-900/90 text-white' : 'bg-white/90 text-gray-800'
        } backdrop-blur-md`}
      >
        <h2 className="text-3xl font-extrabold text-center mb-8">
          Join{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Globe Peek
          </span>
        </h2>

        {/* Email Input */}
        <div className="mb-6">
          <label
            className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            } mb-2`}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className={`w-full px-4 py-3 border ${
              darkMode
                ? 'border-gray-700 bg-gray-800 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
          />
        </div>

        {/* Password Input */}
        <div className="mb-8">
          <label
            className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            } mb-2`}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            className={`w-full px-4 py-3 border ${
              darkMode
                ? 'border-gray-700 bg-gray-800 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-lg font-semibold"
        >
          Register
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div
            className={`flex-grow border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-300'
            }`}
          ></div>
          <span
            className={`mx-4 text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            or
          </span>
          <div
            className={`flex-grow border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-300'
            }`}
          ></div>
        </div>

        {/* Google Signup Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className={`w-full flex items-center justify-center py-3 rounded-lg shadow-md transition-all duration-300 ${
            darkMode
              ? 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="w-5 h-5 mr-2"
          />
          Sign Up with Google
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </motion.form>
    </div>
  );
}