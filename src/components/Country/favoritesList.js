import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/clinet.js';
import CountryService from '../../services/CountryService.js';
import CountryCard from './countryCard.js';
import { useTheme } from '../../context/themeProvider.js';

export default function FavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);

      if (error) console.error(error);
      else setFavorites(data);
    })();
  }, []);

  useEffect(() => {
    const fetchAllFavorites = async () => {
      try {
        const promises = favorites.map((fav) =>
          CountryService.getCountryByName(fav.country_name)
        );

        const results = await Promise.all(promises);
        const allCountries = results.flatMap((res) => res.data || []);

        // Remove duplicates by `cca3`
        const uniqueCountries = Array.from(
          new Map(allCountries.map((c) => [c.cca3, c])).values()
        );

        setCountries(uniqueCountries);
      } catch (error) {
        console.error('Error fetching favorite countries:', error);
      } finally {
        setLoading(false);
      }
    };

    if (favorites.length > 0) {
      fetchAllFavorites();
    } else {
      setLoading(false);
    }
  }, [favorites]);

  return (
    <section
      className={`p-6 max-w-7xl mx-auto ${
        darkMode ? 'dark' : ''
      } transition-colors duration-300`}
    >
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-2">
        <span>🌍</span> Your Favorite Countries
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4"
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-4 w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-2 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : countries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            You haven't added any favorite countries yet.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Explore countries and add them to your favorites!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {countries.map((country) => (
            <div
              key={country.cca3}
              className="transform transition-transform duration-300 hover:scale-105"
            >
              <CountryCard country={country} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}