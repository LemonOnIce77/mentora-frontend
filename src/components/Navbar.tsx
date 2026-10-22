'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <NextLink href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1E40AF] via-[#2563EB] to-teal-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            {/* Clover / Star shape icon matching mockup */}
            <div className="grid grid-cols-2 gap-0.5">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
            </div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#2563EB] transition-colors">
            Mentora
          </span>
        </NextLink>

        {/* Center Nav links matching mockup */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <NextLink href="/" className="text-[#2563EB] font-semibold hover:text-[#1E40AF] transition-colors">
            Beranda
          </NextLink>
          <NextLink href="/#tentang" className="hover:text-slate-900 transition-colors">
            Tentang
          </NextLink>
          <NextLink href="/#fitur" className="hover:text-slate-900 transition-colors">
            Fitur
          </NextLink>
          <NextLink href="/#testimoni" className="hover:text-slate-900 transition-colors">
            Testimoni
          </NextLink>
          <NextLink href="/#faq" className="hover:text-slate-900 transition-colors">
            FAQ
          </NextLink>
          {user && (
            <NextLink href="/dashboard" className="text-slate-900 font-semibold flex items-center gap-1 hover:text-[#2563EB] transition-colors">
              <LayoutDashboard className="w-4 h-4 text-[#2563EB]" />
              Dashboard
            </NextLink>
          )}
        </nav>

        {/* Auth CTA buttons matching mockup */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-20 h-9 bg-slate-200/60 rounded-full animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <NextLink
                href="/dashboard"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition"
              >
                {user.fotoProfil ? (
                  <img src={user.fotoProfil} alt={user.namaLengkap} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-xs">
                    {(user.namaPanggilan || user.namaLengkap).charAt(0)}
                  </div>
                )}
                <span className="text-sm font-semibold text-slate-800">
                  {user.namaPanggilan || user.namaLengkap.split(' ')[0]}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  user.role === 'Admin'
                    ? 'bg-indigo-100 text-indigo-700'
                    : user.statusMentor === 'APPROVED'
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-blue-50 text-[#2563EB]'
                }`}>
                  {user.role === 'Admin' ? 'Admin' : user.statusMentor === 'APPROVED' ? 'Mentor' : 'Mentee'}
                </span>
              </NextLink>

              <button
                onClick={handleLogout}
                title="Keluar"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <NextLink
                href="/auth?tab=masuk"
                className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Masuk
              </NextLink>
              <NextLink
                href="/auth?tab=daftar"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1E40AF] rounded-full shadow-sm hover:shadow transition-all"
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