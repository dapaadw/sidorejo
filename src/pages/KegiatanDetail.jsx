import { ArrowLeft, CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fallbackKegiatan } from '../lib/fallbackData.js';
import { publicSupabase } from '../lib/supabase.js';
import { formatDate } from '../lib/utils.js';

export default function KegiatanDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(fallbackKegiatan.find((entry) => String(entry.id) === String(id)));

  useEffect(() => {
    async function load() {
      if (!publicSupabase) return;
      const { data } = await publicSupabase
        .from('kegiatan')
        .select('*, kegiatan_foto(url_foto)')
        .eq('id', id)
        .single();
      if (data) setItem(data);
    }
    load();
  }, [id]);

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-display text-2xl font-black">Kegiatan tidak ditemukan.</p>
        <Link to="/kegiatan" className="mt-5 inline-flex rounded-full bg-leaf-700 px-5 py-3 font-bold text-cream">
          Kembali ke Kegiatan
        </Link>
      </div>
    );
  }

  const photos = item.kegiatan_foto?.length ? item.kegiatan_foto : [{ url_foto: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1200&q=80' }];

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/kegiatan" className="mb-6 inline-flex items-center gap-2 font-extrabold text-clay">
        <ArrowLeft size={18} /> Semua Kegiatan
      </Link>
      <p className="mb-3 flex items-center gap-2 font-bold text-clay">
        <CalendarDays size={18} /> {formatDate(item.tanggal)}
      </p>
      <h1 className="font-display text-4xl font-black leading-tight text-leaf-900">{item.judul}</h1>
      <img src={photos[0].url_foto} alt={item.judul} className="mt-8 aspect-[16/9] w-full rounded-[8px] object-cover shadow-soft" />
      <p className="mt-8 whitespace-pre-line text-lg leading-9 text-leaf-800">{item.deskripsi}</p>

      <h2 className="mb-4 mt-10 font-display text-2xl font-black">Galeri Foto</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {photos.map((photo, index) => (
          <img
            key={`${photo.url_foto}-${index}`}
            src={photo.url_foto}
            alt={`${item.judul} ${index + 1}`}
            className="aspect-[4/3] w-full rounded-[8px] object-cover shadow-soft"
          />
        ))}
      </div>
    </article>
  );
}
