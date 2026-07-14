import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function getAdminToken() {
  return localStorage.getItem('sidorejo_admin_token');
}

export function saveAdminToken(token) {
  localStorage.setItem('sidorejo_admin_token', token);
}

export function clearAdminToken() {
  localStorage.removeItem('sidorejo_admin_token');
}

export function createSupabase(token = getAdminToken()) {
  if (!isSupabaseConfigured) return null;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined,
  });
}

export const publicSupabase = createSupabase(null);

export async function adminLogin(username, password) {
  const client = createSupabase(null);
  if (!client) throw new Error('Konfigurasi Supabase belum tersedia.');

  const { data, error } = await client.functions.invoke('admin-login', {
    body: { username, password },
  });

  if (error) throw error;
  if (!data?.token) throw new Error('Token admin tidak diterima.');
  return data;
}
