'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import { Award, BookOpen, Calendar, Loader2, AlertCircle } from 'lucide-react';
import {
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  MapPin,
  ShieldCheck,
  MessageSquare,
} from '@/components/animated-icons';

interface MentorSkill {
  id: number;
  tipe?: string;
  level?: string;
  skill: {
    id: number;
    namaSkill: string;
    kategori: string;
  };
}

interface MentorDetail {
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

export default function MentorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const mentorId = params?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [mentor, setMentor] = useState<MentorDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchMentorDetail = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          router.replace('/auth');
          return;
        }

        const detailRes = await fetch(`/api/mentor/${mentorId}`).catch(() => null);
        if (detailRes && detailRes.ok) {
          const data = await detailRes.json();
          if (data.mentor && data.mentor.statusMentor === 'APPROVED') {
            setMentor(data.mentor);
          } else {
            setNotFound(true);
          }
        } else {
          const listRes = await fetch('/api/mentor/list');
          if (listRes.ok) {
            const listData = await listRes.json();
            const found = (listData.mentors || []).find(
              (m: MentorDetail) =>
                String(m.id) === String(mentorId) && m.statusMentor === 'APPROVED'
            );
            if (found) {
              setMentor(found);
            } else {
              setNotFound(true);
            }
          } else {
            setNotFound(true);
          }
        }
      } catch (error) {
        console.error('Error memuat detail mentor:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (mentorId) {
      fetchMentorDetail();
    }
  }, [mentorId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
          <p className="text-sm font-bold text-ink-secondary">Membuka profil mentor...</p>
        </div>
        <Footer workspace />
      </div>
    );
  }

  if (notFound || !mentor) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-surface rounded-3xl p-8 border border-line text-center shadow-soft-card">
            <AlertCircle className="w-12 h-12 text-danger mx-auto mb-3" />
            <h2 className="text-lg font-extrabold text-ink">Profil Mentor Tidak Tersedia</h2>
            <p className="text-xs text-ink-muted mt-1.5 mb-6 leading-relaxed">
              Akun mentor tidak ditemukan atau belum berstatus aktif terverifikasi.
            </p>
            <Link
              href="/mentors"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl action-primary text-xs font-bold transition shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Mentor</span>
            </Link>
          </div>
        </div>
        <Footer workspace />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-6">
        <div>
          <Link
            href="/mentors"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface border border-line text-xs font-bold text-ink-secondary hover:text-ink hover:bg-canvas shadow-2xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Mentor</span>
          </Link>
        </div>

        <div className="bg-surface rounded-3xl border border-line shadow-soft-card overflow-hidden">
          <div aria-hidden="true" className="h-36 border-b border-line bg-gradient-to-r from-canvas to-primary-soft sm:h-44" />

          <div className="relative z-10 px-6 sm:px-8 pb-8">
            {/* Foto Profil & Badges Bar */}
            <div className="relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
              <div className="relative z-30 flex items-end gap-4 sm:gap-5">
                {mentor.fotoProfil ? (
                  <img
                    src={mentor.fotoProfil}
                    alt={mentor.namaLengkap}
                    className="relative z-30 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover object-top border-4 border-white shadow-xl bg-surface shrink-0 ring-1 ring-ink/5"
                  />
                ) : (
                  <div className="relative z-30 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-primary text-white border-4 border-white shadow-xl flex items-center justify-center font-extrabold text-3xl sm:text-4xl shrink-0">
                    {(mentor.namaPanggilan || mentor.namaLengkap).charAt(0)}
                  </div>
                )}

                <div className="pb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-tint text-success border border-success-soft text-xs font-bold shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-success" />
                    <span>Mentor Terverifikasi</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pb-2">
                <div className="px-4 py-2 rounded-2xl bg-canvas border border-line text-ink-secondary text-xs font-extrabold flex items-center gap-1.5 shadow-2xs">
                  <Award className="w-4 h-4 text-ink-muted" />
                  <span>{mentor.totalPoin || 0} EduPoints</span>
                </div>
              </div>
            </div>

            {/* Nama & Info Akademik */}
            <div className="space-y-3 pb-6 border-b border-line">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                    {mentor.namaLengkap}
                  </h1>
                  <CheckCircle2 className="w-5 h-5 fill-success text-white shrink-0" />
                </div>

                {mentor.namaPanggilan && (
                  <p className="text-xs font-semibold text-ink-muted mt-0.5">
                    Nama Panggilan: <span className="text-ink-secondary">{mentor.namaPanggilan}</span>
                  </p>
                )}
              </div>

              {/* Chips Info */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-ink-muted">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-canvas border border-line font-semibold text-ink-secondary">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span>
                    {mentor.universitas || 'Universitas belum diatur'}
                    {mentor.prodi ? ` • ${mentor.prodi}` : ''}
                    {mentor.semester ? ` (Semester ${mentor.semester})` : ''}
                  </span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-canvas border border-line font-medium text-ink-secondary">
                  <MapPin className="w-4 h-4 text-ink-muted" />
                  <span>{mentor.domisili || 'Indonesia'}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-tint border border-primary-soft/60 font-semibold text-primary">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Mode: {mentor.modeSesi || 'Online / Fleksibel'}</span>
                </span>
              </div>
            </div>

            <div className="py-6 border-b border-line space-y-2">
              <h2 className="text-sm font-extrabold text-ink uppercase tracking-wider">
                Tentang Mentor
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                {mentor.bio ||
                  'Mentor ini siap membantu sesama mahasiswa memahami materi kuliah, mengerjakan proyek, dan berbagi pengalaman belajar secara kolaboratif.'}
              </p>
            </div>

            <div className="pt-6 space-y-4">
              <h2 className="text-sm font-extrabold text-ink uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Keahlian yang Diajarkan</span>
              </h2>

              {mentor.skills && mentor.skills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mentor.skills.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-canvas border border-line flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-bold text-ink">
                          {item.skill.namaSkill}
                        </p>
                        <p className="text-[11px] font-medium text-ink-muted">
                          Kategori: {item.skill.kategori || 'Umum'}
                        </p>
                      </div>
                      {item.level && (
                        <span className="px-2.5 py-1 rounded-lg bg-canvas text-ink-secondary text-[11px] font-bold border border-line">
                          {item.level}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ink-muted italic">
                  Belum ada rincian keahlian yang ditambahkan.
                </p>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-ink-muted">
                Pilih waktu yang sesuai untuk memulai mentoring.
              </p>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl action-primary text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ajukan Sesi Belajar</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        mentor={mentor}
      />

      <Footer workspace />
    </div>
  );
}
