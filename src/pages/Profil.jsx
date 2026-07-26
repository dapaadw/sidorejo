import { useEffect, useState } from 'react';
import { Landmark, Leaf, Mountain, Store, Target, UsersRound, BarChart3 } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import VillageStats from '../components/VillageStats.jsx';
import { publicSupabase } from '../lib/supabase.js';
import { fallbackProfil } from '../lib/fallbackData.js';

const potensi = [
  { icon: Leaf, title: 'Pertanian', desc: 'Lahan sawah, kebun, dan komoditas pangan menjadi penopang ekonomi warga.' },
  { icon: Mountain, title: 'Alam Doko', desc: 'Lanskap perbukitan dan udara sejuk memberi peluang wisata desa yang ramah keluarga.' },
  { icon: Store, title: 'UMKM', desc: 'Produk olahan rumah tangga dan usaha warga dapat dikembangkan melalui promosi digital.' },
];

export default function Profil() {
  const [profile, setProfile] = useState(fallbackProfil);

  useEffect(() => {
    async function fetchProfile() {
      if (!publicSupabase) return;
      try {
        const { data, error } = await publicSupabase
          .from('profil_desa')
          .select('*')
          .eq('id', 'default')
          .single();
        if (error) throw error;
        if (data) {
          setProfile(data);
        }
      } catch (err) {
        console.error('Gagal memuat profil desa dari Supabase:', err.message);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Profil Desa" title="Mengenal Desa Sidorejo">
        Sidorejo berada di Kecamatan Doko, Kabupaten Blitar, Jawa Timur, dengan suasana
        pedesaan yang hangat, hijau, dan kuat dalam budaya gotong royong.
      </SectionHeading>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] animate-fade-in-up">
        <section className="rounded-[8px] border border-earth-100 bg-white/80 p-6 shadow-soft">
          <h3 className="mb-4 flex items-center gap-2 font-display text-2xl font-black">
            <Landmark className="text-clay" /> Sejarah Singkat
          </h3>
          <p className="leading-8 text-leaf-700 whitespace-pre-line">
            {profile.sejarah}
          </p>
        </section>

        <section className="rounded-[8px] border border-earth-100 bg-leaf-700 p-6 text-cream shadow-soft">
          <h3 className="mb-4 flex items-center gap-2 font-display text-2xl font-black">
            <Target /> Visi dan Misi
          </h3>
          <p className="font-bold">Visi</p>
          <p className="mt-1 leading-7 text-leaf-50">
            {profile.visi}
          </p>
          <p className="mt-5 font-bold">Misi</p>
          <ul className="mt-2 space-y-2 text-sm leading-7 text-leaf-50 list-disc list-inside">
            {Array.isArray(profile.misi) ? (
              profile.misi.map((m, idx) => <li key={idx}>{m}</li>)
            ) : (
              <li>{profile.misi}</li>
            )}
          </ul>
        </section>
      </div>

      {/* Demografi & Bagan Penduduk */}
      <section className="mt-12 animate-fade-in-up-delay-1 opacity-0">
        <h3 className="mb-6 flex items-center gap-2 font-display text-2xl font-black">
          <BarChart3 className="text-clay" /> Kependudukan & Demografi Desa
        </h3>
        <VillageStats stats={profile} />
      </section>

      {/* Struktur Perangkat */}
      <section className="mt-12 animate-fade-in-up-delay-2 opacity-0">
        <h3 className="mb-5 flex items-center gap-2 font-display text-2xl font-black">
          <UsersRound className="text-clay" /> Struktur Perangkat Desa
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {profile.perangkat?.map((item) => (
            <div key={item.jabatan} className="rounded-[8px] border border-earth-100 bg-white/78 p-4 shadow-soft">
              <p className="text-xs font-bold text-clay uppercase tracking-wider">{item.jabatan}</p>
              <p className="text-lg font-black text-leaf-900 mt-1">{item.nama || '-'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Potensi Desa */}
      <section className="mt-12 animate-fade-in-up-delay-2 opacity-0">
        <h3 className="mb-5 font-display text-2xl font-black">Potensi Desa</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {potensi.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-[8px] border border-earth-100 bg-white/78 p-6 shadow-soft">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-earth-100 text-clay">
                <Icon size={25} />
              </div>
              <h4 className="font-display text-xl font-black">{title}</h4>
              <p className="mt-3 text-sm leading-7 text-leaf-700">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

