"use client";

import React, { useEffect, useState, useRef } from "react";
import NextLink from "next/link";
import MentoraLogo from "@/components/MentoraLogo";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Moon,
  Sun,
  ChevronDown,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

interface CurrentUser {
  id: number | string;
  namaLengkap: string;
  namaPanggilan?: string;
  email: string;
  role: string;
  statusMentor: string;
  totalPoin?: number;
  fotoProfil?: string;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync tema bawaan Mentora
  useEffect(() => {
    const isDarkTheme =
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDark(isDarkTheme);
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    window.addEventListener("mentora-theme-change", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("mentora-theme-change", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  // Sync sesi user dengan fallback lokal
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        } else {
          const sessionData = localStorage.getItem("user_session");
          if (sessionData) {
            try {
              setUser(JSON.parse(sessionData));
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      })
      .catch(() => {
        const sessionData = localStorage.getItem("user_session");
        if (sessionData) {
          try {
            setUser(JSON.parse(sessionData));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Tutup dropdown saat klik luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new Event("mentora-theme-change"));
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (_) {}
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_session");
    } catch (_) {}
    setUser(null);
    setIsMenuOpen(false);
    router.push("/auth");
    router.refresh();
  };

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Sisi Kiri: Logo Icon 4 Titik & Nama Brand Mentora */}
        <NextLink href="/" className="flex items-center gap-2.5 group">
          <div className="group-hover:scale-105 transition-transform">
            <MentoraLogo size={32} />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-black group-hover:text-[#2563EB] transition-colors">
            Mentora
          </span>
        </NextLink>

        {/* Tengah: Navigasi Teks Hitam Pekat */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-black">
          <NextLink
            href="/"
            className="text-[#2563EB] hover:text-blue-700 transition-colors"
          >
            Beranda
          </NextLink>
          <NextLink
            href="/tentang"
            className="hover:text-[#2563EB] transition-colors"
          >
            Tentang
          </NextLink>
          <NextLink
            href="/#fitur"
            className="hover:text-[#2563EB] transition-colors"
          >
            Fitur
          </NextLink>
          <NextLink
            href="/testimoni"
            className="hover:text-[#2563EB] transition-colors"
          >
            Testimoni
          </NextLink>
          <NextLink
            href="/faq"
            className="hover:text-[#2563EB] transition-colors"
          >
            FAQ
          </NextLink>
          {user && (
            <NextLink
              href="/dashboard"
              className="text-black font-bold flex items-center gap-1.5 hover:text-[#2563EB] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[#2563EB]" />
              Dashboard
            </NextLink>
          )}
        </nav>

        {/* Sisi Kanan: Auth & Account Dropdown */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-28 h-9 bg-slate-200 rounded-full animate-pulse"></div>
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-slate-300 hover:border-black shadow-sm transition-all focus:outline-none"
                aria-expanded={isMenuOpen}
                aria-label="Menu Akun dan Pengaturan"
              >
                {user.fotoProfil ? (
                  <img
                    src={user.fotoProfil}
                    alt={user.namaLengkap}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-xs">
                    {(user.namaPanggilan || user.namaLengkap)
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-bold text-black max-w-[120px] truncate">
                  {user.namaPanggilan || user.namaLengkap.split(" ")[0]}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isAdmin
                      ? "bg-purple-100 text-purple-800 border border-purple-300"
                      : user.statusMentor === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-blue-100 text-[#2563EB] border border-blue-200"
                  }`}
                >
                  {isAdmin
                    ? "Admin"
                    : user.statusMentor === "APPROVED"
                      ? "Mentor"
                      : "Mentee"}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-black transition-transform duration-200 ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu Modal */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-72 rounded-3xl bg-white border border-slate-200 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Header Info Akun */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    {user.fotoProfil ? (
                      <img
                        src={user.fotoProfil}
                        alt={user.namaLengkap}
                        className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-base shadow-xs">
                        {(user.namaPanggilan || user.namaLengkap)
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold text-black truncate">
                        {user.namaLengkap}
                      </p>
                      <p className="text-[11px] text-slate-600 truncate">
                        {user.email}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#2563EB]">
                          {isAdmin
                            ? "👑 Admin Mentora"
                            : user.statusMentor === "APPROVED"
                              ? "⭐ Mentor Resmi"
                              : "🎓 Mentee"}
                        </span>
                        {typeof user.totalPoin === "number" &&
                          user.totalPoin > 0 && (
                            <span className="text-[10px] font-bold text-black">
                              • {user.totalPoin} Poin
                            </span>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Navigasi Dropdown */}
                  <div className="space-y-1">
                    <NextLink
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:bg-slate-100 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#2563EB]" />
                      <span>Dashboard Belajar</span>
                    </NextLink>

                    {isAdmin && (
                      <NextLink
                        href="/admin/verifikasi-mentor"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Verifikasi Mentor (Admin)</span>
                      </NextLink>
                    )}

                    <NextLink
                      href="/dashboard?tab=profil"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:bg-slate-100 transition"
                    >
                      <Settings className="w-4 h-4 text-black" />
                      <span>Pengaturan & Profil Akun</span>
                    </NextLink>

                    <NextLink
                      href="/dashboard?tab=katalog"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:bg-slate-100 transition"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Katalog Skill Exchange</span>
                    </NextLink>
                  </div>

                  {/* Switch Dark Mode */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-black">
                      {isDark ? (
                        <Moon className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <Sun className="w-4 h-4 text-amber-500" />
                      )}
                      <span>{isDark ? "Mode Gelap" : "Mode Terang"}</span>
                    </div>

                    <button
                      type="button"
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isDark ? "bg-[#2563EB]" : "bg-slate-300"
                      }`}
                      aria-label="Switch Dark Mode"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isDark ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 pt-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleTheme}
                title={
                  isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"
                }
                className="p-2 rounded-full text-black hover:bg-slate-100 transition"
                aria-label="Toggle Mode Gelap/Terang"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              <NextLink
                href="/auth?tab=masuk"
                className="px-5 py-2 text-sm font-bold text-black hover:text-[#2563EB] transition-colors"
              >
                Masuk
              </NextLink>
              <NextLink
                href="/auth?tab=daftar"
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-full shadow-sm hover:shadow transition-all"
              >
                Daftar
              </NextLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
