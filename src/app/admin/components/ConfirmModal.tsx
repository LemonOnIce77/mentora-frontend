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
  "Dokumen tidak terbaca jelas",
  "Transkrip nilai belum resmi",
  "Kualifikasi keahlian belum mencukupi",
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center animate-in fade-in duration-200"
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
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface shadow-cloud animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              approve
                ? "bg-success-soft text-success"
                : "bg-danger-tint text-danger"
            }`}
          >
            {approve ? (
              <ShieldCheck className="h-6 w-6" />
            ) : (
              <XCircle className="h-6 w-6" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-extrabold text-ink sm:text-lg">
              {approve
                ? "Setujui pengajuan mentor ini?"
                : "Tolak pengajuan calon mentor ini?"}
            </h2>
            <p className="mt-1 text-xs text-ink-secondary leading-relaxed sm:text-sm">
              {approve ? (
                <>
                  Peran akun{" "}
                  <strong className="text-ink">
                    {state.submission.name}
                  </strong>{" "}
                  akan diaktifkan sebagai <strong>Mentor</strong> dan profilnya
                  dapat menerima pemesanan sesi belajar.
                </>
              ) : (
                <>
                  Pengajuan{" "}
                  <strong className="text-ink">
                    {state.submission.name}
                  </strong>{" "}
                  akan ditolak. Berikan catatan evaluasi agar calon mentor dapat
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
            className="rounded-lg p-1.5 text-ink-muted transition hover:bg-canvas hover:text-ink disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-xl border border-line bg-canvas p-3.5">
            <p className="text-[10px] font-bold tracking-wider text-ink-muted uppercase">
              Ringkasan Calon Mentor
            </p>
            <p className="mt-1 text-xs sm:text-sm font-bold text-ink">
              {state.submission.name} · {state.submission.id}
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {state.submission.program} — {state.submission.university}
            </p>
          </div>

          {!approve && (
            <div className="mt-4">
              <label
                htmlFor="alasan-penolakan"
                className="text-[10px] font-bold tracking-wider text-ink-secondary uppercase"
              >
                Catatan Alasan Penolakan
              </label>
              <textarea
                id="alasan-penolakan"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Contoh: Dokumen transkrip belum resmi dan pengalaman mengajar belum memenuhi standar minimum."
                className="mt-1.5 w-full resize-none rounded-xl border border-line bg-surface p-3 text-xs sm:text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-danger focus:ring-2 focus:ring-danger-soft"
              />
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-ink-muted uppercase">
                  Pilihan cepat:
                </span>
                {QUICK_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className="rounded-lg border border-line bg-canvas px-2.5 py-1 text-[11px] font-medium text-ink-secondary transition hover:bg-surface hover:border-primary"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-xl border border-line bg-surface px-4 py-2 text-xs font-bold text-ink-secondary transition hover:bg-canvas sm:text-sm disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => onConfirm(reason)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition sm:text-sm disabled:opacity-70 ${
                approve
                  ? "bg-success hover:bg-emerald-800"
                  : "bg-danger hover:bg-danger-hover"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memproses…</span>
                </>
              ) : approve ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={3} />
                  <span>Ya, Setujui Mentor</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>Ya, Tolak Pengajuan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
