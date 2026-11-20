"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, MapPin, Video } from "lucide-react";
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
    .slice(0, 4);

  const showPhoto =
    Boolean(mentor.fotoProfil) && failedPhoto !== mentor.fotoProfil;

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-line bg-surface shadow-soft-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-cloud">
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          {showPhoto ? (
            <img
              src={mentor.fotoProfil}
              alt={mentor.namaLengkap}
              onError={() => setFailedPhoto(mentor.fotoProfil)}
              className="size-12 shrink-0 rounded-2xl border border-line object-cover object-top"
            />
          ) : (
            <span
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-[15px] font-extrabold text-primary"
              aria-hidden="true"
            >
              {initials}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="flex items-center gap-1.5 text-[15.5px] font-bold leading-snug text-ink">
              <span className="truncate">{mentor.namaLengkap}</span>
              <CheckCircle2
                className="size-4 shrink-0 fill-success text-white"
                aria-label="Mentor terverifikasi"
              />
            </h3>

            {academicLine && (
              <p className="mt-1 text-[13px] leading-relaxed text-ink-secondary">
                {academicLine}
              </p>
            )}

            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-muted">
              {mentor.domisili && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  <span>{mentor.domisili}</span>
                </span>
              )}
              {mentor.domisili && <span aria-hidden="true">·</span>}
              <span className="inline-flex items-center gap-1">
                <Video className="size-3.5" />
                <span>Sesi {mentor.modeSesi || "Online"}</span>
              </span>
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink-secondary">
          {mentor.bio ||
            "Siap membimbing dan berdiskusi seputar materi akademik maupun praktik keahlian."}
        </p>

        {skills.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 rounded-full border border-success-soft bg-success-tint px-3 py-1 text-xs font-semibold text-success"
              >
                <span
                  className="size-1.5 rounded-full bg-success"
                  aria-hidden="true"
                />
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

      <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-secondary">
          <span className="size-2 rounded-full bg-success" aria-hidden="true" />
          <span>{own ? "Profil mentor kamu" : "Tersedia untuk sesi 1-on-1"}</span>
        </span>

        <div className="flex items-center gap-2">
          <Link
            href={`/mentors/${mentor.id}`}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-ink-secondary transition-colors hover:bg-canvas hover:text-primary"
          >
            Lihat profil
          </Link>
          {!own && (
            <button
              type="button"
              onClick={() => onBook(mentor)}
              className="action-primary inline-flex min-h-8 items-center gap-1 rounded-full px-4 text-xs font-semibold text-white shadow-2xs transition-colors"
            >
              <span>Pesan sesi</span>
              <ChevronRight className="size-3" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
