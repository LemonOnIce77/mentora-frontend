"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MentoraLogo from "@/components/MentoraLogo";
import { useSession } from "@/components/SessionProvider";
import { accountHome } from "@/lib/account-home";
import { logoutTo } from "@/lib/logout";
import { Camera, Info, Lightbulb, Loader2 } from "lucide-react";
import { ArrowRight, ArrowLeft, Check, CheckCircle2, Upload, Plus } from "@/components/animated-icons";

const PRESET_SKILLS = [
  "UI/UX Design",
  "Figma",
  "Programming",
  "Data Analysis",
  "Public Speaking",
  "English",
  "Marketing",
  "Design Thinking",
  "Web Development",
  "Business Management",
  "Machine Learning",
  "Graphic Design",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile } = useSession();
  const home = profile ? accountHome(profile) : undefined;
  const returnHref = home && home !== "/onboarding" ? home : "/dashboard";
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  // Step 1: Data Diri State
  // Nama lengkap dapat diambil dari data registrasi; data profil lainnya diisi pengguna.
  const [namaLengkap, setNamaLengkap] = useState("");
  const [namaPanggilan, setNamaPanggilan] = useState("");
  const [universitas, setUniversitas] = useState("");
  const [prodi, setProdi] = useState("");
  const [semester, setSemester] = useState("");
  const [domisili, setDomisili] = useState("");
  const [tglLahir, setTglLahir] = useState("");
  const [bio, setBio] = useState("");
  const [fotoProfil, setFotoProfil] = useState<string>("");

  // Step 2: Minat & Skill State
  // Pengguna memilih sendiri skill yang ingin dipelajari dan yang sudah dikuasai.
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>([]);
  const [skillsPossessed, setSkillsPossessed] = useState<string[]>([]);
  const [modeSesi, setModeSesi] = useState<"Online" | "Offline" | "Fleksibel">(
    "Fleksibel",
  );
  const [customSkillInput, setCustomSkillInput] = useState("");

  // Fetch current user if logged in

  useEffect(() => {
    let active = true;

    const loadUserData = async () => {
      try {
        // Ambil profil terbaru dari database
        const res = await fetch("/api/profile");

        if (res.status === 401) {
          if (active) router.replace("/auth?tab=masuk");
          return;
        }

        if (!res.ok) {
          throw new Error("Gagal mengambil profil");
        }

        const data = await res.json();
        const user = data.profile;

        if (!active || !user) return;

        setNamaLengkap(user.namaLengkap ?? "");
        setNamaPanggilan(user.namaPanggilan ?? "");
        setUniversitas(user.universitas ?? "");
        setProdi(user.prodi ?? "");
        setSemester(user.semester ?? "");
        setDomisili(user.domisili ?? "");
        setTglLahir(user.tglLahir ?? "");
        setBio(user.bio ?? "");
        setFotoProfil(user.fotoProfil ?? "");

        if (user.modeSesi) {
          setModeSesi(user.modeSesi);
        }

        // Ambil skill pengguna
        const skillRes = await fetch("/api/profile/skills");

        if (skillRes.ok) {
          const skillData = await skillRes.json();

          if (!active) return;

          setSkillsToLearn(
            (skillData.skillsToLearn ?? []).map(
              (skill: any) => skill.namaSkill,
            ),
          );

          setSkillsPossessed(
            (skillData.skillsPossessed ?? []).map(
              (skill: any) => skill.namaSkill,
            ),
          );
        }
      } catch (error) {
        console.error("Gagal memuat data onboarding:", error);
      } finally {
        if (active) setInitialLoading(false);
      }
    };

    loadUserData();

    return () => {
      active = false;
    };
  }, [router]);

  // Handle Photo Upload simulated / FileReader
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran foto maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoProfil(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (leaving || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/profile/onboarding/step1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaLengkap,
          namaPanggilan,
          universitas,
          prodi,
          semester,
          domisili,
          tglLahir,
          bio,
          fotoProfil,
        }),
      });
      if (res.ok) {
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert("Gagal menyimpan profil.");
      }
    } catch (err) {
      alert("Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  const toggleLearnSkill = (skill: string) => {
    setSkillsToLearn((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const togglePossessedSkill = (skill: string) => {
    setSkillsPossessed((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    const s = customSkillInput.trim();
    if (!skillsToLearn.includes(s)) {
      setSkillsToLearn((prev) => [...prev, s]);
    }
    setCustomSkillInput("");
  };

  const handleFinalSubmit = async () => {
    if (leaving || loading) return;
    if (skillsToLearn.length === 0) {
      alert("Pilih minimal 1 skill yang ingin kamu pelajari.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/profile/onboarding/step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillsToLearn,
          skillsPossessed,
          modeSesi,
        }),
      });

      if (res.ok) {
        window.location.replace("/dashboard");
      } else {
        alert("Gagal menyelesaikan onboarding.");
      }
    } catch (err) {
      alert("Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  const leaveAccount = async () => {
    if (leaving || loading) return;
    setLeaving(true);
    setLogoutError("");
    try {
      await logoutTo("/auth?tab=masuk");
    } catch {
      setLogoutError("Gagal keluar dari akun. Coba lagi.");
      setLeaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Top Header with Stepper */}
      <header className="border-b border-line bg-canvas sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 min-h-16 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 lg:min-h-20">
          <a href={returnHref} aria-label="Mentora" className="inline-flex min-h-11 items-center gap-2 rounded-lg">
            <MentoraLogo />
            <span className="text-2xl font-extrabold tracking-tight text-ink">
              Mentora
            </span>
          </a>

          {/* Stepper Progress bar matching mockup */}
          <div className="order-last flex w-full items-center justify-center gap-2 pb-1 text-xs font-semibold sm:gap-4 md:order-none md:w-auto md:pb-0">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === 1
                    ? "bg-primary text-white"
                    : "bg-primary-soft text-primary"
                }`}
              >
                {currentStep === 2 ? "✓" : "1"}
              </div>
              <span
                className={
                  currentStep === 1
                    ? "text-ink font-bold"
                    : "text-ink-muted"
                }
              >
                Data Diri
              </span>
            </div>

            <div className="w-3 sm:w-16 h-0.5 bg-line"></div>

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === 2
                    ? "bg-primary text-white"
                    : "bg-line text-ink-secondary"
                }`}
              >
                2
              </div>
              <span
                className={
                  currentStep === 2
                    ? "text-ink font-bold"
                    : "text-ink-muted"
                }
              >
                Minat &amp; Skill
              </span>
            </div>

            <div className="w-3 sm:w-16 h-0.5 bg-line"></div>

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-line text-ink-secondary flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span className="text-ink-muted hidden sm:inline">Selesai</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {profile && <span className="hidden max-w-40 truncate text-xs text-ink-muted lg:block" title={profile.email}>{profile.email}</span>}
            <button type="button" onClick={leaveAccount} disabled={leaving || loading}
              className="action-secondary inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold">
              {leaving ? "Sedang keluar…" : "Keluar dari akun"}
            </button>
          </div>
        </div>
        {logoutError && <p role="alert" className="mx-auto max-w-6xl px-4 pb-2 text-right text-sm text-danger">{logoutError}</p>}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10">
        {initialLoading && (
          <div role="status" className="flex items-center justify-center gap-3 py-12 text-sm text-ink-muted">
            <Loader2 aria-hidden="true" className="size-5 animate-spin text-primary" /> Memuat profil Mentora...
          </div>
        )}
        {/* ================= STEP 1: DATA DIRI ================= */}
        {!initialLoading && currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Context & Guidelines */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-canvas text-primary border border-line text-xs font-bold tracking-wider uppercase">
                LANGKAH 1 DARI 2
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
                Yuk, lengkapi <br />
                data dirimu!
              </h1>

              <p className="text-sm text-ink-muted leading-relaxed">
                Data ini membantu Mentora memberi rekomendasi partner dan sesi
                belajar yang lebih relevan.
              </p>

              <div className="pt-2 font-handwriting text-2xl font-bold text-ink -rotate-2">
                Satu langkah lagi <br />
                menuju versi terbaik <br />
                dirimu!
              </div>

              {/* Informative Card */}
              <div className="p-5 rounded-2xl bg-surface border border-line shadow-sm space-y-2.5">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-primary" />
                  Kenapa data ini penting?
                </h4>
                <ul className="text-xs text-ink-muted space-y-1.5 pl-1">
                  <li>• Rekomendasi partner belajar lebih relevan</li>
                  <li>• Pencocokan kampus &amp; jurusan sesuai kurikulum</li>
                  <li>
                    • Pengalaman belajar tatap muka / daring lebih personal
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Form (Informasi Profil) */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleStep1Submit}
                className="bg-surface rounded-3xl p-8 border border-line shadow-sm space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-ink">
                    Informasi Profil
                  </h2>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Mulai dengan informasi dasar tentang dirimu.
                  </p>
                </div>

                {/* Foto Profil Upload */}
                <div>
                  <label className="block text-xs font-bold text-ink-secondary mb-2">
                    Foto Profil
                  </label>
                  <div className="flex items-center gap-5">
                    <div className="relative group">
                      {fotoProfil ? (
                        <img
                          src={fotoProfil}
                          alt="Avatar"
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-line shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-canvas border-2 border-dashed border-line flex items-center justify-center text-ink-muted">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-canvas hover:bg-line/30 border border-line text-xs font-semibold text-ink-secondary transition">
                        <Upload className="w-3.5 h-3.5 text-primary" />
                        <span>Klik untuk upload foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-ink-muted mt-1">
                        JPG, PNG maks. 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2-Columns Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink-secondary mb-1">
                      Nama Lengkap <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      placeholder="mis. Aulia Rahisa Putri"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-secondary mb-1">
                      Nama Panggilan <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={namaPanggilan}
                      onChange={(e) => setNamaPanggilan(e.target.value)}
                      placeholder="mis. Aulia"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-secondary mb-1">
                      Universitas <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={universitas}
                      onChange={(e) => setUniversitas(e.target.value)}
                      placeholder="mis. Universitas Telkom"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-secondary mb-1">
                      Program Studi <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={prodi}
                      onChange={(e) => setProdi(e.target.value)}
                      placeholder="mis. Desain Komunikasi Visual"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-secondary mb-1">
                      Semester <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      placeholder="mis. 4 (Semester Empat)"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-secondary mb-1">
                      Domisili <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={domisili}
                      onChange={(e) => setDomisili(e.target.value)}
                      placeholder="mis. Depok, Jawa Barat"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-secondary mb-1">
                    Tanggal Lahir <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={tglLahir}
                    onChange={(e) => setTglLahir(e.target.value)}
                    placeholder="mis. 14 Agustus 2003"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-secondary mb-1">
                    Bio Singkat
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tuliskan perkenalan singkat mengenai dirimu..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none resize-none"
                  />
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 flex flex-wrap items-center gap-2 border-t border-line">
                  {returnHref && (
                    <Link
                      href={returnHref}
                      className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs font-bold text-ink shadow-2xs transition hover:border-primary hover:text-primary hover:bg-primary-soft/30 active:scale-[0.98]"
                    >
                      <ArrowLeft className="size-4 shrink-0 text-primary" />
                      <span>
                        {returnHref === "/admin"
                          ? "Kembali ke portal admin"
                          : "Kembali ke dashboard"}
                      </span>
                    </Link>
                  )}

                  <button
                    type="submit"
                    disabled={loading || leaving}
                    className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-xl action-primary text-xs font-bold shadow-md transition disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    <span>Lanjut ke Minat &amp; Skill</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= STEP 2: MINAT & SKILL ================= */}
        {!initialLoading && currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Area: Skill Selectors */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-canvas text-primary border border-line text-xs font-bold tracking-wider uppercase mb-2">
                  PILIH AKTIVITAS KEMAMPUAN LEBIH CEPAT
                </div>
                <h1 className="text-3xl font-extrabold text-ink">
                  Pilih skill yang ingin kamu pelajari
                </h1>
                <p className="text-xs text-ink-muted mt-1">
                  Pilih minimal 1 (disarankan 3) agar rekomendasi teman belajar
                  di Mentora lebih tepat.
                </p>
              </div>

              {/* Section 1: Skill yang Ingin Dipelajari */}
              <div className="bg-surface rounded-3xl p-7 border border-line shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    Skill yang Ingin Kamu Pelajari
                  </h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Pilih skill yang sedang ingin kamu kuasai saat ini.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {PRESET_SKILLS.map((skill) => {
                    const isSelected = skillsToLearn.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleLearnSkill(skill)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-canvas text-ink border-2 border-primary shadow-xs"
                            : "bg-canvas text-ink-secondary border border-line hover:border-ink-muted"
                        }`}
                      >
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        )}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Skill */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    placeholder="Tambah skill lain..."
                    className="px-3.5 py-1.5 rounded-xl border border-line text-xs focus:ring-1 focus:ring-primary-accent outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3 py-1.5 rounded-xl bg-canvas hover:bg-line/30 text-ink-secondary border border-line text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Section 2: Skill yang Sudah Dimiliki */}
              <div className="bg-surface rounded-3xl p-7 border border-line/80 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    Skill yang Sudah Kamu Miliki
                  </h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Boleh dipilih lebih dari satu. Ini membantu pencocokan skill
                    dua arah (barter ilmu).
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {PRESET_SKILLS.map((skill) => {
                    const isSelected = skillsPossessed.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => togglePossessedSkill(skill)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-primary-soft text-primary border-2 border-primary shadow-xs"
                            : "bg-canvas text-ink-secondary border border-line hover:border-subtle"
                        }`}
                      >
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        )}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Mode Sesi yang Disukai */}
              <div className="bg-surface rounded-3xl p-7 border border-line shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    Mode Sesi yang Kamu Sukai
                  </h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Pilih preferensi pelaksanaan sesi belajar.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {(["Online", "Offline", "Fleksibel"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setModeSesi(mode)}
                      className={`py-3 px-4 rounded-xl text-xs font-bold text-center border transition-all ${
                        modeSesi === mode
                          ? "border-primary bg-canvas text-ink shadow-xs"
                          : "border-line bg-surface text-ink-secondary hover:bg-canvas"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs font-bold text-ink shadow-2xs transition hover:border-primary hover:text-primary active:scale-[0.98]"
                >
                  <ArrowLeft className="size-4 shrink-0" />
                  <span>Kembali ke Data Diri</span>
                </button>
              </div>
            </div>

            {/* Right Column: Tips & Complete Action */}
            <div className="lg:col-span-4 space-y-5">
              <div className="rounded-3xl border border-line bg-canvas p-6 text-ink">
                <div className="relative z-10 space-y-4">
                  <h3 className="text-lg font-black leading-snug">
                    Mulai perjalanan <br />
                    belajarmu hari ini <br />
                    bareng Mentora!
                  </h3>
                  <div className="font-handwriting text-2xl font-bold -rotate-2 text-ink-secondary">
                    More Skills Brighter Friends
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-canvas border border-line text-xs text-ink space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-ink">
                  <Lightbulb className="w-3.5 h-3.5 text-primary" />
                  <span>Tips Belajar</span>
                </div>
                <p className="leading-relaxed">
                  Fokus dulu ke skill yang benar-benar ingin kamu pelajari.
                  Pilihan ini bisa diubah kapan saja lewat halaman Profil.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-canvas border border-line text-xs text-ink space-y-2">
                <h4 className="font-bold text-ink">
                  Tips memilih skill:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-ink-secondary leading-relaxed">
                  <li>Pilih minat yang paling relevan</li>
                  <li>Kelompokkan skill yang sudah kamu kuasai</li>
                  <li>Sesuaikan mode sesi sesuai kenyamananmu</li>
                </ol>
              </div>

              {/* Final Complete Button */}
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading || leaving}
                className="w-full py-4 px-6 rounded-2xl action-primary text-sm font-bold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Selesai &amp; Masuk Mentora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
