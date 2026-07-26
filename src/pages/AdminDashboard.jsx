import { LogOut, Pencil, Plus, Trash2, X, UploadCloud, FileText, Settings } from 'lucide-react';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { clearAdminToken, createSupabase, getAdminToken } from '../lib/supabase.js';
import { formatDate } from '../lib/utils.js';
import { fallbackProfil } from '../lib/fallbackData.js';


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

  // Profile Desa Management State
  const [activeTab, setActiveTab] = useState('kegiatan');
  const [profileForm, setProfileForm] = useState(fallbackProfil);

  function handleEditKegiatan(item) {
    navigate(`/admin/kegiatan/${item.id}/edit`);
  }

  function handleEditLayanan(item) {
    navigate(`/admin/layanan/${item.id}/edit`);
  }

  async function loadData() {
    if (!supabase) return;
    const [kegiatanResult, layananResult, profilResult] = await Promise.all([
      supabase.from('kegiatan').select('*, kegiatan_foto(id,url_foto)').order('tanggal', { ascending: false }),
      supabase.from('layanan').select('*').order('created_at', { ascending: false }),
      supabase.from('profil_desa').select('*').eq('id', 'default').maybeSingle(),
    ]);
    if (kegiatanResult.error || layananResult.error) {
      toast.error('Gagal memuat data admin. Cek token dan RLS Supabase.');
      return;
    }
    setKegiatan(kegiatanResult.data || []);
    setLayanan(layananResult.data || []);

    if (profilResult.data) {
      setProfileForm(profilResult.data);
    }
  }

  useEffect(() => {
    loadData();
  }, [supabase]);

  // Profile Form Handlers
  function handleMisiChange(index, value) {
    const updated = [...(profileForm.misi || [])];
    updated[index] = value;
    setProfileForm({ ...profileForm, misi: updated });
  }

  function handleAddMisi() {
    setProfileForm({
      ...profileForm,
      misi: [...(profileForm.misi || []), ''],
    });
  }

  function handleRemoveMisi(index) {
    const updated = (profileForm.misi || []).filter((_, i) => i !== index);
    setProfileForm({ ...profileForm, misi: updated });
  }

  function handlePerangkatChange(index, field, value) {
    const updated = [...(profileForm.perangkat || [])];
    updated[index] = { ...updated[index], [field]: value };
    setProfileForm({ ...profileForm, perangkat: updated });
  }

  function handleAddPerangkat() {
    setProfileForm({
      ...profileForm,
      perangkat: [...(profileForm.perangkat || []), { jabatan: '', nama: '' }],
    });
  }

  function handleRemovePerangkat(index) {
    const updated = (profileForm.perangkat || []).filter((_, i) => i !== index);
    setProfileForm({ ...profileForm, perangkat: updated });
  }

  async function updateProfile(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profil_desa')
        .upsert({
          id: 'default',
          visi: profileForm.visi,
          misi: profileForm.misi,
          sejarah: profileForm.sejarah,
          kk: parseInt(profileForm.kk) || 0,
          laki_laki: parseInt(profileForm.laki_laki) || 0,
          perempuan: parseInt(profileForm.perempuan) || 0,
          bekerja: parseInt(profileForm.bekerja) || 0,
          menganggur: parseInt(profileForm.menganggur) || 0,
          perangkat: profileForm.perangkat,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      toast.success('Profil Desa berhasil diperbarui.');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Gagal memperbarui profil desa.');
    } finally {
      setLoading(false);
    }
  }


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

        {/* Tab Selection */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-earth-200 pb-px">
          <button
            onClick={() => setActiveTab('kegiatan')}
            className={`border-b-2 px-6 py-3 font-display font-black text-lg transition-all ${
              activeTab === 'kegiatan'
                ? 'border-leaf-700 text-leaf-900'
                : 'border-transparent text-leaf-500 hover:text-leaf-800'
            }`}
          >
            Kegiatan & Berita
          </button>
          <button
            onClick={() => setActiveTab('layanan')}
            className={`border-b-2 px-6 py-3 font-display font-black text-lg transition-all ${
              activeTab === 'layanan'
                ? 'border-leaf-700 text-leaf-900'
                : 'border-transparent text-leaf-500 hover:text-leaf-800'
            }`}
          >
            Layanan Desa
          </button>
          <button
            onClick={() => setActiveTab('profil')}
            className={`border-b-2 px-6 py-3 font-display font-black text-lg transition-all ${
              activeTab === 'profil'
                ? 'border-leaf-700 text-leaf-900'
                : 'border-transparent text-leaf-500 hover:text-leaf-800'
            }`}
          >
            Profil Desa
          </button>
        </div>

        {/* Tab Content: Kegiatan */}
        {activeTab === 'kegiatan' && (
          <div className="grid gap-8 lg:grid-cols-[1fr_1.8fr]">
            <section className="rounded-[8px] border border-earth-100 bg-white/82 p-5 shadow-soft h-fit">
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
              <h2 className="mb-4 font-display text-2xl font-black">Daftar Kegiatan</h2>
              <div className="grid gap-4 md:grid-cols-2">
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
          </div>
        )}

        {/* Tab Content: Layanan */}
        {activeTab === 'layanan' && (
          <div className="grid gap-8 lg:grid-cols-[1fr_1.8fr]">
            <section className="rounded-[8px] border border-earth-100 bg-white/82 p-5 shadow-soft h-fit">
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

            <section className="rounded-[8px] border border-earth-100 bg-white/82 p-5 shadow-soft">
              <h2 className="mb-4 font-display text-2xl font-black">Daftar Layanan</h2>
              <div className="grid gap-4 md:grid-cols-2">
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
        )}

        {/* Tab Content: Profil Desa */}
        {activeTab === 'profil' && (
          <div className="rounded-[8px] border border-earth-100 bg-white/82 p-6 shadow-soft">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-black text-leaf-900">Kelola Profil & Kependudukan Desa</h2>
              <p className="text-sm text-leaf-600 mt-1">Perbarui data sejarah, visi misi, statistik kependudukan, dan perangkat kepengurusan desa.</p>
            </div>

            <form onSubmit={updateProfile} className="space-y-8">
              {/* Sejarah & Visi */}
              <div className="grid gap-6 md:grid-cols-2">
                <TextArea
                  label="Sejarah Singkat Desa"
                  value={profileForm.sejarah || ''}
                  onChange={(val) => setProfileForm({ ...profileForm, sejarah: val })}
                  required
                />
                <TextArea
                  label="Visi Desa"
                  value={profileForm.visi || ''}
                  onChange={(val) => setProfileForm({ ...profileForm, visi: val })}
                  required
                />
              </div>

              {/* Misi List Editor */}
              <div className="rounded-[8px] border border-earth-100 bg-cream p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-earth-700 text-lg">Misi Desa</span>
                  <button
                    type="button"
                    onClick={handleAddMisi}
                    className="inline-flex items-center gap-1 rounded-full bg-leaf-100 px-3 py-1.5 text-xs font-bold text-leaf-700 hover:bg-leaf-200 transition"
                  >
                    <Plus size={14} /> Tambah Misi
                  </button>
                </div>
                <div className="space-y-3">
                  {(profileForm.misi || []).map((m, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-700 text-sm font-bold text-cream">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={m}
                        onChange={(e) => handleMisiChange(idx, e.target.value)}
                        className="flex-1 rounded-[8px] border border-earth-100 bg-white px-4 py-2 font-semibold outline-none focus:border-leaf-500 text-leaf-900"
                        placeholder={`Misi ke-${idx + 1}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMisi(idx)}
                        className="rounded-full bg-red-50 p-2 text-red-500 hover:bg-red-100 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {(!profileForm.misi || profileForm.misi.length === 0) && (
                    <p className="text-sm text-leaf-500 italic">Belum ada misi. Tambah misi baru menggunakan tombol di atas.</p>
                  )}
                </div>
              </div>

              {/* Data Penduduk Grid */}
              <div className="rounded-[8px] border border-earth-100 bg-cream p-5">
                <h3 className="font-bold text-earth-700 text-lg mb-4">Statistik Kependudukan</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <Input
                    type="number"
                    label="Jumlah KK"
                    value={profileForm.kk || 0}
                    onChange={(val) => setProfileForm({ ...profileForm, kk: parseInt(val) || 0 })}
                    required
                  />
                  <Input
                    type="number"
                    label="Jumlah Laki-laki"
                    value={profileForm.laki_laki || 0}
                    onChange={(val) => setProfileForm({ ...profileForm, laki_laki: parseInt(val) || 0 })}
                    required
                  />
                  <Input
                    type="number"
                    label="Jumlah Perempuan"
                    value={profileForm.perempuan || 0}
                    onChange={(val) => setProfileForm({ ...profileForm, perempuan: parseInt(val) || 0 })}
                    required
                  />
                  <Input
                    type="number"
                    label="Penduduk Bekerja"
                    value={profileForm.bekerja || 0}
                    onChange={(val) => setProfileForm({ ...profileForm, bekerja: parseInt(val) || 0 })}
                    required
                  />
                  <Input
                    type="number"
                    label="Penduduk Menganggur"
                    value={profileForm.menganggur || 0}
                    onChange={(val) => setProfileForm({ ...profileForm, menganggur: parseInt(val) || 0 })}
                    required
                  />
                </div>
                <p className="mt-3 text-xs text-leaf-600 font-semibold">
                  * Catatan: Total Penduduk dihitung otomatis dari (Laki-laki + Perempuan). Angkatan kerja dihitung dari (Bekerja + Menganggur).
                </p>
              </div>

              {/* Perangkat Desa List Editor */}
              <div className="rounded-[8px] border border-earth-100 bg-cream p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-earth-700 text-lg">Struktur Perangkat Desa</span>
                  <button
                    type="button"
                    onClick={handleAddPerangkat}
                    className="inline-flex items-center gap-1 rounded-full bg-leaf-100 px-3 py-1.5 text-xs font-bold text-leaf-700 hover:bg-leaf-200 transition"
                  >
                    <Plus size={14} /> Tambah Jabatan
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {(profileForm.perangkat || []).map((p, idx) => (
                    <div key={idx} className="relative rounded-[8px] border border-earth-100 bg-white p-4 shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleRemovePerangkat(idx)}
                        className="absolute right-2 top-2 rounded-full bg-red-50 p-1 text-red-500 hover:bg-red-100 transition"
                      >
                        <X size={14} />
                      </button>
                      <div className="space-y-3 pt-3">
                        <label className="block">
                          <span className="text-xs font-bold text-earth-600">Nama Jabatan</span>
                          <input
                            type="text"
                            value={p.jabatan}
                            onChange={(e) => handlePerangkatChange(idx, 'jabatan', e.target.value)}
                            className="mt-1 w-full rounded-[6px] border border-earth-100 bg-cream px-3 py-2 text-sm font-semibold outline-none focus:border-leaf-500 text-leaf-900"
                            placeholder="Contoh: Kepala Desa"
                            required
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs font-bold text-earth-600">Nama Pejabat</span>
                          <input
                            type="text"
                            value={p.nama}
                            onChange={(e) => handlePerangkatChange(idx, 'nama', e.target.value)}
                            className="mt-1 w-full rounded-[6px] border border-earth-100 bg-cream px-3 py-2 text-sm font-semibold outline-none focus:border-leaf-500 text-leaf-900"
                            placeholder="Contoh: Sutrisno"
                            required
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                  {(!profileForm.perangkat || profileForm.perangkat.length === 0) && (
                    <div className="col-span-full py-4 text-center text-sm text-leaf-500 italic">
                      Belum ada perangkat desa yang terdaftar.
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-leaf-700 px-6 py-3 font-extrabold text-cream disabled:opacity-60 shadow-medium hover:bg-leaf-800 transition"
                >
                  Simpan Semua Perubahan Profil
                </button>
              </div>
            </form>
          </div>
        )}
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
