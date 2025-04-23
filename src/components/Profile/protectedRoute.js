import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../supabase/clinet.js';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    })();
  }, []);

  if (isAuthenticated === null) return <p>Checking...</p>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}
