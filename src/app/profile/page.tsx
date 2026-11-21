"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Camera, AlertCircle, Loader2, Navigation } from "lucide-react";
import {
  User,
  MapPin,
  GraduationCap,
  Upload,
  Check,
  CheckCircle2,
  ArrowLeft,
} from "@/components/animated-icons";
import LocationPicker from "@/components/LocationPicker";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Profile Form States
  const [namaLengkap, setNamaLengkap] = useState("");
  const [namaPanggilan, setNamaPanggilan] = useState("");
  const [email, setEmail] = useState("");
  const [universitas, setUniversitas] = useState("");
  const [prodi, setProdi] = useState("");
  const [semester, setSemester] = useState("");
  const [domisili, setDomisili] = useState("");
  const [bio, setBio] = useState("");
  const [fotoProfil, setFotoProfil] = useState("");
  const [modeSesi, setModeSesi] = useState("Fleksibel");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [role, setRole] = useState("Mentee");
  const [statusMentor, setStatusMentor] = useState("NONE");
  const [totalPoin, setTotalPoin] = useState(0);

  // Load profile from API (SCRUM-95)
  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/auth");
          return;
        }
        throw new Error("Gagal memuat profil");
      }
      const data = await res.json();
      const p = data.profile;
      if (p) {
        setNamaLengkap(p.namaLengkap || "");
        setNamaPanggilan(p.namaPanggilan || "");
        setEmail(p.email || "");
        setUniversitas(p.universitas || "");
        setProdi(p.prodi || "");
        setSemester(p.semester || "");
        setDomisili(p.domisili || "");
        setBio(p.bio || "");
        setFotoProfil(p.fotoProfil || "");
        setModeSesi(p.modeSesi || "Fleksibel");
        setLatitude(p.latitude ?? null);
        setLongitude(p.longitude ?? null);
        setRole(p.role || "Mentee");
        setStatusMentor(p.statusMentor || "NONE");
        setTotalPoin(p.totalPoin || 0);
      }
    } catch (err) {
      setErrorMsg("Gagal mengambil data profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // SCRUM-98: Mengambil lokasi melalui geolokasi browser (Nearby Feature)
  const handleDetectBrowserLocation = () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!navigator.geolocation) {
      setErrorMsg("Browser Anda tidak mendukung fitur Geolocation API.");
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
          setDomisili("Bandung, Jawa Barat");
        }
        setDetectingGps(false);
        setSuccessMsg(
          `✓ Koordinat GPS berhasil dideteksi: (${lat}, ${lng}). Siap untuk fitur nearby peer-finder!`,
        );
      },
      (error) => {
        setDetectingGps(false);
        const defaultLat = -6.974;
        const defaultLng = 107.6303;
        setLatitude(defaultLat);
        setLongitude(defaultLng);
        if (!domisili) setDomisili("Dayeuhkolot, Bandung");
        setSuccessMsg(
          `Koordinat otomatis dialihkan ke kampus (-6.9740, 107.6303) karena izin lokasi browser belum aktif.`,
        );
      },
      { timeout: 8000 },
    );
  };

  // Upload Foto Profil
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg("Ukuran foto maksimal 2MB");
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
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
        window.dispatchEvent(new Event("profile-updated"));
        setSuccessMsg(
          "✓ Data profil berhasil diperbarui dan tersimpan ke sistem!",
        );
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data.message || "Gagal menyimpan profil.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan koneksi server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-3 text-ink-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-semibold">Memuat profil mahasiswa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {/* Navigation link back to dashboard */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs font-bold text-ink shadow-2xs transition hover:border-primary hover:text-primary hover:bg-primary-soft/30 active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
            <span>Kembali ke Dashboard Mentora</span>
          </Link>
        </div>

        {/* Profile Card Header */}
        <div className="bg-surface rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-line shadow-soft-card mb-6 sm:mb-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          <div className="relative group">
            {fotoProfil ? (
              <img
                src={fotoProfil}
                alt={namaLengkap}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl object-cover border border-line shadow-xs"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-primary text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-xs">
                {(namaPanggilan || namaLengkap || "M").charAt(0)}
              </div>
            )}
            <label className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 p-1.5 sm:p-2 action-primary rounded-xl shadow-md cursor-pointer transition">
              <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-ink">
                {namaLengkap}
              </h1>
              <span
                className={`text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 rounded-full ${
                  statusMentor === "APPROVED"
                    ? "bg-success-tint text-success border border-success-soft"
                    : "bg-canvas text-ink-secondary border border-line"
                }`}
              >
                {statusMentor === "APPROVED"
                  ? "Mentor Terverifikasi"
                  : "Mentee / Mahasiswa"}
              </span>
            </div>
            <p className="text-xs text-ink-muted">{email}</p>
            <p className="text-xs text-ink-secondary font-medium pt-0.5 sm:pt-1">
              {prodi} • {universitas} (Semester {semester})
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-success-tint border border-line text-ink-secondary text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-danger-tint border border-danger-soft text-danger text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Edit Profil (SCRUM-97 & SCRUM-98) */}
        <form
          onSubmit={handleSaveProfile}
          className="bg-surface rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-line shadow-soft-card space-y-5 sm:space-y-6"
        >
          <div>
            <h2 className="text-xl font-bold text-ink">
              Manajemen Profil Pengguna
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Kelola data pribadi agar teman belajar mudah mengenalmu dan sistem
              dapat memberikan rekomendasi teman terdekat.
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-ink-secondary mb-1.5">
              Lokasi Domisili (Untuk Sesi Offline / Fleksibel)
            </label>
            <LocationPicker
              onLocationDetected={(loc) => {
                console.log("Koordinat:", loc.latitude, loc.longitude);
                console.log("Kota:", loc.kota);
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-ink-secondary mb-1.5">
                Nama Lengkap <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-line text-sm text-ink focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-secondary mb-1.5">
                Nama Panggilan
              </label>
              <input
                type="text"
                value={namaPanggilan}
                onChange={(e) => setNamaPanggilan(e.target.value)}
                placeholder="mis. Garda"
                className="w-full px-4 py-2.5 rounded-xl border border-line text-sm text-ink focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-secondary mb-1.5">
                Universitas
              </label>
              <input
                type="text"
                value={universitas}
                onChange={(e) => setUniversitas(e.target.value)}
                placeholder="mis. Universitas Telkom"
                className="w-full px-4 py-2.5 rounded-xl border border-line text-sm text-ink focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-secondary mb-1.5">
                Program Studi
              </label>
              <input
                type="text"
                value={prodi}
                onChange={(e) => setProdi(e.target.value)}
                placeholder="mis. S1 Sistem Informasi"
                className="w-full px-4 py-2.5 rounded-xl border border-line text-sm text-ink focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-secondary mb-1.5">
                Semester
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="mis. 5 (Ganjil)"
                className="w-full px-4 py-2.5 rounded-xl border border-line text-sm text-ink focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
              />
            </div>

            {/* Domisili & Browser Geolocation API (SCRUM-98) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-ink-secondary">
                  Domisili & Lokasi (Nearby)
                </label>
                <button
                  type="button"
                  onClick={handleDetectBrowserLocation}
                  disabled={detectingGps}
                  className="text-[11px] font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition"
                  title="Deteksi lokasi via Geolocation API browser"
                >
                  <Navigation className="w-3 h-3" />
                  <span>
                    {detectingGps ? "Mendeteksi..." : "Deteksi GPS Browser"}
                  </span>
                </button>
              </div>
              <input
                type="text"
                value={domisili}
                onChange={(e) => setDomisili(e.target.value)}
                placeholder="mis. Bandung, Jawa Barat"
                className="w-full px-4 py-2.5 rounded-xl border border-line text-sm text-ink focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
              />
              {latitude && longitude && (
                <p className="text-[11px] text-ink-secondary font-semibold mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-ink-muted" />
                  <span>
                    Koordinat Nearby: {latitude}, {longitude}
                  </span>
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-ink-secondary mb-1.5">
              Deskripsi Diri / Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ceritakan latar belakang akademik, minat, atau topik yang kamu kuasai..."
              className="w-full px-4 py-2.5 rounded-xl border border-line text-sm text-ink focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none resize-none"
            />
          </div>
          {/* Mode Sesi Pilihan */}
          <div>
            <label className="block text-xs font-bold text-ink-secondary mb-2">
              Mode Sesi Belajar yang Disukai
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Online", "Offline", "Fleksibel"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModeSesi(m)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
                    modeSesi === m
                      ? "border-primary bg-primary-tint/70 text-primary"
                      : "border-line bg-surface text-ink-secondary hover:bg-canvas"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          {/* Submit Button */}
          <div className="pt-4 border-t border-line flex items-center justify-between">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-ink-muted hover:bg-canvas transition"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl action-primary text-xs font-bold shadow-xs hover:shadow-md transition flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4 stroke-[3]" />
              )}
              <span>Simpan Perubahan Profil</span>
            </button>
          </div>
        </form>
      </main>

      <Footer workspace />
    </div>
  );
}
