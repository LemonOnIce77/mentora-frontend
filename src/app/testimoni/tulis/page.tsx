
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import {
  Star,
  ArrowLeft,
  MessageSquareText,
  Send,
} from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] text-slate-800">

      <Navbar />

      <main className="flex-1 py-12 sm:py-16">

        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          {/* KEMBALI */}
          <Link
            href="/testimoni"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#2563EB] transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />

            Kembali ke Testimoni
          </Link>

          {/* FORM CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="p-6 sm:p-8 border-b border-slate-100">

              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-5">

                <MessageSquareText className="w-6 h-6" />

              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Tulis Ulasan
              </h1>

              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
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

                <label className="text-sm font-bold text-slate-800">
                  Nama Mentor
                </label>

                <input
                  type="text"
                  value={namaMentor}
                  onChange={(e) => setNamaMentor(e.target.value)}
                  placeholder="Masukkan nama mentor"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition"
                />

              </div>

              {/* TOPIK SESI */}
              <div className="space-y-2">

                <label className="text-sm font-bold text-slate-800">
                  Topik Sesi Mentoring
                </label>

                <input
                  type="text"
                  value={topik}
                  onChange={(e) => setTopik(e.target.value)}
                  placeholder="Contoh: UI/UX Design, Laravel, Python"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition"
                />

              </div>

              {/* RATING */}
              <div className="space-y-3">

                <label className="text-sm font-bold text-slate-800">
                  Bagaimana pengalamanmu?
                </label>

                <p className="text-xs text-slate-500">
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
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />

                    </button>

                  ))}

                </div>

                <p className="text-xs font-semibold text-[#2563EB]">
                  {rating === 0
                    ? 'Belum ada rating dipilih'
                    : `${rating} dari 5 bintang`}
                </p>

              </div>

              {/* ULASAN */}
              <div className="space-y-2">

                <label className="text-sm font-bold text-slate-800">
                  Ceritakan Pengalamanmu
                </label>

                <textarea
                  value={ulasan}
                  onChange={(e) => setUlasan(e.target.value)}
                  placeholder="Ceritakan bagaimana pengalamanmu selama mengikuti sesi mentoring..."
                  required
                  minLength={10}
                  rows={5}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition resize-none"
                />

                <p className="text-[11px] text-slate-400">
                  Minimal 10 karakter.
                </p>

              </div>

              {/* MANFAAT */}
              <div className="space-y-2">

                <label className="text-sm font-bold text-slate-800">
                  Apa Manfaat yang Kamu Dapatkan?
                  <span className="text-slate-400 font-normal">
                    {' '}(Opsional)
                  </span>
                </label>

                <textarea
                  value={manfaat}
                  onChange={(e) => setManfaat(e.target.value)}
                  placeholder="Contoh: Lebih memahami materi, menyelesaikan tugas, atau memperoleh skill baru..."
                  rows={3}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition resize-none"
                />

              </div>

              {/* PESAN VALIDASI */}
              {pesan && (

                <div
                  role="status"
                  className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-700 leading-relaxed"
                >
                  {pesan}
                </div>

              )}

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition"
              >

                <Send className="w-4 h-4" />

                Kirim Ulasan

              </button>

              <p className="text-center text-[11px] text-slate-400">
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
