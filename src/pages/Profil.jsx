import { Landmark, Leaf, Mountain, Store, Target, UsersRound } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';

const perangkat = [
  'Kepala Desa',
  'Sekretaris Desa',
  'Kaur Tata Usaha dan Umum',
  'Kaur Keuangan',
  'Kaur Perencanaan',
  'Kasi Pemerintahan',
  'Kasi Kesejahteraan',
  'Kasi Pelayanan',
  'Kepala Dusun',
];

const potensi = [
  { icon: Leaf, title: 'Pertanian', desc: 'Lahan sawah, kebun, dan komoditas pangan menjadi penopang ekonomi warga.' },
  { icon: Mountain, title: 'Alam Doko', desc: 'Lanskap perbukitan dan udara sejuk memberi peluang wisata desa yang ramah keluarga.' },
  { icon: Store, title: 'UMKM', desc: 'Produk olahan rumah tangga dan usaha warga dapat dikembangkan melalui promosi digital.' },
];

export default function Profil() {
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
          <p className="leading-8 text-leaf-700">
            Desa Sidorejo tumbuh dari kehidupan masyarakat agraris yang menjaga hubungan
            erat dengan tanah, air, dan lingkungan sekitar. Semangat guyub rukun menjadi
            dasar dalam membangun desa, mulai dari kegiatan sosial, pertanian, hingga
            pelayanan publik. Data sejarah rinci dapat diperbarui oleh admin sesuai arsip desa.
          </p>
        </section>

        <section className="rounded-[8px] border border-earth-100 bg-leaf-700 p-6 text-cream shadow-soft">
          <h3 className="mb-4 flex items-center gap-2 font-display text-2xl font-black">
            <Target /> Visi dan Misi
          </h3>
          <p className="font-bold">Visi</p>
          <p className="mt-1 leading-7 text-leaf-50">
            Terwujudnya Desa Sidorejo yang maju, mandiri, sejahtera, dan berbudaya.
          </p>
          <p className="mt-5 font-bold">Misi</p>
          <ul className="mt-2 space-y-2 text-sm leading-7 text-leaf-50">
            <li>Meningkatkan kualitas pelayanan administrasi desa.</li>
            <li>Menguatkan pertanian, UMKM, dan ekonomi warga.</li>
            <li>Menjaga lingkungan desa yang bersih, aman, dan lestari.</li>
          </ul>
        </section>
      </div>

      <section className="mt-12 animate-fade-in-up-delay-1 opacity-0">
        <h3 className="mb-5 flex items-center gap-2 font-display text-2xl font-black">
          <UsersRound className="text-clay" /> Struktur Perangkat Desa
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {perangkat.map((item) => (
            <div key={item} className="rounded-[8px] border border-earth-100 bg-white/78 p-4 font-bold shadow-soft">
              {item}
            </div>
          ))}
        </div>
      </section>

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
