
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { Star, MessageSquareText } from 'lucide-react';
import { ArrowLeft, Send } from '@/components/animated-icons';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TulisUlasanPage() {

  const [rating, setRating] = useState(0);

  const [namaMentor, setNamaMentor] = useState('');
  const [topik, setTopik] = useState('');
  const [ulasan, setUlasan] = useState('');
  const [manfaat, setManfaat] = useState('');

  const [pesan, setPesan] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (rating === 0) {
      setPesan('Silakan pilih rating bintang terlebih dahulu.');
      return;
    }

    // Formulir belum terhubung ke API backend.
    // Data belum disimpan ke database.

    setPesan(
      'Formulir berhasil divalidasi. Pengiriman ulasan belum terhubung ke backend.'
    );

  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">

      <Navbar />

      <main className="flex-1 py-12 sm:py-16">

        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          {/* KEMBALI */}
          <Link
            href="/testimoni"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-primary transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />

            Kembali ke Testimoni
          </Link>

          {/* FORM CARD */}
          <div className="bg-surface rounded-3xl border border-line shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="p-6 sm:p-8 border-b border-line">

              <div className="w-12 h-12 rounded-2xl bg-primary-tint text-primary flex items-center justify-center mb-5">

                <MessageSquareText className="w-6 h-6" />

              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
                Tulis Ulasan
              </h1>

              <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                Bagikan pengalamanmu selama mengikuti sesi mentoring
                bersama Mentora.
              </p>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 space-y-6"
            >

              {/* NAMA MENTOR */}
              <div className="space-y-2">

                <label className="text-sm font-bold text-ink">
                  Nama Mentor
                </label>

                <input
                  type="text"
                  value={namaMentor}
                  onChange={(e) => setNamaMentor(e.target.value)}
                  placeholder="Masukkan nama mentor"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-line bg-surface text-sm text-ink placeholder:text-ink-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft transition"
                />

              </div>

              {/* TOPIK SESI */}
              <div className="space-y-2">

                <label className="text-sm font-bold text-ink">
                  Topik Sesi Mentoring
                </label>

                <input
                  type="text"
                  value={topik}
                  onChange={(e) => setTopik(e.target.value)}
                  placeholder="Contoh: UI/UX Design, Laravel, Python"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-line bg-surface text-sm text-ink placeholder:text-ink-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft transition"
                />

              </div>

              {/* RATING */}
              <div className="space-y-3">

                <label className="text-sm font-bold text-ink">
                  Bagaimana pengalamanmu?
                </label>

                <p className="text-xs text-ink-muted">
                  Berikan penilaian dari 1 sampai 5 bintang.
                </p>

                <div className="flex items-center gap-2">

                  {[1, 2, 3, 4, 5].map((star) => (

                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`Berikan ${star} bintang`}
                      aria-pressed={rating === star}
                      className="p-1 hover:scale-110 transition-transform"
                    >

                      <Star
                        className={`w-9 h-9 ${
                          star <= rating
                            ? 'fill-primary text-primary'
                            : 'text-primary-accent'
                        }`}
                      />

                    </button>

                  ))}

                </div>

                <p className="text-xs font-semibold text-primary">
                  {rating === 0
                    ? 'Belum ada rating dipilih'
                    : `${rating} dari 5 bintang`}
                </p>

              </div>

              {/* ULASAN */}
              <div className="space-y-2">

                <label className="text-sm font-bold text-ink">
                  Ceritakan Pengalamanmu
                </label>

                <textarea
                  value={ulasan}
                  onChange={(e) => setUlasan(e.target.value)}
                  placeholder="Ceritakan bagaimana pengalamanmu selama mengikuti sesi mentoring..."
                  required
                  minLength={10}
                  rows={5}
                  className="w-full px-4 py-3.5 rounded-xl border border-line bg-surface text-sm text-ink placeholder:text-ink-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft transition resize-none"
                />

                <p className="text-[11px] text-ink-muted">
                  Minimal 10 karakter.
                </p>

              </div>

              {/* MANFAAT */}
              <div className="space-y-2">

                <label className="text-sm font-bold text-ink">
                  Apa Manfaat yang Kamu Dapatkan?
                  <span className="text-ink-muted font-normal">
                    {' '}(Opsional)
                  </span>
                </label>

                <textarea
                  value={manfaat}
                  onChange={(e) => setManfaat(e.target.value)}
                  placeholder="Contoh: Lebih memahami materi, menyelesaikan tugas, atau memperoleh skill baru..."
                  rows={3}
                  className="w-full px-4 py-3.5 rounded-xl border border-line bg-surface text-sm text-ink placeholder:text-ink-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft transition resize-none"
                />

              </div>

              {/* PESAN VALIDASI */}
              {pesan && (

                <div
                  role="status"
                  className="p-4 rounded-xl bg-primary-tint border border-primary-soft text-sm text-primary-hover leading-relaxed"
                >
                  {pesan}
                </div>

              )}

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl action-primary text-sm font-bold shadow-sm transition"
              >

                <Send className="w-4 h-4" />

                Kirim Ulasan

              </button>

              <p className="text-center text-[11px] text-ink-muted">
                Pastikan ulasan yang kamu berikan sesuai dengan pengalaman
                selama sesi mentoring.
              </p>

            </form>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}
