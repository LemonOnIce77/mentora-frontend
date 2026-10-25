'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Layers,
  BookOpen,
  Sparkles,
  Plus,
  X,
  Check,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Save,
} from 'lucide-react';

const PRESET_SKILLS = [
  'UI/UX Design',
  'Figma',
  'Programming',
  'Web Development',
  'Data Analysis',
  'Machine Learning',
  'Graphic Design',
  'Public Speaking',
  'English',
  'Marketing',
  'Design Thinking',
  'Business Management',
];

export default function SkillManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Skill states
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>([]);
  const [skillsPossessed, setSkillsPossessed] = useState<string[]>([]);
  const [modeSesi, setModeSesi] = useState<'Online' | 'Offline' | 'Fleksibel'>('Online');

  // Input states
  const [customLearnInput, setCustomLearnInput] = useState('');
  const [customTeachInput, setCustomTeachInput] = useState('');

  // 1. Ambil data skill user yang sedang login
  const fetchUserSkills = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth');
          return;
        }
        throw new Error('Gagal memuat profil');
      }

      const data = await res.json();
      if (data && data.user) {
        if (data.user.modeSesi) {
          setModeSesi(data.user.modeSesi);
        }

        if (data.user.skills && data.user.skills.length > 0) {
          const learn = data.user.skills
            .filter((s: any) => s.tipe === 'LEARN')
            .map((s: any) => s.skill.namaSkill);
          const teach = data.user.skills
            .filter((s: any) => s.tipe === 'TEACH')
            .map((s: any) => s.skill.namaSkill);

          setSkillsToLearn(learn);
          setSkillsPossessed(teach);
        }
      }
    } catch (err) {
      setErrorMsg('Gagal mengambil data keahlian pengguna.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSkills();
  }, []);

  // Handlers Skill Ingin Dipelajari (LEARN)
  const addLearnSkill = (skill: string) => {
    const s = skill.trim();
    if (!s) return;
    if (!skillsToLearn.includes(s)) {
      setSkillsToLearn((prev) => [...prev, s]);
    }
    setCustomLearnInput('');
  };

  const removeLearnSkill = (skill: string) => {
    setSkillsToLearn((prev) => prev.filter((item) => item !== skill));
  };

  // Handlers Skill yang Dikuasai (TEACH)
  const addTeachSkill = (skill: string) => {
    const s = skill.trim();
    if (!s) return;
    if (!skillsPossessed.includes(s)) {
      setSkillsPossessed((prev) => [...prev, s]);
    }
    setCustomTeachInput('');
  };

  const removeTeachSkill = (skill: string) => {
    setSkillsPossessed((prev) => prev.filter((item) => item !== skill));
  };

  // 2. Simpan Pembaruan Skill
  const handleSaveSkills = async () => {
    if (skillsToLearn.length === 0) {
      setErrorMsg('Pilih minimal 1 skill yang ingin kamu pelajari.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Pastikan master skill terdaftar ke database
      const allUniqueSkills = Array.from(new Set([...skillsToLearn, ...skillsPossessed]));
      await Promise.all(
        allUniqueSkills.map((sk) =>
          fetch('/api/skills', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ namaSkill: sk, kategori: 'General' }),
          })
        )
      );

      // Simpan asosiasi relasi skill ke profil user
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
        setSuccessMsg('✓ Data keahlian berhasil diperbarui dan tersimpan ke profil!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        const d = await res.json();
        setErrorMsg(d.message || 'Gagal menyimpan perubahan.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kendala koneksi server.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
          <p className="text-sm font-semibold">Memuat data keahlian Mentora...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      <Navbar />

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        
        {/* Navigasi Balik ke Dashboard */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Mentora</span>
          </Link>
        </div>

        {/* Header Title Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>PENGELOLAAN SKILL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Keahlian & Minat Belajar
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Atur skill yang ingin kamu pelajari dan kuasai untuk memudahkan sistem mencocokkan teman belajar dua arah.
            </p>
          </div>

          <button
            onClick={handleSaveSkills}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Perubahan Skill</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 2-Columns Grid: LEARN vs TEACH */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Card 1: Skill Ingin Dipelajari (LEARN / Mentee) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Skill yang Ingin Dipelajari</h2>
                    <p className="text-[11px] text-slate-400">Target belajar kamu saat ini (Mentee)</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold">
                  {skillsToLearn.length} Dipilih
                </span>
              </div>

              {/* Chips Container */}
              <div className="min-h-[100px] p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 mb-5">
                {skillsToLearn.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skillsToLearn.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#2563EB] border border-blue-200 text-xs font-semibold shadow-xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeLearnSkill(skill)}
                          className="hover:text-rose-600 transition p-0.5 rounded-full hover:bg-rose-50"
                          title="Hapus skill"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 italic py-6">
                    Belum ada skill yang dipilih. Pilih dari daftar atau ketik skill baru.
                  </div>
                )}
              </div>

              {/* Input Custom Skill */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tambah Skill Kustom
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customLearnInput}
                    onChange={(e) => setCustomLearnInput(e.target.value)}
                    placeholder="mis. React.js, Akuntansi..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLearnSkill(customLearnInput);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addLearnSkill(customLearnInput)}
                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Presets Quick Picker */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Rekomendasi Cepat:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_SKILLS.map((sk) => {
                    const isSelected = skillsToLearn.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => (isSelected ? removeLearnSkill(sk) : addLearnSkill(sk))}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border flex items-center gap-1 ${
                          isSelected
                            ? 'bg-blue-50 text-[#2563EB] border-[#2563EB]'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{sk}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Skill yang Sudah Dikuasai (TEACH / Mentor) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Skill yang Sudah Dimiliki</h2>
                    <p className="text-[11px] text-slate-400">Keahlian yang bisa diajarkan (Mentor)</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                  {skillsPossessed.length} Dikuasai
                </span>
              </div>

              {/* Chips Container */}
              <div className="min-h-[100px] p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 mb-5">
                {skillsPossessed.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skillsPossessed.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeTeachSkill(skill)}
                          className="hover:text-rose-600 transition p-0.5 rounded-full hover:bg-rose-50"
                          title="Hapus skill"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 italic py-6">
                    Belum ada keahlian yang dimasukkan. Pilih dari rekomendasi di bawah.
                  </div>
                )}
              </div>

              {/* Input Custom Skill */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tambah Skill Kustom
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customTeachInput}
                    onChange={(e) => setCustomTeachInput(e.target.value)}
                    placeholder="mis. Flutter, Copywriting..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTeachSkill(customTeachInput);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addTeachSkill(customTeachInput)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Presets Quick Picker */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Rekomendasi Cepat:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_SKILLS.map((sk) => {
                    const isSelected = skillsPossessed.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => (isSelected ? removeTeachSkill(sk) : addTeachSkill(sk))}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border flex items-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{sk}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Preferensi Pelaksanaan Sesi */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-base font-bold text-slate-900">Preferensi Pelaksanaan Sesi Belajar</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih kenyamanan metode belajar kamu dengan teman sejawat.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 w-full sm:w-auto">
            {(['Online', 'Offline', 'Fleksibel'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setModeSesi(mode)}
                className={`py-2 px-5 rounded-xl text-xs font-bold transition-all text-center border ${
                  modeSesi === mode
                    ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            Batal & Kembali
          </Link>

          <button
            onClick={handleSaveSkills}
            disabled={saving}
            className="px-7 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Perubahan Skill</span>
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
}