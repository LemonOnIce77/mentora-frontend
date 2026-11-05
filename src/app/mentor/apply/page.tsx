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
  const [uploading, setUploading] = useState(false);

  // Form states
  const [skillsOffered, setSkillsOffered] = useState('');
  const [pengalamanMengajar, setPengalamanMengajar] = useState('');
  const [dokumenNama, setDokumenNama] = useState('');
  const [dokumenUrl, setDokumenUrl] = useState('');

  // Feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Ambil data profil pengguna & status pengajuan saat ini
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

  // 2. Upload Dokumen Transkrip / Kredensial via /api/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran berkas melebihi batas maksimal 5MB.');
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('Format berkas tidak didukung. Harap unggah PDF, JPG, atau PNG.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
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
        setSuccessMsg(`✓ Dokumen "${data.fileName}" berhasil diunggah.`);
        setTimeout(() => setSuccessMsg(''), 3500);
      } else {
        // Fallback simpan metadata lokal
        setDokumenNama(file.name);
        setDokumenUrl('/uploads/' + file.name);
      }
    } catch {
      setDokumenNama(file.name);
      setDokumenUrl('/uploads/' + file.name);
    } finally {
      setUploading(false);
    }
  };

  // 3. Submit Pengajuan Mentor
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!skillsOffered.trim()) {
      setErrorMsg('Mohon sebutkan keahlian yang ingin Anda ajarkan.');
      return;
    }

    if (!dokumenNama) {
      setErrorMsg('Mohon unggah dokumen transkrip nilai atau sertifikat pendukung.');
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
          dokumenUrl: dokumenUrl || `/uploads/${dokumenNama}`,
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
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Mentora</span>
          </Link>
        </div>

        {/* Title Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UPGRADE PERAN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pengajuan Akun & Kredensial Mentor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
            Ajukan diri sebagai mentor untuk membagikan keahlian kepada rekan mahasiswa, mengumpulkan EduPoints keaktifan, dan membangun portofolio resmi.
          </p>
        </div>

        {/* Status Section: APPROVED */}
        {user?.statusMentor === 'APPROVED' && (
          <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-sm text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Selamat! Akun Anda Telah Menjadi Mentor Terverifikasi 🎉
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Kredensial akademik dan keahlian Anda telah disetujui oleh tim verifikator Mentora. Profil Anda kini terdaftar di direktori mentor dan dapat menerima permintaan sesi belajar.
            </p>
            {user?.dokumenKredensial && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                <FileText className="w-4 h-4 text-[#2563EB]" />
                <span>Dokumen Terverifikasi: {user.dokumenKredensial}</span>
              </div>
            )}
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 transition"
              >
                <span>Buka Dashboard Mentor</span>
                <Check className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Status Section: PENDING */}
        {user?.statusMentor === 'PENDING' && (
          <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-sm text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Pengajuan Mentor Sedang Ditinjau Tim Verifikator
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Berkas transkrip/sertifikat Anda sedang dalam proses peninjauan oleh Admin Mentora. Notifikasi status kelulusan akan diperbarui secara otomatis.
            </p>
            {dokumenNama && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Berkas Kredensial: {dokumenNama}</span>
              </div>
            )}
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <span>Kembali ke Halaman Utama</span>
              </Link>
            </div>
          </div>
        )}

        {/* Application Form for NONE or REJECTED */}
        {user?.statusMentor !== 'APPROVED' && user?.statusMentor !== 'PENDING' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            
            {user?.statusMentor === 'REJECTED' && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Pengajuan sebelumnya belum disetujui.</span> Silakan periksa kembali kejelasan dokumen kredensial dan ajukan ulang.
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

            {/* User Academic Summary Display */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>
                  Pemohon: <span className="font-bold text-slate-900">{user?.namaLengkap}</span> ({user?.universitas || 'Telkom University'})
                </span>
              </div>
              <div>
                Prodi: <span className="font-semibold text-slate-800">{user?.prodi || 'Informatika'}</span> • Semester {user?.semester || '5'}
              </div>
            </div>

            {/* Field: Skills Offered */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Materi / Keahlian yang Ingin Diajarkan <span className="text-rose-500">*</span>
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

            {/* Field: Pengalaman Mengajar */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pengalaman Bimbingan, Proyek, atau Organisasi Terkait (Opsional)
              </label>
              <textarea
                rows={3}
                value={pengalamanMengajar}
                onChange={(e) => setPengalamanMengajar(e.target.value)}
                placeholder="mis. Asisten praktikum mata kuliah DKV semester lalu, juara hackathon UI/UX, aktif membagikan tutorial kelompok belajar..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none resize-none"
              />
            </div>

            {/* Field: Upload Kredensial */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Unggah Bukti Kredensial / Transkrip Nilai <span className="text-rose-500">*</span>
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-[#2563EB] rounded-2xl p-7 text-center transition bg-slate-50/50">
                <FileText className="w-8 h-8 text-[#2563EB] mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">
                  {dokumenNama ? `Berkas terpilih: ${dokumenNama}` : 'Pilih Transkrip Nilai Akademik atau Portofolio (PDF)'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Format file yang didukung: PDF, JPG, PNG (Maksimal 5MB)</p>
                <label className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs transition">
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2563EB]" /> : <Upload className="w-3.5 h-3.5 text-[#2563EB]" />}
                  <span>{uploading ? 'Mengunggah berkas...' : dokumenNama ? 'Ganti Dokumen' : 'Cari File Dokumen'}</span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Info Point Callout */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed">
              <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <p>
                Setelah diverifikasi, Anda akan memperoleh status <span className="font-bold text-[#2563EB]">Mentor Terverifikasi</span> dan berhak mendapatkan insentif <span className="font-bold text-[#2563EB]">+5 EduPoints</span> untuk tiap sesi belajar yang tuntas diselenggarakan.
              </p>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Kirimkan Formulir Pengajuan Mentor</span>
              </button>
            </div>
          </form>
        )}

      </main>

      <Footer />
    </div>
  );
}
