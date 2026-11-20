"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserRound, LogIn, LogOut } from "lucide-react";
import { ChevronDown, Menu, X, UserPlus } from "@/components/animated-icons";
import { accountHome } from "@/lib/account-home";
import { logoutTo } from "@/lib/logout";
import { useSession } from "@/components/SessionProvider";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/tentang" },
  { label: "Testimoni", href: "/testimoni" },
  { label: "FAQ", href: "/faq" },
];

const adminNavLinks = [
  { label: "Portal Admin", href: "/admin" },
  { label: "Dashboard Admin", href: "/dashboard" },
];

const memberNavLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Cari Partner", href: "/matching" },
  { label: "Mentor", href: "/mentors" },
  { label: "Pesan", href: "/chat" },
];

const navigationByHome = {
  "/": navLinks,
  "/dashboard": memberNavLinks,
  "/admin": adminNavLinks,
  "/onboarding": [{ label: "Onboarding", href: "/onboarding" }],
};

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { profile, authLoading } = useSession();
  const [imageError, setImageError] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen && !accountOpen) return;
    const boundary = accountOpen ? accountRef.current : headerRef.current;
    const close = () => {
      setMobileOpen(false);
      setAccountOpen(false);
    };
    const dismissOutside = (event: Event) => {
      if (event.target instanceof Node && !boundary?.contains(event.target)) close();
    };
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      boundary?.querySelector<HTMLButtonElement>('button[aria-expanded="true"]')?.focus();
      close();
    };
    const breakpoint = window.matchMedia("(min-width: 1024px)");
    breakpoint.addEventListener("change", close);
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOutside);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      breakpoint.removeEventListener("change", close);
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOutside);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [mobileOpen, accountOpen]);

  useEffect(() => {
    setImageError(false);
  }, [profile?.id, profile?.fotoProfil, profile?.foto_profil]);

  const displayName =
    profile?.namaLengkap || profile?.namaPanggilan || "Pengguna Mentora";
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";
  const photo = profile?.fotoProfil || profile?.foto_profil || null;
  const role = profile?.role || "Pengguna Mentora";
  const homeHref = profile ? accountHome(profile) : "/";
  const isAdmin = homeHref === "/admin";
  const visibleNavLinks = authLoading ? [] : navigationByHome[homeHref];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  const closeMenus = () => {
    setMobileOpen(false);
    setAccountOpen(false);
  };

  const handleLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);

    try {
      await logoutTo("/");
    } catch (error) {
      console.error("Gagal logout:", error);
      alert("Gagal keluar dari akun. Silakan coba kembali.");
      setLogoutLoading(false);
    }
  };

  const Avatar = ({ size = "w-9 h-9" }: { size?: string }) => (
    <div className={`${size} rounded-full overflow-hidden bg-primary-soft text-primary flex items-center justify-center font-bold shrink-0`}>
      {photo && !imageError ? (
        <img
          src={photo}
          alt={displayName}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-lg">{initial}</span>
      )}
    </div>
  );

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full border-b border-line bg-canvas text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 lg:grid lg:h-20 lg:grid-cols-[1fr_auto_1fr]">
          <Link href={homeHref} onClick={closeMenus} className="inline-flex min-h-11 items-center gap-2.5 justify-self-start rounded-lg">
            <Image src="/Mentora.svg" alt="" width={40} height={40} className="size-8 object-contain lg:size-10" />
            <span className="text-2xl font-extrabold text-ink tracking-tight">Mentora</span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
            {visibleNavLinks.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenus}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                    active ? "bg-primary-soft text-primary" : "text-ink-secondary hover:bg-white hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Area akun: akun hanya muncul jika API mengembalikan user. */}
          <div className="hidden items-center justify-self-end lg:flex">
            {authLoading ? (
              <div className="h-12 w-48 rounded-full bg-canvas border border-line animate-pulse" />
            ) : profile ? (
              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((value) => !value)}
                  aria-expanded={accountOpen}
                  aria-controls="account-navigation"
                  className="flex items-center gap-3 px-4 py-2 rounded-full border border-line bg-surface shadow-2xs hover:bg-canvas transition"
                >
                  <Avatar />
                  <div className="text-left min-w-0">
                    <p className="text-sm font-bold text-ink max-w-[150px] truncate">{displayName}</p>
                    <p className="text-[11px] text-ink-muted font-bold">{role}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>

                {accountOpen && (
                  <div id="account-navigation" className="absolute right-0 top-full mt-3 w-60 rounded-2xl border border-line bg-white p-2 shadow-cloud">
                    <div className="px-3 py-3 border-b border-line mb-2 flex items-center gap-3">
                      <Avatar size="w-11 h-11" />
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-ink truncate">{displayName}</p>
                        <p className="text-xs text-ink-muted truncate">{profile.email || ""}</p>
                      </div>
                    </div>
                    {!isAdmin && <Link href="/profile" aria-current={pathname === "/profile" ? "page" : undefined} onClick={closeMenus} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-secondary hover:bg-canvas hover:text-primary aria-[current=page]:bg-primary-soft aria-[current=page]:text-primary transition">
                      <UserRound className="w-4 h-4 text-ink-muted" /> Profil Saya
                    </Link>}
                    <div className="my-1 border-t border-line" />
                    <button type="button" onClick={handleLogout} disabled={logoutLoading} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger-tint transition disabled:opacity-60">
                      <LogOut className="w-4 h-4" /> {logoutLoading ? "Keluar..." : "Keluar"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link href="/auth?tab=masuk" className="action-secondary inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold transition-colors">Masuk</Link>
                <Link href="/auth?tab=daftar" className="action-primary inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold transition-colors">Daftar</Link>
              </div>
            )}
          </div>

          <button type="button" onClick={() => setMobileOpen((value) => !value)} className="grid size-11 place-items-center rounded-xl border border-line text-ink-secondary hover:bg-primary-soft lg:hidden" aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"} aria-controls="mobile-navigation" aria-expanded={mobileOpen}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div id="mobile-navigation" className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-b-2xl border-y border-line bg-canvas p-4 shadow-cloud lg:hidden">
            <nav aria-label="Navigasi utama" className="flex flex-col gap-1">
              {visibleNavLinks.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={closeMenus} aria-current={active ? "page" : undefined} className={`px-4 py-3 rounded-xl text-sm font-semibold ${active ? "bg-primary-soft text-primary" : "text-ink-secondary hover:bg-canvas hover:text-ink"}`}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 pt-3 border-t border-line">
              {authLoading ? (
                <div className="mx-4 h-12 rounded-xl bg-canvas animate-pulse" />
              ) : profile ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-canvas rounded-xl">
                    <Avatar size="w-11 h-11" />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-ink truncate">{displayName}</p>
                      <p className="text-xs text-ink-muted">{role}</p>
                    </div>
                  </div>
                  {!isAdmin && <Link href="/profile" aria-current={pathname === "/profile" ? "page" : undefined} onClick={closeMenus} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-ink-secondary hover:bg-canvas aria-[current=page]:bg-primary-soft aria-[current=page]:text-primary">
                    <UserRound className="w-5 h-5" /> Profil Saya
                  </Link>}
                  <button type="button" onClick={handleLogout} disabled={logoutLoading} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-danger hover:bg-danger-tint disabled:opacity-60">
                    <LogOut className="w-5 h-5" /> {logoutLoading ? "Keluar..." : "Keluar"}
                  </button>
                </>
              ) : (
                <div className="grid gap-2">
                  <Link href="/auth?tab=masuk" onClick={closeMenus} className="action-secondary flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors">
                    <LogIn className="w-5 h-5" /> Masuk
                  </Link>
                  <Link href="/auth?tab=daftar" onClick={closeMenus} className="action-primary flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors">
                    <UserPlus className="w-5 h-5" /> Daftar Akun
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
