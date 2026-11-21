"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { uploadMentorDocument } from "@/lib/upload-mentor-document";
import MentorDocumentType from "@/components/MentorDocumentType";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  Check,
} from "@/components/animated-icons";

interface CurrentUser {
  id: number;
  namaLengkap: string;
  email: string;
  universitas?: string;
  prodi?: string;
  semester?: string;
  statusMentor: string;
  dokumenKredensial?: string;
}

export default function MentorApplyPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [skillsOffered, setSkillsOffered] = useState("");
  const [pengalamanMengajar, setPengalamanMengajar] = useState("");
  const [dokumenNama, setDokumenNama] = useState("");
  const [dokumenUrl, setDokumenUrl] = useState("");

  // Feedback states
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 1. Ambil data profil pengguna & status pengajuan saat ini
  const loadUserData = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/auth");
          return;
        }
        throw new Error("Gagal memuat sesi pengguna");
      }

      const data = await res.json();
      if (data && data.user) {
        setUser(data.user);
        if (data.user.statusMentor === "PENDING" && data.user.dokumenKredensial) {
          setDokumenNama(data.user.dokumenKredensial);
        }
      }
    } catch (err) {
      setErrorMsg("Gagal memuat status pengajuan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // 2. Upload Dokumen Transkrip / Kredensial via /api/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4.5 * 1024 * 1024) {
      setErrorMsg("Ukuran berkas melebihi batas maksimal 4.5 MB serverless. Harap kompres dokumen Anda.");
      return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg(
        "Format berkas tidak didukung. Harap unggah PDF, JPG, atau PNG.",
      );
      return;
    }

    setUploading(true);
    setErrorMsg("");
    try {
      const data = await uploadMentorDocument(file);
      setDokumenNama(data.fileName);
      setDokumenUrl(data.fileUrl);
    } catch (error) {
      setDokumenNama("");
      setDokumenUrl("");
      setErrorMsg(error instanceof Error ? error.message : "Gagal mengunggah berkas.");
    } finally {
      setUploading(false);
    }
  };

  // 3. Submit Pengajuan Mentor
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!skillsOffered.trim()) {
      setErrorMsg("Mohon sebutkan keahlian yang ingin Anda ajarkan.");
      return;
    }

    if (!dokumenUrl) {
      setErrorMsg(
        "Mohon unggah dokumen transkrip nilai atau sertifikat pendukung.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/mentor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillsOffered: skillsOffered.trim(),
          pengalamanMengajar: pengalamanMengajar.trim(),
          dokumenNama,
          dokumenUrl,
          jenisDokumen: new FormData(e.currentTarget).get("jenisDokumen"),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(
          "✓ Pengajuan berhasil dikirimkan! Tim Admin Mentora akan memverifikasi dokumen Anda.",
        );
        await loadUserData();
      } else {
        setErrorMsg(data.message || "Gagal mengirimkan pengajuan mentor.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kendala server saat mengirim data.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-3 text-ink-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-semibold">
            Memeriksa status akun mentor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs font-bold text-ink shadow-2xs transition hover:border-primary hover:text-primary hover:bg-primary-soft/30 active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
            <span>Kembali ke Dashboard Mentora</span>
          </Link>
        </div>

        {/* Title Header Card */}
        <div className="bg-surface rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-line shadow-soft-card mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-tint border border-primary-soft text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <span>UPGRADE PERAN</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
            Pengajuan Akun & Kredensial Mentor
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted max-w-2xl mt-1 leading-relaxed">
            Ajukan diri sebagai mentor untuk membagikan keahlian kepada rekan
            mahasiswa, mengumpulkan EduPoints keaktifan, dan membangun
            portofolio resmi.
          </p>
        </div>

        {/* Status Section: APPROVED */}
        {user?.statusMentor === "APPROVED" && (
          <div className="bg-surface rounded-3xl p-8 border border-success-soft shadow-soft-card text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-success-tint text-success flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-ink">
              Selamat! Akun Anda Telah Menjadi Mentor Terverifikasi
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed">
              Kredensial akademik dan keahlian Anda telah disetujui oleh tim
              verifikator Mentora. Profil Anda kini terdaftar di direktori
              mentor dan dapat menerima permintaan sesi belajar.
            </p>
            {user?.dokumenKredensial && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-canvas border border-line text-xs font-semibold text-ink-secondary">
                <FileText className="w-4 h-4 text-primary" />
                <span>Dokumen Terverifikasi: {user.dokumenKredensial}</span>
              </div>
            )}
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full action-primary text-xs font-bold transition shadow-xs"
              >
                <span>Buka Dashboard Mentor</span>
                <Check className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Status Section: PENDING */}
        {user?.statusMentor === "PENDING" && (
          <div className="bg-surface rounded-3xl p-8 border border-warning-soft shadow-soft-card text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-warning-soft text-warning flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-ink">
              Pengajuan Mentor Sedang Ditinjau Tim Verifikator
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed">
              Berkas transkrip/sertifikat Anda sedang dalam proses peninjauan
              oleh Admin Mentora. Notifikasi status kelulusan akan diperbarui
              secara otomatis.
            </p>
            {dokumenNama && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-warning-tint border border-warning-soft text-xs font-medium text-warning">
                <FileText className="w-4 h-4 text-warning" />
                <span>Berkas Kredensial: {dokumenNama}</span>
              </div>
            )}
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface border border-line text-xs font-bold text-ink-secondary hover:bg-canvas transition"
              >
                <span>Kembali ke Halaman Utama</span>
              </Link>
            </div>
          </div>
        )}

        {/* Application Form for NONE or REJECTED */}
        {user?.statusMentor !== "APPROVED" &&
          user?.statusMentor !== "PENDING" && (
            <form
              onSubmit={handleSubmit}
              className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-soft-card space-y-6"
            >
              {user?.statusMentor === "REJECTED" && (
                <div className="p-4 rounded-2xl bg-danger-tint border border-danger-soft text-danger-hover text-xs font-medium flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      Pengajuan sebelumnya belum disetujui.
                    </span>{" "}
                    Silakan periksa kembali kejelasan dokumen kredensial dan
                    ajukan ulang.
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-danger-tint border border-danger-soft text-danger text-xs font-semibold flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-4 rounded-2xl bg-success-tint border border-line text-ink-secondary text-xs font-semibold flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* User Academic Summary Display */}
              <div className="p-4 rounded-2xl bg-canvas border border-line flex flex-wrap items-center justify-between gap-4 text-xs text-ink-muted">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-ink-muted" />
                  <span>
                    Pemohon:{" "}
                    <span className="font-bold text-ink">
                      {user?.namaLengkap || "-"}
                    </span>{" "}
                    ({user?.universitas || "Belum diisi"})
                  </span>
                </div>

                <div>
                  Prodi:{" "}
                  <span className="font-semibold text-ink-secondary">
                    {user?.prodi || "Belum diisi"}
                  </span>{" "}
                  • Semester {user?.semester || "-"}
                </div>
              </div>

              {/* Field: Skills Offered */}
              <div>
                <label className="block text-xs font-bold text-ink-secondary mb-1.5">
                  Materi / Keahlian yang Ingin Diajarkan{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={skillsOffered}
                  onChange={(e) => setSkillsOffered(e.target.value)}
                  placeholder="mis. UI/UX Design, Figma, Logika Pemrograman Web Dasar"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-line text-sm text-ink focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
                />
                <p className="text-[11px] text-ink-muted mt-1">
                  Pisahkan dengan koma jika menawarkan lebih dari satu keahlian.
                </p>
              </div>

              {/* Field: Pengalaman Mengajar */}
              <div>
                <label className="block text-xs font-bold text-ink-secondary mb-1.5">
                  Pengalaman Bimbingan, Proyek, atau Organisasi Terkait
                  (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={pengalamanMengajar}
                  onChange={(e) => setPengalamanMengajar(e.target.value)}
                  placeholder="mis. Asisten praktikum mata kuliah DKV semester lalu, juara hackathon UI/UX, aktif membagikan tutorial kelompok belajar..."
                  className="w-full px-4 py-2.5 rounded-xl border border-line text-sm text-ink focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none resize-none"
                />
              </div>

              {/* Field: Upload Kredensial */}
              <div>
                <MentorDocumentType />
                <label className="block text-xs font-bold text-ink-secondary mb-1.5">
                  Unggah Bukti Kredensial / Transkrip Nilai{" "}
                  <span className="text-danger">*</span>
                </label>
                <div className="border-2 border-dashed border-line hover:border-primary rounded-2xl p-7 text-center transition bg-canvas">
                  <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-bold text-ink-secondary">
                    {dokumenNama
                      ? `Berkas terpilih: ${dokumenNama}`
                      : "Pilih Transkrip Nilai Akademik atau Portofolio (PDF)"}
                  </p>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    Format file yang didukung: PDF, JPG, PNG (Maksimal 4.5 MB)
                  </p>
                  <label className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-line text-xs font-bold text-ink-secondary hover:bg-canvas cursor-pointer shadow-xs transition">
                    {uploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-primary" />
                    )}
                    <span>
                      {uploading
                        ? "Mengunggah berkas..."
                        : dokumenNama
                          ? "Ganti Dokumen"
                          : "Cari File Dokumen"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Info Point Callout */}
              <div className="p-4 rounded-2xl bg-primary-tint border border-primary-soft text-xs text-ink-secondary flex items-start gap-2.5 leading-relaxed">
                <p>
                  Setelah diverifikasi, Anda akan memperoleh status{" "}
                  <span className="font-bold text-primary">
                    Mentor Terverifikasi
                  </span>{" "}
                  dan berhak mendapatkan insentif{" "}
                  <span className="font-bold text-primary">+5 EduPoints</span>{" "}
                  untuk tiap sesi belajar yang tuntas diselenggarakan.
                </p>
              </div>

              {/* Submit Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="w-full py-3.5 rounded-xl action-primary text-xs font-bold shadow-xs hover:shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  <span>Kirimkan Formulir Pengajuan Mentor</span>
                </button>
              </div>
            </form>
          )}
      </main>

      <Footer workspace />
    </div>
  );
}
