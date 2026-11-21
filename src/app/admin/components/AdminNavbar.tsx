"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Activity,
  ShieldCheck,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import type { TabKey } from "./adminData";

type Props = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  pendingCount: number;
  adminUser: {
    namaLengkap?: string;
    namaPanggilan?: string;
    email?: string;
    role?: string;
    fotoProfil?: string;
  } | null;
  onLogout: () => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
};

const TABS: {
  key: TabKey;
  label: string;
  icon: typeof Activity;
}[] = [
  {
    key: "overview",
    label: "Ringkasan & Metrik",
    icon: Activity,
  },
  {
    key: "verification",
    label: "Verifikasi Calon Mentor",
    icon: ShieldCheck,
  },
  {
    key: "mentors",
    label: "Direktori Mentor",
    icon: Users,
  },
];

export default function AdminNavbar({
  activeTab,
  onTabChange,
  pendingCount,
  adminUser,
  onLogout,
  isRefreshing = false,
  onRefresh,
}: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const displayName = adminUser?.namaLengkap || adminUser?.namaPanggilan || "Super Admin";
  const initial = displayName.trim().charAt(0).toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/Mentora.svg"
              alt="Mentora Logo"
              width={30}
              height={30}
              className="size-7.5 shrink-0"
              priority
            />
            <span className="text-xl font-extrabold tracking-tight text-ink">
              Mentora
            </span>
          </div>

          <span aria-hidden="true" className="h-5 border-l border-line" />

          <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
            <ShieldCheck className="size-3.5" />
            <span>Admin Console</span>
          </span>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav
          role="tablist"
          aria-label="Navigasi konsol administrator"
          className="hidden md:inline-flex items-center gap-1 rounded-2xl border border-line bg-canvas p-1 shadow-2xs"
        >
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onTabChange(key)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all sm:text-sm ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-ink-secondary hover:bg-surface hover:text-ink"
                }`}
              >
                <Icon
                  className={`size-4 shrink-0 ${
                    active ? "text-white" : "text-ink-muted"
                  }`}
                  strokeWidth={2.2}
                />
                <span>{label}</span>
                {key === "verification" && pendingCount > 0 && (
                  <span
                    className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold tabular-nums ${
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
        </nav>

        {/* Right Section: Status Indicator, Refresh, & User Dropdown */}
        <div className="hidden sm:flex items-center gap-3">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Perbarui Data"
              className="inline-flex items-center justify-center size-9 rounded-xl border border-line bg-surface text-ink-muted hover:text-ink hover:bg-canvas transition shadow-2xs disabled:opacity-60"
            >
              <RefreshCw
                className={`size-4 ${isRefreshing ? "animate-spin text-primary" : ""}`}
              />
            </button>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink-secondary shadow-2xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span>Super Admin</span>
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 rounded-full border border-line bg-surface p-1.5 pr-3 shadow-2xs hover:bg-canvas transition"
            >
              <span className="grid size-8 place-items-center rounded-full bg-primary-soft text-xs font-extrabold text-primary">
                {initial}
              </span>
              <span className="max-w-[120px] truncate text-xs font-bold text-ink">
                {displayName}
              </span>
              <ChevronDown className="size-3.5 text-ink-muted" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-line bg-surface p-2 shadow-soft-card animate-in fade-in slide-in-from-top-2">
                <div className="border-b border-line px-3 py-2.5">
                  <p className="truncate text-xs font-bold text-ink">
                    {displayName}
                  </p>
                  <p className="truncate text-[11px] text-ink-muted">
                    {adminUser?.email || "admin@mentora.my.id"}
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-danger hover:bg-danger-soft transition"
                  >
                    <LogOut className="size-4" />
                    <span>Keluar dari Akun Admin</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid size-10 place-items-center rounded-xl border border-line bg-surface text-ink hover:bg-canvas"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-line bg-surface px-4 py-4 md:hidden space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full bg-primary-soft text-xs font-extrabold text-primary">
                {initial}
              </span>
              <div>
                <p className="text-xs font-bold text-ink">{displayName}</p>
                <p className="text-[11px] text-ink-muted">
                  {adminUser?.email || "admin@mentora.my.id"}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-0.5 text-[11px] font-bold text-success">
              <span className="size-1.5 rounded-full bg-success" />
              <span>Admin</span>
            </span>
          </div>

          <nav className="flex flex-col gap-1.5">
            {TABS.map(({ key, label, icon: Icon }) => {
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onTabChange(key);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    active
                      ? "bg-primary text-white"
                      : "text-ink-secondary hover:bg-canvas hover:text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4 shrink-0" strokeWidth={2.2} />
                    <span>{label}</span>
                  </div>
                  {key === "verification" && pendingCount > 0 && (
                    <span
                      className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] font-extrabold ${
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
          </nav>

          <div className="border-t border-line pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl border border-danger-soft bg-danger-tint px-3.5 py-2.5 text-xs font-bold text-danger hover:bg-danger-soft transition"
            >
              <LogOut className="size-4" />
              <span>Keluar dari Akun Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
