'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  Users,
  BookOpen,
  Clock,
  Check,
  XCircle,
  FileText,
  Activity,
  TrendingUp,
  ArrowRight,
  Settings,
  Search,
  Loader2,
  ShieldAlert,
  RefreshCw,
  Award,
  GraduationCap,
} from 'lucide-react';

interface AdminUser {
  id: number;
  namaLengkap: string;
  email: string;
  role: string;
  fotoProfil?: string;
}

interface MentorApplication {
  id: number;
  userId: number;
  skillsOffered: string;
  pengalamanMengajar?: string;
  dokumenUrl: string;
  dokumenNama: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  catatanAdmin?: string;
  createdAt: string;
  user: {
    id: number;
    namaLengkap: string;
    email: string;
    universitas?: string;
    prodi?: string;
    semester?: string;
    domisili?: string;
    statusMentor: string;
  };
}

interface ActiveMentor {
  id: number;
  namaLengkap: string;
  universitas?: string;
  prodi?: string;
  domisili?: string;
  totalPoin: number;
  statusMentor: string;
  skills: Array<{
    id: number;
    skill: { namaSkill: string };
  }>;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Auth & Role Guard State
  const [authStatus, setAuthStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'mentors'>('overview');

  // Data States
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [activeMentors, setActiveMentors] = useState<ActiveMentor[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterAppStatus, setFilterAppStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchMentor, setSearchMentor] = useState('');

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.replace('/auth');
          return;
        }

        const data = await res.json();
        const currentUser = data.user;

        // Proteksi Ketat: Hanya izinkan role Admin
        if (!currentUser || currentUser.role !== 'Admin') {
          setAuthStatus('unauthorized');
          setTimeout(() => {
            router.replace('/dashboard');
          }, 1800);
          return;
        }

        setAdminUser(currentUser);
        setAuthStatus('authorized');
        await fetchAdminData();
      } catch (error) {
        console.error('Gagal memverifikasi akses admin:', error);
        router.replace('/auth');
      }
    };

    verifyAdminAccess();
  }, [router]);

  const fetchAdminData = async () => {
    setIsRefreshing(true);
    try {
      const [appRes, mentorRes] = await Promise.all([
        fetch('/api/admin/applications').catch(() => null),
        fetch('/api/mentor/list').catch(() => null),
      ]);

      if (appRes && appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData.applications || []);
      }

      if (mentorRes && mentorRes.ok) {
        const mentorData = await mentorRes.json();
        const approved = (mentorData.mentors || []).filter(
          (m: ActiveMentor) => m.statusMentor === 'APPROVED'
        );
        setActiveMentors(approved);
      }
    } catch (error) {
      console.error('Error memuat data admin:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReviewApplication = async (appId: number, action: 'APPROVE' | 'REJECT') => {
    const confirmMsg =
      action === 'APPROVE'
        ? 'Setujui pengajuan ini dan aktifkan status Mentor pengguna?'
        : 'Tolak pengajuan mentor ini?';

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/applications/${appId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        await fetchAdminData();
        alert(
          action === 'APPROVE'
            ? 'Pengajuan disetujui. Akun pengguna kini aktif sebagai Mentor.'
            : 'Pengajuan mentor telah ditolak.'
        );
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Gagal memproses keputusan verifikasi.');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi ke server.');
    }
  };

  // Tampilan saat memverifikasi sesi
  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFB]">
        <Loader2 className="w-9 h-9 text-[#2563EB] animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-600">Memverifikasi hak akses administrator...</p>
      </div>
    );
  }

  // Tampilan jika diakses oleh akun non-Admin
  if (authStatus === 'unauthorized') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFB] p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-200 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Akses Ditolak</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Halaman ini khusus untuk akun Administrator Mentora. Anda sedang dialihkan kembali ke dashboard pengguna...
          </p>
        </div>
      </div>
    );
  }

  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;

  const filteredApplications = applications.filter((app) =>
    filterAppStatus === 'ALL' ? true : app.status === filterAppStatus
  );

  const filteredMentors = activeMentors.filter((m) => {
    const q = searchMentor.toLowerCase();
    return (
      m.namaLengkap.toLowerCase().includes(q) ||
      (m.universitas || '').toLowerCase().includes(q) ||
      (m.prodi || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {/* Header Portal Admin */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-2xl shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Portal Administrator Mentora
                </h1>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  Admin Terverifikasi
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Masuk sebagai <strong className="text-slate-800">{adminUser?.namaLengkap}</strong> ({adminUser?.email})
              </p>
            </div>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={isRefreshing}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-[#2563EB] text-white text-xs font-bold transition flex items-center gap-2 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Perbarui Data</span>
          </button>
        </div>

        {/* Navigasi Tab Admin */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Ringkasan Platform</span>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'verification'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verifikasi Pengajuan Mentor</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('mentors')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'mentors'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Direktori Mentor Aktif ({activeMentors.length})</span>
          </button>
        </div>

        {/* ================= TAB 1: RINGKASAN PLATFORM ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Kartu Metrik Utama */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: 'Total Pengajuan Masuk',
                  value: applications.length.toString(),
                  icon: FileText,
                  color: 'text-[#2563EB]',
                  bg: 'bg-blue-50',
                  border: 'border-blue-100',
                  badge: 'Semua Status',
                },
                {
                  label: 'Menunggu Verifikasi',
                  value: pendingCount.toString(),
                  icon: Clock,
                  color: 'text-amber-700',
                  bg: 'bg-amber-50',
                  border: 'border-amber-200',
                  badge: pendingCount > 0 ? 'Perlu Tinjauan' : 'Terkendali',
                },
                {
                  label: 'Mentor Aktif',
                  value: activeMentors.length.toString(),
                  icon: ShieldCheck,
                  color: 'text-emerald-700',
                  bg: 'bg-emerald-50',
                  border: 'border-emerald-100',
                  badge: 'Tervalidasi',
                },
                {
                  label: 'Sesi Mentoring Selesai',
                  value: '8,420',
                  icon: BookOpen,
                  color: 'text-purple-700',
                  bg: 'bg-purple-50',
                  border: 'border-purple-100',
                  badge: '+24% bln ini',
                },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`bg-white p-6 rounded-3xl border ${stat.border} shadow-sm flex flex-col gap-4`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                        <TrendingUp className="w-3 h-3" />
                        {stat.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Grafik Aktivitas & Manajemen Konten */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">Aktivitas Pertukaran Ilmu</h2>
                    <p className="text-xs text-slate-500">Volume sesi mentoring 7 hari terakhir</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>

                <div className="h-60 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 pb-2">
                  {[42, 68, 54, 92, 76, 110, 88].map((val, i) => (
                    <div key={i} className="relative flex flex-col items-center flex-1 gap-2 group h-full justify-end">
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-7 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded transition-opacity whitespace-nowrap">
                        {val} Sesi
                      </span>
                      <div
                        className="w-full max-w-[42px] bg-[#2563EB] hover:bg-blue-700 rounded-t-xl transition-all duration-300"
                        style={{ height: `${(val / 110) * 100}%` }}
                      />
                      <span className="text-xs font-bold text-slate-400">H-{6 - i}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Pintasan Pengelolaan</h2>
                  <p className="text-xs text-slate-500">Akses cepat moderasi & konten publik</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('verification')}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#2563EB] transition group bg-slate-50/70 hover:bg-white text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-[#2563EB] transition">
                          Antrean Verifikasi
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {pendingCount} pengajuan menunggu tinjauan
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] transition" />
                  </button>

                  <Link
                    href="/tentang"
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#2563EB] transition group bg-slate-50/70 hover:bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-[#2563EB] transition">
                          Halaman Tentang
                        </p>
                        <p className="text-[11px] text-slate-500">Kelola profil & visi platform</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] transition" />
                  </Link>

                  <Link
                    href="/faq"
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#2563EB] transition group bg-slate-50/70 hover:bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-[#2563EB] transition">
                          Pusat Bantuan (FAQ)
                        </p>
                        <p className="text-[11px] text-slate-500">Perbarui pertanyaan umum</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] transition" />
                  </Link>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ================= TAB 2: VERIFIKASI PENGAJUAN MENTOR ================= */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Verifikasi Kredensial Calon Mentor</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Periksa bukti kompetensi akademik atau portofolio sebelum mengaktifkan status Mentor.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterAppStatus(status)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                      filterAppStatus === status
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status === 'ALL'
                      ? 'Semua'
                      : status === 'PENDING'
                      ? 'Menunggu'
                      : status === 'APPROVED'
                      ? 'Disetujui'
                      : 'Ditolak'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-bold text-slate-900 text-base">{app.user.namaLengkap}</h3>
                      <span className="text-xs text-slate-400">({app.user.email})</span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          app.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold">{app.user.universitas || 'Universitas'}</span>
                        {app.user.prodi ? ` • ${app.user.prodi}` : ''}
                        {app.user.semester ? ` (Semester ${app.user.semester})` : ''}
                      </p>
                      <p>
                        <strong className="text-slate-800">Keahlian Diajukan:</strong> {app.skillsOffered}
                      </p>
                      {app.pengalamanMengajar && (
                        <p>
                          <strong className="text-slate-800">Pengalaman:</strong> {app.pengalamanMengajar}
                        </p>
                      )}
                      <p className="flex items-center gap-1.5 text-[#2563EB] font-semibold pt-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Dokumen Kredensial: {app.dokumenNama}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {app.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleReviewApplication(app.id, 'APPROVE')}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Setujui</span>
                        </button>
                        <button
                          onClick={() => handleReviewApplication(app.id, 'REJECT')}
                          className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Tolak</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 italic">
                        Telah diproses ({app.status})
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {filteredApplications.length === 0 && (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                  Tidak ada data pengajuan pada kategori filter ini.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: DIREKTORI MENTOR AKTIF ================= */}
        {activeTab === 'mentors' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchMentor}
                  onChange={(e) => setSearchMentor(e.target.value)}
                  placeholder="Cari nama mentor, universitas, atau prodi..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                />
              </div>
              <span className="text-xs font-bold text-slate-500">
                Total Mentor Tervalidasi: <span className="text-[#2563EB]">{filteredMentors.length}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-900 text-base">{mentor.namaLengkap}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        AKTIF
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {mentor.prodi || 'Mahasiswa'} • {mentor.universitas || 'Universitas'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {mentor.skills?.map((s) => (
                        <span
                          key={s.id}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold"
                        >
                          {s.skill.namaSkill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {mentor.totalPoin || 0} Poin
                    </span>
                    <Link
                      href={`/mentors/${mentor.id}`}
                      className="text-xs font-bold text-[#2563EB] hover:underline"
                    >
                      Lihat Profil →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}