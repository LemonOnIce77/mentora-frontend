'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sun, 
  Moon, 
  User, 
  LayoutDashboard, 
  LogOut, 
  ChevronDown,
  ShieldCheck
} from 'lucide-react';

export default function FloatingProfileMenu() {
  const router = useRouter();
  
  // 1. Deklarasi seluruh State & Ref di posisi paling atas
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<{ namaLengkap?: string; email?: string; role?: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fungsi pembaca sesi dari localStorage
  const syncUserSession = () => {
    const sessionData = localStorage.getItem('user_session');
    if (sessionData) {
      try {
        setUser(JSON.parse(sessionData));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  // 2. Hook inisialisasi tema & sesi
  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    syncUserSession();
  }, []);

  // 3. Hook klik di luar area modal (Wajib ditaruh sebelum return)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 4. Handler fungsi
  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_session');
    setUser(null);
    router.push('/auth');
    setIsOpen(false);
  };

  // 5. Early return HANYA boleh ditaruh setelah seluruh hooks selesai dipanggil
  if (!mounted) {
    return null;
  }

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  return (
    <div ref={menuRef} className="fixed top-4 right-4 z-50">
      {/* Floating Pill / Trigger Button */}
      <button
        type="button"
        onClick={() => {
          syncUserSession(); // Segarkan data sesi saat tombol diklik
          setIsOpen((prev) => !prev);
        }}
        className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all focus:outline-none"
        aria-label="Menu Profil & Tema"
      >
        <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-xs">
          {user?.namaLengkap ? user.namaLengkap.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
        </div>
        
        <span className="hidden sm:inline-block text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[110px] truncate">
          {user?.namaLengkap || 'Akun Saya'}
        </span>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-64 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Info User */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.namaLengkap || 'Pengguna Mentora'}
              </p>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                  isAdmin
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400'
                }`}
              >
                {user?.role || 'GUEST'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {user?.email || 'Belum masuk akun'}
            </p>
          </div>

          {/* Switch Dark Mode Bar */}
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
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isDark ? 'bg-[#2563EB]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isDark ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Navigasi Cepat */}
          <div className="space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <LayoutDashboard className="w-4 h-4 text-[#2563EB]" />
              <span>Dashboard Belajar</span>
            </Link>

            <Link
              href="/admin/verifikasi-mentor"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verifikasi Mentor (Admin)</span>
            </Link>
          </div>

          {/* Tombol Logout */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Sesi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}