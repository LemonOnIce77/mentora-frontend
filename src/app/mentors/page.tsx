'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Award, BookOpen, Loader2 } from 'lucide-react';
import {
  Search,
  CheckCircle2,
  MapPin,
  GraduationCap,
  UserCheck,
  ChevronRight,
} from '@/components/animated-icons';

interface MentorSkill {
  id: number;
  skill: {
    id: number;
    namaSkill: string;
    kategori: string;
  };
}

interface MentorUser {
  id: number;
  namaLengkap: string;
  namaPanggilan?: string;
  email?: string;
  universitas?: string;
  prodi?: string;
  semester?: string;
  domisili?: string;
  bio?: string;
  fotoProfil?: string;
  totalPoin: number;
  modeSesi?: string;
  statusMentor: string;
  skills: MentorSkill[];
}

export default function MentorsListPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: number; email: string } | null>(null);
  const [mentors, setMentors] = useState<MentorUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => {
    const verifyAuthAndFetchMentors = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          router.replace('/auth');
          return;
        }
        const authData = await authRes.json();
        if (authData?.user) {
          setCurrentUser(authData.user);
        }

        const mentorRes = await fetch('/api/mentor/list');
        if (mentorRes.ok) {
          const data = await mentorRes.json();
          const allMentors: MentorUser[] = data.mentors || [];
          const activeMentors = allMentors.filter(
            (mentor) => mentor.statusMentor === 'APPROVED'
          );
          setMentors(activeMentors);
        }
      } catch (error) {
        console.error('Gagal memuat daftar mentor:', error);
        router.replace('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuthAndFetchMentors();
  }, [router]);

  const availableSkills = useMemo(() => {
    const skillSet = new Set<string>();
    mentors.forEach((m) => {
      m.skills?.forEach((s) => skillSet.add(s.skill.namaSkill));
    });
    return Array.from(skillSet).slice(0, 8);
  }, [mentors]);

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      if (currentUser && (mentor.id === currentUser.id || mentor.email === currentUser.email)) {
        return false;
      }
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        mentor.namaLengkap.toLowerCase().includes(q) ||
        (mentor.universitas || '').toLowerCase().includes(q) ||
        (mentor.prodi || '').toLowerCase().includes(q) ||
        (mentor.domisili || '').toLowerCase().includes(q);

      const matchesSkill =
        selectedSkill === '' ||
        mentor.skills?.some(
          (s) => s.skill.namaSkill.toLowerCase() === selectedSkill.toLowerCase()
        );

      return matchesQuery && matchesSkill;
    });
  }, [mentors, searchQuery, selectedSkill]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
          <p className="text-sm font-bold text-ink-secondary">Memuat daftar mentor terverifikasi...</p>
        </div>
        <Footer workspace />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-success-tint text-success border border-success-soft text-xs font-bold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Mentor Tervalidasi</span>
            </div>
            <h1 className="text-3xl font-extrabold text-ink tracking-tight">
              Direktori Mentor Aktif
            </h1>
            <p className="text-sm text-ink-muted max-w-2xl">
              Jelajahi profil mahasiswa berpengalaman yang telah terverifikasi untuk membimbing dan berdiskusi sesuai bidang keahlianmu.
            </p>
          </div>
          <div className="text-xs font-bold text-ink-muted bg-surface px-4 py-2.5 rounded-2xl border border-line shadow-2xs">
            Menampilkan <span className="text-primary">{filteredMentors.length}</span> Mentor Aktif
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-line shadow-soft-card flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-ink-muted absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama mentor, kampus, prodi, atau kota..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-line text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-accent/20 focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            <span className="text-xs font-bold text-ink-muted whitespace-nowrap">Keahlian:</span>
            <button
              onClick={() => setSelectedSkill('')}
              aria-pressed={selectedSkill === ''}
              className="filter-chip"
            >
              Semua
            </button>
            {availableSkills.map((skillName) => (
              <button
                key={skillName}
                onClick={() =>
                  setSelectedSkill(selectedSkill === skillName ? '' : skillName)
                }
                aria-pressed={selectedSkill === skillName}
                className="filter-chip"
              >
                {skillName}
              </button>
            ))}
          </div>
        </div>

        {filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-surface rounded-3xl p-6 border border-line shadow-soft-card hover:shadow-cloud transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {mentor.fotoProfil ? (
                      <img
                        src={mentor.fotoProfil}
                        alt={mentor.namaLengkap}
                        className="w-14 h-14 rounded-2xl object-cover object-top border border-line shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-extrabold text-xl shrink-0">
                        {(mentor.namaPanggilan || mentor.namaLengkap).charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-bold text-ink text-base truncate">
                          {mentor.namaLengkap}
                        </h2>
                        <span title="Terverifikasi">
                          <CheckCircle2 className="w-4 h-4 fill-success text-white shrink-0" />
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted font-medium flex items-center gap-1 mt-0.5 truncate">
                        <GraduationCap className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                        <span className="truncate text-ink-secondary">
                          {mentor.prodi || 'Mahasiswa'} • {mentor.universitas || 'Universitas'}
                        </span>
                      </p>
                      <p className="text-[11px] text-ink-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-ink-muted shrink-0" />
                        <span>{mentor.domisili || 'Indonesia'}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-ink-secondary line-clamp-2 mb-4 leading-relaxed">
                    {mentor.bio || 'Siap berbagi pengetahuan dan berdiskusi seputar keahlian akademik maupun praktis.'}
                  </p>

                  <div className="mb-5">
                    <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block mb-2">
                      Keahlian yang Diajarkan:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.skills?.length > 0 ? (
                        mentor.skills.slice(0, 4).map((s) => (
                          <span
                            key={s.id}
                            className="px-2.5 py-1 rounded-lg bg-canvas text-ink-secondary text-[11px] font-semibold border border-line"
                          >
                            {s.skill.namaSkill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-ink-muted italic">Belum ada keahlian tercantum</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-line flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-ink-secondary flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{mentor.totalPoin || 0} Poin</span>
                  </span>

                  <Link
                    href={`/mentors/${mentor.id}`}
                    className="px-4 py-2 rounded-xl action-primary text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Lihat Profil</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-3xl p-12 border border-line text-center max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-ink-muted mx-auto mb-3" />
            <h3 className="text-base font-bold text-ink">Mentor Tidak Ditemukan</h3>
            <p className="text-xs text-ink-muted mt-1">
              Tidak ada akun mentor aktif yang sesuai dengan filter pencarian saat ini.
            </p>
          </div>
        )}
      </main>

      <Footer workspace />
    </div>
  );
}