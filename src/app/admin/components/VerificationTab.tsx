"use client";

import React, { useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  Inbox,
  MapPin,
  Quote,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";
import type { Submission, SubmissionStatus } from "./adminData";

type Props = {
  submissions: Submission[];
  onApprove: (submission: Submission) => void;
  onReject: (submission: Submission) => void;
};

type FilterKey = "all" | SubmissionStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Semua Pengajuan" },
  { key: "pending", label: "Menunggu Verifikasi" },
  { key: "approved", label: "Telah Disetujui" },
  { key: "rejected", label: "Ditolak" },
];

const STATUS: Record<
  SubmissionStatus,
  { label: string; className: string; dot: string }
> = {
  pending: {
    label: "Menunggu Verifikasi",
    className: "border-warning-soft bg-warning-tint text-warning-accent",
    dot: "bg-warning-accent",
  },
  approved: {
    label: "Telah Disetujui",
    className: "border-success/25 bg-success-soft text-success",
    dot: "bg-success",
  },
  rejected: {
    label: "Ditolak",
    className: "border-danger-soft bg-danger-tint text-danger",
    dot: "bg-danger",
  },
};

export default function VerificationTab({
  submissions,
  onApprove,
  onReject,
}: Props) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      all: submissions.length,
      pending: submissions.filter((s) => s.status === "pending").length,
      approved: submissions.filter((s) => s.status === "approved").length,
      rejected: submissions.filter((s) => s.status === "rejected").length,
    }),
    [submissions],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return submissions.filter((s) => {
      const matchStatus = filter === "all" || s.status === filter;
      const matchQuery =
        q.length === 0 ||
        [s.name, s.university, s.program, s.city, ...s.skills]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchStatus && matchQuery;
    });
  }, [submissions, filter, query]);

  return (
    <section
      role="tabpanel"
      data-jiro-section="verification"
      data-jiro-label="Tab Verifikasi Calon Mentor"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            Pusat Verifikasi Mentor
          </h2>
          <p className="max-w-2xl text-sm text-ink-secondary">
            Tinjau kredensial akademik dan rekam jejak mengajar setiap calon
            mentor sebelum menyetujui perubahan perannya.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-warning-soft bg-warning-tint px-3.5 py-1.5 text-xs font-bold text-warning-accent">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-warning-accent" />
          </span>
          {counts.pending} pengajuan menunggu tindakan
        </span>
      </div>

      {/* Toolbar Filter & Pencarian */}
      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 shadow-soft-card lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition sm:text-sm ${
                  active
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-line bg-surface text-ink-secondary hover:bg-canvas hover:text-ink"
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-extrabold ${
                    active ? "bg-white/20 text-white" : "bg-canvas text-ink-muted"
                  }`}
                >
                  {counts[f.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative lg:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <label htmlFor="cari-pengajuan" className="sr-only">
            Cari pengajuan calon mentor
          </label>
          <input
            id="cari-pengajuan"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari calon mentor, kampus, atau skill..."
            className="w-full rounded-xl border border-line bg-canvas py-2.5 pr-3.5 pl-10 text-xs font-medium text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:bg-surface sm:text-sm"
          />
        </div>
      </div>

      {/* Daftar Pengajuan */}
      <div className="mt-6 flex flex-col gap-5">
        {filtered.map((s) => {
          const status = STATUS[s.status] || STATUS.pending;
          return (
            <article
              key={s.id}
              className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft-card transition hover:shadow-cloud"
            >
              <div className="grid gap-0 lg:grid-cols-[300px_1fr]">
                {/* Kolom Identitas */}
                <div className="border-b border-line bg-canvas/40 p-5 sm:p-6 lg:border-r lg:border-b-0">
                  <div className="flex items-center gap-3.5">
                    <span className="relative shrink-0">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary text-lg font-extrabold border border-primary/20">
                        {s.initials}
                      </span>
                      <span
                        className={`absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full border-2 border-surface ${status.dot}`}
                      />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-base font-extrabold text-ink truncate">
                        {s.name}
                      </h3>
                      <p className="text-xs text-ink-muted truncate">
                        {s.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`mt-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
                  >
                    {status.label}
                  </span>

                  <dl className="mt-5 flex flex-col gap-3 border-t border-line pt-4 text-xs">
                    <div className="flex items-start gap-2.5">
                      <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <dt className="text-[10px] font-bold tracking-wider text-ink-muted uppercase">
                          Asal Kampus
                        </dt>
                        <dd className="font-bold text-ink">
                          {s.university}
                        </dd>
                        <dd className="text-ink-muted">
                          {s.program} · {s.semester}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <dt className="text-[10px] font-bold tracking-wider text-ink-muted uppercase">
                          Domisili
                        </dt>
                        <dd className="font-bold text-ink">
                          {s.city}
                        </dd>
                      </div>
                    </div>
                  </dl>

                  <p className="mt-4 text-[11px] font-medium text-ink-muted">
                    {s.id} · Diajukan {s.submittedAt}
                  </p>
                </div>

                {/* Kolom Detail */}
                <div className="flex flex-col gap-4 p-5 sm:p-6">
                  <div>
                    <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-ink-muted uppercase">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Keahlian yang Ditawarkan
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-bold text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-ink-muted uppercase">
                      Pengalaman Mengajar / Asistensi
                    </p>
                    <blockquote className="mt-2 flex gap-3 rounded-xl border-l-4 border-primary/40 bg-canvas p-3.5 text-xs sm:text-sm text-ink-secondary leading-relaxed">
                      <Quote className="h-4 w-4 shrink-0 text-primary opacity-60" />
                      <p className="italic">
                        {s.experience}
                      </p>
                    </blockquote>
                  </div>

                  <div className="flex flex-col gap-3 rounded-xl border border-line bg-canvas p-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface border border-line text-primary">
                        <FileText className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 leading-tight">
                        <span className="block text-[10px] font-bold tracking-wider text-ink-muted uppercase">
                          Dokumen Kredensial
                        </span>
                        <span className="mt-0.5 block truncate text-xs sm:text-sm font-bold text-ink">
                          {s.documentName}
                        </span>
                      </span>
                    </div>
                    {s.documentUrl ? (
                      <a
                        href={s.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2 text-xs font-bold text-primary shadow-2xs transition hover:bg-canvas"
                      >
                        <span>Lihat Dokumen</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-ink-muted italic">
                        Dokumen belum terlampir
                      </span>
                    )}
                  </div>

                  {s.status === "rejected" && s.rejectionReason && (
                    <div className="rounded-xl border border-danger-soft bg-danger-tint p-3.5 text-xs text-danger">
                      <p className="font-bold uppercase tracking-wider text-[10px]">
                        Catatan Penolakan Admin:
                      </p>
                      <p className="mt-1 leading-relaxed">
                        {s.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Aksi */}
              <div className="border-t border-line bg-canvas/40 px-5 py-3.5 sm:px-6">
                {s.status === "pending" && (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-ink-muted">
                      Pastikan dokumen nilai dan identitas telah diverifikasi keabsahannya.
                    </p>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onReject(s)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-danger-soft bg-danger-tint px-4 py-2 text-xs font-bold text-danger transition hover:bg-danger-soft"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Tolak</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onApprove(s)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-success px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800"
                      >
                        <Check className="h-4 w-4" strokeWidth={3} />
                        <span>Setujui Jadi Mentor</span>
                      </button>
                    </div>
                  </div>
                )}

                {s.status === "approved" && (
                  <p className="flex items-center gap-2 text-xs font-bold text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>✓ Telah Disetujui &amp; Status Mentor Aktif</span>
                  </p>
                )}

                {s.status === "rejected" && (
                  <p className="flex items-center gap-2 text-xs font-bold text-danger">
                    <XCircle className="h-4 w-4" />
                    <span>✕ Pengajuan Ditolak</span>
                  </p>
                )}
              </div>
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface p-12 text-center shadow-soft-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-canvas text-ink-muted">
              <Inbox className="h-6 w-6" />
            </span>
            <p className="mt-3 text-sm font-extrabold text-ink sm:text-base">
              Tidak ada pengajuan yang sesuai
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Coba sesuaikan kata kunci pencarian atau ubah filter status di atas.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
