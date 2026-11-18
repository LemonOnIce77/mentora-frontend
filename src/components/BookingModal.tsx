"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle2,
  X,
  Loader2,
  BookOpen,
  MessageSquare,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

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
  onClose: () => void;
  mentor: BookingMentor | null;
}

export default function BookingModal({
  isOpen,
  onClose,
  mentor,
}: BookingModalProps) {
  const router = useRouter();

  // Form State
  const [selectedSkill, setSelectedSkill] = useState("");
  const [tanggalSesi, setTanggalSesi] = useState("");
  const [jamMulai, setJamMulai] = useState("14:00");
  const [jamSelesai, setJamSelesai] = useState("15:30");
  const [metode, setMetode] = useState<"Online" | "Offline">("Online");
  const [lokasi, setLokasi] = useState("Google Meet (Tautan otomatis dibuat)");
  const [topik, setTopik] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Set default values saat modal dibuka
  React.useEffect(() => {
    if (mentor) {
      if (mentor.skills && mentor.skills.length > 0) {
        setSelectedSkill(mentor.skills[0].skill.namaSkill);
      } else {
        setSelectedSkill("Diskusi & Mentoring Akademik");
      }

      // Default tanggal besok
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
      const dd = String(tomorrow.getDate()).padStart(2, "0");
      setTanggalSesi(`${yyyy}-${mm}-${dd}`);

      setSuccess(false);
      setErrorMsg("");
      setTopik("");
    }
  }, [mentor]);

  if (!isOpen || !mentor) return null;

  const handleMetodeChange = (newMetode: "Online" | "Offline") => {
    setMetode(newMetode);
    if (newMetode === "Online") {
      setLokasi("Google Meet (Tautan otomatis dibuat)");
    } else {
      setLokasi("Perpustakaan Kampus / Ruang Diskusi Bersama");
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

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
    if (jamMulai >= jamSelesai) {
      setErrorMsg("Jam selesai harus lebih akhir dari jam mulai sesi.");
      return;
    }

    setLoading(true);

    try {
      // Simpan riwayat booking sesi ke localStorage agar tersinkron ke riwayat / chat pengguna
      const bookingData = {
        id: `sesi-${Date.now()}`,
        mentorId: mentor.id,
        mentorName: mentor.namaLengkap,
        mentorPhoto: mentor.fotoProfil || "",
        skill: selectedSkill,
        tanggalSesi,
        jamMulai,
        jamSelesai,
        metode,
        lokasi,
        topik: topik.trim() || "Diskusi materi & konsultasi belajar",
        status: "BOOKED",
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

      // Simulasikan delay network singkat agar UX halus
      await new Promise((resolve) => setTimeout(resolve, 600));

      setSuccess(true);
    } catch (err) {
      setErrorMsg("Terjadi kendala saat menyimpan reservasi sesi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToChat = () => {
    onClose();
    router.push(
      `/chat?partnerId=${mentor.id}&name=${encodeURIComponent(mentor.namaLengkap)}`,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-lg">
              <Calendar className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {success ? "Reservasi Terkonfirmasi" : "Booking Sesi Belajar"}
              </h2>
              <p className="text-xs text-slate-500">
                Mentoring 1-on-1 dengan sesama mahasiswa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Card Info Mentor */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
            {mentor.fotoProfil ? (
              <img
                src={mentor.fotoProfil}
                alt={mentor.namaLengkap}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-sm">
                {(mentor.namaPanggilan || mentor.namaLengkap).charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm truncate">
                  {mentor.namaLengkap}
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {mentor.prodi || "Mahasiswa"} •{" "}
                {mentor.universitas || "Universitas"}
              </p>
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mt-1">
                Mentor Terverifikasi
              </span>
            </div>
          </div>

          {/* Sukses State */}
          {success ? (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-slate-900">
                  Sesi Belajar Berhasil Dipesan!
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  Jadwal sesi bersama{" "}
                  <strong className="text-slate-800">
                    {mentor.namaLengkap}
                  </strong>{" "}
                  telah tercatat untuk materi{" "}
                  <strong className="text-[#2563EB]">{selectedSkill}</strong>.
                </p>
              </div>

              {/* Rincian Sesi */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>📅 Tanggal:</span>
                  <strong className="text-slate-800">{tanggalSesi}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>⏰ Waktu:</span>
                  <strong className="text-slate-800">
                    {jamMulai} - {jamSelesai} WIB
                  </strong>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>📍 Metode:</span>
                  <strong className="text-slate-800">
                    {metode} ({lokasi})
                  </strong>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleGoToChat}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Pesan ke Mentor</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            /* Form Booking */
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Pilih Skill */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Keahlian / Materi yang Dipelajari</span>
                </label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none bg-white"
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Metode Belajar
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleMetodeChange("Online")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition ${
                      metode === "Online"
                        ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Daring (Online)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMetodeChange("Offline")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition ${
                      metode === "Offline"
                        ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Tatap Muka (Offline)</span>
                  </button>
                </div>
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Tanggal Sesi</span>
                  </label>
                  <input
                    type="date"
                    value={tanggalSesi}
                    onChange={(e) => setTanggalSesi(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Waktu (WIB)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={jamMulai}
                      onChange={(e) => setJamMulai(e.target.value)}
                      required
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none"
                    />
                    <span className="text-xs text-slate-400 font-bold">-</span>
                    <input
                      type="time"
                      value={jamSelesai}
                      onChange={(e) => setJamSelesai(e.target.value)}
                      required
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Lokasi / Tautan Ruang Sesi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {metode === "Online"
                    ? "Tautan / Platform Online"
                    : "Tempat / Ruang Bertemu"}
                </label>
                <input
                  type="text"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder={
                    metode === "Online"
                      ? "mis. Google Meet / Zoom"
                      : "mis. Gedung Perpustakaan lt. 2"
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none"
                />
              </div>

              {/* Topik / Catatan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Topik / Pokok Pembahasan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={topik}
                  onChange={(e) => setTopik(e.target.value)}
                  placeholder="mis. Konsultasi pengerjaan tugas proyek, tips portfolio, atau latihan studi kasus..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses Reservasi...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Konfirmasi Booking Sesi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
