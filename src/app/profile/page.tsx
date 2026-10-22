'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  MapPin,
  Camera,
  Check,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Navigation,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Profile Form States
  const [namaLengkap, setNamaLengkap] = useState('');
  const [namaPanggilan, setNamaPanggilan] = useState('');
  const [email, setEmail] = useState('');
  const [universitas, setUniversitas] = useState('');
  const [prodi, setProdi] = useState('');
  const [semester, setSemester] = useState('');
  const [domisili, setDomisili] = useState('');
  const [bio, setBio] = useState('');
  const [fotoProfil, setFotoProfil] = useState('');
  const [modeSesi, setModeSesi] = useState('Fleksibel');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [role, setRole] = useState('Mentee');
  const [statusMentor, setStatusMentor] = useState('NONE');
  const [totalPoin, setTotalPoin] = useState(0);

  // Load profile from API (SCRUM-95: Data profil tampil kembali saat halaman dibuka)
  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth');
          return;
        }
        throw new Error('Gagal memuat profil');
      }
      const data = await res.json();
      const p = data.profile;
      if (p) {
        setNamaLengkap(p.namaLengkap || '');
        setNamaPanggilan(p.namaPanggilan || '');
        setEmail(p.email || '');
        setUniversitas(p.universitas || '');
        setProdi(p.prodi || '');
        setSemester(p.semester || '');
        setDomisili(p.domisili || '');
        setBio(p.bio || '');
        setFotoProfil(p.fotoProfil || '');
        setModeSesi(p.modeSesi || 'Fleksibel');
        setLatitude(p.latitude ?? null);
        setLongitude(p.longitude ?? null);
        setRole(p.role || 'Mentee');
        setStatusMentor(p.statusMentor || 'NONE');
        setTotalPoin(p.totalPoin || 0);
      }
    } catch (err) {
      setErrorMsg('Gagal mengambil data profil.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // SCRUM-98: Mengambil lokasi melalui geolokasi browser (Nearby Feature)
  const handleDetectBrowserLocation = () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!navigator.geolocation) {
      setErrorMsg('Browser Anda tidak mendukung fitur Geolocation API.');
      return;
    }

    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        if (!domisili) {
          setDomisili('Bandung, Jawa Barat');
        }
        setDetectingGps(false);
        setSuccessMsg(`✓ Koordinat GPS berhasil dideteksi: (${lat}, ${lng}). Siap untuk fitur nearby peer-finder!`);
      },
      (error) => {
        setDetectingGps(false);
        // Fallback default coordinates for Telkom University Bandung
        const defaultLat = -6.9740;
        const defaultLng = 107.6303;
        setLatitude(defaultLat);
        setLongitude(defaultLng);
        if (!domisili) setDomisili('Dayeuhkolot, Bandung');
        setSuccessMsg(`Koordinat otomatis dialihkan ke kampus (-6.9740, 107.6303) karena izin lokasi browser belum aktif.`);
      },
      { timeout: 8000 }
    );
  };

  // Upload Foto Profil
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Ukuran foto maksimal 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoProfil(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // SCRUM-96: Simpan pembaruan data profil
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaLengkap,
          namaPanggilan,
          universitas,
          prodi,
          semester,
          domisili,
          bio,
          fotoProfil,
          modeSesi,
          latitude,
          longitude,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('✓ Data profil berhasil diperbarui dan tersimpan ke sistem!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.message || 'Gagal menyimpan profil.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi server.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
          <p className="text-sm font-semibold">Memuat profil mahasiswa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        
        {/* Navigation link back to dashboard */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Mentora</span>
          </Link>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            {fotoProfil ? (
              <img
                src={fotoProfil}
                alt={namaLengkap}
                className="w-24 h-24 rounded-3xl object-cover border-2 border-blue-100 shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-3xl">
                {(namaPanggilan || namaLengkap || 'M').charAt(0)}
              </div>
            )}
            <label className="absolute -bottom-2 -right-2 p-2 bg-[#2563EB] hover:bg-[#1E40AF] text-white rounded-xl shadow-md cursor-pointer transition">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl font-extrabold text-slate-900">{namaLengkap}</h1>
              <span
                className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                  statusMentor === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-blue-50 text-[#2563EB] border border-blue-200'
                }`}
              >
                {statusMentor === 'APPROVED' ? '⭐ Mentor Terverifikasi' : '🎓 Mentee / Mahasiswa'}
              </span>
            </div>
            <p className="text-xs text-slate-500">{email}</p>
            <p className="text-xs text-slate-600 font-medium pt-1">
              {prodi} • {universitas} (Semester {semester})
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Edit Profil (SCRUM-97 & SCRUM-98) */}
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Manajemen Profil Pengguna (FR-02)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola data pribadi agar teman belajar mudah mengenalmu dan sistem dapat memberikan rekomendasi teman terdekat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap <span className="text-[#2563EB]">*</span>
              </label>
              <input
                type="text"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Panggilan
              </label>
              <input
                type="text"
                value={namaPanggilan}
                onChange={(e) => setNamaPanggilan(e.target.value)}
                placeholder="mis. Garda"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Universitas
              </label>
              <input
                type="text"
                value={universitas}
                onChange={(e) => setUniversitas(e.target.value)}
                placeholder="mis. Universitas Telkom"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Program Studi
              </label>
              <input
                type="text"
                value={prodi}
                onChange={(e) => setProdi(e.target.value)}
                placeholder="mis. S1 Sistem Informasi"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Semester
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="mis. 5 (Ganjil)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none"
              />
            </div>

            {/* Domisili & Browser Geolocation API (SCRUM-98) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Domisili & Lokasi (Nearby)
                </label>
                <button
                  type="button"
                  onClick={handleDetectBrowserLocation}
                  disabled={detectingGps}
                  className="text-[11px] font-bold text-[#2563EB] hover:text-[#1E40AF] flex items-center gap-1 transition"
                  title="Deteksi lokasi via Geolocation API browser"
                >
                  <Navigation className="w-3 h-3" />
                  <span>{detectingGps ? 'Mendeteksi...' : 'Deteksi GPS Browser'}</span>
                </button>
              </div>
              <input
                type="text"
                value={domisili}
                onChange={(e) => setDomisili(e.target.value)}
                placeholder="mis. Bandung, Jawa Barat"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none"
              />
              {latitude && longitude && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>Koordinat Nearby: {latitude}, {longitude}</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Deskripsi Diri / Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ceritakan latar belakang akademik, minat, atau topik yang kamu kuasai..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none resize-none"
            />
          </div>

          {/* Mode Sesi Pilihan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Mode Sesi Belajar yang Disukai
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Online', 'Offline', 'Fleksibel'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModeSesi(m)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
                    modeSesi === m
                      ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 stroke-[3]" />}
              <span>Simpan Perubahan Profil (FR-02)</span>
            </button>
          </div>
        </form>

      </main>

      <Footer />
    </div>
  );
}