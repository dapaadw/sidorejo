import { Mail, MapPin, Phone, Sprout } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 bg-leaf-900 text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-500">
              <Sprout size={24} />
            </span>
            <div>
              <p className="font-display text-xl font-black">Desa Sidorejo</p>
              <p className="text-sm text-leaf-100">Ramah, guyub, dan bertumbuh bersama.</p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-7 text-leaf-100">
            Website profil Desa Sidorejo, Kecamatan Doko, Kabupaten Blitar, Jawa Timur.
            Dibuat untuk membantu warga dan pengunjung mengenal layanan, kegiatan, dan
            potensi desa.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-extrabold">Kontak Desa</h3>
          <div className="space-y-3 text-sm text-leaf-100">
            <p className="flex gap-2"><MapPin size={18} /> Kantor Desa Sidorejo, Doko, Blitar</p>
            <p className="flex gap-2"><Phone size={18} /> 0823-3052-0585</p>
            <p className="flex gap-2"><Mail size={18} /> desa.sidorejo8@gmail.com</p>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-extrabold">Jam Operasional</h3>
          <p className="text-sm leading-7 text-leaf-100">
            Senin - Kamis<br />
            08.00 - 13.00 WIB<br />
            Jumat<br />
            08.00 - 11.00 WIB<br />
            Sabtu, Minggu, dan hari libur nasional tutup.
          </p>
        </div>
      </div>
      <div className="border-t border-leaf-700/70 py-4 text-center text-xs text-leaf-100">
        © {new Date().getFullYear()} Pemerintah Desa Sidorejo. Made by <a href="https://www.instagram.com/sidorejournal_/" className="font-bold hover:text-leaf-500 transition">MMD FILKOM UB 2026</a>
      </div>
    </footer>
  );
}
