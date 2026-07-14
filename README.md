# Website Profil Desa Sidorejo

Website profil Desa Sidorejo, Kecamatan Doko, Kabupaten Blitar. Dibuat dengan React, Tailwind CSS, dan Supabase untuk database, storage foto, serta autentikasi admin custom berbasis bcrypt + JWT.

## Fitur

- **Halaman Publik**: Beranda, Profil Desa, Kegiatan/Berita, Detail Kegiatan & Galeri, Layanan Desa, Kontak, serta Integrasi Google Maps.
- **Halaman Admin Terproteksi**: Login custom (username & password), CRUD kegiatan, unggah banyak foto ke Supabase Storage, CRUD layanan, notifikasi (toast), dan indikator proses (loading state).
- **Pengelolaan Konten Interaktif**: Sistem pencarian kegiatan berdasarkan kata kunci, filter tanggal, dan paginasi halaman.
- **Tampilan Aman & Cepat**: Konten *fallback* tersedia sehingga tampilan web tetap rapi saat proses memuat dari database.

---

## Panduan Memulai (Menjalankan Web Secara Lokal)

### 1. Prasyarat Sistem
Pastikan sudah menginstal:
- [Node.js](https://nodejs.org/) (versi LTS direkomendasikan)
- npm, yarn, atau pnpm

### 2. Instalasi Proyek
Clone repositori ini dan masuk ke dalam folder proyek, lalu jalankan instalasi:
```bash
# Instal seluruh dependensi
npm install
```

### 3. Konfigurasi Environment Variables
Gandakan file konfigurasi `.env.example` untuk membuat file `.env`:
```bash
cp .env.example .env
```
Lalu isi kredensial `.env` dengan URL dan kunci Supabase:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Menjalankan Aplikasi
Jalankan server pengembangan:
```bash
npm run dev
```
Buka browser dan akses aplikasi di alamat yang disediakan.

---

## Setup Database & Supabase

Untuk menjalankan fungsionalitas admin, database harus diinisialisasi:

1. Buka halaman **SQL Editor** di dashboard Supabase.
2. Salin dan jalankan seluruh isi dari file `supabase/sql/schema.sql`.
3. Jika ingin mengganti password admin *default*, hasilkan hash password baru dengan script:
   ```bash
   npm run hash:admin
   ```
   *Password bawaan dari script ini adalah:*
   - Username: `miminsidorejo`
   - Password: `Sidorejo@maju`
4. Salin nilai `Hash` yang muncul dari terminal dan ubah bagian *insert* admin di dalam file `supabase/sql/schema.sql`.

### Deploy Edge Function (Untuk Login)
Login admin dikelola oleh **Edge Function** dari Supabase, bukan pengecekan dari frontend:
```bash
# Deploy fungsi login
supabase functions deploy admin-login

# Tambahkan secret key di Supabase
supabase secrets set SUPABASE_JWT_SECRET=your-project-jwt-secret
```
*(Catatan: `SUPABASE_SERVICE_ROLE_KEY` dan `SUPABASE_URL` umumnya tersedia otomatis. Jika tidak, tambahkan dengan `supabase secrets set`.)*

---

## 🔒 Catatan Keamanan
- Password admin disimpan secara aman menggunakan **bcrypt hash** di dalam tabel `admin`.
- Tabel `admin` **tidak memiliki akses baca publik** (No public read policy).
- Fungsi CRUD (buat, baca, perbarui, hapus) kegiatan dan layanan hanya dapat dilakukan jika request dilampiri **JWT custom** dengan klaim `is_admin=true`.
- **DILARANG KERAS** menyisipkan Service Role Key di frontend.

---

## 📁 Struktur Folder Utama

```text
src/
  ├── components/  # Komponen antarmuka yang dapat digunakan kembali
  ├── lib/         # Konfigurasi atau fungsi utilitas tambahan
  ├── pages/       # Halaman utama (Beranda, Profil, Admin)
supabase/
  ├── functions/   # File Supabase Edge Functions (e.g. admin-login)
  ├── sql/         # Skema database
scripts/
  └── generate-admin-hash.mjs # Script untuk menghasilkan hash password
```
