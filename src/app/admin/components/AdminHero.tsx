"use client";

import React from "react";
import Link from "next/link";
import {
  Clock3,
  LayoutDashboard,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

type Props = {
  refreshing: boolean;
  onRefresh: () => void;
};

const STRIP = [
  {
    icon: TrendingUp,
    label: "Tingkat persetujuan",
    value: "86%",
    tone: "text-success bg-success-soft",
  },
  {
    icon: Clock3,
    label: "Rata-rata waktu tinjau",
    value: "4 jam",
    tone: "text-warning-accent bg-warning-soft",
  },
  {
    icon: ShieldCheck,
    label: "Kredensial tervalidasi",
    value: "100%",
    tone: "text-primary bg-primary-soft",
  },
];

export default function AdminHero({ refreshing, onRefresh }: Props) {
  return (
    <section
      id="portal-admin"
      data-jiro-section="admin-hero"
      data-jiro-label="Admin Hero"
      className="relative overflow-hidden border-b border-line bg-canvas"
    >
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm ring-4 ring-primary-soft">
              <ShieldCheck className="h-8 w-8" strokeWidth={2.2} />
            </span>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                  🛡️ Super Admin Mentora
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink-muted shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  {refreshing ? "Menyinkronkan data…" : "Data sinkron · baru saja"}
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                Portal Administrator Mentora
              </h1>
              <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink-secondary sm:text-base">
                Pusat kendali verifikasi calon mentor, validasi dokumen kredensial akademik, dan pengelolaan direktori mentor resmi di platform Mentora.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs font-bold text-ink-secondary shadow-2xs transition hover:bg-canvas hover:text-ink sm:text-sm"
            >
              <LayoutDashboard className="h-4 w-4 text-ink-muted" />
              <span>Ke Dashboard Pengguna</span>
            </Link>
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-primary-accent disabled:opacity-75 sm:text-sm"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>{refreshing ? "Memperbarui…" : "Perbarui Data"}</span>
            </button>
          </div>
        </div>

        {/* Strip insight ringkas */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {STRIP.map(({ icon: Icon, label, value, tone }) => (
            <div
              key={label}
              className="flex items-center gap-3.5 rounded-2xl border border-line bg-surface px-4 py-3.5 shadow-soft-card"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] font-bold tracking-wider text-ink-muted uppercase">
                  {label}
                </span>
                <span className="mt-0.5 block text-lg font-extrabold text-ink">
                  {value}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
