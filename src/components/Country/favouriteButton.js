import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/clinet.js';
import { useTheme } from '../../context/themeProvider.js';

export default function FavoriteButton({ countryName }) {
  const [isFav, setIsFav] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUser(null);
        return;
      }

      setUser(user);

      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('country_name', countryName)
        .single();

      if (data) setIsFav(true);
    })();
  }, [countryName]);

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login'); // redirect to login page if not logged in
      return;
    }

    if (isFav) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('country_name', countryName);
      setIsFav(false);
    } else {
      await supabase
        .from('favorites')
        .insert([{ user_id: user.id, country_name: countryName }]);
      setIsFav(true);
    }
  };

  return (
    <button onClick={toggleFavorite} className={`${darkMode ? "text-white" : "text-gray-800"}`}>
      {isFav ? '❤️ Remove Favorite' : '🤍 Add to Favorite'}
    </button>
  );
}
