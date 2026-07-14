import { Leaf, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { adminLogin, saveAdminToken } from '../lib/supabase.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await adminLogin(form.username, form.password);
      saveAdminToken(data.token);
      toast.success('Login admin berhasil.');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.message || 'Username atau password salah.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[8px] border border-earth-100 bg-white/86 p-7 shadow-soft animate-fade-in-up">
        <div className="mb-6 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 font-extrabold text-leaf-700">
            <Leaf size={22} /> Desa Sidorejo
          </span>
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-full border border-earth-200 bg-white/50 px-3 py-1.5 text-xs font-bold text-earth-600 transition hover:bg-earth-100 hover:text-earth-800">
            <ArrowLeft size={14} /> Beranda
          </Link>
        </div>
        <h1 className="font-display text-3xl font-black text-leaf-900">Login Admin</h1>
        <p className="mt-2 text-sm leading-7 text-leaf-700">
          Masuk untuk mengelola kegiatan, foto galeri, dan layanan desa.
        </p>

        <label className="mt-6 block">
          <span className="font-bold text-earth-700">Username</span>
          <input
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            className="mt-2 w-full rounded-[8px] border border-earth-100 bg-cream px-4 py-3 font-semibold outline-none focus:border-leaf-500"
            placeholder="miminsidorejo"
            autoComplete="username"
          />
        </label>
        <label className="mt-4 block">
          <span className="font-bold text-earth-700">Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="mt-2 w-full rounded-[8px] border border-earth-100 bg-cream px-4 py-3 font-semibold outline-none focus:border-leaf-500"
            placeholder="Masukkan password"
            autoComplete="current-password"
          />
        </label>

        <button
          disabled={loading}
          className="mt-6 w-full rounded-full bg-leaf-700 px-5 py-3 font-extrabold text-cream transition hover:bg-leaf-900 disabled:opacity-60"
        >
          {loading ? 'Memeriksa...' : 'Masuk Dashboard'}
        </button>
      </form>
    </main>
  );
}
