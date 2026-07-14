create extension if not exists "pgcrypto";

create table if not exists public.admin (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.kegiatan (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deskripsi text not null,
  tanggal date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.kegiatan_foto (
  id uuid primary key default gen_random_uuid(),
  kegiatan_id uuid not null references public.kegiatan(id) on delete cascade,
  url_foto text not null
);

create table if not exists public.layanan (
  id uuid primary key default gen_random_uuid(),
  nama_layanan text not null,
  deskripsi text not null,
  syarat text not null,
  alur text not null,
  created_at timestamptz not null default now()
);

alter table public.admin enable row level security;
alter table public.kegiatan enable row level security;
alter table public.kegiatan_foto enable row level security;
alter table public.layanan enable row level security;

drop policy if exists "Publik dapat membaca kegiatan" on public.kegiatan;
drop policy if exists "Publik dapat membaca foto kegiatan" on public.kegiatan_foto;
drop policy if exists "Publik dapat membaca layanan" on public.layanan;
drop policy if exists "Admin JWT dapat mengelola kegiatan" on public.kegiatan;
drop policy if exists "Admin JWT dapat mengelola foto kegiatan" on public.kegiatan_foto;
drop policy if exists "Admin JWT dapat mengelola layanan" on public.layanan;

create policy "Publik dapat membaca kegiatan"
on public.kegiatan for select
to anon, authenticated
using (true);

create policy "Publik dapat membaca foto kegiatan"
on public.kegiatan_foto for select
to anon, authenticated
using (true);

create policy "Publik dapat membaca layanan"
on public.layanan for select
to anon, authenticated
using (true);

create policy "Admin JWT dapat mengelola kegiatan"
on public.kegiatan for all
to authenticated
using ((auth.jwt() ->> 'is_admin') = 'true')
with check ((auth.jwt() ->> 'is_admin') = 'true');

create policy "Admin JWT dapat mengelola foto kegiatan"
on public.kegiatan_foto for all
to authenticated
using ((auth.jwt() ->> 'is_admin') = 'true')
with check ((auth.jwt() ->> 'is_admin') = 'true');

create policy "Admin JWT dapat mengelola layanan"
on public.layanan for all
to authenticated
using ((auth.jwt() ->> 'is_admin') = 'true')
with check ((auth.jwt() ->> 'is_admin') = 'true');

insert into storage.buckets (id, name, public)
values ('foto-kegiatan', 'foto-kegiatan', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Publik dapat membaca foto storage" on storage.objects;
drop policy if exists "Admin JWT dapat upload foto kegiatan" on storage.objects;
drop policy if exists "Admin JWT dapat update foto kegiatan" on storage.objects;
drop policy if exists "Admin JWT dapat hapus foto kegiatan" on storage.objects;

create policy "Publik dapat membaca foto storage"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'foto-kegiatan');

create policy "Admin JWT dapat upload foto kegiatan"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'foto-kegiatan'
  and (auth.jwt() ->> 'is_admin') = 'true'
);

create policy "Admin JWT dapat update foto kegiatan"
on storage.objects for update
to authenticated
using (
  bucket_id = 'foto-kegiatan'
  and (auth.jwt() ->> 'is_admin') = 'true'
)
with check (
  bucket_id = 'foto-kegiatan'
  and (auth.jwt() ->> 'is_admin') = 'true'
);

create policy "Admin JWT dapat hapus foto kegiatan"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'foto-kegiatan'
  and (auth.jwt() ->> 'is_admin') = 'true'
);

-- Hash bcrypt untuk password awal: Sidorejo@maju
-- Buat hash baru kapan saja dengan `npm run hash:admin`.
insert into public.admin (username, password_hash)
values ('miminsidorejo', '$2a$10$wuRgUN3dDFeuVGVnMTrIeOAeqeuIsfQ67G.Gtl/DMC3TctFviwQMu')
on conflict (username) do update set password_hash = excluded.password_hash;
