"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { dayInWib, shiftDay } from "@/lib/session-date";
import { BookOpen, Calendar, CheckCircle2, Loader2, MapPin, MessageSquare, ShieldCheck, Video, X } from "lucide-react";

export interface BookingMentor {
  id: number;
  namaLengkap: string;
  namaPanggilan?: string;
  universitas?: string;
  prodi?: string;
  fotoProfil?: string;
  skills: Array<{
    id: number;
    skill: { id: number; namaSkill: string; kategori?: string };
  }>;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: (bookedDate?: string) => void;
  mentor: BookingMentor | null;
  initialDate?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  mentor,
  initialDate,
}: BookingModalProps) {
  const router = useRouter();
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  // Form State
  const [selectedSkill, setSelectedSkill] = useState("");
  const [tanggalSesi, setTanggalSesi] = useState("");
  const [jamMulai, setJamMulai] = useState("14:00");
  const [jamSelesai, setJamSelesai] = useState("15:30");
  const [metode, setMetode] = useState<"Online" | "Offline">("Online");
  const [lokasi, setLokasi] = useState("Google Meet");
  const [topik, setTopik] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentUser, setCurrentUser] = useState<{ id: number; namaLengkap: string; email?: string } | null>(null);

  React.useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Set default values saat modal dibuka
  React.useEffect(() => {
    if (isOpen && mentor) {
      if (mentor.skills && mentor.skills.length > 0) {
        setSelectedSkill(mentor.skills[0].skill.namaSkill);
      } else {
        setSelectedSkill("Mentoring Akademik Umum");
      }

      const today = dayInWib();
      const suggested = initialDate ?? shiftDay(today, 1);
      setTanggalSesi(suggested >= today ? suggested : "");

      setSuccess(false);
      setErrorMsg("");
      setTopik("");
    }
  }, [mentor, isOpen, initialDate]);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, [isOpen, mentor]);

  if (!isOpen || !mentor) return null;
  const start = Date.parse(`${tanggalSesi}T${jamMulai}+07:00`);
  const end = Date.parse(`${tanggalSesi}T${jamSelesai}+07:00`);
  const duration = (end - start) / 60_000;
  const closeBooking = () => onClose(success ? tanggalSesi : undefined);

  const handleMetodeChange = (newMetode: "Online" | "Offline") => {
    setMetode(newMetode);
    if (newMetode === "Online") {
      setLokasi("Google Meet");
    } else {
      setLokasi("Perpustakaan Kampus / Ruang Diskusi Bersama");
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const isSelfBooking = Boolean(
      currentUser && (
        String(currentUser.id) === String(mentor.id) ||
        (currentUser.email && (mentor as any).email && currentUser.email.toLowerCase() === (mentor as any).email.toLowerCase()) ||
        (currentUser.namaLengkap && mentor.namaLengkap && currentUser.namaLengkap.trim().toLowerCase() === mentor.namaLengkap.trim().toLowerCase())
      )
    );

    if (isSelfBooking) {
      setErrorMsg("Kamu tidak dapat mengajukan sesi belajar ke profil sendiri.");
      return;
    }

    if (!selectedSkill) {
      setErrorMsg("Pilih skill atau materi yang ingin dipelajari.");
      return;
    }
    if (!tanggalSesi) {
      setErrorMsg("Pilih tanggal sesi belajar.");
      return;
    }
    if (!jamMulai || !jamSelesai) {
      setErrorMsg("Tentukan jam mulai dan jam selesai sesi.");
      return;
    }
    if (Date.parse(`${tanggalSesi}T${jamMulai}+07:00`) <= Date.now()) {
      setErrorMsg("Pilih tanggal dan jam mulai yang belum lewat (WIB).");
      return;
    }
    if (jamMulai >= jamSelesai) {
      setErrorMsg("Jam selesai harus lebih akhir dari jam mulai sesi.");
      return;
    }

    setLoading(true);

    try {
      // Simpan riwayat booking sesi ke localStorage dengan status PENDING menunggu persetujuan mentor
      const bookingData = {
        id: `sesi-${Date.now()}`,
        mentorId: mentor.id,
        mentorName: mentor.namaLengkap,
        mentorPhoto: mentor.fotoProfil || "",
        menteeId: currentUser?.id,
        menteeName: currentUser?.namaLengkap || "Mentee",
        skill: selectedSkill,
        tanggalSesi,
        jamMulai,
        jamSelesai,
        metode,
        lokasi,
        topik: topik.trim() || "Diskusi materi & konsultasi belajar",
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };

      const existingBookings = JSON.parse(
        localStorage.getItem("mentora_booked_sessions") || "[]",
      );
      existingBookings.unshift(bookingData);
      localStorage.setItem(
        "mentora_booked_sessions",
        JSON.stringify(existingBookings),
      );

      setSuccess(true);
    } catch (err) {
      setErrorMsg("Terjadi kendala saat menyimpan reservasi sesi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToChat = () => {
    closeBooking();
    router.push(
      `/chat?partnerId=${mentor.id}&name=${encodeURIComponent(mentor.namaLengkap)}`,
    );
  };

  return (
    <dialog ref={dialogRef} aria-labelledby="booking-title"
      onCancel={event => { event.preventDefault(); closeBooking(); }}
      className="m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-3xl overflow-y-auto rounded-2xl border border-line bg-surface p-0 text-ink backdrop:bg-ink/55">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 sm:px-7">
        <h2 id="booking-title" className="text-xl font-bold tracking-tight">{success ? "Sesi berhasil dipesan" : "Pesan sesi belajar"}</h2>
        <button type="button" onClick={closeBooking} aria-label="Tutup formulir" className="grid size-10 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-canvas"><X size={18} /></button>
      </div>
      <div className="grid min-w-0 sm:grid-cols-[minmax(0,0.82fr)_minmax(0,1.45fr)]">
        <aside className="flex items-start gap-3 border-b border-line bg-canvas p-5 sm:block sm:border-b-0 sm:border-r sm:p-6">
          {mentor.fotoProfil ? <img src={mentor.fotoProfil} alt="" className="size-12 shrink-0 rounded-xl object-cover" /> :
            <div aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-xl font-bold text-primary">{(mentor.namaPanggilan || mentor.namaLengkap).charAt(0)}</div>}
          <div className="min-w-0 sm:mt-4">
            <h3 className="break-words text-lg font-bold leading-tight tracking-tight">{mentor.namaLengkap}</h3>
            <p className="mt-1 break-words text-sm leading-relaxed text-ink-muted">{[mentor.prodi, mentor.universitas].filter(Boolean).join(" · ")}</p>
            <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-ink-secondary"><ShieldCheck className="size-4 text-success" aria-hidden="true" /> Mentor terverifikasi</p>
          </div>
          {!success && <dl className="mt-6 hidden border-t border-line pt-4 text-sm sm:block">
            {duration > 0 && <div className="mb-3"><dt className="text-xs text-ink-muted">Durasi sesi</dt><dd className="mt-1 font-semibold text-ink">{duration} menit</dd></div>}
            <div><dt className="text-xs text-ink-muted">Zona waktu</dt><dd className="mt-1 font-semibold text-ink">WIB (UTC+7)</dd></div>
          </dl>}
        </aside>
        <div className="min-w-0 p-5 sm:p-6">
          {/* Sukses State */}
          {success ? (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-primary-soft text-primary border border-primary-soft flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-ink">
                  Pengajuan Sesi Terkirim!
                </h4>
                <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto leading-relaxed">
                  Permintaan sesi belajar bersama{" "}
                  <strong className="text-ink">
                    {mentor.namaLengkap}
                  </strong>{" "}
                  telah dikirim untuk materi{" "}
                  <strong className="text-primary">{selectedSkill}</strong>. Status saat ini{" "}
                  <strong className="text-warning font-semibold">Menunggu Persetujuan Mentor</strong>.
                </p>
              </div>

              {/* Rincian Sesi */}
              <div className="p-4 rounded-2xl bg-canvas border border-line text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-ink-muted">
                  <span>Tanggal:</span>
                  <strong className="text-ink">{tanggalSesi}</strong>
                </div>
                <div className="flex items-center justify-between text-ink-muted">
                  <span>Waktu:</span>
                  <strong className="text-ink">
                    {jamMulai} - {jamSelesai} WIB
                  </strong>
                </div>
                <div className="flex items-center justify-between text-ink-muted">
                  <span>Metode:</span>
                  <strong className="text-ink">
                    {metode} ({lokasi})
                  </strong>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleGoToChat}
                  className="flex-1 py-3 px-4 rounded-xl action-primary text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Pesan ke Mentor</span>
                </button>
                <button
                  type="button"
                  onClick={closeBooking}
                  className="py-3 px-5 rounded-xl border border-line bg-surface hover:bg-canvas text-ink-secondary text-xs font-bold transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            /* Form Booking */
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              {errorMsg && (
                <div role="alert" className="p-3 rounded-xl bg-danger-tint border border-danger-soft text-danger text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Pilih Skill */}
              <div>
                <label htmlFor="booking-skill" className="block text-xs font-bold text-ink-secondary mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  <span>Keahlian / Materi yang Dipelajari</span>
                </label>
                <select
                  id="booking-skill"
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-line text-sm font-medium text-ink focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none bg-surface"
                  required
                >
                  {mentor.skills && mentor.skills.length > 0 ? (
                    mentor.skills.map((s) => (
                      <option key={s.id} value={s.skill.namaSkill}>
                        {s.skill.namaSkill}{" "}
                        {s.skill.kategori ? `(${s.skill.kategori})` : ""}
                      </option>
                    ))
                  ) : (
                    <option value="Mentoring Akademik Umum">
                      Mentoring Akademik Umum
                    </option>
                  )}
                </select>
              </div>

              {/* Pilihan Metode Sesi */}
              <div>
                <label className="block text-xs font-bold text-ink-secondary mb-1.5">
                  Metode Belajar
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    aria-pressed={metode === "Online"}
                    onClick={() => handleMetodeChange("Online")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition ${
                      metode === "Online"
                        ? "border-primary bg-primary-tint/70 text-primary"
                        : "border-line bg-surface text-ink-secondary hover:bg-canvas"
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Daring (Online)</span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={metode === "Offline"}
                    onClick={() => handleMetodeChange("Offline")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition ${
                      metode === "Offline"
                        ? "border-primary bg-primary-soft/60 text-primary"
                        : "border-line bg-surface text-ink-secondary hover:bg-canvas"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Tatap Muka (Offline)</span>
                  </button>
                </div>
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid min-w-0 grid-cols-1 gap-3">
                <div className="min-w-0">
                  <label htmlFor="booking-date" className="block text-xs font-bold text-ink-secondary mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-ink-muted" />
                    <span>Tanggal Sesi</span>
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    value={tanggalSesi}
                    onChange={(e) => setTanggalSesi(e.target.value)}
                    min={dayInWib()}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm font-medium text-ink focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                  <label className="min-w-0 text-xs font-bold text-ink-secondary">
                    Jam mulai (WIB)
                    <input id="booking-start" type="time" value={jamMulai} onChange={e => setJamMulai(e.target.value)} required
                      className="mt-1.5 block min-h-10 w-full min-w-0 rounded-xl border border-line px-3 text-sm font-medium text-ink" />
                  </label>
                  <label className="min-w-0 text-xs font-bold text-ink-secondary">
                    Jam selesai (WIB)
                    <input type="time" value={jamSelesai} onChange={e => setJamSelesai(e.target.value)} required
                      className="mt-1.5 block min-h-10 w-full min-w-0 rounded-xl border border-line px-3 text-sm font-medium text-ink" />
                  </label>
                </div>
              </div>

              {/* Lokasi / Tautan Ruang Sesi */}
              <div>
                <label htmlFor="booking-location" className="block text-xs font-bold text-ink-secondary mb-1.5">
                  {metode === "Online"
                    ? "Tautan / Platform Online"
                    : "Tempat / Ruang Bertemu"}
                </label>
                <input
                  type="text"
                  id="booking-location"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder={
                    metode === "Online"
                      ? "mis. Google Meet / Zoom"
                      : "mis. Gedung Perpustakaan lt. 2"
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-line text-sm font-medium text-ink focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none"
                />
              </div>

              {/* Topik / Catatan */}
              <div>
                <label htmlFor="booking-topic" className="block text-xs font-bold text-ink-secondary mb-1.5">
                  Topik / Pokok Pembahasan (Opsional)
                </label>
                <textarea
                  id="booking-topic"
                  rows={2}
                  value={topik}
                  onChange={(e) => setTopik(e.target.value)}
                  placeholder="mis. Konsultasi pengerjaan tugas proyek, tips portfolio, atau latihan studi kasus..."
                  className="w-full px-4 py-2 rounded-xl border border-line text-xs text-ink focus:ring-2 focus:ring-primary-accent/20 focus:border-primary outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-line flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={closeBooking}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-ink-muted hover:bg-canvas transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl action-primary text-xs font-bold shadow-xs transition flex items-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses Reservasi...</span>
                    </>
                  ) : (
                    <>
                      <span>Konfirmasi sesi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
