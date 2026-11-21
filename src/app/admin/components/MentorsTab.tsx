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
      className="mx-auto max-w-7xl scroll-mt-32 px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          Direktori Mentor Terverifikasi
        </h2>
        <p className="text-sm text-ink-secondary">
          Daftar mahasiswa yang telah lolos verifikasi kredensial dan aktif
          membuka sesi mentoring keterampilan di platform Mentora.
        </p>
      </div>

      {/* Toolbar Pencarian */}
      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 shadow-soft-card sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <label htmlFor="cari-mentor" className="sr-only">
            Cari mentor terverifikasi
          </label>
          <input
            id="cari-mentor"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari mentor, kampus, atau keahlian..."
            className="w-full rounded-xl border border-line bg-canvas py-2.5 pr-3.5 pl-10 text-xs font-medium text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:bg-surface sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success-soft px-3.5 py-1.5 text-xs font-bold text-success">
            <Users className="h-4 w-4" />
            <span>Total {activeMentors} Mentor Aktif</span>
          </span>
          <span className="hidden rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-ink-muted sm:inline-flex">
            Menampilkan {filtered.length} profil
          </span>
        </div>
      </div>

      {/* Grid Mentor */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <article
            key={m.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft-card transition hover:shadow-cloud"
          >
            {/* Header tenang */}
            <div className="relative h-16 bg-primary-soft/60 border-b border-line flex items-center justify-end px-4">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 text-[11px] font-bold text-ink-secondary shadow-2xs">
                {m.mode === "Online" ? (
                  <Laptop className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <UsersRound className="h-3.5 w-3.5 text-primary" />
                )}
                <span>{m.mode}</span>
              </span>
            </div>

            <div className="flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
              <span className="relative -mt-8 w-fit">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary text-lg font-extrabold shadow-sm border-2 border-surface">
                  {m.initials}
                </span>
                <BadgeCheck
                  className="absolute -right-1 -bottom-1 h-5 w-5 rounded-full bg-surface text-primary"
                  strokeWidth={2.4}
                  aria-label="Mentor terverifikasi"
                />
              </span>

              <h3 className="mt-3 text-base font-extrabold text-ink truncate">
                {m.name}
              </h3>
              <p className="mt-0.5 text-xs text-ink-muted leading-snug">
                {m.program}
                <span className="block font-semibold text-ink-secondary">
                  {m.university}
                </span>
              </p>

              <span className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-lg bg-canvas border border-line px-2.5 py-1 text-xs font-medium text-ink-secondary">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>{m.city}</span>
              </span>

              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {m.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-line bg-canvas px-2.5 py-1 text-xs font-medium text-ink-secondary"
                  >
                    {skill}
                  </span>
                ))}
                {m.skills.length > 3 && (
                  <span className="rounded-lg border border-line bg-canvas px-2 py-1 text-xs font-medium text-ink-muted">
                    +{m.skills.length - 3} lainnya
                  </span>
                )}
              </div>

              {/* EduPoints */}
              <div className="mt-4 rounded-xl border border-warning-soft bg-warning-tint p-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-warning-accent">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{m.eduPoints} EduPoints</span>
                  </span>
                  <span className="text-[10px] font-bold text-ink-muted uppercase">
                    {m.id}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-warning-soft">
                  <span
                    style={{
                      width: `${Math.min(100, (m.eduPoints / MAX_POINTS) * 100)}%`,
                    }}
                    className="block h-full rounded-full bg-warning-accent transition-all duration-700"
                  />
                </div>
              </div>

              <div className="mt-4">
                <span className="block text-center rounded-xl border border-line bg-surface px-4 py-2 text-xs font-bold text-ink-secondary shadow-2xs transition hover:border-primary hover:text-primary hover:bg-canvas">
                  Mentor Aktif
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface p-12 text-center shadow-soft-card">
          <p className="text-sm font-extrabold text-ink sm:text-base">
            Tidak ada mentor yang sesuai pencarian
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Coba gunakan kata kunci nama, kampus, atau keahlian lain.
          </p>
        </div>
      )}
    </section>
  );
}
