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
      className="sticky top-[68px] z-30 border-b border-line bg-surface/90 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div
          role="tablist"
          aria-label="Navigasi portal administrator"
          className="inline-flex w-full sm:w-auto items-center gap-1 overflow-x-auto rounded-2xl border border-line bg-canvas p-1 shadow-2xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                className={`group relative flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all sm:text-sm ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-ink-secondary hover:bg-surface hover:text-ink"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    active ? "text-white" : "text-ink-muted group-hover:text-ink"
                  }`}
                  strokeWidth={2.2}
                />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{short}</span>
                {key === "verification" && pendingCount > 0 && (
                  <span
                    className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-extrabold tabular-nums ${
                      active
                        ? "bg-white/25 text-white"
                        : "bg-warning-soft text-warning-accent"
                    }`}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
