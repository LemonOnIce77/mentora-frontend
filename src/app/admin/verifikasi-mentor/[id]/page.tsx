'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  GraduationCap,
  Award,
  UserCheck,
  AlertCircle,
  Eye,
} from 'lucide-react';
import Footer from '@/components/Footer';
import {
  INITIAL_APPLICATIONS,
  MentorApplication,
  MentorDocument,
  VerificationStatus,
} from '@/data/mentorApplications';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function AdminMentorVerificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params?.id as string;

  const [application, setApplication] = useState<MentorApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<MentorDocument | null>(null);

  // State untuk form aksi verifikasi
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    const loadDetail = () => {
      setLoading(true);
      const cached = localStorage.getItem('mentora_mentor_applications');
      const list: MentorApplication[] = cached ? JSON.parse(cached) : INITIAL_APPLICATIONS;
      const found = list.find((item) => item.id === applicationId) || null;

      setApplication(found);
      if (found) {
        setRejectionReason(found.alasanPenolakan || '');
        if (found.dokumen.length > 0) {
          setSelectedDoc(found.dokumen[0]);
        }
      }
      setLoading(false);
    };

    loadDetail();
  }, [applicationId]);

  const handleVerificationDecision = async (newStatus: 'APPROVED' | 'REJECTED') => {
    if (!application) return;
    setErrorMsg('');

    // Validasi Acceptance Criteria: Wajib menyertakan alasan bila ditolak
    if (newStatus === 'REJECTED' && !rejectionReason.trim()) {
      setErrorMsg('Alasan penolakan wajib diisi agar mahasiswa dapat memperbaiki pengajuannya.');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token');
      // Coba kirim ke endpoint backend Laravel jika sudah tersedia
      await fetch(`${API_URL}/admin/mentor-applications/${application.id}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: newStatus,
          alasan_penolakan: newStatus === 'REJECTED' ? rejectionReason.trim() : null,
        }),
      }).catch(() => null);

      // Perbarui state dan simpan ke localStorage agar sinkron di seluruh halaman
      const cached = localStorage.getItem('mentora_mentor_applications');
      const list: MentorApplication[] = cached ? JSON.parse(cached) : INITIAL_APPLICATIONS;

      const updatedList = list.map((item) => {
        if (item.id === application.id) {
          return {
            ...item,
            status: newStatus as VerificationStatus,
            alasanPenolakan: newStatus === 'REJECTED' ? rejectionReason.trim() : undefined,
          };
        }
        return item;
      });

      localStorage.setItem('mentora_mentor_applications', JSON.stringify(updatedList));

      const updatedItem = updatedList.find((i) => i.id === application.id) || null;
      setApplication(updatedItem);
      setShowRejectBox(false);

      setFeedbackBanner({
        type: 'success',
        message:
          newStatus === 'APPROVED'
            ? `Pengajuan ${application.namaLengkap} berhasil DISETUJUI. Status pengguna kini diperbarui menjadi Mentor Terverifikasi.`
            : `Pengajuan ${application.namaLengkap} telah DITOLAK beserta catatan evaluasi.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB] dark:bg-slate-950 text-xs text-slate-400">
        Memuat detail pengajuan mentor...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFB] dark:bg-slate-950 p-6 text-center space-y-4">
        <p className="text-base font-bold text-slate-800 dark:text-slate-200">
          Data pengajuan tidak ditemukan
        </p>
        <Link
          href="/admin/verifikasi-mentor"
          className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
        >
          Kembali ke Daftar Pengajuan
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 pr-20">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/verifikasi-mentor"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Kembali ke Daftar"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#2563EB]">
                  {application.id}
                </span>
                <span className="text-xs text-slate-400">• Pemeriksaan Dokumen & Keputusan</span>
              </div>
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {application.namaLengkap}
              </h1>
            </div>
          </div>

          {/* Badge Status Saat Ini */}
          <div>
            {application.status === 'PENDING' && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <Clock className="w-4 h-4" />
                Status: Menunggu Verifikasi
              </span>
            )}
            {application.status === 'APPROVED' && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                Status: Disetujui (Verified Mentor)
              </span>
            )}
            {application.status === 'REJECTED' && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                <XCircle className="w-4 h-4" />
                Status: Ditolak
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Notifikasi Keputusan */}
        {feedbackBanner && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{feedbackBanner.message}</span>
            </div>
            <button
              type="button"
              onClick={() => router.push('/admin/verifikasi-mentor')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition shrink-0"
            >
              Kembali ke Daftar
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolom Kiri (5 Kolom): Profil Kandidat & Panel Keputusan Verifikasi */}
          <div className="lg:col-span-5 space-y-6">
            {/* Kartu Profil Akademik */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                <span>Profil Akademik Pengaju</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <p className="text-slate-400">Nama Lengkap</p>
                  <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                    {application.namaLengkap}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">NIM</p>
                  <p className="font-bold font-mono text-slate-800 dark:text-slate-100 mt-0.5">
                    {application.nim}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Universitas</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                    {application.universitas}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Program Studi</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                    {application.prodi} (Sem. {application.semester})
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">IPK Terakhir</p>
                  <p className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {application.ipk} / 4.00
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Email Kampus</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                    {application.email}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Bidang Keahlian yang Diajukan:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {application.keahlianDiajukan.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 text-xs font-bold border border-blue-200/60 dark:border-blue-800/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-xs">
                <p className="text-slate-400 font-medium">Pengalaman & Prestasi Terkait:</p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                  {application.pengalamanSingkat}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-slate-400 font-medium">Motivasi Menjadi Mentor:</p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                  {application.motivasi}
                </p>
              </div>
            </div>

            {/* Panel Keputusan Verifikasi Admin (SCRUM-122) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <UserCheck className="w-4 h-4 text-[#2563EB]" />
                <span>Keputusan Verifikasi Admin</span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Pastikan seluruh dokumen bukti keahlian dan transkrip telah diperiksa sebelum memberikan keputusan.
              </p>

              {/* Jika Sebelumnya Ditolak, Tampilkan Alasan */}
              {application.status === 'REJECTED' && application.alasanPenolakan && !showRejectBox && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 space-y-1">
                  <p className="font-bold">Catatan Penolakan Saat Ini:</p>
                  <p>{application.alasanPenolakan}</p>
                </div>
              )}

              {/* Tombol Setujui & Tolak */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleVerificationDecision('APPROVED')}
                  className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Setujui Mentor</span>
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => {
                    setShowRejectBox(true);
                    setErrorMsg('');
                  }}
                  className="py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Tolak Pengajuan</span>
                </button>
              </div>

              {/* Box Input Alasan Penolakan (Muncul saat tombol Tolak diklik) */}
              {showRejectBox && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
                  <label className="block text-xs font-bold text-rose-600 dark:text-rose-400">
                    Alasan Penolakan Pengajuan <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Contoh: Sertifikat keahlian belum terlampir atau dokumen KHS tidak terbaca dengan jelas..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-rose-300 dark:border-rose-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />

                  {errorMsg && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRejectBox(false);
                        setErrorMsg('');
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleVerificationDecision('REJECTED')}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition"
                    >
                      Konfirmasi Tolak Pengajuan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Kanan (7 Kolom): Pemeriksaan & Pratinjau Dokumen */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                  <span>Dokumen Bukti & Kualifikasi ({application.dokumen.length})</span>
                </div>
              </div>

              {/* Daftar Tab Dokumen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {application.dokumen.map((doc) => {
                  const active = selectedDoc?.id === doc.id;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setSelectedDoc(doc)}
                      className={`p-3.5 rounded-2xl border text-left transition flex items-start justify-between gap-3 ${
                        active
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#2563EB] ring-1 ring-[#2563EB]'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#2563EB] text-white">
                          {doc.jenis}
                        </span>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {doc.namaDokumen}
                        </p>
                        <p className="text-[11px] text-slate-400">{doc.ukuran}</p>
                      </div>
                      <Eye
                        className={`w-4 h-4 shrink-0 mt-1 ${
                          active ? 'text-[#2563EB]' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Area Pratinjau Dokumen (Document Viewer) */}
              {selectedDoc && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-xl">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                      Pratinjau: {selectedDoc.namaDokumen}
                    </span>
                    <a
                      href={selectedDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline shrink-0"
                    >
                      <span>Buka di Tab Baru</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="w-full h-[480px] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <iframe
                      src={selectedDoc.url}
                      title={selectedDoc.namaDokumen}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}