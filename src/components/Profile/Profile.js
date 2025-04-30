import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/clinet.js';
import FavoritesList from '../Country/favoritesList.js';
import { useTheme } from '../../context/themeProvider.js';

export default function Profile() {
  const [profile, setProfile] = useState({ full_name: '', avatar_url: '', country: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      navigate('/login');
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

  // const handleLogout = async () => {
  //   const { error } = await supabase.auth.signOut();
  //   if (!error) navigate('/login');
  // };

  const updateProfile = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('User not found');

    let avatar_url = profile.avatar_url;

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        alert('Error uploading avatar');
        console.error(uploadError);
        return;
      }

      avatar_url = `https://dqguacwfmqkixpczkhev.supabase.co/storage/v1/object/public/avatars/${filePath}`;
    }

    const updates = {
      id: user.id,
      full_name: profile.full_name,
      country: profile.country,
      avatar_url,
    };

    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) alert(error.message);
    else alert('Profile updated!');
  };

  return loading ? (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-indigo-50 to-blue-100"
      } flex items-center justify-center`}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 dark:border-blue-400 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  ) : (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-indigo-50 to-blue-100"
      } pt-20 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Your Profile
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Manage your account and favorite countries
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Profile Details
            </h2>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 dark:border-gray-700 shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 text-xl font-medium">
                  No Avatar
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-200 cursor-pointer"
              >
                Upload Avatar
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])}
                className="hidden"
              />
            </div>

            {/* Profile Form */}
            <form onSubmit={updateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Country
                </label>
                <input
                  type="text"
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  placeholder="Enter your country"
                />
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md"
                >
                  Update Profile
                </button>
                {/* <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 shadow-md"
                >
                  Logout
                </button> */}
                <button
                  type="button"
                  onClick={() => navigate('/change-password')}
                  className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 shadow-md"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>

          {/* Favorites Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <FavoritesList />
          </div>
        </div>
      </div>
    </div>
  );
}