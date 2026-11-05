'use client';

import React, { useEffect, useState, useRef } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  User, 
  LogOut, 
  Settings, 
  LayoutDashboard, 
  Moon, 
  Sun, 
  ChevronDown,
  BookOpen
} from 'lucide-react';

interface CurrentUser {
  id: number;
  namaLengkap: string;
  namaPanggilan?: string;
  email: string;
  role: string;
  statusMentor: string;
  totalPoin: number;
  fotoProfil?: string;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync theme on mount
  useEffect(() => {
    const isDarkTheme = 
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDark(isDarkTheme);
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    window.addEventListener('mentora-theme-change', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);
    return () => {
      window.removeEventListener('mentora-theme-change', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  // Fetch logged in user
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new Event('mentora-theme-change'));
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {}
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_session');
    } catch (_) {}
    setUser(null);
    setIsMenuOpen(false);
    router.push('/auth');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAFB]/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <NextLink href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 via-[#2563EB] to-indigo-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <div className="grid grid-cols-2 gap-0.5">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
            </div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
            Mentora
          </span>
        </NextLink>

        {/* Center Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <NextLink href="/" className="text-[#2563EB] dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            Beranda
          </NextLink>
          <NextLink href="/#tentang" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Tentang
          </NextLink>
          <NextLink href="/#fitur" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Fitur
          </NextLink>
          <NextLink href="/#testimoni" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Testimoni
          </NextLink>
          <NextLink href="/#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            FAQ
          </NextLink>
          {user && (
            <NextLink href="/dashboard" className="text-slate-900 dark:text-white font-semibold flex items-center gap-1 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors">
              <LayoutDashboard className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
              Dashboard
            </NextLink>
          )}
        </nav>

        {/* Auth & Account CTA buttons */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-28 h-9 bg-slate-200/60 dark:bg-slate-800 rounded-full animate-pulse"></div>
          ) : user ? (
            /* Akun Pojok Kanan Atas: "Budi | Mentee" dengan Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-all focus:outline-none"
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
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-[#2563EB] dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    {(user.namaPanggilan || user.namaLengkap).charAt(0)}
                  </div>
                )}
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                  {user.namaPanggilan || user.namaLengkap.split(' ')[0]}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    user.role === 'Admin'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80'
                      : user.statusMentor === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80'
                      : 'bg-blue-50 text-[#2563EB] dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80'
                  }`}
                >
                  {user.role === 'Admin' ? 'Admin' : user.statusMentor === 'APPROVED' ? 'Mentor' : 'Mentee'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                    isMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu Modal */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-72 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Header info akun */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    {user.fotoProfil ? (
                      <img
                        src={user.fotoProfil}
                        alt={user.namaLengkap}
                        className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-100 to-blue-200 dark:from-blue-950 dark:to-indigo-950 text-[#2563EB] dark:text-blue-400 flex items-center justify-center font-bold text-base shadow-xs">
                        {(user.namaPanggilan || user.namaLengkap).charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.namaLengkap}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {user.email}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#2563EB] dark:text-blue-300">
                          {user.role === 'Admin' ? '👑 Admin Mentora' : user.statusMentor === 'APPROVED' ? '⭐ Mentor Resmi' : '🎓 Mentee'}
                        </span>
                        {user.totalPoin > 0 && (
                          <span className="text-[10px] font-semibold text-slate-400">
                            • {user.totalPoin} Poin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigasi Menu: Dashboard, Settings, Skills */}
                  <div className="space-y-1">
                    <NextLink
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                      <span>Dashboard Belajar</span>
                    </NextLink>

                    <NextLink
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>Settings & Profil Akun</span>
                    </NextLink>

                    <NextLink
                      href="/skills"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Kelola Skill Exchange</span>
                    </NextLink>
                  </div>

                  {/* Switch Dark Mode Row */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {isDark ? (
                        <Moon className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Sun className="w-4 h-4 text-amber-500" />
                      )}
                      <span>{isDark ? 'Mode Gelap' : 'Mode Terang'}</span>
                    </div>

                    {/* Toggle Switch Component */}
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isDark ? 'bg-[#2563EB]' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                      aria-label="Switch Dark Mode"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isDark ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Tombol Logout */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Mode Guest (Belum Login): Toggle tema + Tombol Masuk / Daftar */
            <>
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
                className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Toggle Mode Gelap/Terang"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              <NextLink
                href="/auth?tab=masuk"
                className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Masuk
              </NextLink>
              <NextLink
                href="/auth?tab=daftar"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-full shadow-sm hover:shadow transition-all"
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
