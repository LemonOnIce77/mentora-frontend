"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown, LayoutDashboard, UserRound, Menu, X, LogIn, LogOut, UserPlus, MessageSquare, Calendar, ShieldCheck,
} from "lucide-react";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/tentang" },
  { label: "Fitur", href: "/#fitur" },
  { label: "Testimoni", href: "/testimoni" },
  { label: "FAQ", href: "/faq" },
];

const adminNavLinks = [
  { label: "Dashboard Admin", href: "/dashboard" },
  { label: "Portal Admin", href: "/admin" },
];

interface CurrentUser {
  id?: number;
  namaLengkap?: string;
  namaPanggilan?: string;
  email?: string;
  fotoProfil?: string | null;
  foto_profil?: string | null;
  role?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [profile, setProfile] = useState<CurrentUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Navbar, Beranda, dan Tentang memakai satu endpoint autentikasi.
  const loadProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        setProfile(null);
        setImageError(false);
        return;
      }

      const result = await response.json();
      setProfile(result?.user ?? null);
      setImageError(false);
    } catch (error) {
      console.error("Gagal memeriksa sesi pengguna:", error);
      setProfile(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();

    const refreshAuth = () => void loadProfile();
    window.addEventListener("auth-changed", refreshAuth);
    window.addEventListener("profile-updated", refreshAuth);
    window.addEventListener("focus", refreshAuth);

    return () => {
      window.removeEventListener("auth-changed", refreshAuth);
      window.removeEventListener("profile-updated", refreshAuth);
      window.removeEventListener("focus", refreshAuth);
    };
  }, [loadProfile, pathname]);

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [pathname]);

  const displayName =
    profile?.namaLengkap || profile?.namaPanggilan || "Pengguna Mentora";
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";
  const photo = profile?.fotoProfil || profile?.foto_profil || null;
  const role = profile?.role || "Pengguna Mentora";
  const isAdmin = profile?.role === "Admin";
  const visibleNavLinks = isAdmin ? adminNavLinks : navLinks;

  const isActive = (href: string) => {
    if (href === "/#fitur") return pathname === "/" && activeHash === "#fitur";
    if (href === "/") return pathname === "/" && activeHash !== "#fitur";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const closeMenus = () => {
    setMobileOpen(false);
    setAccountOpen(false);
  };

  const handleNavigation = (href: string) => {
    setActiveHash(href === "/#fitur" ? "#fitur" : "");
    closeMenus();
  };

  const handleLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Logout gagal.");

      setProfile(null);
      setImageError(false);
      closeMenus();
      window.dispatchEvent(new Event("auth-changed"));
      window.location.replace("/");
    } catch (error) {
      console.error("Gagal logout:", error);
      alert("Gagal keluar dari akun. Silakan coba kembali.");
      setLogoutLoading(false);
    }
  };

  const Avatar = ({ size = "w-9 h-9" }: { size?: string }) => (
    <div className={`${size} rounded-full overflow-hidden bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold shrink-0`}>
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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          <Link href="/" onClick={() => handleNavigation("/")} className="flex items-center gap-2.5 shrink-0">
            <Image src="/Mentora.svg" alt="Mentora Logo" width={40} height={40} className="object-contain" />
            <span className="text-2xl font-extrabold text-slate-950 tracking-tight">Mentora</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {visibleNavLinks.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavigation(item.href)}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm font-bold transition-colors duration-200 ${active ? "text-[#2563EB]" : "text-slate-900 hover:text-[#2563EB]"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Area akun: akun hanya muncul jika API mengembalikan user. */}
          <div className="hidden lg:flex items-center">
            {authLoading ? (
              <div className="h-12 w-48 rounded-full bg-slate-100 animate-pulse" />
            ) : profile ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((value) => !value)}
                  aria-expanded={accountOpen}
                  className="flex items-center gap-3 px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition"
                >
                  <Avatar />
                  <div className="text-left min-w-0">
                    <p className="text-sm font-bold text-slate-900 max-w-[150px] truncate">{displayName}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">{role}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-full mt-3 w-60 bg-white rounded-2xl border border-slate-200 shadow-xl p-2">
                    <div className="px-3 py-3 border-b border-slate-100 mb-2 flex items-center gap-3">
                      <Avatar size="w-11 h-11" />
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate">{displayName}</p>
                        <p className="text-xs text-slate-500 truncate">{profile.email || ""}</p>
                      </div>
                    </div>
                    {!isAdmin && <Link href="/profile" onClick={closeMenus} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-[#2563EB]">
                      <UserRound className="w-4 h-4" /> Profil Saya
                    </Link>}
                    <Link href="/dashboard" onClick={closeMenus} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-[#2563EB]">
                      <LayoutDashboard className="w-4 h-4" /> {isAdmin ? "Dashboard Admin" : "Dashboard"}
                    </Link>
                    {isAdmin ? <Link href="/admin" onClick={closeMenus} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-purple-700 hover:bg-purple-50">
                      <ShieldCheck className="w-4 h-4" /> Portal Admin
                    </Link> : <Link href="/chat" onClick={closeMenus} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-[#2563EB]">
                      <MessageSquare className="w-4 h-4" /> Pesan & Diskusi
                    </Link>}
                    <button type="button" onClick={handleLogout} disabled={logoutLoading} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 disabled:opacity-60">
                      <LogOut className="w-4 h-4" /> {logoutLoading ? "Keluar..." : "Keluar"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth?tab=masuk" className="px-4 py-2 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">Masuk</Link>
                <Link href="/auth?tab=daftar" className="px-5 py-2.5 rounded-full bg-[#2563EB] text-white text-sm font-bold hover:bg-blue-700 transition">Daftar</Link>
              </div>
            )}
          </div>

          <button type="button" onClick={() => setMobileOpen((value) => !value)} className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100" aria-label="Buka menu navigasi" aria-expanded={mobileOpen}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 py-4">
            <nav className="flex flex-col gap-1">
              {visibleNavLinks.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={() => handleNavigation(item.href)} className={`px-4 py-3 rounded-xl text-sm font-semibold ${active ? "bg-blue-50 text-[#2563EB]" : "text-slate-700 hover:bg-slate-50"}`}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 pt-3 border-t border-slate-100">
              {authLoading ? (
                <div className="mx-4 h-12 rounded-xl bg-slate-100 animate-pulse" />
              ) : profile ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-slate-50 rounded-xl">
                    <Avatar size="w-11 h-11" />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">{displayName}</p>
                      <p className="text-xs text-emerald-600">{role}</p>
                    </div>
                  </div>
                  {!isAdmin && <Link href="/profile" onClick={closeMenus} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <UserRound className="w-5 h-5" /> Profil Saya
                  </Link>}
                  <Link href="/dashboard" onClick={closeMenus} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#2563EB] hover:bg-blue-50">
                    <LayoutDashboard className="w-5 h-5" /> {isAdmin ? "Dashboard Admin" : "Dashboard"}
                  </Link>
                  {isAdmin ? <Link href="/admin" onClick={closeMenus} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-purple-700 hover:bg-purple-50">
                    <ShieldCheck className="w-5 h-5" /> Portal Admin
                  </Link> : <Link href="/chat" onClick={closeMenus} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <MessageSquare className="w-5 h-5" /> Pesan & Diskusi
                  </Link>}
                  <button type="button" onClick={handleLogout} disabled={logoutLoading} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60">
                    <LogOut className="w-5 h-5" /> {logoutLoading ? "Keluar..." : "Keluar"}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth?tab=masuk" onClick={closeMenus} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <LogIn className="w-5 h-5" /> Masuk
                  </Link>
                  <Link href="/auth?tab=daftar" onClick={closeMenus} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#2563EB] hover:bg-blue-50">
                    <UserPlus className="w-5 h-5" /> Daftar Akun
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
