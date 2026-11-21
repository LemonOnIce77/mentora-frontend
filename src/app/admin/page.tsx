'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, ShieldAlert } from 'lucide-react';
import AdminNavbar from './components/AdminNavbar';
import AdminHero from './components/AdminHero';
import AdminTabs from './components/AdminTabs';
import OverviewTab from './components/OverviewTab';
import VerificationTab from './components/VerificationTab';
import MentorsTab from './components/MentorsTab';
import ConfirmModal from './components/ConfirmModal';
import ToastStack from './components/ToastStack';
import {
  initialSubmissions,
  mentors as defaultMentors,
  TOTAL_SUBMISSIONS,
  BASE_ACTIVE_MENTORS,
  getInitials,
  type Submission,
  type Mentor,
  type TabKey,
  type ToastItem,
} from './components/adminData';

const CALM_AVATAR = 'bg-primary-soft text-primary border border-primary/20';

export default function AdminPage() {
  const router = useRouter();

  // Auth & role protection
  const [authStatus, setAuthStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');
  const [adminUser, setAdminUser] = useState<{
    namaLengkap?: string;
    namaPanggilan?: string;
    email?: string;
    role?: string;
    fotoProfil?: string;
  } | null>(null);
  const [tab, setTab] = useState<TabKey>('overview');

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      window.location.replace('/auth?tab=masuk');
    } catch {
      window.location.replace('/auth?tab=masuk');
    }
  };

  // Data states
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [mentorsList, setMentorsList] = useState<Mentor[]>(defaultMentors);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal & Toast states
  const [confirm, setConfirm] = useState<{
    action: 'approve' | 'reject';
    submission: Submission;
  } | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const fetchAdminData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [appRes, mentorRes] = await Promise.all([
        fetch('/api/admin/applications', { cache: 'no-store' }).catch(() => null),
        fetch('/api/mentor/list', { cache: 'no-store' }).catch(() => null),
      ]);

      if (appRes && appRes.ok) {
        const appData = await appRes.json();
        if (appData.applications && appData.applications.length > 0) {
          const mapped: Submission[] = appData.applications.map((app: any, idx: number) => {
            const rawStatus = (app.status || 'PENDING').toLowerCase();
            const status = rawStatus === 'approved' ? 'approved' : rawStatus === 'rejected' ? 'rejected' : 'pending';
            const skillsArr = Array.isArray(app.skillsOffered)
              ? app.skillsOffered
              : typeof app.skillsOffered === 'string'
                ? app.skillsOffered.split(',').map((s: string) => s.trim()).filter(Boolean)
                : ['Skill Umum'];

            return {
              id: `SUB-${app.id || idx + 1}`,
              realId: typeof app.id === 'number' ? app.id : parseInt(app.id, 10),
              name: app.user?.namaLengkap || 'Calon Mentor',
              email: app.user?.email || 'mentor@mentora.com',
              initials: getInitials(app.user?.namaLengkap || 'CM'),
              tone: CALM_AVATAR,
              university: app.user?.universitas || 'Universitas Mitra Mentora',
              program: app.user?.prodi || 'Program Studi',
              semester: app.user?.semester ? `Semester ${app.user.semester}` : 'Semester Aktif',
              city: app.user?.domisili || 'Indonesia',
              skills: skillsArr,
              experience: app.pengalamanMengajar || 'Pengalaman praktikum dan asistensi akademik mahasiswa.',
              documentName: app.dokumenNama || 'Transkrip_Kredensial_Akademik.pdf',
              documentUrl: app.dokumenUrl || '/uploads/Transkrip_Kredensial_Resmi.pdf',
              status,
              rejectionReason: app.catatanAdmin,
              submittedAt: 'Baru saja',
            };
          });

          // Gabungkan data API dengan fallback unik jika ada
          const realIds = new Set(mapped.map((m) => m.realId));
          const extraDefaults = initialSubmissions.filter((init) => !realIds.has(init.realId));
          setSubmissions([...mapped, ...extraDefaults]);
        }
      }

      if (mentorRes && mentorRes.ok) {
        const mentorData = await mentorRes.json();
        if (mentorData.mentors && mentorData.mentors.length > 0) {
          const approved = mentorData.mentors
            .filter((m: any) => m.statusMentor === 'APPROVED' || m.role === 'Mentor')
            .map((m: any, idx: number) => {
              const skills = Array.isArray(m.skills)
                ? m.skills.map((s: any) => s.skill?.namaSkill || s.namaSkill || 'Keahlian')
                : ['Mentoring'];

              return {
                id: `MTR-${m.id || idx + 1}`,
                name: m.namaLengkap,
                initials: getInitials(m.namaLengkap),
                tone: CALM_AVATAR,
                program: m.prodi || 'Program Studi',
                university: m.universitas || 'Universitas Mitra',
                city: m.domisili || 'Indonesia',
                mode: (m.modeSesi === 'Offline' ? 'Tatap Muka' : 'Online') as 'Online' | 'Tatap Muka',
                skills: skills.length > 0 ? skills : ['Mentoring'],
                eduPoints: m.totalPoin || 80,
              };
            });

          if (approved.length > 0) {
            setMentorsList(approved);
          }
        }
      }

      pushToast({
        tone: 'success',
        title: 'Data berhasil diperbarui',
        message: 'Seluruh pengajuan dan direktori mentor telah disinkronkan.',
      });
    } catch (error) {
      console.error('Error memuat data admin:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [pushToast]);

  // Auth Guard
  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          // Cek fallback localStorage
          const sessionData = typeof window !== 'undefined' ? localStorage.getItem('user_session') : null;
          if (sessionData) {
            try {
              const localUser = JSON.parse(sessionData);
              if (localUser && (localUser.role === 'Admin' || localUser.role?.toLowerCase() === 'admin')) {
                setAdminUser(localUser);
                setAuthStatus('authorized');
                await fetchAdminData();
                return;
              }
            } catch (e) {}
          }
          router.replace('/auth');
          return;
        }

        const data = await res.json();
        const currentUser = data.user;

        if (!currentUser || (currentUser.role !== 'Admin' && currentUser.role?.toLowerCase() !== 'admin')) {
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
        console.error('Gagal memverifikasi hak akses admin:', error);
        router.replace('/auth');
      }
    };

    verifyAdminAccess();
  }, [router, fetchAdminData]);

  // Handle Review (Approve / Reject)
  const handleConfirmAction = async (reason: string) => {
    if (!confirm) return;
    const { action, submission } = confirm;
    setActionLoading(true);

    try {
      if (submission.realId) {
        await fetch(`/api/admin/applications/${submission.realId}/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: action === 'approve' ? 'APPROVE' : 'REJECT',
            catatanAdmin: action === 'reject' ? reason.trim() : undefined,
          }),
        });
      }

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submission.id
            ? {
                ...s,
                status: action === 'approve' ? 'approved' : 'rejected',
                rejectionReason:
                  action === 'reject'
                    ? reason.trim() || 'Pengajuan belum memenuhi standar kelayakan mentor Mentora.'
                    : undefined,
              }
            : s
        )
      );

      setConfirm(null);

      if (action === 'approve') {
        pushToast({
          tone: 'success',
          title: 'Mentor berhasil disetujui',
          message: `${submission.name} kini berstatus Mentor aktif di Mentora.`,
        });
      } else {
        pushToast({
          tone: 'danger',
          title: 'Pengajuan ditolak',
          message: `Alasan penolakan telah dicatat untuk ${submission.name}.`,
        });
      }
    } catch (err) {
      console.error('Gagal memproses review pengajuan:', err);
      pushToast({
        tone: 'danger',
        title: 'Gagal memproses aksi',
        message: 'Terjadi kendala koneksi saat menyimpan keputusan verifikasi.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // State: Sedang memeriksa sesi
  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-canvas">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
        <p className="text-sm font-bold text-ink-secondary">Memverifikasi hak akses administrator Mentora...</p>
      </div>
    );
  }

  // State: Akses ditolak (bukan admin)
  if (authStatus === 'unauthorized') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-canvas p-6">
        <div className="max-w-md w-full bg-surface rounded-3xl p-8 border border-danger-soft text-center shadow-cloud space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-danger-tint text-danger flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-extrabold text-ink">Akses Ditolak</h1>
          <p className="text-xs text-ink-muted leading-relaxed">
            Halaman ini khusus untuk akun Administrator Mentora. Anda sedang dialihkan kembali ke dashboard pengguna...
          </p>
        </div>
      </div>
    );
  }

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const activeMentorsCount = Math.max(mentorsList.length, BASE_ACTIVE_MENTORS + Math.max(0, approvedCount - 2));

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink antialiased">
      <AdminNavbar
        activeTab={tab}
        onTabChange={setTab}
        pendingCount={pendingCount}
        adminUser={adminUser}
        onLogout={handleLogout}
        isRefreshing={isRefreshing}
        onRefresh={fetchAdminData}
      />

      <main className="flex-1">
        <AdminHero refreshing={isRefreshing} onRefresh={fetchAdminData} />
        <AdminTabs tab={tab} onChange={setTab} pendingCount={pendingCount} />

        <div id="dashboard-admin" className="scroll-mt-32">
          {tab === 'overview' && (
            <OverviewTab
              submissions={submissions}
              totalSubmissions={Math.max(submissions.length, TOTAL_SUBMISSIONS)}
              pendingCount={pendingCount}
              activeMentors={activeMentorsCount}
              onGoTo={setTab}
            />
          )}

          {tab === 'verification' && (
            <VerificationTab
              submissions={submissions}
              onApprove={(s) => setConfirm({ action: 'approve', submission: s })}
              onReject={(s) => setConfirm({ action: 'reject', submission: s })}
            />
          )}

          {tab === 'mentors' && (
            <MentorsTab mentors={mentorsList} activeMentors={activeMentorsCount} />
          )}
        </div>
      </main>

      <footer className="border-t border-line bg-surface py-5 text-xs text-ink-muted">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-ink-secondary">
            <Image src="/Mentora.svg" alt="" width={22} height={22} />
            <span>Mentora Administrator Workspace</span>
          </div>
          <p>© {new Date().getFullYear()} Mentora Platform. Hak Akses Khusus Administrator Sistem.</p>
        </div>
      </footer>

      <ConfirmModal
        state={confirm}
        onClose={() => {
          if (!actionLoading) setConfirm(null);
        }}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
      />

      <ToastStack
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
