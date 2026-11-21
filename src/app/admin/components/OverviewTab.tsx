"use client";

import React from "react";
import {
  ArrowRight,
  Award,
  BarChart3,
  Clock,
  FileText,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { Submission, SubmissionStatus, TabKey } from "./adminData";

type Props = {
  submissions: Submission[];
  totalSubmissions: number;
  pendingCount: number;
  activeMentors: number;
  onGoTo: (tab: TabKey) => void;
};

const STATUS: Record<SubmissionStatus, { label: string; className: string }> = {
  pending: {
    label: "Menunggu Verifikasi",
    className: "border-[#FDE68A] bg-[#FFFBEB] text-[#D97706]",
  },
  approved: {
    label: "Telah Disetujui",
    className: "border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]",
  },
  rejected: {
    label: "Ditolak",
    className: "border-[#FECDD3] bg-[#FFF1F2] text-[#E11D48]",
  },
};

const WEEK = [
  { day: "Sen", value: 42 },
  { day: "Sel", value: 68 },
  { day: "Rab", value: 55 },
  { day: "Kam", value: 84 },
  { day: "Jum", value: 72 },
  { day: "Sab", value: 36 },
  { day: "Min", value: 48 },
];

export default function OverviewTab({
  submissions,
  totalSubmissions,
  pendingCount,
  activeMentors,
  onGoTo,
}: Props) {
  const approvedTotal = submissions.filter((s) => s.status === "approved").length;
  const rejectedTotal = submissions.filter((s) => s.status === "rejected").length;
  const reviewed = approvedTotal + rejectedTotal;
  const total = Math.max(1, submissions.length);

  const cards = [
    {
      label: "Total Pengajuan Masuk",
      value: totalSubmissions,
      caption: "Seluruh pengajuan mentor sejak platform dirilis.",
      badge: "Kumulatif",
      icon: FileText,
      iconClass: "bg-[#EFF6FF] text-[#2563EB]",
      badgeClass: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]",
      cardClass: "border-[#E2E8F0]",
      accent: "from-[#2563EB] to-[#60A5FA]",
      bar: "bg-[#2563EB]",
      ratio: 1,
      foot: "+6 pengajuan dalam 7 hari terakhir",
    },
    {
      label: "Menunggu Verifikasi",
      value: pendingCount,
      caption: "Dokumen kredensial yang belum ditinjau admin.",
      badge: "Perlu Tindakan",
      icon: Clock,
      iconClass: "bg-[#FFFBEB] text-[#D97706]",
      badgeClass: "border-[#FDE68A] bg-[#FFFBEB] text-[#D97706]",
      cardClass: "border-[#FDE68A] ring-4 ring-[#FFFBEB]",
      accent: "from-[#D97706] to-[#FBBF24]",
      bar: "bg-[#D97706]",
      ratio: pendingCount / total,
      foot: "Target tinjauan: maksimal 1×24 jam",
    },
    {
      label: "Mentor Aktif & Terverifikasi",
      value: activeMentors,
      caption: "Mentor yang siap membuka sesi belajar bersama.",
      badge: "Tervalidasi",
      icon: Award,
      iconClass: "bg-[#ECFDF5] text-[#059669]",
      badgeClass: "border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]",
      cardClass: "border-[#E2E8F0]",
      accent: "from-[#059669] to-[#34D399]",
      bar: "bg-[#059669]",
      ratio: 0.82,
      foot: "Tersebar di 14 kampus mitra Mentora",
    },
  ];

  const distribution = [
    {
      label: "Menunggu Verifikasi",
      value: pendingCount,
      className: "bg-[#D97706]",
      text: "text-[#D97706]",
    },
    {
      label: "Telah Disetujui",
      value: approvedTotal,
      className: "bg-[#059669]",
      text: "text-[#059669]",
    },
    {
      label: "Ditolak",
      value: rejectedTotal,
      className: "bg-[#E11D48]",
      text: "text-[#E11D48]",
    },
  ];

  const recent = submissions.slice(0, 5);

  return (
    <section
      role="tabpanel"
      data-jiro-section="overview"
      data-jiro-label="Tab Ringkasan & Metrik"
      className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-[20px] font-extrabold tracking-tight text-[#0F172A] sm:text-[24px]">
          Ringkasan &amp; Metrik Portal
        </h2>
        <p className="text-[14px] leading-relaxed text-[#64748B]">
          Gambaran menyeluruh kondisi verifikasi mentor hari ini, lengkap dengan
          pintasan menuju tugas yang paling mendesak.
        </p>
      </div>

      {/* Statistik utama */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {cards.map((card) => (
          <article
            key={card.label}
            className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-slate-900/5 sm:p-6 ${card.cardClass}`}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`}
            />
            <div className="flex items-start justify-between gap-3">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition group-hover:scale-105 ${card.iconClass}`}
              >
                <card.icon className="h-5.5 w-5.5" strokeWidth={2.2} />
              </span>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide ${card.badgeClass}`}
              >
                {card.badge}
              </span>
            </div>
            <p className="mt-5 text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
              {card.label}
            </p>
            <p className="mt-1 text-[42px] leading-none font-extrabold tracking-tight text-[#0F172A] tabular-nums">
              {card.value}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-[#64748B]">
              {card.caption}
            </p>

            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
              <span
                style={{ width: `${Math.min(100, Math.max(8, card.ratio * 100))}%` }}
                className={`block h-full rounded-full transition-all duration-700 ${card.bar}`}
              />
            </div>
            <p className="mt-2.5 text-[11.5px] font-semibold text-[#94A3B8]">
              {card.foot}
            </p>
          </article>
        ))}
      </div>

      {/* Grafik & distribusi */}
      <div className="mt-5 grid gap-4 lg:grid-cols-5 lg:gap-5">
        <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 lg:col-span-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[16px] font-extrabold text-[#0F172A]">
                Aktivitas Verifikasi 7 Hari Terakhir
              </h3>
              <p className="mt-1 text-[13px] text-[#64748B]">
                Jumlah dokumen kredensial yang ditinjau tim administrator.
              </p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#7C3AED]">
              <BarChart3 className="h-5 w-5" strokeWidth={2.2} />
            </span>
          </div>

          <div className="mt-7 flex h-40 items-end gap-2 sm:gap-3">
            {WEEK.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2.5">
                <div
                  style={{ height: `${d.value}%` }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#2563EB] to-[#7C3AED] opacity-85 transition hover:opacity-100"
                  title={`${d.day}: ${d.value}% kapasitas tinjauan`}
                />
                <span className="text-[11px] font-bold text-[#94A3B8]">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 lg:col-span-2">
          <h3 className="text-[16px] font-extrabold text-[#0F172A]">
            Distribusi Status Pengajuan
          </h3>
          <p className="mt-1 text-[13px] text-[#64748B]">
            {reviewed} dari {submissions.length} pengajuan telah selesai
            ditinjau.
          </p>

          <ul className="mt-6 flex flex-col gap-5">
            {distribution.map((d) => (
              <li key={d.label}>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#334155]">
                    {d.label}
                  </span>
                  <span className={`text-[13px] font-extrabold ${d.text}`}>
                    {d.value}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                  <span
                    style={{ width: `${(d.value / total) * 100}%` }}
                    className={`block h-full rounded-full transition-all duration-500 ${d.className}`}
                  />
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-6 rounded-xl bg-[#F8FAFC] p-3.5 text-[12.5px] leading-relaxed text-[#64748B]">
            Pertahankan rasio persetujuan yang sehat dengan memeriksa keaslian
            transkrip dan rekam jejak mengajar setiap pemohon.
          </p>
        </article>
      </div>

      {/* Aksi cepat */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2 lg:gap-5">
        <button
          type="button"
          onClick={() => onGoTo("verification")}
          className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[#DDD6FE] bg-gradient-to-br from-[#F5F3FF] to-white p-5 text-left shadow-sm transition hover:-translate-y-1.5 hover:shadow-lg hover:shadow-violet-600/10 sm:p-6"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -right-10 h-36 w-36 rounded-full bg-[#7C3AED]/10 blur-2xl transition group-hover:bg-[#7C3AED]/20"
          />
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#7C3AED] shadow-sm">
            <ShieldCheck className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <span className="relative min-w-0 flex-1">
            <span className="block text-[15px] font-extrabold text-[#0F172A]">
              Verifikasi Calon Mentor Baru
            </span>
            <span className="mt-1 block text-[13px] leading-relaxed text-[#64748B]">
              Ada calon mentor yang menunggu validasi dokumen.
            </span>
          </span>
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-white shadow-md shadow-violet-600/25 transition group-hover:translate-x-1">
            <ArrowRight className="h-5 w-5" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => onGoTo("mentors")}
          className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[#BFDBFE] bg-gradient-to-br from-[#F0F7FF] to-white p-5 text-left shadow-sm transition hover:-translate-y-1.5 hover:shadow-lg hover:shadow-blue-600/10 sm:p-6"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -right-10 h-36 w-36 rounded-full bg-[#2563EB]/10 blur-2xl transition group-hover:bg-[#2563EB]/20"
          />
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-sm">
            <Users className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <span className="relative min-w-0 flex-1">
            <span className="block text-[15px] font-extrabold text-[#0F172A]">
              Kelola Direktori Mentor
            </span>
            <span className="mt-1 block text-[13px] leading-relaxed text-[#64748B]">
              Pantau daftar mentor yang aktif mengajar di platform.
            </span>
          </span>
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-md shadow-blue-600/25 transition group-hover:translate-x-1">
            <ArrowRight className="h-5 w-5" />
          </span>
        </button>
      </div>

      {/* Tabel ringkasan */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-[#E2E8F0] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-[16px] font-extrabold text-[#0F172A]">
              Pengajuan Terbaru
            </h3>
            <p className="mt-1 text-[13px] text-[#64748B]">
              Lima pengajuan calon mentor paling baru yang masuk ke portal.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onGoTo("verification")}
            className="group inline-flex items-center gap-1.5 self-start text-[13px] font-bold text-[#2563EB] transition hover:text-[#1D4ED8] sm:self-auto"
          >
            Buka pusat verifikasi
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-left">
            <thead>
              <tr className="bg-[#F8FAFC]">
                {[
                  "Calon Mentor",
                  "Universitas & Jurusan",
                  "Keahlian Ditawarkan",
                  "Status",
                  "Aksi",
                ].map((head) => (
                  <th
                    key={head}
                    scope="col"
                    className="px-5 py-3.5 text-[11px] font-bold tracking-wider text-[#64748B] uppercase sm:px-6"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {recent.map((s) => (
                <tr
                  key={s.id}
                  className="group transition hover:bg-[#F8FAFC]"
                >
                  <td className="px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold ring-2 ring-white ${s.tone}`}
                      >
                        {s.initials}
                      </span>
                      <span className="leading-tight">
                        <span className="block text-[14px] font-bold text-[#0F172A]">
                          {s.name}
                        </span>
                        <span className="block text-[12px] text-[#64748B]">
                          {s.submittedAt} · {s.id}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <span className="block text-[13.5px] font-semibold text-[#0F172A]">
                      {s.university}
                    </span>
                    <span className="block text-[12.5px] text-[#64748B]">
                      {s.program} · {s.semester}
                    </span>
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <div className="flex flex-wrap gap-1.5">
                      {s.skills.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-[#F1F5F9] px-2.5 py-1 text-[12px] font-semibold text-[#334155]"
                        >
                          {skill}
                        </span>
                      ))}
                      {s.skills.length > 2 && (
                        <span className="rounded-lg bg-[#F1F5F9] px-2.5 py-1 text-[12px] font-semibold text-[#64748B]">
                          +{s.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[11.5px] font-bold whitespace-nowrap ${STATUS[s.status]?.className || ""}`}
                    >
                      {STATUS[s.status]?.label || s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() => onGoTo("verification")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-1.5 text-[12.5px] font-bold text-[#334155] shadow-sm transition hover:border-[#93C5FD] hover:text-[#1D4ED8] hover:shadow"
                    >
                      Tinjau
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
