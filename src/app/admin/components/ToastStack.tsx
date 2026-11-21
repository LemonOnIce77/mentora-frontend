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
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border border-line bg-surface shadow-cloud animate-in slide-in-from-right-6 fade-in duration-300`}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 w-1.5 ${
                success ? "bg-success" : "bg-danger"
              }`}
            />
            <div className="flex items-start gap-3 p-4 pl-5">
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  success
                    ? "bg-success-soft text-success"
                    : "bg-danger-tint text-danger"
                }`}
              >
                {success ? (
                  <CheckCircle2 className="h-4.5 w-4.5" />
                ) : (
                  <XCircle className="h-4.5 w-4.5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-extrabold text-ink">
                  {toast.title}
                </p>
                <p className="mt-0.5 text-xs text-ink-muted leading-relaxed">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Tutup notifikasi"
                className="rounded-lg p-1 text-ink-muted transition hover:bg-canvas hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <span
              aria-hidden="true"
              className={`block h-1 w-full animate-[progress_4s_linear_forwards] ${
                success ? "bg-success-soft" : "bg-danger-soft"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
