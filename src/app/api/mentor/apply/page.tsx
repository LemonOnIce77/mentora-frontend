'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Loader2,
  GraduationCap,
  ShieldCheck,
  Check,
  FileCheck,
} from 'lucide-react';

interface CurrentUser {
  id: number;
  namaLengkap: string;
  email: string;
  universitas?: string;
  prodi?: string;
  semester?: string;
  statusMentor: string;
  dokumenKredensial?: string;
}

export default function MentorApplyPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Form states
  const [skillsOffered, setSkillsOffered] = useState('');
  const [pengalamanMengajar, setPengalamanMengajar] = useState('');
  const [dokumenNama, setDokumenNama] = useState('');
  const [dokumenUrl, setDokumenUrl] = useState('');

  // Feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadUserData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth');
          return;
        }
        throw new Error('Gagal memuat sesi pengguna');
      }

      const data = await res.json();
      if (data && data.user) {
        setUser(data.user);
        if (data.user.dokumenKredensial) {
          setDokumenNama(data.user.dokumenKredensial);
        }
      }
    } catch (err) {
      setErrorMsg('Gagal memuat status pengajuan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // Upload berkas nyata ke server (FR-05)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setUploadingFile(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setDokumenNama(data.fileName);
        setDokumenUrl(data.fileUrl);
      } else {
        setErrorMsg(data.message || 'Gagal mengunggah berkas kredensial.');
      }
    } catch (err) {
      setErrorMsg('Koneksi terputus saat mengunggah berkas.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!skillsOffered.trim()) {
      setErrorMsg('Mohon sebutkan keahlian/skill yang ingin Anda ajarkan.');
      return;
    }

    if (!dokumenNama || !dokumenUrl) {
      setErrorMsg('Mohon unggah dokumen transkrip nilai atau portofolio kredensial.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/mentor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillsOffered: skillsOffered.trim(),
          pengalamanMengajar: pengalamanMengajar.trim(),
          dokumenNama,
          dokumenUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('✓ Pengajuan berhasil dikirimkan! Tim Admin Mentora akan memverifikasi dokumen Anda.');
        await loadUserData();
      } else {
        setErrorMsg(data.message || 'Gagal mengirimkan pengajuan mentor.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kendala server saat mengirim data.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
          <p className="text-sm font-semibold">Memeriksa status akun mentor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Mentora</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UPGRADE PERAN • FR-04 & FR-05</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pengajuan Akun & Kredensial Mentor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
            Unggah bukti transkrip nilai akademik atau sertifikat keahlian terverifikasi untuk divalidasi oleh Admin.
          </p>
        </div>

        {user?.statusMentor === 'APPROVED' && (
          <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Selamat! Akun Anda Telah Terverifikasi sebagai Mentor
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Profil dan skill Anda telah dipublikasikan di direktori mentor Mentora.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                <span>Buka Direktori Mentor di Dashboard</span>
              </Link>
            </div>
          </div>
        )}

        {user?.statusMentor === 'PENDING' && (
          <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-sm space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">
                  Pengajuan Mentor Anda Sedang Ditinjau Admin
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Dokumen kredensial: <span className="font-semibold text-slate-700">{user.dokumenKredensial || dokumenNama}</span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
              Status pengajuan akan diperbarui secara otomatis begitu proses validasi oleh administrator selesai (FR-06 & FR-07).
            </div>
          </div>
        )}

        {(!user?.statusMentor || user?.statusMentor === 'NONE' || user?.statusMentor === 'REJECTED') && (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            {user?.statusMentor === 'REJECTED' && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Pengajuan sebelumnya belum disetujui.</span> Silakan unggah dokumen kredensial yang lebih jelas dan ajukan kembali.
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>
                  Pemohon: <span className="font-bold text-slate-900">{user?.namaLengkap}</span> ({user?.universitas || 'Telkom University'})
                </span>
              </div>
              <div>
                Prodi: <span className="font-semibold text-slate-800">{user?.prodi || 'Sistem Informasi'}</span> • Semester {user?.semester || '-'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Materi / Skill yang Ditawarkan untuk Diajarkan (FR-04) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={skillsOffered}
                onChange={(e) => setSkillsOffered(e.target.value)}
                placeholder="mis. UI/UX Design, Figma, Logika Pemrograman Web Dasar"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Pisahkan dengan koma jika menawarkan lebih dari satu keahlian.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pengalaman Bimbingan, Proyek, atau Organisasi Terkait (Opsional)
              </label>
              <textarea
                rows={3}
                value={pengalamanMengajar}
                onChange={(e) => setPengalamanMengajar(e.target.value)}
                placeholder="mis. Asisten praktikum mata kuliah DKV semester lalu, juara hackathon UI/UX..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none resize-none"
              />
            </div>

            {/* Field: Upload Kredensial Nyata (FR-05) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Unggah Bukti Kredensial / Transkrip Nilai (FR-05) <span className="text-rose-500">*</span>
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-[#2563EB] rounded-2xl p-7 text-center transition bg-slate-50/50">
                {uploadingFile ? (
                  <div className="py-4 flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
                    <p className="text-xs font-semibold text-slate-600">Mengunggah berkas ke server...</p>
                  </div>
                ) : dokumenNama ? (
                  <div className="py-2 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-900">{dokumenNama}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">✓ Berkas siap diajukan</p>
                  </div>
                ) : (
                  <>
                    <FileText className="w-8 h-8 text-[#2563EB] mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">
                      Pilih Transkrip Nilai Akademik atau Portofolio (PDF/Gambar)
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Format file didukung: PDF, JPG, PNG (Maksimal 5MB)</p>
                  </>
                )}

                <label className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs transition">
                  <Upload className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{dokumenNama ? 'Ganti Dokumen' : 'Pilih Berkas'}</span>
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed">
              <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <p>
                Setelah diverifikasi oleh Admin (FR-06 & FR-07), Anda akan resmi menjadi <span className="font-bold text-[#2563EB]">Mentor Terverifikasi</span> dan memperoleh <span className="font-bold text-[#2563EB]">+5 EduPoints</span> per sesi bimbingan.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || uploadingFile}
                className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Kirimkan Formulir Pengajuan Mentor (FR-04 & FR-05)</span>
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}