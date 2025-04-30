import { useState } from 'react';
import { supabase } from '../../supabase/clinet.js';
import { useTheme } from '../../context/themeProvider';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const checkPasswordStrength = (pass) => {
    if (pass.length < 6) return 'Weak';
    if (pass.length >= 6 && /[A-Z]/.test(pass) && /\d/.test(pass)) return 'Strong';
    return 'Moderate';
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully!');
      navigate('/profile'); // Redirect to profile page after update
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 ${
        darkMode
          ? 'dark bg-gradient-to-br from-gray-900 to-gray-800'
          : 'bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100'
      } transition-colors duration-500`}
    >
      <motion.form
        variants={formVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleChangePassword}
        className={`p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md ${
          darkMode ? 'bg-gray-900/90 text-white' : 'bg-white/90 text-gray-800'
        } backdrop-blur-md`}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8">
          Change Your Password
        </h2>

        {/* New Password Input */}
        <div className="mb-6">
          <label
            className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            } mb-2`}
          >
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordStrength(checkPasswordStrength(e.target.value));
            }}
            placeholder="Enter new password"
            required
            className={`w-full px-4 py-3 border ${
              darkMode
                ? 'border-gray-700 bg-gray-800 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-sm sm:text-base`}
          />
          {password && (
            <p
              className={`text-xs sm:text-sm mt-2 ${
                passwordStrength === 'Weak'
                  ? 'text-red-500'
                  : passwordStrength === 'Moderate'
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`}
            >
              Password Strength: {passwordStrength}
            </p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="mb-8">
          <label
            className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            } mb-2`}
          >
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            className={`w-full px-4 py-3 border ${
              darkMode
                ? 'border-gray-700 bg-gray-800 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-sm sm:text-base`}
          />
        </div>

        {/* Update Password Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-sm sm:text-lg font-semibold ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mx-auto text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            'Update Password'
          )}
        </button>

        {/* Back to Profile Link */}
        <p className="mt-6 text-center text-xs sm:text-sm">
          Changed your mind?{' '}
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Back to Profile
          </button>
        </p>
      </motion.form>
      <ToastContainer />
    </div>
  );
}