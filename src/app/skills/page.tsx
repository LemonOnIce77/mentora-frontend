'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Layers, BookOpen, AlertCircle, Loader2, Save } from 'lucide-react';
import { Plus, X, Check, CheckCircle2, ArrowLeft } from '@/components/animated-icons';

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
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-3 text-ink-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-semibold">Memuat data keahlian Mentora...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        
        {/* Navigasi Balik ke Dashboard */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-ink-muted hover:text-ink transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Mentora</span>
          </Link>
        </div>

        {/* Header Title Card */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-canvas border border-line text-primary text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>PENGELOLAAN SKILL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Keahlian &amp; Minat Belajar
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted max-w-2xl leading-relaxed">
              Atur skill yang ingin kamu pelajari dan kuasai untuk memudahkan sistem mencocokkan teman belajar dua arah.
            </p>
          </div>

          <button
            onClick={handleSaveSkills}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl action-primary text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Perubahan Skill</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-success-tint border border-line text-ink-secondary text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-danger-tint border border-danger-soft text-danger text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-danger-accent" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 2-Columns Grid: LEARN vs TEACH */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Card 1: Skill Ingin Dipelajari (LEARN / Mentee) */}
          <div className="bg-surface rounded-3xl p-6 sm:p-7 border border-line shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-line mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-canvas text-primary border border-line flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-ink">Skill yang Ingin Dipelajari</h2>
                    <p className="text-[11px] text-ink-muted">Target belajar kamu saat ini (Mentee)</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-canvas text-primary border border-line text-xs font-bold">
                  {skillsToLearn.length} Dipilih
                </span>
              </div>

              {/* Chips Container */}
              <div className="min-h-[100px] p-4 rounded-2xl bg-canvas border border-line mb-5">
                {skillsToLearn.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skillsToLearn.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface text-ink border border-line text-xs font-semibold shadow-xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeLearnSkill(skill)}
                          className="hover:text-danger transition p-0.5 rounded-full hover:bg-danger-tint"
                          title="Hapus skill"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-ink-muted italic py-6">
                    Belum ada skill yang dipilih. Pilih dari daftar atau ketik skill baru.
                  </div>
                )}
              </div>

              {/* Input Custom Skill */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-ink-secondary mb-1.5">
                  Tambah Skill Kustom
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customLearnInput}
                    onChange={(e) => setCustomLearnInput(e.target.value)}
                    placeholder="mis. React.js, Akuntansi..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-line text-xs focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
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
                    className="px-4 py-2 rounded-xl action-primary text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Presets Quick Picker */}
              <div>
                <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block mb-2">
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
                            ? 'bg-primary-tint text-primary border-primary'
                            : 'bg-surface text-ink-secondary border-line hover:border-ink-muted'
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
          <div className="bg-surface rounded-3xl p-6 sm:p-7 border border-line/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-line mb-5">
                <div className="flex items-center gap-2.5">
                  <div>
                    <h2 className="text-base font-bold text-ink">Skill yang Sudah Dimiliki</h2>
                    <p className="text-[11px] text-ink-muted">Keahlian yang bisa diajarkan (Mentor)</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-canvas text-ink-secondary text-xs font-bold">
                  {skillsPossessed.length} Dikuasai
                </span>
              </div>

              {/* Chips Container */}
              <div className="min-h-[100px] p-4 rounded-2xl bg-canvas/70 border border-line/70 mb-5">
                {skillsPossessed.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skillsPossessed.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface text-ink-secondary border border-line text-xs font-semibold shadow-xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeTeachSkill(skill)}
                          className="hover:text-danger transition p-0.5 rounded-full hover:bg-danger-tint"
                          title="Hapus skill"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-ink-muted italic py-6">
                    Belum ada keahlian yang dimasukkan. Pilih dari rekomendasi di bawah.
                  </div>
                )}
              </div>

              {/* Input Custom Skill */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-ink-secondary mb-1.5">
                  Tambah Skill Kustom
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customTeachInput}
                    onChange={(e) => setCustomTeachInput(e.target.value)}
                    placeholder="mis. Flutter, Copywriting..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-line text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
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
                    className="px-4 py-2 rounded-xl action-primary text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Presets Quick Picker */}
              <div>
                <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block mb-2">
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
                            ? 'bg-primary-tint text-primary border-primary'
                            : 'bg-surface text-ink-secondary border-line hover:border-subtle'
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
        <div className="bg-surface rounded-3xl p-6 sm:p-7 border border-line shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-base font-bold text-ink">Preferensi Pelaksanaan Sesi Belajar</h3>
            <p className="text-xs text-ink-muted mt-0.5">
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
                    ? 'border-primary bg-canvas text-ink shadow-xs'
                    : 'border-line bg-surface text-ink-secondary hover:bg-canvas'
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
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-ink-muted hover:bg-canvas transition"
          >
            Batal &amp; Kembali
          </Link>

          <button
            onClick={handleSaveSkills}
            disabled={saving}
            className="px-7 py-3 rounded-2xl action-primary text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Perubahan Skill</span>
          </button>
        </div>

      </main>

      <Footer workspace />
    </div>
  );
}
