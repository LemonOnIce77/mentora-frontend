# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Mahasiswa (Mentee):** Mahasiswa yang mencari mentor sebaya atau partner belajar untuk mendalami skill akademik maupun praktis, memilih jadwal belajar online/offline, dan berkoordinasi via chat.
- **Mentor Terverifikasi (Mentor):** Mahasiswa berprestasi atau berpengalaman yang telah mengunggah kredensial dan disetujui Admin untuk mengajar serta mengumpulkan EduPoints per sesi.
- **Administrator (Admin):** Pengelola yang meninjau dan memverifikasi pengajuan kredensial calon mentor.

## Product Purpose

Mentora adalah platform pertukaran skill dan mentoring peer-to-peer antar mahasiswa di Indonesia agar mahasiswa dapat belajar dari teman sejawat secara fleksibel (daring maupun tatap muka), melacak jadwal sesi belajar, dan berkembang melalui kolaborasi kampus.

## Positioning

Ekosistem mentoring sebaya antar kampus yang menghubungkan pencarian mentor berdasarkan skill/kampus, pencocokan partner belajar berbasis lokasi/minat (`/matching`), reservasi sesi langsung, ruang diskusi terintegrasi, dan sistem reputasi EduPoints dalam satu workspace terpadu.

## Operating Context

- Aplikasi web berbasis Next.js App Router (`src/app/`) dengan autentikasi sesi cookie/JWT dan backend API/Prisma MySQL.
- Pengguna masuk ke `/dashboard` sebagai workspace utama harian untuk menemukan mentor terverifikasi, memfilter keahlian, memesan sesi belajar, mengelola riwayat sesi, mengedit profil, memantau skill, dan mengajukan verifikasi mentor.

## Capabilities and Constraints

- Tab & fitur pada `/dashboard`: `Daftar Mentor`, `Riwayat Sesi Belajar`, `Manajemen Profil`, `Pengelolaan Skill`, `Pengajuan Mentor & Kredensial` (serta `Admin Verifikasi Mentor` khusus role Admin).
- Pintasan aktivitas utama dari Dashboard: `/matching` (Cari Partner Belajar) dan `/chat` (Pesan & Diskusi).
- Fitur interaktif wajib terjaga: filter search/skill real-time ke `/api/mentor/list`, `BookingModal`, edit profil & deteksi GPS, upload dokumen kredensial, dan review Admin.
- Penggunaan lokal berbahasa Indonesia yang jelas dan alami untuk konteks akademik mahasiswa.

## Brand Commitments

- **Nama & Identitas:** Mentora (`/Mentora.svg`).
- **Palet Warna Resmi (Google / Google News grounded palette):**
  - Canvas White (`#F8F9FA`) sebagai latar utama halaman
  - Surface (`#FFFFFF`) sebagai permukaan bersih di atas canvas
  - Charcoal Ink (`#202124`) untuk teks utama & tipografi kuat
  - Graphite (`#3C4043`) & Slate Muted (`#5F6368`) untuk teks sekunder & metadata
  - Mist / Line (`#DADCE0`) untuk hairline dividers & outline terstruktur
  - Google Blue Deep (`#1967D2`) untuk tautan, fokus, pilihan aktif, dan tanda centang verifikasi. Biru muda (`#E8F0FE`) menandai pilihan dan konfirmasi.
  - Label keahlian, peran, lokasi, dan poin menggunakan Graphite atau Slate di atas Canvas White. Status disetujui, menunggu, dan ditolak mempunyai label teks.
  - Primary CTA button menggunakan Graphite/Charcoal (`action-primary`), bukan biru solid.
