import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';

export default function Kontak() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Kontak" title="Hubungi Kantor Desa Sidorejo">
        Kami siap membantu kebutuhan administrasi dan informasi desa pada jam operasional.
      </SectionHeading>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] animate-fade-in-up">
        <div className="space-y-4">
          {[
            { icon: MapPin, title: 'Alamat', body: 'Kantor Desa Sidorejo, Kecamatan Doko, Kabupaten Blitar, Jawa Timur' },
            { icon: Phone, title: 'Telepon', body: '0342-000000' },
            { icon: Mail, title: 'Email', body: 'desa.sidorejo@example.com' },
            { icon: Clock, title: 'Jam Operasional', body: 'Senin - Jumat, 08.00 - 15.00 WIB' },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-[8px] border border-earth-100 bg-white/82 p-5 shadow-soft">
              <p className="mb-2 flex items-center gap-2 font-extrabold text-clay"><Icon size={19} /> {title}</p>
              <p className="leading-7 text-leaf-700">{body}</p>
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-[8px] border border-earth-100 bg-white shadow-soft">
          <iframe
            title="Peta Desa Sidorejo Doko Blitar"
            src="https://www.google.com/maps?q=Desa%20Sidorejo%20Doko%20Blitar&output=embed"
            className="h-[460px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
