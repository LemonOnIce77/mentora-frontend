'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2, ShieldCheck, BookOpen, Users } from 'lucide-react';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'daftar' ? 'daftar' : 'masuk';

  const [activeTab, setActiveTab] = useState<'masuk' | 'daftar'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'daftar' || tab === 'masuk') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'masuk' | 'daftar') => {
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'budi@mentora.com', password: 'password123' }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('✓ Berhasil masuk dengan Akun Kampus! Mengarahkan...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 900);
      } else {
        setErrorMsg(data.message || 'Gagal masuk dengan Google.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kendala jaringan saat menghubungkan ke akun Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (activeTab === 'daftar') {
        if (!namaLengkap || !email || !password) {
          setErrorMsg('Semua kolom wajib diisi.');
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMsg('Konfirmasi password tidak cocok.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ namaLengkap, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || 'Registrasi gagal. Silakan coba lagi.');
          setLoading(false);
          return;
        }

        setSuccessMsg('Akun berhasil dibuat! Mengarahkan ke Onboarding...');
        setTimeout(() => {
          router.push('/onboarding');
        }, 1100);
      } else {
        // Login flow
        if (!email || !password) {
          setErrorMsg('Email dan password wajib diisi.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || 'Email atau password yang Anda masukkan salah.');
          setLoading(false);
          return;
        }

        setSuccessMsg('Login berhasil! Mengarahkan...');
        setTimeout(() => {
          if (!data.user.onboardingCompleted && data.user.role !== 'Admin') {
            router.push('/onboarding');
          } else {
            router.push('/dashboard');
          }
        }, 900);
      }
    } catch (err: any) {
      setErrorMsg('Terjadi kendala pada server autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      
      {/* Left Column: Context & Real Student Social Proof */}
      <div className="lg:col-span-6 space-y-8 pr-0 lg:pr-6">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
            M
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Mentora
            </span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold text-slate-400 border-l border-slate-300 pl-2">
              Peer Skill Exchange
            </span>
          </div>
        </Link>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
            Tukar keahlian, <br />
            tumbuh <span className="text-blue-600">bersama teman.</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg">
            Masuk ke platform kolaboratif mahasiswa Telkom University. Temukan partner belajar, saling bimbing, dan kumpulkan EduPoints resmi.
          </p>
        </div>

        {/* Real Value Pillars */}
        <div className="space-y-4 pt-1 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              1
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Barter 1-on-1 Seimbang</h4>
              <p className="text-slate-500 mt-0.5">Satu jam kamu membimbing keahlianmu, satu jam kamu menerima materi dari rekan.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Verifikasi Dokumen Akademik</h4>
              <p className="text-slate-500 mt-0.5">Transkrip nilai dan portofolio resmi ditinjau verifikator sebelum status mentor aktif.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Klaim EduPoints & Portofolio</h4>
              <p className="text-slate-500 mt-0.5">Kumpulkan poin reputasi untuk sertifikat kompetensi keaktifan mahasiswa.</p>
            </div>
          </div>
        </div>

        {/* Student Testimonial Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs max-w-md space-y-2.5">
          <p className="text-xs text-slate-600 leading-relaxed italic">
            "Semester lalu saya terbantu memahami query SQL praktikum dari mahasiswa Informatika, dan saya gantian mengajarinya dasar pembuatan prototipe Figma untuk proyek tugas akhirnya."
          </p>
          <div className="flex items-center gap-2.5 pt-1 border-t border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80"
              alt="Aulia"
              className="w-7 h-7 rounded-full object-cover"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 block">Aulia Rahisa</span>
              <span className="text-[10px] text-slate-400">Mahasiswa DKV • Telkom University</span>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Card with Masuk / Daftar Tabs */}
      <div className="lg:col-span-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-lg relative">
          
          {/* Top Tabs Switcher */}
          <div className="flex border-b border-slate-200 mb-8">
            <button
              type="button"
              onClick={() => handleTabChange('masuk')}
              className={`flex-1 pb-3 text-center text-sm font-bold transition-all relative ${
                activeTab === 'masuk'
                  ? 'text-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Masuk
              {activeTab === 'masuk' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('daftar')}
              className={`flex-1 pb-3 text-center text-sm font-bold transition-all relative ${
                activeTab === 'daftar'
                  ? 'text-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Daftar
              {activeTab === 'daftar' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Greeting */}
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {activeTab === 'masuk' ? 'Selamat datang kembali' : 'Buat akun Mentora'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'masuk'
                ? 'Gunakan akun mahasiswa terdaftar untuk masuk.'
                : 'Mulai kolaborasi belajar bersama rekan mahasiswa Telkom University.'}
            </p>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Social Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-semibold shadow-xs transition hover:bg-slate-50 disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{activeTab === 'masuk' ? 'Masuk dengan Akun Kampus (SSO)' : 'Daftar dengan Akun Kampus'}</span>
          </button>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative px-3 bg-white text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              atau gunakan email mahasiswa
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'daftar' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="mis. Budi Santoso"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                {activeTab === 'masuk' && (
                  <span className="text-[11px] text-slate-400">
                    Minimal 6 karakter
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password kamu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {activeTab === 'daftar' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password kamu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs transition flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{activeTab === 'masuk' ? 'Masuk' : 'Daftar Sekarang'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer switcher */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {activeTab === 'masuk' ? (
              <p>
                Belum punya akun?{' '}
                <button
                  onClick={() => handleTabChange('daftar')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Daftar sekarang
                </button>
              </p>
            ) : (
              <p>
                Sudah punya akun?{' '}
                <button
                  onClick={() => handleTabChange('masuk')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Masuk di sini
                </button>
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }>
        <AuthContent />
      </Suspense>
    </div>
  );
}
