"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { shiftDay } from "@/lib/session-date";

/* ============================================================================
 * ReUI Frame Family (scraped from keenthemes/reui c-frame-4 & c-frame-6)
 * - stacked + dense: single 1px border-line container with divide-y panels
 * - ghost: unboxed section container on bg-canvas
 * ========================================================================== */

export function Frame({
  variant = "stacked",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "stacked" | "ghost";
}) {
  return (
    <div
      data-slot="frame"
      className={cn(
        "flex min-w-0 flex-col",
        variant === "stacked"
          ? "divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface"
          : "gap-6",
        className,
      )}
      {...props}
    />
  );
}

export function FrameHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="frame-header"
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-canvas/65 px-5 py-3.5 sm:px-6",
        className,
      )}
      {...props}
    />
  );
}

export function FrameTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      data-slot="frame-title"
      className={cn("text-sm font-bold tracking-tight text-ink", className)}
      {...props}
    />
  );
}

export function FrameDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="frame-description"
      className={cn("text-xs leading-relaxed text-ink-secondary", className)}
      {...props}
    />
  );
}

export function FramePanel({
  padded = true,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { padded?: boolean }) {
  return (
    <div
      data-slot="frame-panel"
      className={cn(
        "min-w-0 bg-surface",
        padded && "p-5 sm:p-6",
        className,
      )}
      {...props}
    />
  );
}

export function FrameFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="frame-footer"
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 bg-canvas/65 px-5 py-3 text-xs text-ink-secondary sm:px-6",
        className,
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * ReUI Semantic Badge (mapped strictly to Mentora tailwind.config.cjs palette)
 * ========================================================================== */

export type BadgeVariant =
  | "outline"
  | "primary-light"
  | "success-light"
  | "warning-light"
  | "destructive-light";

const badgeVariantClasses: Record<BadgeVariant, string> = {
  outline: "border-line bg-canvas text-ink-secondary",
  "primary-light": "border-primary-soft bg-primary-soft text-primary",
  "success-light": "border-success-soft bg-success-soft text-success",
  "warning-light": "border-warning-soft bg-warning-soft text-ink",
  "destructive-light": "border-danger-soft bg-danger-tint text-danger",
};

export function Badge({
  variant = "outline",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        badgeVariantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}

export function InlineDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("size-1 shrink-0 rounded-full bg-ink-muted/45", className)}
    />
  );
}

/* ============================================================================
 * Kibo UI MiniCalendar Strip (scraped from shadcnblocks/kibo/mini-calendar)
 * ========================================================================== */

const shortWeekday = new Intl.DateTimeFormat("id-ID", {
  weekday: "short",
  timeZone: "UTC",
});
const shortMonth = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const fullAriaDate = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "full",
  timeZone: "UTC",
});

export function MiniCalendarStrip({
  today,
  selectedDay,
  bookedDays,
  onSelectDay,
  days = 7,
}: {
  today: string;
  selectedDay: string;
  bookedDays: Set<string>;
  onSelectDay: (day: string) => void;
  days?: number;
}) {
  const [startDay, setStartDay] = useState(selectedDay || today);
  const effectiveStart = startDay || today;
  const dayList = Array.from({ length: days }, (_, idx) =>
    shiftDay(effectiveStart, idx),
  );
  const labelMonth = shortMonth.format(new Date(effectiveStart + "T00:00:00Z"));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-ink-secondary">
          Rentang 7 hari · <span className="font-bold text-ink">{labelMonth}</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setStartDay(today);
              onSelectDay(today);
            }}
            className="min-h-8 rounded-full px-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary-soft"
          >
            Hari ini
          </button>
          <button
            type="button"
            aria-label="7 hari sebelumnya"
            onClick={() => setStartDay(shiftDay(effectiveStart, -days))}
            className="grid size-8 place-items-center rounded-full border border-line bg-surface text-ink-secondary transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="7 hari berikutnya"
            onClick={() => setStartDay(shiftDay(effectiveStart, days))}
            className="grid size-8 place-items-center rounded-full border border-line bg-surface text-ink-secondary transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        role="group"
        aria-label="Pilih tanggal cepat"
        className="grid grid-cols-7 gap-1.5"
      >
        {dayList.map((iso) => {
          const d = new Date(iso + "T00:00:00Z");
          const isSelected = iso === selectedDay;
          const isToday = iso === today;
          const hasSession = bookedDays.has(iso);
          return (
            <button
              key={iso}
              type="button"
              aria-pressed={isSelected}
              aria-current={isToday ? "date" : undefined}
              aria-label={fullAriaDate.format(d) + (hasSession ? ", ada sesi" : "")}
              onClick={() => onSelectDay(iso)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl border text-center transition-colors",
                isSelected
                  ? "border-primary bg-primary-soft text-primary"
                  : isToday
                    ? "border-primary/50 bg-surface text-primary"
                    : "border-line bg-canvas/70 text-ink-secondary hover:border-primary hover:bg-surface",
              )}
            >
              <span className="text-xs font-medium text-ink-muted">
                {shortWeekday.format(d)}
              </span>
              <span className="text-sm font-bold tabular-nums text-ink">
                {d.getUTCDate()}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 rounded-full",
                  hasSession ? "bg-primary" : "bg-transparent",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
 * Kibo UI Dropzone + blocks.so file-upload-04
 * ========================================================================== */

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function FileDropzone({
  id,
  fileName,
  fileSize,
  uploading,
  disabled,
  accept = ".pdf,image/*",
  onFileSelected,
  onClear,
}: {
  id: string;
  fileName: string;
  fileSize?: number;
  uploading: boolean;
  disabled?: boolean;
  accept?: string;
  onFileSelected: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const isDisabled = Boolean(uploading || disabled);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (isDisabled) return;
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) onFileSelected(dropped);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          if (!isDisabled) setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!isDisabled) setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed px-5 py-6 text-center transition-colors",
          dragging
            ? "border-primary bg-primary-soft/50"
            : "border-line bg-canvas hover:border-primary",
        )}
      >
        <Upload className="mb-2 size-5 text-primary" aria-hidden="true" />
        <p className="text-sm font-semibold text-ink">
          {dragging
            ? "Lepaskan berkas di sini"
            : "Tarik dan letakkan berkas, atau pilih dari perangkat"}
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Transkrip nilai, sertifikat, atau portofolio · PDF, JPG, PNG (Maks 5 MB)
        </p>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          tabIndex={-1}
          disabled={isDisabled}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onFileSelected(file);
            event.target.value = "";
          }}
          className="sr-only"
        />
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => inputRef.current?.click()}
          className="action-secondary mt-4 inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors disabled:opacity-60"
        >
          <Upload className="size-3.5" aria-hidden="true" />
          <span>
            {uploading
              ? "Mengunggah…"
              : fileName
                ? "Ganti berkas"
                : "Pilih berkas"}
          </span>
        </button>
      </div>

      {fileName && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <FileText className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-ink">
                {fileName}
              </p>
              {typeof fileSize === "number" && fileSize > 0 && (
                <p className="text-xs tabular-nums text-ink-muted">
                  {formatFileSize(fileSize)}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            disabled={isDisabled}
            onClick={onClear}
            aria-label="Hapus berkas terpilih"
            className="grid size-8 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
