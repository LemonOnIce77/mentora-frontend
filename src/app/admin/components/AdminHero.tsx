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
    tone: "text-[#059669] bg-[#ECFDF5]",
  },
  {
    icon: Clock3,
    label: "Rata-rata waktu tinjau",
    value: "4 jam",
    tone: "text-[#D97706] bg-[#FFFBEB]",
  },
  {
    icon: ShieldCheck,
    label: "Kredensial tervalidasi",
    value: "100%",
    tone: "text-[#7C3AED] bg-[#F5F3FF]",
  },
];

export default function AdminHero({ refreshing, onRefresh }: Props) {
  return (
    <section
      id="portal-admin"
      data-jiro-section="admin-hero"
      data-jiro-label="Admin Hero"
      className="relative overflow-hidden border-b border-[#E2E8F0] bg-[#F0F7FF]"
    >
      {/* Dekorasi latar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#2563EB0F_1px,transparent_1px),linear-gradient(to_bottom,#2563EB0F_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-24 h-96 w-96 rounded-full bg-[#7C3AED]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 -left-20 h-96 w-96 rounded-full bg-[#2563EB]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#F8FAFC]"
      />

      <div className="relative mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-9 lg:flex-row lg:items-start lg:justify-between transition-all duration-300">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">
            <span className="relative flex h-18 w-18 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white shadow-xl shadow-violet-600/25">
              <span className="absolute inset-0 rounded-3xl ring-8 ring-[#7C3AED]/10" />
              <ShieldCheck className="h-9 w-9" strokeWidth={2.2} />
            </span>

            <div>
              <p className="text-[11px] font-bold tracking-[0.14em] text-[#7C3AED] uppercase">
                Pusat Kendali Sistem &amp; Verifikasi Kredensial Mentor
              </p>
              <h1 className="mt-2.5 max-w-2xl text-[28px] leading-[1.1] font-extrabold tracking-tight text-[#0F172A] sm:text-[38px] lg:text-[44px]">
                PORTAL ADMINISTRATOR{" "}
                <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
                  MENTORA
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#475569]">
                Selamat datang kembali, Admin. Tinjau pengajuan calon mentor,
                validasi dokumen kredensial, dan pantau kualitas pertukaran
                keterampilan antarmahasiswa di seluruh platform Mentora.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#DDD6FE] bg-white/80 px-3.5 py-1.5 text-[12px] font-bold text-[#6D28D9] shadow-sm backdrop-blur">
                  🛡️ Super Admin Aktif
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white/80 px-3.5 py-1.5 text-[12px] font-semibold text-[#64748B] shadow-sm backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#059669] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#059669]" />
                  </span>
                  {refreshing ? "Menyinkronkan data…" : "Data sinkron · baru saja"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0 lg:flex-col xl:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#CBD5E1] bg-white/90 px-5 py-3.5 text-[13.5px] font-bold text-[#334155] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[#93C5FD] hover:text-[#1D4ED8] hover:shadow-md"
            >
              <LayoutDashboard className="h-4.5 w-4.5" />
              Ke Dashboard Pengguna
            </Link>
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-5 py-3.5 text-[13.5px] font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/30 disabled:translate-y-0 disabled:opacity-85"
            >
              <RefreshCw
                className={`h-4.5 w-4.5 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Memperbarui…" : "Perbarui Data"}
            </button>
          </div>
        </div>

        {/* Strip insight */}
        <div className="mt-10 grid gap-3 rounded-3xl border border-white bg-white/70 p-3 shadow-sm backdrop-blur sm:grid-cols-3">
          {STRIP.map(({ icon: Icon, label, value, tone }) => (
            <div
              key={label}
              className="flex items-center gap-3.5 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-[#E2E8F0] transition hover:shadow"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span className="leading-tight">
                <span className="block text-[10.5px] font-bold tracking-[0.1em] text-[#94A3B8] uppercase">
                  {label}
                </span>
                <span className="mt-0.5 block text-[18px] font-extrabold text-[#0F172A]">
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
