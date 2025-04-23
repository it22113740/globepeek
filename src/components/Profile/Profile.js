import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/clinet.js';
import FavoritesList from '../Country/favoritesList.js';

export default function Profile() {
  const [profile, setProfile] = useState({ full_name: '', avatar_url: '', country: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    else navigate('/login');
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('User not found');
      return;
    }

    let avatar_url = profile.avatar_url;

    // Upload new avatar if selected
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

      // Replace with your Supabase project ref in the URL:
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
    <p>Loading...</p>
  ) : (
    <>
      <form onSubmit={updateProfile}>
        <h2>Profile</h2>

        {profile.avatar_url && (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            width={100}
            height={100}
            style={{ borderRadius: '50%' }}
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files[0])}
        />

        <input
          type="text"
          placeholder="Full Name"
          value={profile.full_name}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Country"
          value={profile.country}
          onChange={(e) => setProfile({ ...profile, country: e.target.value })}
        />

        <button type="submit">Update Profile</button>
        <button type="button" onClick={handleLogout}>Logout</button>
        <button type="button" onClick={() => navigate('/change-password')}>Change Password</button>
      </form>

      <FavoritesList />
    </>
  );
}
