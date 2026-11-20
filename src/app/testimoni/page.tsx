
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { BadgeCheck, Star, MessageSquareText } from 'lucide-react';
import { ArrowRight } from '@/components/animated-icons';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Testimonial {
  id: string;
  nama: string;
  peran: 'Mentee' | 'Mentor';
  kampus: string;
  prodi: string;
  keahlian: string;
  rating: number;
  ulasan: string;
  hasil: string;
  tanggal: string;
  sesiTerverifikasi: boolean;
}

const dataTestimoni: Testimonial[] = [
  {
    id: '1',
    tanggal: '2026-06-18',
    sesiTerverifikasi: true,
    nama: 'Fajar Nugraha',
    peran: 'Mentee',
    kampus: 'Telkom University Surabaya',
    prodi: 'Sistem Informasi',
    keahlian: 'Next.js & REST API',
    rating: 5,
    ulasan:
      'Sempat bingung waktu ngerjain tugas besar Integrasi Sistem. Ketemu mentor sebaya di Mentora yang jelasin cara konsumsi Sanctum API dengan santai tanpa ribet. Proyek selesai tepat waktu!',
    hasil: 'Mendapat nilai A pada Tugas Besar Pemrograman Web',
  },
  {
    id: '2',
    tanggal: '2026-06-15',
    sesiTerverifikasi: true,
    nama: 'Siti Rahmawati',
    peran: 'Mentor',
    kampus: 'Universitas Indonesia',
    prodi: 'Ilmu Komputer',
    keahlian: 'UI/UX & Design System',
    rating: 5,
    ulasan:
      'Menjadi mentor di Mentora bikin portofolio kepemimpinan dan kemampuan mentoring saya diakui saat daftar magang. Mahasiswa yang saya bimbing juga sangat antusias belajar.',
    hasil: 'Membimbing 14 mentee & lolos UI/UX Designer Intern',
  },
  {
    id: '3',
    tanggal: '2026-06-12',
    sesiTerverifikasi: true,
    nama: 'Kevin Ananda',
    peran: 'Mentee',
    kampus: 'Institut Teknologi Sepuluh Nopember',
    prodi: 'Teknik Informatika',
    keahlian: 'Data Science & Python',
    rating: 4,
    ulasan:
      'Materi eksplorasi data dan machine learning-nya sangat daging. Sesi 1-on-1 terasa padat dan solutif, cuma perlu sedikit penyesuaian di jadwal sesi agar tidak bentrok dengan praktikum kampus.',
    hasil: 'Finalis Lomba Data Mining Mahasiswa 2026',
  },
  {
    id: '4',
    tanggal: '2026-06-09',
    sesiTerverifikasi: true,
    nama: 'Alya Sabrina',
    peran: 'Mentee',
    kampus: 'Telkom University Bandung',
    prodi: 'Sistem Informasi',
    keahlian: 'Business Analysis & UML',
    rating: 5,
    ulasan:
      'Belajar analisis proses bisnis bareng mentor yang seangkatan jauh lebih terbuka untuk tanya hal-hal dasar tanpa takut dihakimi. Penjelasannya to-the-point dan aplikatif.',
    hasil: 'Sukses presentasi Capstone Project tingkat 3',
  },
  {
    id: '5',
    tanggal: '2026-06-05',
    sesiTerverifikasi: true,
    nama: 'Rian Hidayat',
    peran: 'Mentor',
    kampus: 'Universitas Brawijaya',
    prodi: 'Teknologi Informasi',
    keahlian: 'Laravel & Database Relasional',
    rating: 4,
    ulasan:
      'Ekosistem belajarnya interaktif dan menteenya aktif berdiskusi tugas query SQL. Ke depannya bakal makin mantap kalau ada fitur whiteboard interaktif langsung di dalam ruang sesi.',
    hasil: 'Mentor Terverifikasi dengan total rating 4.80',
  },
  {
    id: '6',
    tanggal: '2026-06-02',
    sesiTerverifikasi: true,
    nama: 'Dina Kusuma',
    peran: 'Mentee',
    kampus: 'UPN Veteran Jawa Timur',
    prodi: 'Sistem Informasi',
    keahlian: 'Cloud Computing & Docker',
    rating: 5,
    ulasan:
      'Sangat terbantu memahami deployment pipeline Docker dan CI/CD. Mentornya langsung praktek live code lewat sesi 1-on-1.',
    hasil: 'Berhasil deploy tugas cloud ke server staging',
  },
];

const formatDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

function Stars({ value, large = false }: { value: number; large?: boolean }) {
  return (
    <span role="img" aria-label={`${value.toLocaleString('id-ID', { maximumFractionDigits: 1 })} dari 5 bintang`} className="inline-flex gap-0.5">
      {[0, 1, 2, 3, 4].map(index => (
        <span key={index} className={`relative block ${large ? 'size-5' : 'size-4'}`}>
          <Star aria-hidden="true" className="size-full fill-line text-line" />
          <Star aria-hidden="true" className="absolute inset-0 size-full fill-primary text-primary" style={{ clipPath: `inset(0 ${100 - Math.max(0, Math.min(1, value - index)) * 100}% 0 0)` }} />
        </span>
      ))}
    </span>
  );
}

type FilterType = 'ALL' | 'Mentee' | 'Mentor';

export default function TestimoniPage() {
  const [filter, setFilter] = useState<FilterType>('ALL');

  const [page, setPage] = useState(0);
  const filteredData = dataTestimoni.filter(
    (item) => filter === 'ALL' || item.peran === filter
  );

  const total = filteredData.length;
  const average = total ? filteredData.reduce((sum, item) => sum + item.rating, 0) / total : 0;
  const pageCount = Math.ceil(total / 3);

  const filterOptions: {
    id: FilterType;
    label: string;
  }[] = [
    { id: 'ALL', label: 'Semua Cerita' },
    { id: 'Mentee', label: 'Pengalaman Mentee' },
    { id: 'Mentor', label: 'Cerita Mentor' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">

      <Navbar />

      <main className="flex-1">

        {/* HEADER */}
        <section className="py-16 sm:py-20 border-b border-line bg-primary-tint">

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-tint text-primary border border-primary-soft text-xs font-bold uppercase tracking-wider">


              Cerita & Pengalaman Mahasiswa

            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">

              Apa Kata Mereka Tentang{' '}

              <span className="text-primary">
                Mentora
              </span>
              ?

            </h1>

            <p className="text-sm sm:text-base text-ink-muted max-w-2xl mx-auto leading-relaxed">
              Dengarkan langsung cerita pengalaman para mahasiswa dan
              mentor sebaya yang saling berkembang melalui pertukaran
              keterampilan.
            </p>

            {/* FILTER */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2">


              {filterOptions.map((tab) => (

                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setFilter(tab.id); setPage(0); }}
                  aria-pressed={filter === tab.id}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                    filter === tab.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface border border-line text-ink-muted hover:bg-canvas hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>

              ))}

            </div>

          </div>
        </section>

        <section id="cerita-komunitas" aria-labelledby="judul-cerita" className="bg-surface px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 id="judul-cerita" className="mb-8 font-serif text-3xl tracking-tight text-ink sm:mb-10 sm:text-4xl">Cerita Komunitas Mentora</h2>
            {total > 0 ? (
              <div className="grid items-start gap-8 lg:grid-cols-[minmax(240px,1fr)_2fr] lg:gap-12">
                <aside aria-label="Ringkasan penilaian" className="rounded-2xl border border-line bg-canvas p-6">
                  <h3 className="text-sm font-semibold text-ink-secondary">Penilaian rata-rata</h3>
                  <p className="my-3 flex items-baseline gap-2"><strong className="text-7xl font-bold leading-none tracking-tight text-ink">{average.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</strong><span className="text-ink-muted">/ 5</span></p>
                  <Stars value={average} large />
                  <p role="status" className="mt-2 text-sm text-ink-muted">{total} ulasan contoh</p>
                  <ul aria-label="Distribusi penilaian" className="mt-6 space-y-3 border-t border-line pt-5">
                    {[5, 4, 3, 2, 1].map(stars => {
                      const percent = filteredData.filter(item => item.rating === stars).length / total * 100;
                      return <li key={stars} className="flex items-center gap-3 text-xs tabular-nums text-ink-secondary">
                        <span>{stars}<span className="sr-only"> bintang</span></span>
                        <span aria-hidden="true" className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"><span className="block h-full rounded-full bg-primary" style={{ width: `${percent}%` }} /></span>
                        <span className="w-9 text-right">{Math.round(percent)}%</span>
                      </li>;
                    })}
                  </ul>
                </aside>
                <div>
                  <div className="divide-y divide-line">
                    {filteredData.slice(page * 3, page * 3 + 3).map(item => (
                      <article key={item.id} className="space-y-3 py-6 first:pt-0">
                        <header className="flex items-center gap-3">
                          <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">{item.nama.split(' ').slice(0, 2).map(word => word[0]).join('')}</span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1"><strong className="text-sm text-ink">{item.nama}</strong>
                              {item.sesiTerverifikasi && <span className="inline-flex items-center gap-1 rounded-full bg-success-tint px-2 py-0.5 text-[11px] font-semibold text-success"><BadgeCheck aria-hidden="true" className="size-3.5" />Sesi terverifikasi</span>}
                            </div>
                            <p className="mt-1 text-xs text-ink-muted">{item.peran} · {item.kampus}</p>
                          </div>
                        </header>
                        <div className="flex items-center gap-3"><Stars value={item.rating} /><time dateTime={item.tanggal} className="text-xs text-ink-muted">{formatDate.format(new Date(item.tanggal))}</time></div>
                        <h3 className="text-base font-bold leading-snug text-ink">{item.hasil}</h3>
                        <blockquote className="text-sm leading-relaxed text-ink-secondary">{item.ulasan}</blockquote>
                      </article>
                    ))}
                  </div>
                  {pageCount > 1 && <nav aria-label="Halaman ulasan" className="flex items-center justify-between gap-2 border-t border-line pt-4 text-sm">
                    <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)} className="min-h-11 rounded-lg px-2 font-semibold text-primary disabled:text-ink-muted disabled:opacity-50">Sebelumnya</button>
                    <span aria-live="polite" className="text-xs text-ink-muted">Halaman {page + 1} dari {pageCount}</span>
                    <button type="button" disabled={page + 1 === pageCount} onClick={() => setPage(page + 1)} className="min-h-11 rounded-lg px-2 font-semibold text-primary disabled:text-ink-muted disabled:opacity-50">Berikutnya</button>
                  </nav>}
                </div>
              </div>
            ) : (

              <div className="bg-surface rounded-3xl border border-line p-12 text-center">

                <MessageSquareText className="w-10 h-10 text-subtle mx-auto mb-4" />

                <p className="font-bold text-ink">
                  Belum ada cerita untuk kategori ini.
                </p>

                <p className="text-sm text-ink-muted mt-2">
                  Coba pilih kategori lainnya.
                </p>

              </div>

            )}

          </div>
        </section>

        {/* AJAKAN MENULIS ULASAN */}
        <section className="py-16 bg-surface border-t border-line">

          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">

            <div className="w-14 h-14 rounded-2xl bg-canvas text-primary flex items-center justify-center mx-auto">

              <MessageSquareText className="w-7 h-7" />

            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-ink">
              Punya Pengalaman Menarik Selama Belajar di Mentora?
            </h2>

            <p className="text-sm text-ink-muted">
              Bagikan pengalamanmu dan bantu mahasiswa lainnya menemukan
              pengalaman belajar yang lebih baik.
            </p>

            <Link
              href="/testimoni/tulis"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full action-primary text-sm font-bold transition shadow-sm"
            >
              Tulis Ulasan Sesi Mentoring

              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>
        </section>

      </main>

      <Footer />

    </div>
  );
}
