'use client';

import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { MapPin } from '@/components/animated-icons';

interface LocationData {
  latitude: number;
  longitude: number;
  alamat?: string;
  kota?: string;
  provinsi?: string;
}

interface LocationPickerProps {
  onLocationDetected?: (data: LocationData) => void;
  initialLocationName?: string;
  children?: React.ReactNode;
}

export default function LocationPicker({
  onLocationDetected,
  initialLocationName = '',
  children,
}: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<Pick<LocationData, 'kota' | 'provinsi'> | null>(
    initialLocationName ? { kota: initialLocationName } : null
  );

  const handleGetLocation = () => {
    setErrorMsg('');

    // 1. Validasi dukungan Geolocation API di browser
    if (!('geolocation' in navigator)) {
      setErrorMsg('Browser kamu tidak mendukung deteksi lokasi Geolocation API.');
      return;
    }

    setLoading(true);

    // 2. Ambil koordinat perangkat pengguna
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const location: LocationData = { latitude, longitude };

        try {
          // 3. Reverse Geocoding ke OpenStreetMap Nominatim untuk mendapatkan nama wilayah
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (!res.ok) throw new Error('Gagal mendapatkan nama lokasi');
          const data = await res.json();

          location.kota =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            data.address?.state;
          if (data.address?.state && data.address.state !== location.kota) {
            location.provinsi = data.address.state;
          }
          location.alamat = data.display_name || `${latitude}, ${longitude}`;
        } catch {
          // Koordinat GPS tetap tersedia ketika nama wilayah tidak bisa diambil.
        }
        setResult(location);
        setLoading(false);
        onLocationDetected?.(location);
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMsg('Izin akses lokasi ditolak. Silakan aktifkan izin lokasi di browser.');
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMsg('Informasi lokasi perangkat tidak tersedia.');
            break;
          case error.TIMEOUT:
            setErrorMsg('Waktu permintaan lokasi habis. Coba lagi.');
            break;
          default:
            setErrorMsg('Gagal mengambil lokasi perangkat.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div role="status" aria-atomic="true" className={result ? 'relative isolate flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-primary-soft bg-gradient-to-r from-canvas to-primary-tint px-4 py-4 sm:px-5' : 'sr-only'}>
        {result && (
          <>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ink-secondary">
                {loading || errorMsg ? 'Lokasi terakhir' : 'Lokasi saat ini'}
              </p>
              {result.kota ? (
                <strong className="mt-1 block break-words text-2xl font-bold leading-tight tracking-tight text-primary sm:text-3xl">
                  {result.kota}
                </strong>
              ) : (
                <p className="mt-1 text-sm text-ink-secondary">
                  Koordinat terdeteksi. Nama wilayah belum tersedia.
                </p>
              )}
              {result.provinsi && <p className="mt-1 break-words text-sm text-ink-muted">{result.provinsi}</p>}
            </div>
            <span
              aria-hidden="true"
              className={`pointer-events-none grid size-12 shrink-0 place-items-center rounded-full border sm:size-16 ${
                loading || errorMsg ? 'border-line text-subtle' : 'border-primary-soft text-primary-accent'
              }`}
            >
              <span className="relative grid size-7 place-items-center rounded-full before:absolute before:inset-0 before:rounded-full before:bg-current before:opacity-15 sm:size-9">
                <span className="relative size-3.5 rounded-full border-2 border-white bg-current shadow-sm" />
              </span>
            </span>
          </>
        )}
        {loading && <span className="sr-only">Mendeteksi lokasi...</span>}
      </div>
      <div className={result ? 'flex flex-wrap items-center justify-between gap-x-4 gap-y-1' : ''}>
        {result && children}
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={loading}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg text-xs transition disabled:opacity-60 ${
            result
              ? 'px-1 font-medium text-ink-muted underline decoration-line underline-offset-4 hover:text-primary hover:decoration-current'
              : 'action-secondary w-full px-4 py-2.5 font-bold sm:w-auto'
          }`}
        >
          {loading ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 motion-safe:animate-spin" />
              Mendeteksi lokasi...
            </>
          ) : result ? 'Perbarui lokasi' : (
            <>
              <MapPin className="size-4" />
              Gunakan lokasi saya
            </>
          )}
        </button>
      </div>

      {/* Tampilan Pesan Error / Akses Ditolak */}
      {errorMsg && (
        <div role="alert" className="p-3 rounded-xl bg-danger-tint border border-danger-soft text-danger text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
