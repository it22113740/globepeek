import { supabase } from '../supabase/clinet.js';

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) alert(error.message);
};

export const isLoggedin = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
};