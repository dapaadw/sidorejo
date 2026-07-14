import { ArrowRight, Home, Map, Mountain, Sprout, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import StatCard from '../components/StatCard.jsx';
import KegiatanCard from '../components/KegiatanCard.jsx';
import { fallbackKegiatan } from '../lib/fallbackData.js';
import { publicSupabase } from '../lib/supabase.js';

const stats = [
  { icon: UsersRound, label: 'Jumlah Penduduk', value: '± 4.200 jiwa' },
  { icon: Map, label: 'Luas Wilayah', value: '± 610 ha' },
  { icon: Home, label: 'Dusun', value: '4 dusun' },
  { icon: Sprout, label: 'Potensi Utama', value: 'Pertanian' },
];

export default function Beranda() {
  const [kegiatan, setKegiatan] = useState(fallbackKegiatan);

  useEffect(() => {
    async function load() {
      if (!publicSupabase) return;
      const { data } = await publicSupabase
        .from('kegiatan')
        .select('*, kegiatan_foto(url_foto)')
        .order('tanggal', { ascending: false })
        .limit(3);
      if (data?.length) setKegiatan(data);
    }
    load();
  }, []);

  return (
    <>
      <section className="village-pattern relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cream/60 via-cream/20 to-cream" />
        <div className="relative mx-auto grid min-h-[calc(100vh-78px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-2xl animate-fade-in-up opacity-0">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/78 px-4 py-2 text-sm font-black text-clay shadow-soft">
              <Mountain size={18} /> Kecamatan Doko, Kabupaten Blitar
            </p>
            <h1 className="font-display text-4xl font-black leading-tight text-leaf-900 sm:text-5xl lg:text-6xl">
              Desa Sidorejo yang guyub, asri, dan terus bertumbuh.
            </h1>
            <p className="mt-5 text-lg leading-9 text-leaf-700">
              Selamat datang di profil resmi Desa Sidorejo. Di sini warga dan pengunjung
              dapat mengenal kegiatan desa, layanan administrasi, potensi lokal, serta
              kabar terbaru dari lingkungan kami.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/profil"
                className="inline-flex items-center gap-2 rounded-full bg-leaf-700 px-6 py-3 font-extrabold text-cream shadow-soft transition hover:bg-leaf-900"
              >
                Kenali Desa <ArrowRight size={19} />
              </Link>
              <Link
                to="/layanan"
                className="inline-flex items-center gap-2 rounded-full border border-earth-300 bg-white/70 px-6 py-3 font-extrabold text-earth-700 transition hover:bg-earth-100"
              >
                Layanan Desa
              </Link>
            </div>
          </div>
          <div className="relative animate-fade-in-up-delay-1 opacity-0">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=85"
              alt="Suasana sawah pedesaan"
              className="aspect-[4/3] w-full rounded-[8px] object-cover shadow-soft"
            />
            <div className="absolute -bottom-6 left-5 right-5 rounded-[8px] border border-earth-100 bg-cream/95 p-5 shadow-soft">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-clay">
                Sambutan Kepala Desa
              </p>
              <p className="mt-2 text-sm leading-7 text-leaf-800">
                "Mari kita rawat Sidorejo sebagai rumah bersama yang maju tanpa kehilangan
                akar gotong royong dan keramahan desa."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 animate-fade-in-up-delay-2 opacity-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </div>
      </section>

      <section className="bg-white/54 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Kabar Desa" title="Kegiatan Terbaru">
            Catatan kecil dari aktivitas warga, pemerintah desa, kelompok tani, UMKM, dan
            komunitas yang ikut menghidupkan Sidorejo.
          </SectionHeading>
          <div className="grid gap-6 md:grid-cols-3">
            {kegiatan.map((item) => (
              <KegiatanCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
