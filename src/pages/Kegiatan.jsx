import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import KegiatanCard from '../components/KegiatanCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { fallbackKegiatan } from '../lib/fallbackData.js';
import { publicSupabase } from '../lib/supabase.js';

const pageSize = 6;

export default function Kegiatan() {
  const [items, setItems] = useState(fallbackKegiatan);
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      if (!publicSupabase) return;
      const { data } = await publicSupabase
        .from('kegiatan')
        .select('*, kegiatan_foto(url_foto)')
        .order('tanggal', { ascending: false });
      if (data?.length) setItems(data);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const keyword = query.toLowerCase();
    return items.filter((item) => {
      const matchesKeyword =
        item.judul.toLowerCase().includes(keyword) ||
        item.deskripsi.toLowerCase().includes(keyword);
      const matchesDate = !date || item.tanggal === date;
      return matchesKeyword && matchesDate;
    });
  }, [items, query, date]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Kegiatan Desa" title="Berita dan Kegiatan Sidorejo">
        Telusuri kabar terbaru, agenda warga, dan dokumentasi kegiatan desa.
      </SectionHeading>

      <div className="mb-8 grid gap-3 rounded-[8px] border border-earth-100 bg-white/78 p-4 shadow-soft md:grid-cols-[1fr_220px] animate-fade-in-up">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500" size={19} />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Cari judul atau ringkasan kegiatan"
            className="w-full rounded-full border border-earth-100 bg-cream py-3 pl-11 pr-4 font-semibold outline-none focus:border-leaf-500"
          />
        </label>
        <input
          type="date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setPage(1);
          }}
          className="rounded-full border border-earth-100 bg-cream px-4 py-3 font-semibold outline-none focus:border-leaf-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up-delay-1 opacity-0">
        {visible.map((item) => (
          <KegiatanCard key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 animate-fade-in-up-delay-2 opacity-0">
        <button
          disabled={page === 1}
          onClick={() => setPage((value) => Math.max(1, value - 1))}
          className="rounded-full border border-earth-200 px-4 py-2 font-bold disabled:opacity-40"
        >
          Sebelumnya
        </button>
        <span className="font-bold text-earth-700">
          {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          className="rounded-full border border-earth-200 px-4 py-2 font-bold disabled:opacity-40"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
