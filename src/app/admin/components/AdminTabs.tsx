"use client";

import React from "react";
import { Activity, ShieldCheck, Users } from "lucide-react";
import type { TabKey } from "./adminData";

type Props = {
  tab: TabKey;
  onChange: (tab: TabKey) => void;
  pendingCount: number;
};

const TABS: {
  key: TabKey;
  label: string;
  short: string;
  icon: typeof Activity;
}[] = [
  {
    key: "overview",
    label: "Ringkasan & Metrik",
    short: "Ringkasan",
    icon: Activity,
  },
  {
    key: "verification",
    label: "Verifikasi Calon Mentor",
    short: "Verifikasi",
    icon: ShieldCheck,
  },
  {
    key: "mentors",
    label: "Direktori Mentor Terverifikasi",
    short: "Direktori",
    icon: Users,
  },
];

export default function AdminTabs({ tab, onChange, pendingCount }: Props) {
  return (
    <section
      data-jiro-section="admin-tabs"
      data-jiro-label="Admin Tabs"
      className="sticky top-[72px] z-30 border-b border-[#E2E8F0]/70 bg-[#F8FAFC]/90 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-[1280px] px-4 py-3.5 sm:px-6 lg:px-8">
        <div
          role="tablist"
          aria-label="Navigasi portal administrator"
          className="flex gap-1.5 overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white p-1.5 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map(({ key, label, short, icon: Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onChange(key)}
                className={`group relative flex flex-1 shrink-0 items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-[13.5px] font-bold whitespace-nowrap transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-md shadow-violet-600/25"
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
              >
                <span className="relative flex items-center gap-2.5">
                  <Icon
                    className={`h-4.5 w-4.5 transition-colors ${
                      active
                        ? "text-white"
                        : "text-[#94A3B8] group-hover:text-[#7C3AED]"
                    }`}
                    strokeWidth={2.3}
                  />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{short}</span>
                  {key === "verification" && pendingCount > 0 && (
                    <span
                      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-extrabold transition-colors ${
                        active
                          ? "bg-white/25 text-white"
                          : "border border-[#FDE68A] bg-[#FFFBEB] text-[#D97706]"
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
