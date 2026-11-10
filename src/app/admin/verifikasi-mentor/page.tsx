'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  AlertTriangle,
  Users,
  Filter,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import Footer from '@/components/Footer';
import {
  INITIAL_APPLICATIONS,
  MentorApplication,
  VerificationStatus,
} from '@/data/mentorApplications';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function AdminMentorVerificationListPage() {
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | VerificationStatus>('ALL');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ namaLengkap?: string; role?: string } | null>(null);

  useEffect(() => {
    // 1. Cek otorisasi peran Admin dari localStorage / sesi
    const sessionStr = localStorage.getItem('user_session');
    if (sessionStr) {
      try {
        const parsed = JSON.parse(sessionStr);
        setCurrentUser(parsed);
        setIsAdmin(parsed.role?.toUpperCase() === 'ADMIN');
      } catch {
        setIsAdmin(false);
      }
    }

    // 2. Muat data pengajuan (Coba dari API Laravel, fallback ke localStorage / Mock)
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${API_URL}/admin/mentor-applications`, {
          headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.ok) {
          const data = await res.json();
          setApplications(data.data || data);
          localStorage.setItem('mentora_mentor_applications', JSON.stringify(data.data || data));
          setLoading(false);
          return;
        }
      } catch {
        // Gunakan penyimpanan lokal jika backend belum menyediakan endpoint ini
      }

      const cached = localStorage.getItem('mentora_mentor_applications');
      if (cached) {
        setApplications(JSON.parse(cached));
      } else {
        setApplications(INITIAL_APPLICATIONS);
        localStorage.setItem('mentora_mentor_applications', JSON.stringify(INITIAL_APPLICATIONS));
      }
      setLoading(false);
    };

    fetchApplications();
  }, []);

  // Fungsi helper untuk mengaktifkan akses Admin saat demo lokal
  const enableDemoAdminAccess = () => {
    const updatedUser = {
      ...(currentUser || {}),
      namaLengkap: currentUser?.namaLengkap || 'Admin Mentora',
      email: 'admin@mentora.id',
      role: 'ADMIN',
    };
    localStorage.setItem('user_session', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setIsAdmin(true);
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchStatus = statusFilter === 'ALL' || app.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        app.namaLengkap.toLowerCase().includes(q) ||
        app.nim.toLowerCase().includes(q) ||
        app.prodi.toLowerCase().includes(q) ||
        app.keahlianDiajukan.some((skill) => skill.toLowerCase().includes(q));

      return matchStatus && matchQuery;
    });
  }, [applications, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === 'PENDING').length,
      approved: applications.filter((a) => a.status === 'APPROVED').length,
      rejected: applications.filter((a) => a.status === 'REJECTED').length,
    };
  }, [applications]);

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Verifikasi
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Disetujui
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
            <XCircle className="w-3.5 h-3.5" />
            Ditolak
          </span>
        );
    }
  };

  // Tampilan Proteksi Role (Acceptance Criteria 4: Endpoint/Halaman hanya dapat diakses oleh peran Admin)
  if (!loading && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAFB] dark:bg-slate-950">
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[11px] font-bold uppercase tracking-wider">
                403 Forbidden • Akses Terbatas
              </span>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Halaman Khusus Administrator
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Sesuai kebijakan keamanan sistem (FR-06), pemeriksaan dokumen dan verifikasi pengajuan Mentor hanya dapat diakses oleh pengguna dengan peran <strong>ADMIN</strong>.
              </p>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={enableDemoAdminAccess}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Aktifkan Mode Admin
              </button>
              <Link
                href="/dashboard"
                className="block w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Kembali ke Dashboard Mahasiswa
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header Topbar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pr-20">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB]">
              <ShieldCheck className="w-4 h-4" />
              <span>PANEL ADMINISTRATOR</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Verifikasi Pengajuan Mentor
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Periksa kelengkapan dokumen kualifikasi dan kelola persetujuan calon mentor sebaya.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Ke Dashboard Utama
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Statistik Ringkas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Pengajuan</span>
              <Users className="w-4 h-4 text-[#2563EB]" />
            </div>
            <p className="text-2xl font-extrabold mt-2 text-slate-900 dark:text-white">{stats.total}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Menunggu Review</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-extrabold mt-2 text-amber-600 dark:text-amber-400">{stats.pending}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Disetujui</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-extrabold mt-2 text-emerald-600 dark:text-emerald-400">{stats.approved}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-rose-200/80 dark:border-rose-900/50 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">Ditolak</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-extrabold mt-2 text-rose-600 dark:text-rose-400">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Pencarian */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama mahasiswa, NIM, prodi, atau keahlian yang diajukan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Filter Tab Status */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 mr-1 hidden sm:block" />
            {(
              [
                { id: 'ALL', label: 'Semua' },
                { id: 'PENDING', label: 'Menunggu' },
                { id: 'APPROVED', label: 'Disetujui' },
                { id: 'REJECTED', label: 'Ditolak' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel / Daftar Pengajuan */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Memuat daftar pengajuan mentor...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Tidak ada data pengajuan yang sesuai
              </p>
              <p className="text-xs text-slate-400">
                Coba ubah kata kunci pencarian atau filter status di atas.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 sm:p-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  {/* Info Kiri: Identitas & Skill */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {app.id}
                      </span>
                      {getStatusBadge(app.status)}
                      <span className="text-xs text-slate-400">
                        • Diajukan{' '}
                        {new Date(app.tanggalPengajuan).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {app.namaLengkap}{' '}
                        <span className="text-xs font-normal text-slate-400">({app.nim})</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {app.prodi} • {app.universitas} • Semester {app.semester} (IPK: {app.ipk})
                      </p>
                    </div>

                    {/* Keahlian yang Diajukan */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {app.keahlianDiajukan.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50 text-[11px] font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Ringkasan Dokumen Terlampir */}
                    <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                        {app.dokumen.length} Dokumen Lampiran:
                      </span>
                      {app.dokumen.map((doc) => (
                        <span
                          key={doc.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300"
                        >
                          [{doc.jenis}] {doc.namaDokumen}
                        </span>
                      ))}
                    </div>

                    {/* Tampilkan alasan jika berstatus ditolak */}
                    {app.status === 'REJECTED' && app.alasanPenolakan && (
                      <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
                        <strong>Alasan Penolakan:</strong> {app.alasanPenolakan}
                      </div>
                    )}
                  </div>

                  {/* Aksi Kanan: Menuju Halaman Detail & Verifikasi (SCRUM-122) */}
                  <div className="flex items-center justify-end shrink-0">
                    <Link
                      href={`/admin/verifikasi-mentor/${app.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
                    >
                      <span>Periksa Dokumen & Verifikasi</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}