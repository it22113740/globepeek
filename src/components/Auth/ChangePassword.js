import { useState } from 'react';
import { supabase } from '../../supabase/clinet.js';

export default function ChangePassword() {
  const [password, setPassword] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) alert(error.message);
    else alert('Password updated successfully!');
  };

  return (
    <form onSubmit={handleChangePassword}>
      <h2>Change Password</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password"
        required
      />
      <button type="submit">Update Password</button>
    </form>
  );
}
