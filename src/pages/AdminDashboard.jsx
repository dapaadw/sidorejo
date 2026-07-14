import { LogOut, Pencil, Plus, Trash2, X, UploadCloud } from 'lucide-react';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { clearAdminToken, createSupabase, getAdminToken } from '../lib/supabase.js';
import { formatDate } from '../lib/utils.js';

const emptyKegiatan = { judul: '', deskripsi: '', tanggal: '' };
const emptyLayanan = { nama_layanan: '', deskripsi: '', syarat: '', alur: '' };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = getAdminToken();
  const supabase = useMemo(() => createSupabase(token), [token]);
  const [kegiatan, setKegiatan] = useState([]);
  const [layanan, setLayanan] = useState([]);
  const [kegiatanForm, setKegiatanForm] = useState(emptyKegiatan);
  const [layananForm, setLayananForm] = useState(emptyLayanan);
  const [editingLayanan, setEditingLayanan] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  function handleEditKegiatan(item) {
    navigate(`/admin/kegiatan/${item.id}/edit`);
  }

  function handleEditLayanan(item) {
    navigate(`/admin/layanan/${item.id}/edit`);
  }

  async function loadData() {
    if (!supabase) return;
    const [kegiatanResult, layananResult] = await Promise.all([
      supabase.from('kegiatan').select('*, kegiatan_foto(id,url_foto)').order('tanggal', { ascending: false }),
      supabase.from('layanan').select('*').order('created_at', { ascending: false }),
    ]);
    if (kegiatanResult.error || layananResult.error) {
      toast.error('Gagal memuat data admin. Cek token dan RLS Supabase.');
      return;
    }
    setKegiatan(kegiatanResult.data || []);
    setLayanan(layananResult.data || []);
  }

  useEffect(() => {
    loadData();
  }, [supabase]);

  function logout() {
    clearAdminToken();
    toast.success('Logout berhasil.');
    navigate('/admin/login');
  }

  async function uploadPhotos(kegiatanId) {
    const uploaded = [];
    for (const file of files) {
      const extension = file.name.split('.').pop();
      const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      const path = `${kegiatanId}/${uniqueId}.${extension}`;
      const { error } = await supabase.storage.from('foto-kegiatan').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from('foto-kegiatan').getPublicUrl(path);
      uploaded.push({ kegiatan_id: kegiatanId, url_foto: data.publicUrl });
    }
    if (uploaded.length) {
      const { error } = await supabase.from('kegiatan_foto').insert(uploaded);
      if (error) throw error;
    }
  }

  async function saveKegiatan(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.from('kegiatan').insert(kegiatanForm).select('id').single();
      if (error) throw error;
      const kegiatanId = data.id;
      
      if (files.length) await uploadPhotos(kegiatanId);
      toast.success('Data kegiatan berhasil ditambahkan.');
      setKegiatanForm(emptyKegiatan);
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Gagal menyimpan kegiatan.');
    } finally {
      setLoading(false);
    }
  }

  async function deleteKegiatan(id) {
    if (!confirm('Hapus kegiatan ini? Semua foto terkait akan ikut terhapus.')) return;
    
    // Delete files from storage first
    try {
      const { data: files } = await supabase.storage.from('foto-kegiatan').list(id);
      if (files && files.length > 0) {
        const paths = files.map(file => `${id}/${file.name}`);
        await supabase.storage.from('foto-kegiatan').remove(paths);
      }
    } catch (err) {
      console.error('Error deleting files:', err);
    }

    const { error } = await supabase.from('kegiatan').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Kegiatan dihapus.');
      loadData();
    }
  }

  async function saveLayanan(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('layanan').insert(layananForm);
      if (error) throw error;
      toast.success('Layanan berhasil ditambahkan.');
      setLayananForm(emptyLayanan);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Gagal menyimpan layanan.');
    } finally {
      setLoading(false);
    }
  }

  async function deleteLayanan(id) {
    if (!confirm('Hapus layanan ini?')) return;
    const { error } = await supabase.from('layanan').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Layanan dihapus.');
      loadData();
    }
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-8 text-leaf-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[8px] border border-earth-100 bg-white/82 p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-clay">Dashboard Admin</p>
            <h1 className="font-display text-3xl font-black">Kelola Website Desa Sidorejo</h1>
          </div>
          <button onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-full bg-earth-700 px-5 py-3 font-extrabold text-cream">
            <LogOut size={18} /> Logout
          </button>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-[8px] border border-earth-100 bg-white/82 p-5 shadow-soft">
            <h2 className="mb-4 font-display text-2xl font-black">Form Kegiatan/Berita</h2>
            <form onSubmit={saveKegiatan} className="space-y-4">
              <Input label="Judul" value={kegiatanForm.judul} onChange={(value) => setKegiatanForm({ ...kegiatanForm, judul: value })} required />
              <TextArea label="Deskripsi" value={kegiatanForm.deskripsi} onChange={(value) => setKegiatanForm({ ...kegiatanForm, deskripsi: value })} required />
              <Input type="date" label="Tanggal" value={kegiatanForm.tanggal} onChange={(value) => setKegiatanForm({ ...kegiatanForm, tanggal: value })} required />
              <div className="block">
                <span className="font-bold text-earth-700">Foto Kegiatan</span>
                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-earth-300 bg-cream p-4 text-center transition hover:bg-earth-100">
                  <UploadCloud size={24} className="mb-2 text-earth-500" />
                  <span className="text-sm font-bold text-earth-700">
                    Pilih Foto (Bisa lebih dari 1)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(event) => setFiles(prev => [...prev, ...Array.from(event.target.files || [])])}
                  />
                </label>
                
                {files.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="group relative aspect-square overflow-hidden rounded-[8px] border border-earth-100 bg-white">
                        <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover transition group-hover:opacity-75" />
                        <button
                          type="button"
                          onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-leaf-700 px-5 py-3 font-extrabold text-cream disabled:opacity-60">
                <Plus size={18} /> Tambah Kegiatan
              </button>
            </form>
          </section>

          <section className="rounded-[8px] border border-earth-100 bg-white/82 p-5 shadow-soft">
            <h2 className="mb-4 font-display text-2xl font-black">Form Layanan Desa</h2>
            <form onSubmit={saveLayanan} className="space-y-4">
              <Input label="Nama Layanan" value={layananForm.nama_layanan} onChange={(value) => setLayananForm({ ...layananForm, nama_layanan: value })} required />
              <TextArea label="Deskripsi" value={layananForm.deskripsi} onChange={(value) => setLayananForm({ ...layananForm, deskripsi: value })} required />
              <TextArea label="Syarat" value={layananForm.syarat} onChange={(value) => setLayananForm({ ...layananForm, syarat: value })} placeholder="Pisahkan dengan baris baru atau titik koma" required />
              <TextArea label="Alur" value={layananForm.alur} onChange={(value) => setLayananForm({ ...layananForm, alur: value })} placeholder="Pisahkan dengan baris baru atau titik koma" required />
              <button disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-leaf-700 px-5 py-3 font-extrabold text-cream disabled:opacity-60">
                <Plus size={18} /> Tambah Layanan
              </button>
            </form>
          </section>
        </div>

        <section className="mt-8 rounded-[8px] border border-earth-100 bg-white/82 p-5 shadow-soft">
          <h2 className="mb-4 font-display text-2xl font-black">Daftar Kegiatan</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {kegiatan.map((item) => (
              <div key={item.id} className="rounded-[8px] border border-earth-100 bg-cream p-4">
                <p className="font-display text-xl font-black">{item.judul}</p>
                <p className="mt-1 text-sm font-bold text-clay">{formatDate(item.tanggal)}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-leaf-700">{item.deskripsi}</p>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => handleEditKegiatan(item)} className="inline-flex items-center gap-1 rounded-full border border-earth-200 px-3 py-2 text-sm font-bold hover:bg-earth-100 transition">
                    <Pencil size={15} /> Edit
                  </button>
                  <button onClick={() => deleteKegiatan(item.id)} className="inline-flex items-center gap-1 rounded-full bg-clay px-3 py-2 text-sm font-bold text-cream">
                    <Trash2 size={15} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[8px] border border-earth-100 bg-white/82 p-5 shadow-soft">
          <h2 className="mb-4 font-display text-2xl font-black">Daftar Layanan</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {layanan.map((item) => (
              <div key={item.id} className="rounded-[8px] border border-earth-100 bg-cream p-4">
                <p className="font-display text-xl font-black">{item.nama_layanan}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-leaf-700">{item.deskripsi}</p>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => handleEditLayanan(item)} className="inline-flex items-center gap-1 rounded-full border border-earth-200 px-3 py-2 text-sm font-bold hover:bg-earth-100 transition">
                    <Pencil size={15} /> Edit
                  </button>
                  <button onClick={() => deleteLayanan(item.id)} className="inline-flex items-center gap-1 rounded-full bg-clay px-3 py-2 text-sm font-bold text-cream">
                    <Trash2 size={15} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Input({ label, value, onChange, type = 'text', ...props }) {
  return (
    <label className="block">
      <span className="font-bold text-earth-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[8px] border border-earth-100 bg-cream px-4 py-3 font-semibold outline-none focus:border-leaf-500"
        {...props}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, ...props }) {
  return (
    <label className="block">
      <span className="font-bold text-earth-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded-[8px] border border-earth-100 bg-cream px-4 py-3 font-semibold outline-none focus:border-leaf-500"
        {...props}
      />
    </label>
  );
}
