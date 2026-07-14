import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/utils.js';

export default function KegiatanCard({ item }) {
  const image = item.kegiatan_foto?.[0]?.url_foto;

  return (
    <article className="overflow-hidden rounded-[8px] border border-earth-100 bg-white shadow-soft">
      <Link to={`/kegiatan/${item.id}`} className="block">
        <img
          src={image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'}
          alt={item.judul}
          className="h-52 w-full object-cover"
        />
      </Link>
      <div className="p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-clay">
          <CalendarDays size={17} /> {formatDate(item.tanggal)}
        </p>
        <Link to={`/kegiatan/${item.id}`}>
          <h3 className="font-display text-xl font-black leading-tight text-leaf-900 hover:text-leaf-700">
            {item.judul}
          </h3>
        </Link>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-leaf-700">{item.deskripsi}</p>
      </div>
    </article>
  );
}
