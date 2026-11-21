"use client";

import React from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import type { ToastItem } from "./adminData";

type Props = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

export default function ToastStack({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-20 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6">
      {toasts.map((toast) => {
        const success = toast.tone === "success";
        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border bg-white shadow-xl shadow-slate-900/10 animate-in slide-in-from-right-6 fade-in duration-300 ${
              success ? "border-[#A7F3D0]" : "border-[#FECDD3]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 w-1.5 ${
                success ? "bg-[#059669]" : "bg-[#E11D48]"
              }`}
            />
            <div className="flex items-start gap-3 p-4 pl-5">
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  success
                    ? "bg-[#ECFDF5] text-[#059669]"
                    : "bg-[#FFF1F2] text-[#E11D48]"
                }`}
              >
                {success ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-extrabold text-[#0F172A]">
                  {toast.title}
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[#64748B]">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Tutup notifikasi"
                className="rounded-lg p-1 text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#334155]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <span
              aria-hidden="true"
              className={`block h-[3px] w-full animate-[progress_4s_linear_forwards] ${
                success ? "bg-[#A7F3D0]" : "bg-[#FECDD3]"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
