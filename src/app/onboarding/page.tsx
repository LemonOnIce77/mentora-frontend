'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Camera,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Info,
  Lightbulb,
  Upload,
  Plus,
  Loader2,
} from 'lucide-react';

const PRESET_SKILLS = [
  'UI/UX Design',
  'Figma',
  'Programming',
  'Data Analysis',
  'Public Speaking',
  'English',
  'Marketing',
  'Design Thinking',
  'Web Development',
  'Business Management',
  'Machine Learning',
  'Graphic Design',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Step 1: Data Diri State (defaults initialized from mockup example)
  const [namaLengkap, setNamaLengkap] = useState('Aulia Rahisa Putri');
  const [namaPanggilan, setNamaPanggilan] = useState('Aulia');
  const [universitas, setUniversitas] = useState('Universitas Telkom');
  const [prodi, setProdi] = useState('Desain Komunikasi Visual');
  const [semester, setSemester] = useState('4 (Semester Empat)');
  const [domisili, setDomisili] = useState('Depok, Jawa Barat');
  const [tglLahir, setTglLahir] = useState('14 Agustus 2003');
  const [bio, setBio] = useState('Mahasiswa DKV yang tertarik dengan desain, branding, dan pengembangan UI.');
  const [fotoProfil, setFotoProfil] = useState<string>('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80');

  // Step 2: Minat & Skill State
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>(['UI/UX Design', 'Design Thinking']);
  const [skillsPossessed, setSkillsPossessed] = useState<string[]>(['Figma', 'UI/UX Design']);
  const [modeSesi, setModeSesi] = useState<'Online' | 'Offline' | 'Fleksibel'>('Online');
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Fetch current user if logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/auth');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.user) {
          if (data.user.namaLengkap) setNamaLengkap(data.user.namaLengkap);
          if (data.user.namaPanggilan) setNamaPanggilan(data.user.namaPanggilan);
          if (data.user.universitas) setUniversitas(data.user.universitas);
          if (data.user.prodi) setProdi(data.user.prodi);
          if (data.user.semester) setSemester(data.user.semester);
          if (data.user.domisili) setDomisili(data.user.domisili);
          if (data.user.tglLahir) setTglLahir(data.user.tglLahir);
          if (data.user.bio) setBio(data.user.bio);
          if (data.user.fotoProfil) setFotoProfil(data.user.fotoProfil);
          if (data.user.modeSesi) setModeSesi(data.user.modeSesi);

          // User skills if available
          if (data.user.skills && data.user.skills.length > 0) {
            const learn = data.user.skills
              .filter((s: any) => s.tipe === 'LEARN')
              .map((s: any) => s.skill.namaSkill);
            const teach = data.user.skills
              .filter((s: any) => s.tipe === 'TEACH')
              .map((s: any) => s.skill.namaSkill);
            if (learn.length) setSkillsToLearn(learn);
            if (teach.length) setSkillsPossessed(teach);
          }
        }
      })
      .finally(() => setInitialLoading(false));
  }, [router]);

  // Handle Photo Upload simulated / FileReader
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran foto maksimal 2MB');
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
    setLoading(true);
    try {
      const res = await fetch('/api/profile/onboarding/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Gagal menyimpan profil.');
      }
    } catch (err) {
      alert('Terjadi kesalahan pada server.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLearnSkill = (skill: string) => {
    setSkillsToLearn((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const togglePossessedSkill = (skill: string) => {
    setSkillsPossessed((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    const s = customSkillInput.trim();
    if (!skillsToLearn.includes(s)) {
      setSkillsToLearn((prev) => [...prev, s]);
    }
    setCustomSkillInput('');
  };

  const handleFinalSubmit = async () => {
    if (skillsToLearn.length === 0) {
      alert('Pilih minimal 1 skill yang ingin kamu pelajari.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/profile/onboarding/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillsToLearn,
          skillsPossessed,
          modeSesi,
        }),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('Gagal menyelesaikan onboarding.');
      }
    } catch (err) {
      alert('Terjadi kesalahan pada server.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#ED3875]" />
          <p className="text-sm font-semibold">Memuat profil Mentora...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFB] flex flex-col">
      {/* Top Header with Stepper */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
            </div>
            <span className="text-xl font-extrabold text-slate-900">Mentora</span>
          </Link>

          {/* Stepper Progress bar matching mockup */}
          <div className="flex items-center gap-3 sm:gap-6 text-xs font-semibold">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === 1
                    ? 'bg-[#ED3875] text-white'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {currentStep === 2 ? '✓' : '1'}
              </div>
              <span className={currentStep === 1 ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                Data Diri
              </span>
            </div>

            <div className="w-8 sm:w-16 h-0.5 bg-slate-200"></div>

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === 2
                    ? 'bg-[#ED3875] text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                2
              </div>
              <span className={currentStep === 2 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                Minat & Skill
              </span>
            </div>

            <div className="w-8 sm:w-16 h-0.5 bg-slate-200"></div>

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span className="text-slate-400 hidden sm:inline">Selesai</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10">
        
        {/* ================= STEP 1: DATA DIRI (03 Mockup) ================= */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Context & Guidelines */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-rose-50 text-[#ED3875] text-xs font-bold tracking-wider uppercase">
                LANGKAH 1 DARI 2
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Yuk, lengkapi <br />
                data dirimu!
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed">
                Data ini membantu Mentora memberi rekomendasi partner dan sesi belajar yang lebih relevan.
              </p>

              <div className="pt-2 font-handwriting text-2xl font-bold text-slate-800 -rotate-2">
                Satu langkah lagi <br />
                menuju versi terbaik <br />
                dirimu! 🚀
              </div>

              {/* Informative Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-600" />
                  Kenapa data ini penting?
                </h4>
                <ul className="text-xs text-slate-500 space-y-1.5 pl-1">
                  <li>• Rekomendasi partner belajar lebih relevan</li>
                  <li>• Pencocokan kampus & jurusan sesuai kurikulum</li>
                  <li>• Pengalaman belajar tatap muka / daring lebih personal</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Form (Informasi Profil) */}
            <div className="lg:col-span-7">
              <form onSubmit={handleStep1Submit} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
                
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Informasi Profil</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Mulai dengan informasi dasar tentang dirimu.</p>
                </div>

                {/* Foto Profil Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Foto Profil</label>
                  <div className="flex items-center gap-5">
                    <div className="relative group">
                      {fotoProfil ? (
                        <img
                          src={fotoProfil}
                          alt="Avatar"
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-rose-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition">
                        <Upload className="w-3.5 h-3.5 text-[#ED3875]" />
                        <span>Klik untuk upload foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-slate-400 mt-1">JPG, PNG maks. 2MB</p>
                    </div>
                  </div>
                </div>

                {/* 2-Columns Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      placeholder="mis. Aulia Rahisa Putri"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#ED3875]/30 focus:border-[#ED3875] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Panggilan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={namaPanggilan}
                      onChange={(e) => setNamaPanggilan(e.target.value)}
                      placeholder="mis. Aulia"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#ED3875]/30 focus:border-[#ED3875] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Universitas <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={universitas}
                      onChange={(e) => setUniversitas(e.target.value)}
                      placeholder="mis. Universitas Telkom"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#ED3875]/30 focus:border-[#ED3875] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Program Studi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={prodi}
                      onChange={(e) => setProdi(e.target.value)}
                      placeholder="mis. Desain Komunikasi Visual"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#ED3875]/30 focus:border-[#ED3875] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Semester <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      placeholder="mis. 4 (Semester Empat)"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#ED3875]/30 focus:border-[#ED3875] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Domisili <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={domisili}
                      onChange={(e) => setDomisili(e.target.value)}
                      placeholder="mis. Depok, Jawa Barat"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#ED3875]/30 focus:border-[#ED3875] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Lahir <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tglLahir}
                    onChange={(e) => setTglLahir(e.target.value)}
                    placeholder="mis. 14 Agustus 2003"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#ED3875]/30 focus:border-[#ED3875] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bio Singkat
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tuliskan perkenalan singkat mengenai dirimu..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#ED3875]/30 focus:border-[#ED3875] outline-none resize-none"
                  />
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali</span>
                  </Link>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ED3875] hover:bg-[#D92361] text-white text-xs font-bold shadow-md transition disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Lanjut ke Minat & Skill</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>
            </div>

          </div>
        )}

        {/* ================= STEP 2: MINAT & SKILL (04 Mockup) ================= */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Area: Skill Selectors */}
            <div className="lg:col-span-8 space-y-8">
              
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-rose-50 text-[#ED3875] text-xs font-bold tracking-wider uppercase mb-2">
                  PILIH AKTIVITAS KEMAMPUAN LEBIH CEPAT
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">
                  Pilih skill yang ingin kamu pelajari
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Pilih minimal 1 (disarankan 3) agar rekomendasi teman belajar di Mentora lebih tepat.
                </p>
              </div>

              {/* Section 1: Skill yang Ingin Dipelajari */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Skill yang Ingin Kamu Pelajari</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Pilih skill yang sedang ingin kamu kuasai saat ini.</p>
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
                            ? 'bg-rose-50 text-[#ED3875] border-2 border-[#ED3875] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
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
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-[#ED3875] outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Section 2: Skill yang Sudah Dimiliki */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Skill yang Sudah Kamu Miliki</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Boleh dipilih lebih dari satu. Ini membantu pencocokan skill dua arah (barter ilmu).</p>
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
                            ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-500 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Mode Sesi yang Disukai */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Mode Sesi yang Kamu Sukai</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Pilih preferensi pelaksanaan sesi belajar.</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {(['Online', 'Offline', 'Fleksibel'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setModeSesi(mode)}
                      className={`py-3 px-4 rounded-xl text-xs font-bold text-center border transition-all ${
                        modeSesi === mode
                          ? 'border-[#ED3875] bg-rose-50 text-[#ED3875] shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
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
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>
              </div>

            </div>

            {/* Right Column: Tips & Complete Action */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Pink Card Graphic */}
              <div className="bg-[#ED3875] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <h3 className="text-lg font-black leading-snug">
                    Mulai perjalanan <br />
                    belajarmu hari ini <br />
                    bareng Mentora! 🚀
                  </h3>
                  <div className="font-handwriting text-2xl font-bold -rotate-2 text-rose-100">
                    More Skills Brighter Friends
                  </div>
                </div>
                {/* Decorative circle */}
                <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              </div>

              {/* Green Tip Box from Mockup */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-slate-700 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tips Belajar</span>
                </div>
                <p className="leading-relaxed">
                  Fokus dulu ke skill yang benar-benar ingin kamu pelajari. Pilihan ini bisa diubah kapan saja lewat halaman Profil.
                </p>
              </div>

              {/* Yellow Tip Box from Mockup */}
              <div className="p-5 rounded-2xl bg-[#FEF08A]/70 border border-amber-300 text-xs text-slate-800 space-y-2">
                <h4 className="font-bold text-amber-900">Tips memilih skill:</h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 leading-relaxed">
                  <li>Pilih minat yang paling relevan</li>
                  <li>Kelompokkan skill yang sudah kamu kuasai</li>
                  <li>Sesuaikan mode sesi sesuai kenyamananmu</li>
                </ol>
              </div>

              {/* Final Complete Button */}
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-[#ED3875] hover:bg-[#D92361] text-white text-sm font-bold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Selesai & Masuk Mentora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
