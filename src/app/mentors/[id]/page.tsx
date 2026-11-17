'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Award,
  BookOpen,
  Calendar,
  ShieldCheck,
  Loader2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

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
      <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin mb-3" />
          <p className="text-sm font-bold text-slate-600">Membuka profil mentor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !mentor) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h2 className="text-lg font-extrabold text-slate-900">Profil Mentor Tidak Tersedia</h2>
            <p className="text-xs text-slate-500 mt-1.5 mb-6 leading-relaxed">
              Akun mentor tidak ditemukan atau belum berstatus aktif terverifikasi.
            </p>
            <Link
              href="/mentors"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Mentor</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        <div>
          <Link
            href="/mentors"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#2563EB] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Mentor</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-600 relative" />

          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
              <div className="flex items-end gap-4">
                {mentor.fotoProfil ? (
                  <img
                    src={mentor.fotoProfil}
                    alt={mentor.namaLengkap}
                    className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-md bg-white"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-blue-100 text-[#2563EB] border-4 border-white shadow-md flex items-center justify-center font-extrabold text-3xl">
                    {(mentor.namaPanggilan || mentor.namaLengkap).charAt(0)}
                  </div>
                )}

                <div className="pb-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Mentor Aktif Terverifikasi</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-extrabold flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>{mentor.totalPoin || 0} EduPoints</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {mentor.namaLengkap}
                </h1>
                <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white shrink-0" />
              </div>

              {mentor.namaPanggilan && (
                <p className="text-xs font-semibold text-slate-400">
                  Panggilan: {mentor.namaPanggilan}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-semibold">
                  <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                  {mentor.universitas || 'Universitas belum dicantumkan'}
                  {mentor.prodi ? ` • ${mentor.prodi}` : ''}
                  {mentor.semester ? ` (Semester ${mentor.semester})` : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {mentor.domisili || 'Indonesia'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Mode Sesi: <strong className="text-slate-800">{mentor.modeSesi || 'Online / Fleksibel'}</strong>
                </span>
              </div>
            </div>

            <div className="py-6 border-b border-slate-100 space-y-2">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Tentang Mentor
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {mentor.bio ||
                  'Mentor ini siap membantu sesama mahasiswa memahami materi kuliah, mengerjakan proyek, dan berbagi pengalaman belajar secara kolaboratif.'}
              </p>
            </div>

            <div className="pt-6 space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2563EB]" />
                <span>Keahlian yang Diajarkan</span>
              </h2>

              {mentor.skills && mentor.skills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mentor.skills.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {item.skill.namaSkill}
                        </p>
                        <p className="text-[11px] font-medium text-slate-500">
                          Kategori: {item.skill.kategori || 'Umum'}
                        </p>
                      </div>
                      {item.level && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          {item.level}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Belum ada rincian keahlian yang ditambahkan.
                </p>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                Profil ditampilkan dalam mode baca.
              </p>
              <button
                onClick={() =>
                  alert(`Permintaan sesi belajar dengan ${mentor.namaLengkap} siap dilanjutkan ke tahap reservasi.`)
                }
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ajukan Sesi Belajar</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}