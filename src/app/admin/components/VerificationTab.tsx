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
  { label: string; className: string; accent: string; dot: string }
> = {
  pending: {
    label: "Menunggu Verifikasi",
    className: "border-[#FDE68A] bg-[#FFFBEB] text-[#D97706]",
    accent: "from-[#D97706] to-[#FBBF24]",
    dot: "bg-[#D97706]",
  },
  approved: {
    label: "Telah Disetujui",
    className: "border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]",
    accent: "from-[#059669] to-[#34D399]",
    dot: "bg-[#059669]",
  },
  rejected: {
    label: "Ditolak",
    className: "border-[#FECDD3] bg-[#FFF1F2] text-[#E11D48]",
    accent: "from-[#E11D48] to-[#FB7185]",
    dot: "bg-[#E11D48]",
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
      className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-[20px] font-extrabold tracking-tight text-[#0F172A] sm:text-[24px]">
            Pusat Verifikasi Mentor
          </h2>
          <p className="max-w-2xl text-[14px] leading-relaxed text-[#64748B]">
            Tinjau kredensial akademik dan rekam jejak mengajar setiap calon
            mentor sebelum menyetujui perubahan perannya.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-4 py-2 text-[12.5px] font-bold text-[#D97706]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D97706] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D97706]" />
          </span>
          {counts.pending} pengajuan menunggu tindakan Anda
        </span>
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:p-5">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12.5px] font-bold transition ${
                  active
                    ? "border-[#7C3AED] bg-[#7C3AED] text-white shadow-sm shadow-violet-600/20"
                    : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#DDD6FE] hover:bg-[#F5F3FF] hover:text-[#6D28D9]"
                }`}
              >
                {f.label}
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-extrabold ${
                    active ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#64748B]"
                  }`}
                >
                  {counts[f.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative lg:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-[#94A3B8]" />
          <label htmlFor="cari-pengajuan" className="sr-only">
            Cari pengajuan calon mentor
          </label>
          <input
            id="cari-pengajuan"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama calon mentor, kampus, atau skill..."
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pr-3.5 pl-11 text-[13.5px] font-medium text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#93C5FD] focus:bg-white focus:ring-4 focus:ring-[#EFF6FF]"
          />
        </div>
      </div>

      {/* Daftar pengajuan */}
      <div className="mt-6 flex flex-col gap-5">
        {filtered.map((s) => {
          const status = STATUS[s.status] || STATUS.pending;
          return (
            <article
              key={s.id}
              className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#CBD5E1] hover:shadow-xl hover:shadow-slate-900/5"
            >
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${status.accent}`}
              />

              <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
                {/* Kolom identitas */}
                <div className="relative border-b border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] to-white p-5 sm:p-6 lg:border-r lg:border-b-0">
                  <div className="flex items-center gap-4">
                    <span className="relative shrink-0">
                      <span
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl text-[19px] font-extrabold shadow-sm ring-4 ring-white ${s.tone}`}
                      >
                        {s.initials}
                      </span>
                      <span
                        className={`absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-[3px] border-white ${status.dot}`}
                      />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[17px] leading-tight font-extrabold tracking-tight text-[#0F172A]">
                        {s.name}
                      </h3>
                      <p className="mt-1 truncate text-[12.5px] text-[#64748B]">
                        {s.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`mt-4 inline-flex items-center rounded-full border px-3.5 py-1.5 text-[12px] font-bold ${status.className}`}
                  >
                    {status.label}
                  </span>

                  <dl className="mt-5 flex flex-col gap-3 border-t border-dashed border-[#E2E8F0] pt-5">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#2563EB]" />
                      <div className="min-w-0">
                        <dt className="text-[10.5px] font-bold tracking-wider text-[#94A3B8] uppercase">
                          Asal kampus
                        </dt>
                        <dd className="text-[13px] leading-snug font-bold text-[#0F172A]">
                          {s.university}
                        </dd>
                        <dd className="text-[12.5px] text-[#64748B]">
                          {s.program} · {s.semester}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#7C3AED]" />
                      <div>
                        <dt className="text-[10.5px] font-bold tracking-wider text-[#94A3B8] uppercase">
                          Domisili
                        </dt>
                        <dd className="text-[13px] font-bold text-[#0F172A]">
                          {s.city}
                        </dd>
                      </div>
                    </div>
                  </dl>

                  <p className="mt-5 text-[11.5px] font-semibold text-[#94A3B8]">
                    {s.id} · Diajukan {s.submittedAt}
                  </p>
                </div>

                {/* Kolom detail */}
                <div className="flex flex-col gap-5 p-5 sm:p-6">
                  <div>
                    <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                      <Sparkles className="h-3.5 w-3.5 text-[#2563EB]" />
                      Skill yang ditawarkan
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {s.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1.5 text-[12.5px] font-bold text-[#1D4ED8] transition hover:bg-[#DBEAFE]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                      Pengalaman mengajar
                    </p>
                    <blockquote className="mt-2.5 flex gap-3 rounded-xl border-l-4 border-[#DDD6FE] bg-[#F5F3FF]/60 p-4">
                      <Quote className="h-4.5 w-4.5 shrink-0 text-[#7C3AED]" />
                      <p className="text-[13.5px] leading-relaxed text-[#475569] italic">
                        {s.experience}
                      </p>
                    </blockquote>
                  </div>

                  <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#E11D48] shadow-sm ring-1 ring-[#FECDD3]">
                        <FileText className="h-5.5 w-5.5" strokeWidth={2.2} />
                      </span>
                      <span className="min-w-0 leading-tight">
                        <span className="block text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase">
                          Dokumen kredensial
                        </span>
                        <span className="mt-1 block truncate text-[13.5px] font-bold text-[#0F172A]">
                          {s.documentName}
                        </span>
                      </span>
                    </div>
                    {s.documentUrl ? (
                      <a
                        href={s.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#BFDBFE] bg-white px-4 py-2.5 text-[13px] font-bold text-[#1D4ED8] shadow-sm transition hover:bg-[#EFF6FF]"
                      >
                        Lihat Dokumen Kredensial
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-xs text-[#94A3B8] italic">
                        Dokumen belum diunggah
                      </span>
                    )}
                  </div>

                  {s.status === "rejected" && s.rejectionReason && (
                    <div className="rounded-xl border border-[#FECDD3] bg-[#FFF1F2] p-4">
                      <p className="text-[11px] font-bold tracking-wider text-[#E11D48] uppercase">
                        Alasan penolakan
                      </p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-[#9F1239]">
                        {s.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer aksi */}
              <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 sm:px-6">
                {s.status === "pending" && (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[12.5px] leading-relaxed text-[#64748B]">
                      Pastikan dokumen sesuai nama pemohon sebelum mengambil
                      keputusan.
                    </p>
                    <div className="flex flex-col gap-2.5 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => onReject(s)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FECDD3] bg-white px-5 py-2.5 text-[13.5px] font-bold text-[#E11D48] transition hover:-translate-y-0.5 hover:bg-[#FFF1F2]"
                      >
                        <XCircle className="h-4.5 w-4.5" />
                        Tolak
                      </button>
                      <button
                        type="button"
                        onClick={() => onApprove(s)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#059669] to-[#047857] px-5 py-2.5 text-[13.5px] font-bold text-white shadow-md shadow-emerald-600/25 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/30"
                      >
                        <Check className="h-4.5 w-4.5" strokeWidth={3} />
                        Setujui Mentor
                      </button>
                    </div>
                  </div>
                )}

                {s.status === "approved" && (
                  <p className="flex items-center gap-2 text-[13.5px] font-bold text-[#059669]">
                    <CheckCircle2 className="h-4.5 w-4.5" />✓ Telah Disetujui &amp;
                    Status Mentor Aktif
                  </p>
                )}

                {s.status === "rejected" && (
                  <p className="flex items-center gap-2 text-[13.5px] font-bold text-[#E11D48]">
                    <XCircle className="h-4.5 w-4.5" />✕ Pengajuan Ditolak
                  </p>
                )}
              </div>
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-12 text-center shadow-sm">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8FAFC] text-[#94A3B8]">
              <Inbox className="h-7 w-7" />
            </span>
            <p className="mt-4 text-[16px] font-extrabold text-[#0F172A]">
              Tidak ada pengajuan yang sesuai
            </p>
            <p className="mt-1.5 max-w-sm text-[13px] text-[#64748B]">
              Coba sesuaikan kata kunci pencarian atau ubah filter status di atas.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
