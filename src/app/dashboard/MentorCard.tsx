"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, ChevronRight } from "lucide-react";
import type { BookingMentor } from "@/components/BookingModal";
import { cleanInitials } from "./DashboardNavigation";

type Mentor = BookingMentor & {
  bio?: string;
  domisili?: string;
  modeSesi?: string;
};

type Props = {
  mentor: Mentor;
  own: boolean;
  wide?: boolean;
  onBook: (mentor: BookingMentor) => void;
};

export default function MentorCard({ mentor, own, wide = false, onBook }: Props) {
  const [failedPhoto, setFailedPhoto] = useState<string>();
  const profileUrl = `/mentors/${mentor.id}`;
  const titleId = `mentor-name-${mentor.id}`;
  const academicLine = [mentor.prodi, mentor.universitas].filter(Boolean).join(" · ");
  const skills = (mentor.skills ?? []).flatMap(({ skill }) => skill?.namaSkill ? [skill] : []);
  const visibleSkills = skills.slice(0, 6);
  const sessionDetails = [mentor.modeSesi ? `Sesi 1-on-1 (${mentor.modeSesi})` : "Sesi 1-on-1", mentor.domisili].filter(Boolean).join(" · ");

  return (
    <article aria-labelledby={titleId}
      className={`min-w-0 rounded-2xl border border-line bg-surface p-5 sm:p-6 ${wide ? "grid items-start gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(12rem,0.85fr)_auto] lg:items-center lg:gap-7" : "flex h-full flex-col gap-4"}`}>
      <div className="min-w-0">
        <header className="flex items-center gap-3.5">
          <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-soft text-xl font-bold text-primary">
            {mentor.fotoProfil && failedPhoto !== mentor.fotoProfil ? (
              <img src={mentor.fotoProfil} alt="" onError={() => setFailedPhoto(mentor.fotoProfil)} className="size-full object-cover object-top" />
            ) : (
              <span aria-hidden="true">{cleanInitials(mentor.namaPanggilan, mentor.namaLengkap)}</span>
            )}
          </div>
          <div className="min-w-0">
            <h3 id={titleId} className="break-words text-xl font-bold leading-snug tracking-tight text-ink">{mentor.namaLengkap}</h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-secondary">
              <BadgeCheck className="text-success" aria-hidden="true" size={15} /> Mentor terverifikasi
            </p>
          </div>
        </header>
        {academicLine && <p className="mt-3 break-words text-sm font-medium leading-relaxed text-ink-secondary">{academicLine}</p>}
        {mentor.bio && <p className="mt-1 line-clamp-2 break-words text-sm leading-relaxed text-ink-muted">{mentor.bio}</p>}
      </div>

      <div className={`min-w-0 border-t border-line pt-3 ${wide ? "lg:border-t-0 lg:pt-0" : ""}`}>
        {visibleSkills.length > 0 && (
          <>
            <p className="mb-2 text-xs font-semibold text-ink-muted">Keahlian yang diajarkan</p>
            <ul aria-label="Keahlian yang diajarkan" className="flex flex-wrap gap-1.5">
              {visibleSkills.map(skill => (
                <li key={skill.id} className="max-w-full break-words rounded-md border border-line bg-canvas px-2.5 py-1 text-sm font-medium text-ink-secondary">{skill.namaSkill}</li>
              ))}
              {skills.length > visibleSkills.length && (
                <li><Link href={profileUrl} className="inline-flex min-h-7 items-center px-1 text-xs font-semibold text-primary hover:underline">+{skills.length - visibleSkills.length} lainnya</Link></li>
              )}
            </ul>
          </>
        )}
        <p className={`break-words text-sm leading-relaxed text-ink-muted ${visibleSkills.length ? "mt-2" : ""}`}>{sessionDetails}</p>
      </div>

      <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${wide ? "lg:flex-col lg:items-end lg:gap-1" : "mt-auto"}`}>
        <Link href={profileUrl} className={own
          ? "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-semibold text-ink hover:border-primary hover:text-primary"
          : "inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-4 hover:underline"}>
          {own ? "Lihat profil publik" : "Lihat profil"}{own && <ChevronRight size={15} aria-hidden="true" />}
        </Link>
        {!own && <button type="button" onClick={() => onBook(mentor)} className="action-primary inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold">Pesan sesi</button>}
      </div>
    </article>
  );
}
