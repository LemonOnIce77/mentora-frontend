'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Compass, BookOpen, GraduationCap } from 'lucide-react';

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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAFB]/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <NextLink href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-blue-700 transition">
            M
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Mentora
            </span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold text-slate-400 border-l border-slate-300 pl-2">
              Peer Skill Exchange
            </span>
          </div>
        </NextLink>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <NextLink href="/" className="hover:text-blue-600 transition-colors">
            Beranda
          </NextLink>
          <NextLink href="/skills" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Katalog Keahlian</span>
          </NextLink>
          <NextLink href="/mentor/apply" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-slate-400" />
            <span>Daftar Mentor</span>
          </NextLink>
          {user && (
            <NextLink href="/dashboard" className="text-slate-900 font-bold flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
              <span>Dashboard</span>
            </NextLink>
          )}
        </nav>

        {/* User Session Actions */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-9 bg-slate-200/60 rounded-full animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <NextLink
                href="/dashboard"
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition"
              >
                {user.fotoProfil ? (
                  <img src={user.fotoProfil} alt={user.namaLengkap} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {(user.namaPanggilan || user.namaLengkap).charAt(0)}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-800">
                  {user.namaPanggilan || user.namaLengkap.split(' ')[0]}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  user.role === 'Admin'
                    ? 'bg-purple-100 text-purple-700'
                    : user.statusMentor === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  {user.role === 'Admin' ? 'Admin' : user.statusMentor === 'APPROVED' ? 'Mentor' : 'Mentee'}
                </span>
              </NextLink>

              <button
                onClick={handleLogout}
                title="Keluar dari akun"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <NextLink
                href="/auth?tab=masuk"
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Masuk
              </NextLink>
              <NextLink
                href="/auth?tab=daftar"
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs transition-all"
              >
                Daftar Akun
              </NextLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
