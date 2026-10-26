'use client';

import React, { useState } from 'react';
import { MapPin, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface LocationData {
  latitude: number;
  longitude: number;
  alamat?: string;
  kota?: string;
}

interface LocationPickerProps {
  onLocationDetected?: (data: LocationData) => void;
  initialLocationName?: string;
}

export default function LocationPicker({
  onLocationDetected,
  initialLocationName = '',
}: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [locationName, setLocationName] = useState(initialLocationName);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

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
        setCoords({ lat: latitude, lng: longitude });

        try {
          // 3. Reverse Geocoding ke OpenStreetMap Nominatim untuk mendapatkan nama wilayah
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          const area =
            data.address?.city ||
            data.address?.town ||
            data.address?.county ||
            data.address?.state ||
            'Lokasi Terdeteksi';

          const fullAddress = data.display_name || `${latitude}, ${longitude}`;
          
          setLocationName(area);

          if (onLocationDetected) {
            onLocationDetected({
              latitude,
              longitude,
              alamat: fullAddress,
              kota: area,
            });
          }
        } catch (err) {
          // Jika reverse geocode gagal, fallback ke koordinat mentah
          const fallbackText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocationName(fallbackText);
          if (onLocationDetected) {
            onLocationDetected({ latitude, longitude });
          }
        } finally {
          setLoading(false);
        }
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
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] hover:bg-blue-100/70 text-xs font-bold transition disabled:opacity-60 shadow-xs"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
              <span>Mendeteksi Lokasi...</span>
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 text-[#2563EB]" />
              <span>Gunakan Lokasi Saat Ini (Browser GPS)</span>
            </>
          )}
        </button>

        {coords && (
          <button
            type="button"
            onClick={handleGetLocation}
            title="Perbarui titik koordinat"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition self-center hidden sm:block"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tampilan Status Berhasil */}
      {locationName && !errorMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Lokasi: {locationName}</span>
          </div>
          {coords && (
            <span className="text-[11px] text-emerald-700 font-mono">
              ({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})
            </span>
          )}
        </div>
      )}

      {/* Tampilan Pesan Error / Akses Ditolak */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}