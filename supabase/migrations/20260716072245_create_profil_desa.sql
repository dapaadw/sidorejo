create table if not exists public.profil_desa (
  id text primary key default 'default' check (id = 'default'),
  visi text not null default 'Terwujudnya Desa Sidorejo yang maju, mandiri, sejahtera, dan berbudaya.',
  misi jsonb not null default '["Meningkatkan kualitas pelayanan administrasi desa.", "Menguatkan pertanian, UMKM, dan ekonomi warga.", "Menjaga lingkungan desa yang bersih, aman, dan lestari."]'::jsonb,
  sejarah text not null default 'Desa Sidorejo tumbuh dari kehidupan masyarakat agraris yang menjaga hubungan erat dengan tanah, air, dan lingkungan sekitar. Semangat guyub rukun menjadi dasar dalam membangun desa, mulai dari kegiatan sosial, pertanian, hingga pelayanan publik.',
  kk integer not null default 1250,
  laki_laki integer not null default 2450,
  perempuan integer not null default 2510,
  bekerja integer not null default 3200,
  menganggur integer not null default 1760,
  perangkat jsonb not null default '[
    {"jabatan": "Kepala Desa", "nama": "Sutrisno"},
    {"jabatan": "Sekretaris Desa", "nama": "Wahyudi"},
    {"jabatan": "Kaur Tata Usaha dan Umum", "nama": "Dwi Astuti"},
    {"jabatan": "Kaur Keuangan", "nama": "Rina Wati"},
    {"jabatan": "Kaur Perencanaan", "nama": "Budi Santoso"},
    {"jabatan": "Kasi Pemerintahan", "nama": "Heri Prasetyo"},
    {"jabatan": "Kasi Kesejahteraan", "nama": "Joko Susilo"},
    {"jabatan": "Kasi Pelayanan", "nama": "Siti Aminah"},
    {"jabatan": "Kepala Dusun", "nama": "Mulyono"}
  ]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profil_desa enable row level security;

-- Drop policies if exists
drop policy if exists "Publik dapat membaca profil desa" on public.profil_desa;
drop policy if exists "Admin JWT dapat mengelola profil desa" on public.profil_desa;

-- Create policies
create policy "Publik dapat membaca profil desa"
on public.profil_desa for select
to anon, authenticated
using (true);

create policy "Admin JWT dapat mengelola profil desa"
on public.profil_desa for all
to authenticated
using ((auth.jwt() ->> 'is_admin') = 'true')
with check ((auth.jwt() ->> 'is_admin') = 'true');

-- Insert default row if not exists
insert into public.profil_desa (id) 
values ('default') 
on conflict (id) do nothing;
