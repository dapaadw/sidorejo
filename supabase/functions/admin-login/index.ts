import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import bcrypt from 'npm:bcryptjs@2.4.3';
import { SignJWT } from 'npm:jose@5.9.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return json({ message: 'Username dan password wajib diisi.' }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const jwtSecret = Deno.env.get('ADMIN_JWT_SECRET');

    if (!supabaseUrl || !serviceRoleKey || !jwtSecret) {
      return json({ message: 'Environment Edge Function belum lengkap.' }, 500);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: admin, error } = await supabase
      .from('admin')
      .select('id, username, password_hash')
      .eq('username', username)
      .single();

    if (error || !admin) {
      return json({ message: 'Username atau password salah.' }, 401);
    }

    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return json({ message: 'Username atau password salah.' }, 401);
    }

    const secret = new TextEncoder().encode(jwtSecret);
    const expiresInSeconds = 60 * 60 * 8;
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

    const token = await new SignJWT({
      role: 'authenticated',
      is_admin: true,
      username: admin.username,
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setSubject(admin.id)
      .setIssuedAt()
      .setExpirationTime(expiresAt)
      .sign(secret);

    return json({
      token,
      expires_at: expiresAt,
      admin: { id: admin.id, username: admin.username },
    });
  } catch (error) {
    return json({ message: error.message || 'Login gagal.' }, 500);
  }
});

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}
