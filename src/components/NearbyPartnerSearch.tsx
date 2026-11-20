"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ArrowRight } from "./animated-icons";
import LocationPicker from "./LocationPicker";
import styles from "./NearbyPartnerSearch.module.css";

export default function NearbyPartnerSearch({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  function rememberLocation() {
    try {
      sessionStorage.setItem("mentora-nearby", JSON.stringify(coords));
    } catch {
      // The destination also works when browser storage is disabled.
    }
  }

  return (
    <div className="mt-auto w-full">
      <div className="flex flex-wrap items-center justify-between gap-x-3">
        {children}
        <button type="button" id="nearby-toggle" aria-expanded={open} aria-controls="nearby-panel"
          onClick={() => setOpen(!open)}
          className="inline-flex min-h-11 items-center gap-1 rounded text-sm font-medium text-ink-secondary hover:text-primary">
          Cari di sekitar saya
          <ChevronDown aria-hidden="true" className={`size-4 motion-safe:transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      <div id="nearby-panel" role="region" aria-labelledby="nearby-toggle" hidden={!open} className={`${styles.panel} border-t border-line pt-3`}>
        <p className="mb-3 text-sm leading-relaxed text-ink-secondary">
          Untuk sesi tatap muka, gunakan lokasi perangkatmu agar partner bisa diurutkan berdasarkan jarak.
        </p>
        <LocationPicker onLocationDetected={({ latitude, longitude }) => setCoords({ latitude, longitude })}>
          <Link href="/auth?tab=masuk&tujuan=sekitar" onClick={rememberLocation} className="inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-primary hover:underline">
            Masuk untuk lihat partner terdekat <ArrowRight className="size-4" />
          </Link>
        </LocationPicker>
      </div>
    </div>
  );
}
