import { ArrowLeft, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { createSupabase, getAdminToken } from '../lib/supabase.js';

export default function AdminLayananEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getAdminToken();
  const supabase = useMemo(() => createSupabase(token), [token]);

  const [form, setForm] = useState({ nama_layanan: '', deskripsi: '', syarat: '', alur: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;
      const { data, error } = await supabase.from('layanan').select('*').eq('id', id).single();
      
      if (error) {
        toast.error('Gagal memuat layanan');
        navigate('/admin/dashboard');
        return;
      }
      
      setForm({
        nama_layanan: data.nama_layanan,
        deskripsi: data.deskripsi,
        syarat: data.syarat,
        alur: data.alur,
      });
      setLoading(false);
    }
    loadData();
  }, [id, supabase, navigate]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('layanan').update(form).eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Layanan berhasil diperbarui.');
      navigate('/admin/dashboard');
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="p-8 text-center text-leaf-700 font-bold animate-pulse">Memuat data...</div>;
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-8 text-leaf-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/admin/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-earth-600 transition hover:text-earth-800">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
        
        <h1 className="mb-8 font-display text-3xl font-black">Edit Layanan</h1>
        
        <section className="rounded-[8px] border border-earth-100 bg-white/82 p-5 shadow-soft">
          <form onSubmit={handleSave} className="space-y-4">
            <label className="block">
              <span className="font-bold text-earth-700">Nama Layanan</span>
              <input required value={form.nama_layanan} onChange={(e) => setForm({...form, nama_layanan: e.target.value})} className="mt-2 w-full rounded-[8px] border border-earth-100 bg-cream px-4 py-3 font-semibold outline-none focus:border-leaf-500" />
            </label>
            <label className="block">
              <span className="font-bold text-earth-700">Deskripsi</span>
              <textarea required rows={3} value={form.deskripsi} onChange={(e) => setForm({...form, deskripsi: e.target.value})} className="mt-2 w-full rounded-[8px] border border-earth-100 bg-cream px-4 py-3 font-semibold outline-none focus:border-leaf-500" />
            </label>
            <label className="block">
              <span className="font-bold text-earth-700">Syarat (Pisahkan dengan baris baru)</span>
              <textarea required rows={4} value={form.syarat} onChange={(e) => setForm({...form, syarat: e.target.value})} className="mt-2 w-full rounded-[8px] border border-earth-100 bg-cream px-4 py-3 font-semibold outline-none focus:border-leaf-500" />
            </label>
            <label className="block">
              <span className="font-bold text-earth-700">Alur (Pisahkan dengan baris baru)</span>
              <textarea required rows={4} value={form.alur} onChange={(e) => setForm({...form, alur: e.target.value})} className="mt-2 w-full rounded-[8px] border border-earth-100 bg-cream px-4 py-3 font-semibold outline-none focus:border-leaf-500" />
            </label>
            <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf-700 px-5 py-3 font-extrabold text-cream transition hover:bg-leaf-900 disabled:opacity-60">
              <Plus size={18} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
