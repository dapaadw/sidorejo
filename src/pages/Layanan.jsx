import { ClipboardList } from 'lucide-react';
import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import { fallbackLayanan } from '../lib/fallbackData.js';
import { publicSupabase } from '../lib/supabase.js';
import { splitLines } from '../lib/utils.js';

export default function Layanan() {
  const [items, setItems] = useState(fallbackLayanan);

  useEffect(() => {
    async function load() {
      if (!publicSupabase) return;
      const { data } = await publicSupabase.from('layanan').select('*').order('created_at', { ascending: false });
      if (data?.length) setItems(data);
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Layanan Administrasi" title="Urus Kebutuhan Warga dengan Jelas">
        Daftar layanan desa beserta syarat dan alurnya. Datanglah pada jam operasional
        dengan berkas yang sudah lengkap agar proses lebih lancar.
      </SectionHeading>

      <div className="grid gap-6 md:grid-cols-2 animate-fade-in-up">
        {items.map((item) => (
          <article key={item.id} className="rounded-[8px] border border-earth-100 bg-white/82 p-6 shadow-soft">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
              <ClipboardList size={24} />
            </div>
            <h3 className="font-display text-2xl font-black">{item.nama_layanan}</h3>
            <p className="mt-3 leading-7 text-leaf-700">{item.deskripsi}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 font-extrabold text-clay">Syarat</p>
                <ul className="space-y-2 text-sm leading-6 text-leaf-700">
                  {splitLines(item.syarat).map((value) => <li key={value}>• {value}</li>)}
                </ul>
              </div>
              <div>
                <p className="mb-2 font-extrabold text-clay">Alur</p>
                <ul className="space-y-2 text-sm leading-6 text-leaf-700">
                  {splitLines(item.alur).map((value) => <li key={value}>• {value}</li>)}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
