import { ArrowLeft, Plus, Trash2, UploadCloud } from 'lucide-react';
import { useEffect, useMemo, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { createSupabase, getAdminToken } from '../lib/supabase.js';

export default function AdminKegiatanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getAdminToken();
  const supabase = useMemo(() => createSupabase(token), [token]);

  const [form, setForm] = useState({ judul: '', deskripsi: '', tanggal: '' });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('kegiatan')
        .select('*, kegiatan_foto(id, url_foto)')
        .eq('id', id)
        .single();
      
      if (error) {
        toast.error('Gagal memuat kegiatan');
        navigate('/admin/dashboard');
        return;
      }
      
      setForm({ judul: data.judul, deskripsi: data.deskripsi, tanggal: data.tanggal });
      setPhotos(data.kegiatan_foto || []);
      setLoading(false);
    }
    loadData();
  }, [id, supabase, navigate]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('kegiatan').update(form).eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Kegiatan berhasil diperbarui.');
      navigate('/admin/dashboard');
    }
    setSaving(false);
  }

  async function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    let uploadedCount = 0;
    
    try {
      for (const file of files) {
        const extension = file.name.split('.').pop();
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const path = `${id}/${uniqueId}.${extension}`;
        
        const { error: uploadError } = await supabase.storage.from('foto-kegiatan').upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });
        
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage.from('foto-kegiatan').getPublicUrl(path);
        
        const { data: dbData, error: dbError } = await supabase.from('kegiatan_foto').insert({
          kegiatan_id: id,
          url_foto: publicUrlData.publicUrl,
        }).select().single();
        
        if (dbError) throw dbError;
        
        setPhotos(prev => [...prev, dbData]);
        uploadedCount++;
      }
      if (uploadedCount > 0) toast.success(`${uploadedCount} foto berhasil diunggah.`);
    } catch (error) {
      toast.error('Gagal mengunggah foto: ' + error.message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploading(false);
    }
  }

  async function handleDeletePhoto(photoId, url) {
    if (!confirm('Hapus foto ini?')) return;
    
    try {
      // Extract path from the public URL. 
      // Supabase public URLs usually look like: .../storage/v1/object/public/foto-kegiatan/folder/filename.jpg
      const urlParts = url.split('/foto-kegiatan/');
      if (urlParts.length > 1) {
        const path = urlParts[1];
        await supabase.storage.from('foto-kegiatan').remove([path]);
      }
    } catch (err) {
      console.error('Error deleting file from storage:', err);
    }
    
    const { error } = await supabase.from('kegiatan_foto').delete().eq('id', photoId);
    if (error) {
      toast.error('Gagal menghapus foto: ' + error.message);
      return;
    }
    
    setPhotos(prev => prev.filter(p => p.id !== photoId));
    toast.success('Foto dihapus.');
  }

  if (loading) {
    return <div className="p-8 text-center text-leaf-700 font-bold animate-pulse">Memuat data...</div>;
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-8 text-leaf-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/admin/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-earth-600 transition hover:text-earth-800">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
        
        <h1 className="mb-8 font-display text-3xl font-black">Edit Kegiatan</h1>
        
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <section className="rounded-[8px] border border-earth-100 bg-white/82 p-5 shadow-soft h-fit">
            <h2 className="mb-4 font-display text-xl font-black">Informasi Utama</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <label className="block">
                <span className="font-bold text-earth-700">Judul</span>
                <input required value={form.judul} onChange={(e) => setForm({...form, judul: e.target.value})} className="mt-2 w-full rounded-[8px] border border-earth-100 bg-cream px-4 py-3 font-semibold outline-none focus:border-leaf-500" />
              </label>
              <label className="block">
                <span className="font-bold text-earth-700">Deskripsi</span>
                <textarea required rows={5} value={form.deskripsi} onChange={(e) => setForm({...form, deskripsi: e.target.value})} className="mt-2 w-full rounded-[8px] border border-earth-100 bg-cream px-4 py-3 font-semibold outline-none focus:border-leaf-500" />
              </label>
              <label className="block">
                <span className="font-bold text-earth-700">Tanggal</span>
                <input required type="date" value={form.tanggal} onChange={(e) => setForm({...form, tanggal: e.target.value})} className="mt-2 w-full rounded-[8px] border border-earth-100 bg-cream px-4 py-3 font-semibold outline-none focus:border-leaf-500" />
              </label>
              <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf-700 px-5 py-3 font-extrabold text-cream transition hover:bg-leaf-900 disabled:opacity-60">
                <Plus size={18} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </section>

          <section className="rounded-[8px] border border-earth-100 bg-white/82 p-5 shadow-soft h-fit">
            <h2 className="mb-4 font-display text-xl font-black">Galeri Foto</h2>
            
            <div className="mb-4">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-earth-300 bg-cream p-6 text-center transition hover:bg-earth-100">
                <UploadCloud size={30} className="mb-3 text-earth-500" />
                <span className="text-sm font-extrabold text-earth-700">
                  {uploading ? 'Mengunggah...' : 'Pilih Foto Baru'}
                </span>
                <span className="mt-1 text-xs font-semibold text-leaf-700">
                  Foto akan langsung terunggah.
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-[8px] border border-earth-100 bg-cream">
                  <img src={photo.url_foto} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-75" />
                  <button
                    onClick={() => handleDeletePhoto(photo.id, photo.url_foto)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-600"
                    title="Hapus foto"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              {photos.length === 0 && (
                <div className="col-span-2 py-8 text-center text-sm font-semibold text-earth-500">
                  Belum ada foto yang diunggah.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
