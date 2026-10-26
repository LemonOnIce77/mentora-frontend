'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Star, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

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
        }, 1200);
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
          setErrorMsg(data.message || 'Email atau password salah.');
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
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg('Terjadi kesalahan jaringan atau server.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Account Helper
  const fillDemoAccount = (roleEmail: string, rolePass: string) => {
    setActiveTab('masuk');
    setEmail(roleEmail);
    setPassword(rolePass);
    setErrorMsg('');
  };

  return (
    <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      
      {/* Left Column: Mentora Value Props & Graphics */}
      <div className="lg:col-span-6 space-y-8 pr-0 lg:pr-6">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 via-[#2563EB] to-indigo-500 flex items-center justify-center shadow-sm">
            <div className="grid grid-cols-2 gap-0.5">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
            </div>
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Mentora
          </span>
        </Link>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
            Belajar bareng, <br />
            tumbuh <span className="text-[#2563EB]">lebih jauh</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed max-w-lg">
            Mentora adalah platform peer-to-peer untuk menemukan teman belajar, bertukar skill, dan berkembang bersama.
          </p>
        </div>

        {/* 3 Value Propositions with Blue Star */}
        <div className="space-y-5 pt-2">
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
              <Star className="w-4 h-4 fill-[#2563EB]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Temukan teman belajar</h4>
              <p className="text-xs text-slate-500 mt-0.5">Dari kampus mana pun, untuk skill apa pun.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
              <Star className="w-4 h-4 fill-[#2563EB]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Tukar pengetahuan</h4>
              <p className="text-xs text-slate-500 mt-0.5">Belajar langsung dari sesama teman sebaya.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
              <Star className="w-4 h-4 fill-[#2563EB]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Kembangkan potensimu</h4>
              <p className="text-xs text-slate-500 mt-0.5">Bangun skill, portofolio, dan koneksi baru.</p>
            </div>
          </div>
        </div>

        {/* Bottom Badge Stickers */}
        <div className="pt-4 flex items-center justify-between max-w-md">
          <div className="font-handwriting text-3xl font-bold text-slate-800 -rotate-2">
            More Skills <br />
            Brighter Friends
          </div>

          <div className="w-32 h-32 rounded-full bg-[#2563EB] text-white p-3 flex flex-col items-center justify-center text-center shadow-lg rotate-6 hover:rotate-0 transition-transform">
            <p className="text-[11px] font-bold leading-tight">
              Skill baru ini <br />
              bisa jadi peluang <br />
              besar nanti! ✨
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Card with Masuk / Daftar Tabs */}
      <div className="lg:col-span-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-lg relative">
          
          {/* Top Tabs Switcher */}
          <div className="flex border-b border-slate-200 mb-8">
            <button
              type="button"
              onClick={() => handleTabChange('masuk')}
              className={`flex-1 pb-3 text-center text-sm font-bold transition-all relative ${
                activeTab === 'masuk'
                  ? 'text-[#2563EB]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Masuk
              {activeTab === 'masuk' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full"></span>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('daftar')}
              className={`flex-1 pb-3 text-center text-sm font-bold transition-all relative ${
                activeTab === 'daftar'
                  ? 'text-[#2563EB]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Daftar
              {activeTab === 'daftar' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full"></span>
              )}
            </button>
          </div>

          {/* Greeting */}
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              {activeTab === 'masuk' ? 'Selamat datang di Mentora! 👋' : 'Daftar akun Mentora! 🚀'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'masuk'
                ? 'Masuk untuk melanjutkan perjalanan belajarmu.'
                : 'Mulai perjalanan belajarmu bersama mahasiswa lainnya.'}
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
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Social Button */}
          <button
            type="button"
            onClick={() => {
              alert('Login dengan Google disimulasikan untuk prototipe akademik Mentora. Silakan gunakan form atau akun demo di bawah.');
            }}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-semibold shadow-sm transition hover:bg-slate-50"
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
            <span>{activeTab === 'masuk' ? 'Masuk dengan Google' : 'Daftar dengan Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative px-3 bg-white text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              atau {activeTab === 'masuk' ? 'masuk' : 'daftar'} dengan email
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
                  placeholder="mis. Sulthoni Prima Rafasya"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
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
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                {activeTab === 'masuk' && (
                  <button
                    type="button"
                    onClick={() => alert('Fitur reset password dapat diakses melalui tim helpdesk Mentora.')}
                    className="text-[11px] text-[#2563EB] hover:underline font-semibold"
                  >
                    Lupa password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password kamu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] pr-10"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
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

          {/* Green Notification Callout Banner from Mockup */}
          <div className="mt-6 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
            <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
              ✓
            </div>
            <p>
              <span className="font-bold text-emerald-900">Kamu akan bergabung sebagai mentee (mahasiswa).</span> Kamu bisa mengajukan diri menjadi mentor dari halaman profil.
            </p>
          </div>

          {/* Footer switcher */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {activeTab === 'masuk' ? (
              <p>
                Belum punya akun?{' '}
                <button
                  onClick={() => handleTabChange('daftar')}
                  className="font-bold text-[#2563EB] hover:underline"
                >
                  Daftar sekarang
                </button>
              </p>
            ) : (
              <p>
                Sudah punya akun?{' '}
                <button
                  onClick={() => handleTabChange('masuk')}
                  className="font-bold text-[#2563EB] hover:underline"
                >
                  Masuk di sini
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Selector for Reviewers / QA testing */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
              Login Sebagai:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@mentora.com', 'admin123')}
                className="py-1.5 px-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold border border-purple-200 truncate transition"
                title="Admin (Verifikasi Mentor)"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('sulthoni@mentora.com', 'password123')}
                className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold border border-emerald-200 truncate transition"
                title="Mentor Terverifikasi (Sulthoni)"
              >
                ⭐ Mentor
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('budi@mentora.com', 'password123')}
                className="py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-[11px] font-semibold border border-blue-200 truncate transition"
                title="Mentee Pemohon Mentor (Budi)"
              >
                🌱 Mentee
              </button>
            </div>
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
          <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
        </div>
      }>
        <AuthContent />
      </Suspense>
    </div>
  );
}