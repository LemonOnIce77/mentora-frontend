"use client";

import React, { useEffect, useState } from "react";
import { Check, ShieldCheck, X, XCircle, Loader2 } from "lucide-react";
import type { Submission } from "./adminData";

type Props = {
  state: { action: "approve" | "reject"; submission: Submission } | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
};

const QUICK_REASONS = [
  "Dokumen tidak terbaca",
  "Transkrip belum resmi",
  "Pengalaman belum memadai",
];

export default function ConfirmModal({
  state,
  onClose,
  onConfirm,
  loading = false,
}: Props) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (state) setReason("");
  }, [state]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, loading]);

  if (!state) return null;

  const approve = state.action === "approve";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F172A]/50 p-4 backdrop-blur-sm sm:items-center animate-in fade-in duration-200"
      onClick={() => {
        if (!loading) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={
        approve
          ? "Konfirmasi persetujuan mentor"
          : "Konfirmasi penolakan pengajuan"
      }
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl shadow-slate-900/20 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-start gap-4 border-b border-[#E2E8F0] p-5 sm:p-6">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              approve
                ? "bg-[#ECFDF5] text-[#059669]"
                : "bg-[#FFF1F2] text-[#E11D48]"
            }`}
          >
            {approve ? (
              <ShieldCheck className="h-6 w-6" />
            ) : (
              <XCircle className="h-6 w-6" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] font-extrabold text-[#0F172A]">
              {approve
                ? "Setujui pengajuan mentor ini?"
                : "Tolak pengajuan calon mentor ini?"}
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#64748B]">
              {approve ? (
                <>
                  Peran akun{" "}
                  <span className="font-bold text-[#0F172A]">
                    {state.submission.name}
                  </span>{" "}
                  akan diubah menjadi <strong>Mentor</strong> dan profilnya
                  langsung tampil di direktori mentor Mentora.
                </>
              ) : (
                <>
                  Pengajuan{" "}
                  <span className="font-bold text-[#0F172A]">
                    {state.submission.name}
                  </span>{" "}
                  akan ditandai ditolak. Sampaikan alasan agar calon mentor dapat
                  memperbaiki berkasnya.
                </>
              )}
            </p>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            aria-label="Tutup dialog"
            className="rounded-lg p-1.5 text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#334155] disabled:opacity-50"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-xl bg-[#F8FAFC] p-4">
            <p className="text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase">
              Ringkasan pengajuan
            </p>
            <p className="mt-2 text-[14px] font-bold text-[#0F172A]">
              {state.submission.name} · {state.submission.id}
            </p>
            <p className="mt-1 text-[13px] text-[#475569]">
              {state.submission.program} — {state.submission.university}
            </p>
          </div>

          {!approve && (
            <div className="mt-4">
              <label
                htmlFor="alasan-penolakan"
                className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase"
              >
                Alasan penolakan
              </label>
              <textarea
                id="alasan-penolakan"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Contoh: Dokumen transkrip belum resmi dan pengalaman mengajar belum memenuhi standar minimum."
                className="mt-2 w-full resize-none rounded-xl border border-[#E2E8F0] bg-white p-3 text-[13.5px] leading-relaxed text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#FDA4AF] focus:ring-4 focus:ring-[#FFF1F2]"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase">
                  Alasan cepat:
                </span>
                {QUICK_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-[12px] font-semibold text-[#475569] transition hover:border-[#CBD5E1] hover:bg-white"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-xl border border-[#CBD5E1] bg-white px-5 py-2.5 text-[13.5px] font-bold text-[#334155] transition hover:bg-[#F8FAFC] disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => onConfirm(reason)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[13.5px] font-bold text-white shadow-md transition disabled:opacity-70 ${
                approve
                  ? "bg-gradient-to-r from-[#059669] to-[#047857] shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/30"
                  : "bg-gradient-to-r from-[#E11D48] to-[#BE123C] shadow-rose-600/25 hover:shadow-lg hover:shadow-rose-600/30"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Memproses…
                </>
              ) : approve ? (
                <>
                  <Check className="h-4.5 w-4.5" strokeWidth={3} />
                  Ya, Setujui Mentor
                </>
              ) : (
                <>
                  <XCircle className="h-4.5 w-4.5" />
                  Ya, Tolak Pengajuan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
