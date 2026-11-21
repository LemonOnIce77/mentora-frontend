"use client";

import React, { useMemo, useState } from "react";
import {
  BadgeCheck,
  Laptop,
  MapPin,
  Search,
  Sparkles,
  Users,
  UsersRound,
} from "lucide-react";
import type { Mentor } from "./adminData";

type Props = {
  mentors: Mentor[];
  activeMentors: number;
};

const MAX_POINTS = 220;

export default function MentorsTab({ mentors, activeMentors }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mentors;
    return mentors.filter((m) =>
      [m.name, m.program, m.university, m.city, ...m.skills]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [mentors, query]);

  return (
    <section
      role="tabpanel"
      id="direktori-mentor"
      data-jiro-section="mentors"
      data-jiro-label="Tab Direktori Mentor"
      className="mx-auto max-w-[1280px] scroll-mt-32 px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-[20px] font-extrabold tracking-tight text-[#0F172A] sm:text-[24px]">
          Direktori Mentor Terverifikasi
        </h2>
        <p className="text-[14px] leading-relaxed text-[#64748B]">
          Daftar mahasiswa yang telah lolos verifikasi kredensial dan aktif
          membuka sesi pertukaran keterampilan di Mentora.
        </p>
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:p-5">
        <div className="relative sm:w-96">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-[#94A3B8]" />
          <label htmlFor="cari-mentor" className="sr-only">
            Cari mentor terverifikasi
          </label>
          <input
            id="cari-mentor"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari mentor, universitas, kota, atau keahlian..."
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pr-3.5 pl-11 text-[13.5px] font-medium text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#93C5FD] focus:bg-white focus:ring-4 focus:ring-[#EFF6FF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-2 text-[12.5px] font-bold text-[#059669]">
            <Users className="h-4 w-4" />
            Total {activeMentors} Mentor Aktif
          </span>
          <span className="hidden rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-[12.5px] font-semibold text-[#64748B] sm:inline-flex">
            Menampilkan {filtered.length} profil
          </span>
        </div>
      </div>

      {/* Grid mentor */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <article
            key={m.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#BFDBFE] hover:shadow-xl hover:shadow-blue-600/10"
          >
            {/* Cover */}
            <div className="relative h-20 bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED]">
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_right,#FFFFFF22_1px,transparent_1px),linear-gradient(to_bottom,#FFFFFF22_1px,transparent_1px)] bg-[size:22px_22px]"
              />
              <span
                className={`absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold backdrop-blur ${
                  m.mode === "Online"
                    ? "bg-white/90 text-[#1D4ED8]"
                    : "bg-white/90 text-[#6D28D9]"
                }`}
              >
                {m.mode === "Online" ? (
                  <Laptop className="h-3.5 w-3.5" />
                ) : (
                  <UsersRound className="h-3.5 w-3.5" />
                )}
                {m.mode}
              </span>
            </div>

            <div className="flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
              <span className="relative -mt-9 w-fit">
                <span
                  className={`flex h-18 w-18 items-center justify-center rounded-2xl text-[20px] font-extrabold shadow-md ring-4 ring-white ${m.tone}`}
                >
                  {m.initials}
                </span>
                <BadgeCheck
                  className="absolute -right-1.5 -bottom-1.5 h-6.5 w-6.5 rounded-full bg-white text-[#2563EB]"
                  strokeWidth={2.4}
                  aria-label="Mentor terverifikasi"
                />
              </span>

              <h3 className="mt-3.5 text-[16.5px] leading-tight font-extrabold tracking-tight text-[#0F172A]">
                {m.name}
              </h3>
              <p className="mt-1 text-[12.5px] leading-snug text-[#64748B]">
                {m.program}
                <span className="block font-semibold text-[#475569]">
                  {m.university}
                </span>
              </p>

              <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg bg-[#F1F5F9] px-2.5 py-1.5 text-[12px] font-semibold text-[#475569]">
                <MapPin className="h-3.5 w-3.5 text-[#7C3AED]" />
                {m.city}
              </span>

              <div className="mt-4 flex flex-wrap gap-2">
                {m.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-[12px] font-semibold text-[#334155] transition group-hover:border-[#BFDBFE] group-hover:bg-[#EFF6FF] group-hover:text-[#1D4ED8]"
                  >
                    {skill}
                  </span>
                ))}
                {m.skills.length > 3 && (
                  <span className="rounded-lg border border-dashed border-[#CBD5E1] bg-white px-2.5 py-1 text-[12px] font-bold text-[#64748B]">
                    +{m.skills.length - 3} lainnya
                  </span>
                )}
              </div>

              {/* EduPoints */}
              <div className="mt-5 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-3.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-extrabold text-[#D97706]">
                    <Sparkles className="h-4 w-4" />
                    {m.eduPoints} EduPoints
                  </span>
                  <span className="text-[10.5px] font-bold tracking-wider text-[#B45309] uppercase">
                    {m.id}
                  </span>
                </div>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#FDE68A]/70">
                  <span
                    style={{
                      width: `${Math.min(100, (m.eduPoints / MAX_POINTS) * 100)}%`,
                    }}
                    className="block h-full rounded-full bg-gradient-to-r from-[#D97706] to-[#FBBF24] transition-all duration-700"
                  />
                </div>
              </div>

              <div className="mt-4">
                <span className="block text-center rounded-xl border border-[#CBD5E1] bg-white px-4 py-2.5 text-[13px] font-bold text-[#334155] transition hover:border-[#93C5FD] hover:bg-[#EFF6FF] hover:text-[#1D4ED8]">
                  Profil Mentor Aktif
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-12 text-center shadow-sm">
          <p className="text-[16px] font-extrabold text-[#0F172A]">
            Tidak ada mentor yang sesuai pencarian
          </p>
          <p className="mt-1.5 text-[13px] text-[#64748B]">
            Coba gunakan kata kunci nama, kampus, atau keahlian lain.
          </p>
        </div>
      )}
    </section>
  );
}
