'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  User,
  Shield,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Upload,
  Plus,
  Trash2,
  Search,
  Sparkles,
  ExternalLink,
  Edit3,
  Check,
  Loader2,
  Calendar,
  Layers,
  GraduationCap,
  MapPin,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface CurrentUser {
  id: number;
  namaLengkap: string;
  namaPanggilan?: string;
  email: string;
  universitas?: string;
  prodi?: string;
  semester?: string;
  domisili?: string;
  tglLahir?: string;
  bio?: string;
  fotoProfil?: string;
  modeSesi?: string;
  role: string;
  statusMentor: string;
  dokumenKredensial?: string;
  totalPoin: number;
  skills: Array<{
    id: number;
    tipe: string;
    level: string;
    skill: { id: number; namaSkill: string; kategori: string };
  }>;
}

interface MentorApplication {
  id: number;
  userId: number;
  skillsOffered: string;
  pengalamanMengajar?: string;
  dokumenUrl: string;
  dokumenNama: string;
  status: string;
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

interface MentorUser {
  id: number;
  namaLengkap: string;
  namaPanggilan?: string;
  universitas?: string;
  prodi?: string;
  semester?: string;
  domisili?: string;
  bio?: string;
  fotoProfil?: string;
  totalPoin: number;
  modeSesi?: string;
  statusMentor: string;
  skills: Array<{
    id: number;
    skill: { id: number; namaSkill: string; kategori: string };
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mentors' | 'profile' | 'skills' | 'apply' | 'admin'>('mentors');

  // Mentors list state
  const [mentors, setMentors] = useState<MentorUser[]>([]);
  const [searchMentorQuery, setSearchMentorQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');

  // Admin applications state
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  // Mentor application form state
  const [applySkills, setApplySkills] = useState('');
  const [applyExperience, setApplyExperience] = useState('');
  const [applyDocName, setApplyDocName] = useState('');
  const [applyDocUrl, setApplyDocUrl] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Profile edit state
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [profileForm, setProfileForm] = useState<{
    namaLengkap: string;
    namaPanggilan: string;
    universitas: string;
    prodi: string;
    semester: string;
    domisili: string;
    bio: string;
    latitude?: number | null;
    longitude?: number | null;
  }>({
    namaLengkap: '',
    namaPanggilan: '',
    universitas: '',
    prodi: '',
    semester: '',
    domisili: '',
    bio: '',
    latitude: null,
    longitude: null,
  });

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung fitur Geolocation API.');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        setProfileForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          domisili: prev.domisili || 'Bandung, Jawa Barat',
        }));
        setDetectingLocation(false);
        alert(`Lokasi GPS berhasil dideteksi: (${lat}, ${lng}) untuk fitur nearby!`);
      },
      () => {
        setDetectingLocation(false);
        // Fallback simulated GPS coordinates for Telkom University
        setProfileForm((prev) => ({
          ...prev,
          latitude: -6.9740,
          longitude: 107.6303,
          domisili: prev.domisili || 'Dayeuhkolot, Bandung',
        }));
        alert('Izin lokasi browser tidak diberikan. Menggunakan koordinat simulasi kampus Bandung (-6.9740, 107.6303).');
      },
      { timeout: 8000 }
    );
  };

  const loadUserData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/auth');
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setProfileForm({
        namaLengkap: data.user.namaLengkap || '',
        namaPanggilan: data.user.namaPanggilan || '',
        universitas: data.user.universitas || '',
        prodi: data.user.prodi || '',
        semester: data.user.semester || '',
        domisili: data.user.domisili || '',
        bio: data.user.bio || '',
        latitude: data.user.latitude ?? null,
        longitude: data.user.longitude ?? null,
      });
    } catch (err) {
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const loadMentors = async () => {
    try {
      let url = '/api/mentor/list';
      const params = new URLSearchParams();
      if (searchMentorQuery) params.append('q', searchMentorQuery);
      if (selectedSkillFilter) params.append('skill', selectedSkillFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMentors(data.mentors || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadAdminApplications = async () => {
    if (!user || user.role !== 'Admin') return;
    setAdminLoading(true);
    try {
      const res = await fetch('/api/admin/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    loadMentors();
  }, [searchMentorQuery, selectedSkillFilter]);

  useEffect(() => {
    if (user?.role === 'Admin') {
      loadAdminApplications();
    }
  }, [user]);

  // Handle Mentor Upgrade Application
  const handleApplyMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applySkills || !applyDocName) {
      alert('Mohon isi skill yang ditawarkan dan nama dokumen transkrip.');
      return;
    }
    setApplyLoading(true);
    try {
      const res = await fetch('/api/mentor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillsOffered: applySkills,
          pengalamanMengajar: applyExperience,
          dokumenNama: applyDocName,
          dokumenUrl: applyDocUrl || '/uploads/dummy_transkrip.pdf',
        }),
      });

      if (res.ok) {
        setApplySuccess(true);
        await loadUserData();
      } else {
        const d = await res.json();
        alert(d.message || 'Gagal mengirim pengajuan.');
      }
    } catch (err) {
      alert('Terjadi kesalahan pada server.');
    } finally {
      setApplyLoading(false);
    }
  };

  // Handle Admin Review (Approve / Reject)
  const handleReviewApplication = async (appId: number, action: 'APPROVE' | 'REJECT') => {
    const confirmMsg =
      action === 'APPROVE'
        ? 'Apakah Anda yakin ingin menyetujui dan mengaktifkan akun pengguna ini menjadi Mentor?'
        : 'Apakah Anda yakin ingin menolak pengajuan ini?';
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/applications/${appId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        await loadAdminApplications();
        await loadMentors();
        alert(
          action === 'APPROVE'
            ? '✓ Berhasil disetujui! Pengguna kini berstatus Mentor aktif.'
            : 'Pengajuan telah ditolak.'
        );
      } else {
        alert('Gagal memproses review.');
      }
    } catch (err) {
      alert('Terjadi kesalahan server.');
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile/onboarding/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      if (res.ok) {
        await loadUserData();
        setEditProfileMode(false);
        alert('Profil berhasil diperbarui!');
      } else {
        alert('Gagal memperbarui profil.');
      }
    } catch (err) {
      alert('Terjadi kesalahan server.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
          <p className="text-sm font-semibold">Memuat dashboard Mentora...</p>
        </div>
      </div>
    );
  }

  const taughtSkills = user?.skills.filter((s) => s.tipe === 'TEACH') || [];
  const learnedSkills = user?.skills.filter((s) => s.tipe === 'LEARN') || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      {/* Main App Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Top Profile Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              {user?.fotoProfil ? (
                <img
                  src={user.fotoProfil}
                  alt={user.namaLengkap}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-100 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-100 to-blue-200 text-[#2563EB] flex items-center justify-center font-bold text-2xl shadow-sm">
                  {(user?.namaPanggilan || user?.namaLengkap || 'U').charAt(0)}
                </div>
              )}
              {user?.statusMentor === 'APPROVED' && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-xs" title="Mentor Terverifikasi">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  {user?.namaLengkap}
                </h1>
                {/* Role / Status Badge */}
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    user?.role === 'Admin'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : user?.statusMentor === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1'
                      : user?.statusMentor === 'PENDING'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-blue-50 text-[#2563EB] border border-blue-200'
                  }`}
                >
                  {user?.role === 'Admin'
                    ? '👑 Admin Mentora'
                    : user?.statusMentor === 'APPROVED'
                    ? '⭐ Mentor Terverifikasi'
                    : user?.statusMentor === 'PENDING'
                    ? '⏳ Pengajuan Mentor Pending'
                    : '🎓 Mahasiswa / Mentee'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1 font-medium">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {user?.universitas || 'Belum diatur'} {user?.prodi ? `• ${user.prodi}` : ''}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {user?.domisili || 'Indonesia'}
                </span>
                <span className="flex items-center gap-1 font-bold text-[#2563EB]">
                  <Award className="w-3.5 h-3.5" />
                  {user?.totalPoin || 0} EduPoints
                </span>
              </div>
            </div>
          </div>

          {/* Quick Upgrade / Mentor CTA banner on the right */}
          <div className="flex items-center gap-3">
            {user?.role !== 'Admin' && user?.statusMentor !== 'APPROVED' && (
              <button
                onClick={() => setActiveTab('apply')}
                className="px-5 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {user?.statusMentor === 'PENDING' ? 'Status Pengajuan Mentor' : 'Ajukan Jadi Mentor'}
                </span>
              </button>
            )}

            <button
              onClick={() => router.push('/onboarding')}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              Ulangi Onboarding
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('mentors')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'mentors'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Daftar Mentor (UC-F1-05)</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Manajemen Profil (FR-02)</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'skills'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Pengelolaan Skill (FR-03)</span>
          </button>

          {user?.role !== 'Admin' && (
            <button
              onClick={() => router.push('/mentor/apply')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'apply'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Pengajuan Mentor & Kredensial (FR-04, FR-05)</span>
            </button>
          )}

          {user?.role === 'Admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'admin'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-purple-600 hover:text-purple-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Verifikasi Mentor (FR-06, FR-07)</span>
              {applications.filter((a) => a.status === 'PENDING').length > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {applications.filter((a) => a.status === 'PENDING').length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* ================= TAB 1: DAFTAR MENTOR (UC-F1-05) ================= */}
        {activeTab === 'mentors' && (
          <div className="space-y-6">
            
            {/* Search and Filters */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchMentorQuery}
                  onChange={(e) => setSearchMentorQuery(e.target.value)}
                  placeholder="Cari mentor, kampus, atau prodi..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                />
              </div>

              {/* Preset Skill Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Filter Skill:</span>
                <button
                  onClick={() => setSelectedSkillFilter('')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    selectedSkillFilter === ''
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua
                </button>
                {['UI/UX Design', 'Programming', 'Figma', 'Data Analysis', 'Design Thinking'].map((sk) => (
                  <button
                    key={sk}
                    onClick={() => setSelectedSkillFilter(sk === selectedSkillFilter ? '' : sk)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                      selectedSkillFilter === sk
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sk}
                  </button>
                ))}
              </div>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      {mentor.fotoProfil ? (
                        <img
                          src={mentor.fotoProfil}
                          alt={mentor.namaLengkap}
                          className="w-14 h-14 rounded-2xl object-cover border border-blue-100 shadow-xs"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-lg">
                          {(mentor.namaPanggilan || mentor.namaLengkap).charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 text-base">{mentor.namaLengkap}</h3>
                          <span className="text-emerald-500" title="Terverifikasi Admin Mentora">
                            <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {mentor.prodi} • {mentor.universitas}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          📍 {mentor.domisili || 'Indonesia'} • Mode: <span className="font-semibold text-slate-700">{mentor.modeSesi || 'Fleksibel'}</span>
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {mentor.bio || 'Siap berbagi ilmu dan berdiskusi seputar materi perkuliahan.'}
                    </p>

                    {/* Skills offered */}
                    <div className="mb-4">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Skill yang Diajarkan:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {mentor.skills.map((s) => (
                          <span
                            key={s.id}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/60"
                          >
                            {s.skill.namaSkill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {mentor.totalPoin} Poin Keaktifan
                    </span>

                    <button
                      onClick={() => alert(`Fitur booking sesi dengan Mentor ${mentor.namaLengkap} masuk dalam cakupan Sprint 2 (Fase 2: Skill Exchange & Reservasi).`)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#2563EB] text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>Booking Sesi</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {mentors.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">Tidak ada mentor ditemukan</h3>
                <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter skill.</p>
              </div>
            )}

          </div>
        )}

        {/* ================= TAB 2: MANAJEMEN PROFIL (FR-02) ================= */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Data Profil Pengguna (FR-02)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Kelola informasi data diri untuk keperluan pertukaran ilmu.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditProfileMode(!editProfileMode)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{editProfileMode ? 'Batal Edit' : 'Edit Profil'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    disabled={!editProfileMode}
                    value={profileForm.namaLengkap}
                    onChange={(e) => setProfileForm({ ...profileForm, namaLengkap: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    disabled={!editProfileMode}
                    value={profileForm.namaPanggilan}
                    onChange={(e) => setProfileForm({ ...profileForm, namaPanggilan: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Universitas</label>
                  <input
                    type="text"
                    disabled={!editProfileMode}
                    value={profileForm.universitas}
                    onChange={(e) => setProfileForm({ ...profileForm, universitas: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Program Studi</label>
                  <input
                    type="text"
                    disabled={!editProfileMode}
                    value={profileForm.prodi}
                    onChange={(e) => setProfileForm({ ...profileForm, prodi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                  <input
                    type="text"
                    disabled={!editProfileMode}
                    value={profileForm.semester}
                    onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Domisili & Lokasi (Nearby)</label>
                    {editProfileMode && (
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={detectingLocation}
                        className="text-[11px] font-bold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 transition"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>{detectingLocation ? 'Mendeteksi...' : 'Deteksi GPS Browser'}</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    disabled={!editProfileMode}
                    value={profileForm.domisili}
                    onChange={(e) => setProfileForm({ ...profileForm, domisili: e.target.value })}
                    placeholder="mis. Bandung, Jawa Barat"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                  />
                  {profileForm.latitude && profileForm.longitude && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                      <span>✓ Koordinat Terkunci: {profileForm.latitude}, {profileForm.longitude} (Fitur Nearby Aktif)</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bio Singkat</label>
                <textarea
                  rows={3}
                  disabled={!editProfileMode}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                />
              </div>

              {editProfileMode && (
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* ================= TAB 3: PENGELOLAAN SKILL (FR-03) ================= */}
        {activeTab === 'skills' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Pengelolaan Skill Pengguna (FR-03)</h2>
              <p className="text-xs text-slate-500 mb-6">
                Data keahlian yang kamu kuasai untuk diajarkan dan materi yang ingin kamu pelajari.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skill Yang Ingin Dipelajari */}
                <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <h3 className="text-sm font-bold text-[#2563EB] mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Skill yang Ingin Dipelajari (Mentee)</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {learnedSkills.map((s) => (
                      <span
                        key={s.id}
                        className="px-3 py-1.5 rounded-xl bg-white text-[#2563EB] border border-blue-200 text-xs font-semibold shadow-2xs"
                      >
                        {s.skill.namaSkill}
                      </span>
                    ))}
                    {learnedSkills.length === 0 && (
                      <p className="text-xs text-slate-400">Belum ada skill yang ditambahkan.</p>
                    )}
                  </div>
                </div>

                {/* Skill Yang Sudah Dimiliki */}
                <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Skill yang Sudah Dimiliki (Mentor)</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {taughtSkills.map((s) => (
                      <span
                        key={s.id}
                        className="px-3 py-1.5 rounded-xl bg-white text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-2xs"
                      >
                        {s.skill.namaSkill}
                      </span>
                    ))}
                    {taughtSkills.length === 0 && (
                      <p className="text-xs text-slate-400">Belum ada skill yang ditambahkan.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => router.push('/onboarding')}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Ubah Pilihan Skill di Onboarding</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: PENGAJUAN AKUN MENTOR (FR-04, FR-05) ================= */}
        {activeTab === 'apply' && user?.role !== 'Admin' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
            <div className="mb-6">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                FASE 1: UPGRADE AKUN
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Pengajuan Akun Mentor & Unggah Kredensial
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sesuai FR-04 & FR-05 pada proposal Mentora, unggah bukti kompetensi (transkrip nilai/portofolio) untuk diverifikasi oleh Admin.
              </p>
            </div>

            {user?.statusMentor === 'APPROVED' ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-emerald-900">
                  Selamat! Akun Anda telah Terverifikasi sebagai Mentor
                </h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                  Profil dan keahlian Anda kini telah dipublikasikan di direktori mentor sehingga mahasiswa lain dapat memilih Anda untuk sesi belajar.
                </p>
              </div>
            ) : user?.statusMentor === 'PENDING' ? (
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-amber-900">Pengajuan Mentor Sedang Ditinjau</h3>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Dokumen kredensial: <span className="font-semibold">{user.dokumenKredensial || 'Transkrip_Nilai.pdf'}</span>
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-amber-200/60 leading-relaxed">
                  Tim Admin Mentora sedang memvalidasi kesesuaian nilai dan kualifikasi keahlianmu. Status akunmu akan otomatis berubah setelah disetujui. (FR-06, FR-07)
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplyMentor} className="space-y-5">
                {applySuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Pengajuan berhasil dikirim! Menunggu validasi Admin.</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Skill yang Ingin Kamu Ajarkan (FR-04) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={applySkills}
                    onChange={(e) => setApplySkills(e.target.value)}
                    placeholder="mis. UI/UX Design, Figma, Programming Web Dasar"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Pisahkan dengan koma jika lebih dari satu.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pengalaman Bimbingan / Mengajar (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    value={applyExperience}
                    onChange={(e) => setApplyExperience(e.target.value)}
                    placeholder="mis. Asisten praktikum mata kuliah DKV semester lalu, aktif sharing ilmu di kelompok belajar..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none resize-none"
                  />
                </div>

                {/* Upload Dokumen Kredensial (FR-05) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Upload Dokumen Kredensial (FR-05) <span className="text-rose-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-200 hover:border-[#2563EB] rounded-2xl p-6 text-center transition bg-slate-50/50">
                    <FileText className="w-8 h-8 text-[#2563EB] mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">
                      {applyDocName ? `Dokumen terpilih: ${applyDocName}` : 'Pilih Transkrip Nilai / Sertifikat Keahlian (PDF)'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Format file: PDF, JPG, PNG (Maks 5MB)</p>
                    <label className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{applyDocName ? 'Ganti File' : 'Browse File'}</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setApplyDocName(file.name);
                            setApplyDocUrl('/uploads/' + file.name);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed">
                  <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <p>
                    Dengan mengajukan diri sebagai Mentor, Anda bersedia membagikan ilmu kepada mentee lain dan berhak memperoleh <span className="font-bold text-[#2563EB]">+5 EduPoints</span> per sesi belajar yang selesai.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={applyLoading}
                    className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {applyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Kirim Pengajuan Akun Mentor (FR-04)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ================= TAB 5: ADMIN PANEL (FR-06, FR-07) ================= */}
        {activeTab === 'admin' && user?.role === 'Admin' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  PORTAL ADMINISTRATOR MENTORA
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  Verifikasi Pengajuan Mentor (FR-06 & FR-07)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Validasi transkrip nilai dan kredensial calon mentor sebelum status aktif dipublikasikan.
                </p>
              </div>
              <button
                onClick={loadAdminApplications}
                className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition border border-purple-200"
              >
                Refresh Data
              </button>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
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
                      <p>
                        🎓 <span className="font-semibold">{app.user.universitas}</span> • {app.user.prodi} (Semester {app.user.semester})
                      </p>
                      <p>
                        💡 <span className="font-semibold text-slate-800">Skill yang ditawarkan:</span> {app.skillsOffered}
                      </p>
                      {app.pengalamanMengajar && (
                        <p>
                          📝 <span className="font-semibold text-slate-800">Pengalaman:</span> {app.pengalamanMengajar}
                        </p>
                      )}
                      <p className="flex items-center gap-1.5 text-blue-600 font-semibold pt-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Dokumen: {app.dokumenNama}</span>
                      </p>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    {app.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleReviewApplication(app.id, 'APPROVE')}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Setujui (FR-07)</span>
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
                        Sudah diproses ({app.status})
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {applications.length === 0 && (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                  Belum ada pengajuan mentor yang masuk.
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}