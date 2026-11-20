'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSession } from '@/components/SessionProvider';
import { accountHome } from '@/lib/account-home';
import { XCircle, Loader2, ShieldAlert, RefreshCw, Award } from 'lucide-react';
import {
  ShieldCheck,
  Users,
  Clock,
  Check,
  FileText,
  Activity,
  ArrowRight,
  Search,
  GraduationCap,
} from '@/components/animated-icons';

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

  const { profile: adminUser, authLoading } = useSession();
  const home = adminUser ? accountHome(adminUser) : null;

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'mentors'>('overview');

  // Data States
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [activeMentors, setActiveMentors] = useState<ActiveMentor[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterAppStatus, setFilterAppStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchMentor, setSearchMentor] = useState('');

  const fetchAdminData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!home) {
      router.replace('/auth?tab=masuk');
      return;
    }
    if (home !== '/admin') {
      const timer = window.setTimeout(() => router.replace(home), 1800);
      return () => window.clearTimeout(timer);
    }
    void fetchAdminData();
  }, [authLoading, home, router, fetchAdminData]);

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
  if (authLoading || !home) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-canvas">
        <Loader2 className="w-9 h-9 text-primary animate-spin mb-3" />
        <p className="text-sm font-bold text-ink-secondary">Memverifikasi hak akses administrator...</p>
      </div>
    );
  }

  // Tampilan jika diakses oleh akun non-Admin
  if (home !== '/admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-canvas p-6">
        <div className="max-w-md w-full bg-surface rounded-3xl p-8 border border-danger-soft text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-danger-tint text-danger flex items-center justify-center mx-auto">
            <ShieldAlert className="size-6 sm:size-8" />
          </div>
          <h1 className="text-xl font-extrabold text-ink">Akses Ditolak</h1>
          <p className="text-xs text-ink-muted leading-relaxed">
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
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {/* Header Portal Admin */}
        <div className="bg-surface rounded-2xl p-5 sm:p-8 border border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="size-11 sm:size-16 rounded-2xl bg-primary-soft text-primary flex items-center justify-center font-extrabold text-2xl shrink-0">
              <ShieldCheck className="size-6 sm:size-8" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                Portal Admin
              </h1>
              <p className="break-words text-sm text-ink-muted mt-1">
                Masuk sebagai <strong className="text-ink">{adminUser?.namaLengkap}</strong> ({adminUser?.email})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchAdminData}
              disabled={isRefreshing}
              className="action-primary inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Perbarui Data</span>
            </button>
          </div>
        </div>

        {/* Navigasi Tab Admin */}
        <div role="group" aria-label="Bagian portal admin" className="workspace-tabs">
          <button
            onClick={() => setActiveTab('overview')}
            aria-pressed={activeTab === 'overview'}
          >
            <Activity className="w-4 h-4" />
            <span>Ringkasan Platform</span>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            aria-pressed={activeTab === 'verification'}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verifikasi Pengajuan Mentor</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-warning-soft text-warning text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('mentors')}
            aria-pressed={activeTab === 'mentors'}
          >
            <Users className="w-4 h-4" />
            <span>Direktori Mentor Aktif ({activeMentors.length})</span>
          </button>
        </div>

        {/* ================= TAB 1: RINGKASAN PLATFORM ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Kartu Metrik Utama */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  label: 'Total Pengajuan Masuk',
                  value: applications.length.toString(),
                  icon: FileText,
                  color: 'text-primary',
                  bg: 'bg-primary-tint',
                  border: 'border-primary-soft',
                  badge: 'Semua Status',
                },
                {
                  label: 'Menunggu Verifikasi',
                  value: pendingCount.toString(),
                  icon: Clock,
                  color: 'text-warning',
                  bg: 'bg-warning-tint',
                  border: 'border-warning-soft',
                  badge: pendingCount > 0 ? 'Perlu Tinjauan' : 'Terkendali',
                },
                {
                  label: 'Mentor Aktif',
                  value: activeMentors.length.toString(),
                  icon: ShieldCheck,
                  color: 'text-success',
                  bg: 'bg-success-tint',
                  border: 'border-success-soft',
                  badge: 'Tervalidasi',
                },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`bg-surface p-6 rounded-3xl border ${stat.border} shadow-sm flex flex-col gap-4`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                        {stat.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-ink">{stat.value}</h3>
                      <p className="text-xs font-bold text-ink-muted mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Grafik Aktivitas & Manajemen Konten */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 bg-surface p-6 sm:p-8 rounded-2xl border border-line flex flex-col justify-between space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-ink">Aktivitas Pertukaran Ilmu</h2>
                    <p className="text-xs text-ink-muted">Volume sesi mentoring 7 hari terakhir</p>
                  </div>
                  <div className="p-2.5 bg-canvas border border-line rounded-xl text-ink-secondary">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>

                <div className="h-60 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-canvas text-center">
                  <Activity className="h-8 w-8 text-subtle" />
                  <p className="max-w-xs text-sm text-ink-muted">Data aktivitas sesi belum tersedia.</p>
                </div>
              </section>

              <section className="bg-surface p-6 sm:p-8 rounded-3xl border border-line/80 shadow-sm space-y-5">
                <div>
                  <h2 className="text-lg font-extrabold text-ink">Pintasan Pengelolaan</h2>
                  <p className="text-xs text-ink-muted">Akses cepat pengelolaan platform</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('verification')}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-line hover:border-primary transition group bg-canvas/70 hover:bg-surface text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-warning-soft text-warning flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink group-hover:text-primary transition">
                          Antrean Verifikasi
                        </p>
                        <p className="text-[11px] text-ink-muted">
                          {pendingCount} pengajuan menunggu tinjauan
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-primary transition" />
                  </button>

                  <button
                    onClick={() => setActiveTab('mentors')}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-line hover:border-primary transition group bg-canvas/70 hover:bg-surface text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink group-hover:text-primary transition">
                          Direktori Mentor Aktif
                        </p>
                        <p className="text-[11px] text-ink-muted">Tinjau akun mentor terverifikasi</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-primary transition" />
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ================= TAB 2: VERIFIKASI PENGAJUAN MENTOR ================= */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div className="bg-surface rounded-2xl p-6 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-ink">Verifikasi Kredensial Calon Mentor</h2>
                <p className="text-xs text-ink-muted mt-0.5">
                  Periksa bukti kompetensi akademik atau portofolio sebelum mengaktifkan status Mentor.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterAppStatus(status)}
                    aria-pressed={filterAppStatus === status}
                    className="filter-chip"
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
                  className="bg-surface rounded-2xl p-6 border border-line flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-bold text-ink text-base">{app.user.namaLengkap}</h3>
                      <span className="text-xs text-ink-muted">({app.user.email})</span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          app.status === 'APPROVED'
                            ? 'bg-success-soft text-success'
                            : app.status === 'REJECTED'
                            ? 'bg-danger-soft text-danger'
                            : 'bg-warning-soft text-warning'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="text-xs text-ink-secondary space-y-1">
                      <p className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-ink-muted" />
                        <span className="font-semibold">{app.user.universitas || 'Universitas'}</span>
                        {app.user.prodi ? ` • ${app.user.prodi}` : ''}
                        {app.user.semester ? ` (Semester ${app.user.semester})` : ''}
                      </p>
                      <p>
                        <strong className="text-ink">Keahlian Diajukan:</strong> {app.skillsOffered}
                      </p>
                      {app.pengalamanMengajar && (
                        <p>
                          <strong className="text-ink">Pengalaman:</strong> {app.pengalamanMengajar}
                        </p>
                      )}
                      <p className="flex items-center gap-1.5 text-primary font-semibold pt-1">
                        <FileText className="w-3.5 h-3.5" />
                        {app.dokumenUrl ? <a className="underline underline-offset-2" href={app.dokumenUrl}>Unduh {app.dokumenNama}</a> : <span>Berkas belum tersedia</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {app.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleReviewApplication(app.id, 'APPROVE')}
                          className="px-4 py-2.5 rounded-xl action-primary text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Setujui</span>
                        </button>
                        <button
                          onClick={() => handleReviewApplication(app.id, 'REJECT')}
                          className="px-4 py-2.5 rounded-xl bg-danger-tint hover:bg-danger-soft text-danger-hover text-xs font-bold border border-danger-soft transition flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Tolak</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-ink-muted italic">
                        Telah diproses ({app.status})
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {filteredApplications.length === 0 && (
                <div className="p-12 text-center bg-surface rounded-3xl border border-line text-ink-muted text-xs">
                  Tidak ada data pengajuan pada kategori filter ini.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: DIREKTORI MENTOR AKTIF ================= */}
        {activeTab === 'mentors' && (
          <div className="space-y-6">
            <div className="bg-surface rounded-2xl p-5 border border-line flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-ink-muted absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchMentor}
                  onChange={(e) => setSearchMentor(e.target.value)}
                  placeholder="Cari nama mentor, universitas, atau prodi..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-line text-sm focus:outline-none focus:ring-2 focus:ring-primary-accent/30 focus:border-primary"
                />
              </div>
              <span className="text-xs font-bold text-ink-muted">
                Total Mentor Tervalidasi: <span className="text-primary">{filteredMentors.length}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-surface rounded-2xl p-6 border border-line flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-ink text-base">{mentor.namaLengkap}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-success-tint text-success border border-success-soft text-[10px] font-bold">
                        AKTIF
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted">
                      {mentor.prodi || 'Mahasiswa'} • {mentor.universitas || 'Universitas'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {mentor.skills?.map((s) => (
                        <span
                          key={s.id}
                          className="px-2.5 py-1 rounded-lg bg-canvas text-ink-secondary text-[11px] font-semibold"
                        >
                          {s.skill.namaSkill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line flex items-center justify-between">
                    <span className="text-xs font-bold text-ink-secondary flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {mentor.totalPoin || 0} Poin
                    </span>
                    <Link href={`/mentors/${mentor.id}`} className="inline-flex min-h-11 items-center gap-1 rounded text-sm font-semibold text-primary hover:underline">
                      Lihat Profil →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer workspace />
    </div>
  );
}
