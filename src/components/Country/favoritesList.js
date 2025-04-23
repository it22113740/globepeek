import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/clinet.js';
import CountryService from '../../services/CountryService.js';
import CountryCard from './countryCard.js';

export default function FavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const [countries, setCountries] = useState([]);

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
        const allCountries = results.flatMap(res => res.data || []);

        // ❗ Remove duplicate countries by `cca3`
        const uniqueCountries = Array.from(
          new Map(allCountries.map(c => [c.cca3, c])).values()
        );

        setCountries(uniqueCountries);
      } catch (error) {
        console.error('Error fetching favorite countries:', error);
      }
    };

    if (favorites.length > 0) {
      fetchAllFavorites();
    }
  }, [favorites]);

  return (
    <div>
      <h2>Your Favorite Countries</h2>
      <ul>
        {countries.map((country) => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </ul>
    </div>
  );
}
