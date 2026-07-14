import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Sprout, X } from 'lucide-react';

const navItems = [
  ['/', 'Beranda'],
  ['/profil', 'Profil Desa'],
  ['/kegiatan', 'Kegiatan'],
  ['/layanan', 'Layanan'],
  ['/kontak', 'Kontak'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-earth-100/80 bg-cream/92 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-700 text-cream shadow-soft">
            <Sprout size={24} />
          </span>
          <span>
            <span className="block font-display text-lg font-black leading-tight text-leaf-900">
              Desa Sidorejo
            </span>
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-earth-500">
              Doko, Blitar
            </span>
          </span>
        </Link>

        <button
          type="button"
          aria-label="Buka menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-earth-100 text-leaf-900 md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-extrabold transition ${
                  isActive
                    ? 'bg-leaf-700 text-cream'
                    : 'text-leaf-900 hover:bg-leaf-100 hover:text-leaf-700'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/admin/login"
            className="ml-2 rounded-full border border-earth-300 px-4 py-2 text-sm font-extrabold text-earth-700 transition hover:bg-earth-100"
          >
            Admin
          </NavLink>
        </div>
      </nav>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-earth-100 bg-cream px-4 py-3">
          <div className="grid gap-2">
            {navItems.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 font-extrabold ${
                    isActive ? 'bg-leaf-700 text-cream' : 'bg-white/70 text-leaf-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="rounded-2xl border border-earth-200 px-4 py-3 font-extrabold text-earth-700 hover:bg-earth-100 transition-colors"
            >
              Admin
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
