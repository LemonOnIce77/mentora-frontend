
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import {
  ChevronDown,
  LayoutDashboard,
  UserRound,
  Menu,
  X,
  LogIn,
} from 'lucide-react';

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'Fitur', href: '/#fitur' },
  { label: 'Testimoni', href: '/testimoni' },
  { label: 'FAQ', href: '/faq' },
];

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  // Membaca hash URL dan memperbarui menu aktif
  useEffect(() => {
    const syncHash = () => {
      setActiveHash(window.location.hash);
    };

    syncHash();

    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);

    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
    };
  }, [pathname]);

  // Menentukan menu yang sedang aktif
  const isActive = (href: string) => {
    if (href === '/#fitur') {
      return pathname === '/' && activeHash === '#fitur';
    }

    if (href === '/') {
      return pathname === '/' && activeHash !== '#fitur';
    }

    return pathname === href || pathname.startsWith(href + '/');
  };

  const closeMenus = () => {
    setMobileOpen(false);
    setAccountOpen(false);
  };

  const handleNavigation = (href: string) => {
    setActiveHash(href === '/#fitur' ? '#fitur' : '');
    closeMenus();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-20 flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link
            href="/"
            onClick={() => handleNavigation('/')}
            className="flex items-center gap-2.5 shrink-0"
          >
            <Image
              src="/Mentora.svg"
              alt="Mentora Logo"
              width={40}
              height={40}
              className="object-contain"
            />

            <span className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Mentora
            </span>
          </Link>

          {/* NAVBAR DESKTOP */}
          <nav className="hidden lg:flex items-center gap-8">

            {navLinks.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavigation(item.href)}
                  aria-current={active ? 'page' : undefined}
                  className={`text-sm font-bold transition-colors duration-200 ${
                    active
                      ? 'text-[#2563EB]'
                      : 'text-slate-900 hover:text-[#2563EB]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

          </nav>

          {/* DASHBOARD DAN AKUN */}
          <div className="hidden lg:flex items-center gap-5">

            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-bold text-slate-950 hover:text-[#2563EB] transition"
            >
              <LayoutDashboard className="w-5 h-5 text-[#2563EB]" />
              Dashboard
            </Link>

            <div className="relative">

              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                aria-expanded={accountOpen}
                className="flex items-center gap-3 px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition"
              >

                <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
                  M
                </div>

                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">
                    Akun
                  </p>

                  <p className="text-[11px] text-emerald-600 font-semibold">
                    Pengguna Mentora
                  </p>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${
                    accountOpen ? 'rotate-180' : ''
                  }`}
                />

              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full mt-3 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl p-2">

                  <Link
                    href="/profile"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-[#2563EB]"
                  >
                    <UserRound className="w-4 h-4" />
                    Profil Saya
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-[#2563EB]"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  <Link
                    href="/auth"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:text-[#2563EB]"
                  >
                    <LogIn className="w-4 h-4" />
                    Masuk / Ganti Akun
                  </Link>

                </div>
              )}

            </div>
          </div>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            aria-label="Buka menu navigasi"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

        </div>

        {/* MOBILE NAVIGATION */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 py-4">

            <nav className="flex flex-col gap-1">

              {navLinks.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold ${
                      active
                        ? 'bg-blue-50 text-[#2563EB]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

            </nav>

            <div className="mt-3 pt-3 border-t border-slate-100">

              <Link
                href="/dashboard"
                onClick={closeMenus}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#2563EB] hover:bg-blue-50"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>

              <Link
                href="/profile"
                onClick={closeMenus}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <UserRound className="w-5 h-5" />
                Profil Saya
              </Link>

            </div>
          </div>
        )}

      </div>
    </header>
  );
}
