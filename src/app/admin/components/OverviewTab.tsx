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
    className: "border-warning-soft bg-warning-tint text-warning-accent",
  },
  approved: {
    label: "Telah Disetujui",
    className: "border-success/25 bg-success-soft text-success",
  },
  rejected: {
    label: "Ditolak",
    className: "border-danger-soft bg-danger-tint text-danger",
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
      iconClass: "bg-primary-soft text-primary",
      badgeClass: "border-primary/20 bg-primary-soft text-primary",
      cardClass: "border-line",
      bar: "bg-primary",
      ratio: 1,
      foot: "+6 pengajuan dalam 7 hari terakhir",
    },
    {
      label: "Menunggu Verifikasi",
      value: pendingCount,
      caption: "Dokumen kredensial yang perlu ditinjau admin.",
      badge: "Perlu Tindakan",
      icon: Clock,
      iconClass: "bg-warning-soft text-warning-accent",
      badgeClass: "border-warning-soft bg-warning-tint text-warning-accent",
      cardClass: "border-warning-soft ring-2 ring-warning-tint",
      bar: "bg-warning-accent",
      ratio: pendingCount / total,
      foot: "Target tinjauan: maksimal 1×24 jam",
    },
    {
      label: "Mentor Aktif & Terverifikasi",
      value: activeMentors,
      caption: "Mentor yang siap membuka sesi belajar bersama.",
      badge: "Tervalidasi",
      icon: Award,
      iconClass: "bg-success-soft text-success",
      badgeClass: "border-success/20 bg-success-soft text-success",
      cardClass: "border-line",
      bar: "bg-success",
      ratio: 0.82,
      foot: "Tersebar di 14 kampus mitra Mentora",
    },
  ];

  const distribution = [
    {
      label: "Menunggu Verifikasi",
      value: pendingCount,
      barColor: "bg-warning-accent",
      textColor: "text-warning-accent",
    },
    {
      label: "Telah Disetujui",
      value: approvedTotal,
      barColor: "bg-success",
      textColor: "text-success",
    },
    {
      label: "Ditolak",
      value: rejectedTotal,
      barColor: "bg-danger",
      textColor: "text-danger",
    },
  ];

  const recent = submissions.slice(0, 5);

  return (
    <section
      role="tabpanel"
      data-jiro-section="overview"
      data-jiro-label="Tab Ringkasan & Metrik"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          Ringkasan &amp; Metrik Portal
        </h2>
        <p className="text-sm text-ink-secondary">
          Gambaran menyeluruh kondisi verifikasi mentor hari ini, lengkap dengan
          pintasan menuju tugas yang paling mendesak.
        </p>
      </div>

      {/* Statistik Utama */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.label}
            className={`group relative overflow-hidden rounded-2xl border bg-surface p-5 shadow-soft-card transition hover:shadow-cloud ${card.cardClass}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconClass}`}
              >
                <card.icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${card.badgeClass}`}
              >
                {card.badge}
              </span>
            </div>
            <p className="mt-5 text-[11px] font-bold tracking-wider text-ink-muted uppercase">
              {card.label}
            </p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-ink tabular-nums sm:text-4xl">
              {card.value}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
              {card.caption}
            </p>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
              <span
                style={{ width: `${Math.min(100, Math.max(8, card.ratio * 100))}%` }}
                className={`block h-full rounded-full transition-all duration-700 ${card.bar}`}
              />
            </div>
            <p className="mt-2 text-[11px] font-medium text-ink-muted">
              {card.foot}
            </p>
          </article>
        ))}
      </div>

      {/* Grafik & Distribusi */}
      <div className="mt-6 grid gap-5 lg:grid-cols-5">
        <article className="rounded-2xl border border-line bg-surface p-5 shadow-soft-card sm:p-6 lg:col-span-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-ink">
                Aktivitas Verifikasi 7 Hari Terakhir
              </h3>
              <p className="mt-1 text-xs text-ink-muted">
                Jumlah dokumen kredensial yang ditinjau tim administrator.
              </p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <BarChart3 className="h-5 w-5" strokeWidth={2.2} />
            </span>
          </div>

          <div className="mt-6 flex h-36 items-end gap-2 sm:gap-3">
            {WEEK.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  style={{ height: `${d.value}%` }}
                  className="w-full rounded-t-lg bg-primary hover:bg-primary-accent opacity-90 transition"
                  title={`${d.day}: ${d.value}% kapasitas tinjauan`}
                />
                <span className="text-[11px] font-bold text-ink-muted">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-line bg-surface p-5 shadow-soft-card sm:p-6 lg:col-span-2">
          <h3 className="text-base font-extrabold text-ink">
            Distribusi Status Pengajuan
          </h3>
          <p className="mt-1 text-xs text-ink-muted">
            {reviewed} dari {submissions.length} pengajuan telah selesai ditinjau.
          </p>

          <ul className="mt-5 flex flex-col gap-4">
            {distribution.map((d) => (
              <li key={d.label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-ink-secondary">
                    {d.label}
                  </span>
                  <span className={`font-extrabold ${d.textColor}`}>
                    {d.value}
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-canvas">
                  <span
                    style={{ width: `${(d.value / total) * 100}%` }}
                    className={`block h-full rounded-full transition-all duration-500 ${d.barColor}`}
                  />
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-5 rounded-xl border border-line bg-canvas p-3 text-xs leading-relaxed text-ink-muted">
            Pertahankan rasio persetujuan yang sehat dengan memeriksa keaslian
            transkrip dan kualifikasi keahlian setiap pemohon.
          </p>
        </article>
      </div>

      {/* Aksi Cepat */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <button
          type="button"
          onClick={() => onGoTo("verification")}
          className="group relative flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 text-left shadow-soft-card transition hover:border-primary/40 hover:bg-canvas hover:shadow-cloud sm:p-6"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary shadow-2xs">
            <ShieldCheck className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold text-ink sm:text-base">
              Verifikasi Calon Mentor Baru
            </span>
            <span className="mt-0.5 block text-xs text-ink-muted">
              Ada pengajuan calon mentor yang menunggu validasi dokumen kredensial.
            </span>
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition group-hover:translate-x-1">
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => onGoTo("mentors")}
          className="group relative flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 text-left shadow-soft-card transition hover:border-primary/40 hover:bg-canvas hover:shadow-cloud sm:p-6"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary shadow-2xs">
            <Users className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold text-ink sm:text-base">
              Kelola Direktori Mentor
            </span>
            <span className="mt-0.5 block text-xs text-ink-muted">
              Pantau daftar mentor yang aktif mengajar dan berbagi ilmu di platform.
            </span>
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition group-hover:translate-x-1">
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      </div>

      {/* Tabel Ringkasan */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface shadow-soft-card">
        <div className="flex flex-col gap-1 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-sm font-extrabold text-ink sm:text-base">
              Pengajuan Terbaru
            </h3>
            <p className="text-xs text-ink-muted">
              Daftar pengajuan calon mentor terbaru yang masuk ke sistem Mentora.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onGoTo("verification")}
            className="group inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-accent sm:text-sm"
          >
            <span>Buka pusat verifikasi</span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="bg-canvas border-b border-line">
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
                    className="px-5 py-3 text-[11px] font-bold tracking-wider text-ink-muted uppercase sm:px-6"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm">
              {recent.map((s) => (
                <tr
                  key={s.id}
                  className="transition hover:bg-canvas"
                >
                  <td className="px-5 py-3.5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary font-extrabold text-xs">
                        {s.initials}
                      </span>
                      <span className="leading-tight">
                        <span className="block font-bold text-ink">
                          {s.name}
                        </span>
                        <span className="block text-xs text-ink-muted">
                          {s.submittedAt} · {s.id}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 sm:px-6">
                    <span className="block font-semibold text-ink text-xs sm:text-sm">
                      {s.university}
                    </span>
                    <span className="block text-xs text-ink-muted">
                      {s.program} · {s.semester}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 sm:px-6">
                    <div className="flex flex-wrap gap-1">
                      {s.skills.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-canvas border border-line px-2 py-0.5 text-xs font-medium text-ink-secondary"
                        >
                          {skill}
                        </span>
                      ))}
                      {s.skills.length > 2 && (
                        <span className="rounded-lg bg-canvas border border-line px-1.5 py-0.5 text-xs text-ink-muted">
                          +{s.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 sm:px-6">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${STATUS[s.status]?.className || ""}`}
                    >
                      {STATUS[s.status]?.label || s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 sm:px-6">
                    <button
                      type="button"
                      onClick={() => onGoTo("verification")}
                      className="inline-flex items-center gap-1 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-bold text-ink-secondary shadow-2xs transition hover:border-primary hover:text-primary hover:bg-canvas"
                    >
                      <span>Tinjau</span>
                      <ArrowRight className="h-3 w-3" />
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
