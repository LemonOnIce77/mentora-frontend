"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, MapPin, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingMentor } from "@/components/BookingModal";
import { cleanInitials } from "./DashboardNavigation";

export interface MentorCardData extends BookingMentor {
  domisili?: string;
  bio?: string;
  modeSesi?: string;
  totalPoin?: number;
}

/* Jiro-inspired Minimal Student Mentor Card:
 * - Clean rounded-2xl with hairline border (border-line) & subtle soft card shadow
 * - Soft brand avatar (bg-primary-soft text-primary)
 * - Academic info with inline verified check
 * - Pill chips with subtle emerald dot indicator
 * - Proportional hairline footer with availability indicator & crisp CTAs
 */
export default function MentorCard({
  mentor,
  own,
  onBook,
}: {
  wide?: boolean;
  mentor: MentorCardData;
  own: boolean;
  onBook: (mentor: BookingMentor) => void;
}) {
  const [failedPhoto, setFailedPhoto] = useState<string>();
  const initials = cleanInitials(mentor.namaPanggilan, mentor.namaLengkap);

  const academicLine = [mentor.prodi, mentor.universitas]
    .filter(Boolean)
    .join(" · ");

  const rawSkills = mentor.skills ?? [];
  const skills: string[] = rawSkills
    .map((item: any) => item?.skill?.namaSkill ?? item?.namaSkill)
    .filter((s): s is string => Boolean(s))
    .slice(0, 3);

  const showPhoto =
    Boolean(mentor.fotoProfil) && failedPhoto !== mentor.fotoProfil;

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-line bg-surface shadow-soft-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-cloud">
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Header: Avatar, Name, and Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5 min-w-0">
            {showPhoto ? (
              <img
                src={mentor.fotoProfil}
                alt={mentor.namaLengkap}
                onError={() => setFailedPhoto(mentor.fotoProfil)}
                className="size-11 shrink-0 rounded-2xl border border-line object-cover object-top sm:size-12"
              />
            ) : (
              <span
                className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-[14px] font-extrabold text-primary sm:size-12 sm:text-[15px]"
                aria-hidden="true"
              >
                {initials}
              </span>
            )}

            <div className="min-w-0 flex-1">
              <h3 className="flex items-center gap-1.5 text-[15px] font-bold text-ink group-hover:text-primary transition-colors sm:text-base">
                <span className="truncate">{mentor.namaLengkap}</span>
                <CheckCircle2
                  className="size-4 shrink-0 fill-primary text-white"
                  aria-label="Mentor terverifikasi"
                />
              </h3>

              {academicLine && (
                <p className="mt-0.5 truncate text-xs text-ink-secondary">
                  {academicLine}
                </p>
              )}

              <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-ink-muted">
                {mentor.domisili && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" />
                    <span>{mentor.domisili}</span>
                  </span>
                )}
                {mentor.domisili && <span aria-hidden="true">·</span>}
                <span className="inline-flex items-center gap-1">
                  <Video className="size-3" />
                  <span>Sesi {mentor.modeSesi || "Online"}</span>
                </span>
              </p>
            </div>
          </div>

          {/* Top-right Status Pill */}
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border",
              own
                ? "border-primary-soft bg-primary-soft text-primary"
                : "border-success-soft bg-success-tint text-success",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                own ? "bg-primary" : "bg-success",
              )}
              aria-hidden="true"
            />
            <span>{own ? "Profil kamu" : "Tersedia"}</span>
          </span>
        </div>

        {/* Bio */}
        <p className="mt-3.5 line-clamp-2 text-xs leading-relaxed text-ink-muted sm:text-[13px]">
          {mentor.bio ||
            "Siap membimbing dan berdiskusi seputar materi akademik maupun praktik keahlian."}
        </p>

        {/* Skill Tags */}
        {skills.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-lg border border-line/70 bg-canvas px-2.5 py-1 text-[11px] font-medium text-ink-secondary transition-colors group-hover:border-primary-soft group-hover:bg-primary-soft/40 group-hover:text-primary"
              >
                <span>{s}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-xs italic text-ink-muted">
            Belum ada keahlian tercantum
          </p>
        )}
      </div>

      {/* Footer: Balanced Dual Action Bar (No awkward wrapping!) */}
      <div className="flex items-center gap-2 border-t border-line/70 bg-canvas/40 p-3 sm:px-5 sm:py-3.5 rounded-b-2xl">
        <Link
          href={`/mentors/${mentor.id}`}
          className="flex-1 rounded-xl border border-line bg-surface py-2 text-center text-xs font-semibold text-ink-secondary shadow-2xs transition-all hover:border-primary hover:text-primary active:scale-[0.98]"
        >
          Lihat profil
        </Link>
        {!own ? (
          <button
            type="button"
            onClick={() => onBook(mentor)}
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-primary py-2 text-center text-xs font-bold text-white shadow-2xs transition-all hover:bg-primary-accent active:scale-[0.98]"
          >
            <span>Pesan sesi</span>
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </button>
        ) : (
          <Link
            href="/dashboard?tab=apply"
            className="flex-1 rounded-xl bg-primary/10 py-2 text-center text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
          >
            Status mentor
          </Link>
        )}
      </div>
    </article>
  );
}
