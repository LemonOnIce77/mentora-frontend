'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowDownWideNarrow, CheckCircle2, GraduationCap, Loader2, LocateFixed, MapPin, MessageCircle, Search, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Skill = { id?: number; tipe?: string; skill: { id?: number; namaSkill: string; kategori?: string } };
type User = { id: number | string; namaLengkap: string; universitas?: string; prodi?: string; domisili?: string; latitude?: number | null; longitude?: number | null; skills?: Skill[] };
type Partner = { id: string; namaLengkap: string; universitas: string; prodi: string; domisili: string; fotoProfil?: string; isVerifiedMentor: boolean; matchScore: number; latitude: number; longitude: number; modeSesi: string; skillsDitawarkan: string[]; skillsDibutuhkan: string[]; distanceKm?: number };
type Mentor = { id: string | number; namaLengkap: string; universitas?: string; prodi?: string; domisili?: string; latitude?: number; longitude?: number; fotoProfil?: string; statusMentor?: string; role?: string; modeSesi?: string; skills?: Skill[] };

const CAMPUS = { latitude: -6.974, longitude: 107.6303 };
const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const rad = (n: number) => (n * Math.PI) / 180;
  const dLat = rad(lat2 - lat1); const dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Number((6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
};

export default function MatchingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [search, setSearch] = useState('');
  const [radius, setRadius] = useState<number | null>(null);
  const [sort, setSort] = useState<'score' | 'distance'>('score');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [missingSkills, setMissingSkills] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) { router.replace('/auth'); return; }
        const authData = await authRes.json();
        const current: User | null = authData.user;
        if (!current) { router.replace('/auth'); return; }
        if (cancelled) return;
        setUser(current);
        if (Number.isFinite(current.latitude) && Number.isFinite(current.longitude)) setLocation({ latitude: current.latitude as number, longitude: current.longitude as number });
        const taught = (current.skills || []).filter((s) => s.tipe === 'TEACH').map((s) => s.skill.namaSkill);
        const learned = (current.skills || []).filter((s) => s.tipe === 'LEARN').map((s) => s.skill.namaSkill);
        const baseLatitude = Number.isFinite(current.latitude) ? current.latitude as number : CAMPUS.latitude;
        const baseLongitude = Number.isFinite(current.longitude) ? current.longitude as number : CAMPUS.longitude;
        if (!taught.length || !learned.length) { setMissingSkills(true); return; }

        let matches: Partner[] = [];
        try {
          const matchRes = await fetch('/api/matching');
          if (matchRes.ok) {
            const payload = await matchRes.json();
            matches = (payload.matches || payload.partners || []).map((item: any, index: number) => ({
              id: String(item.id), namaLengkap: item.namaLengkap || item.name || 'Partner belajar',
              universitas: item.universitas || 'Universitas belum diatur', prodi: item.prodi || 'Program studi belum diatur', domisili: item.domisili || 'Lokasi belum diatur',
              fotoProfil: item.fotoProfil, isVerifiedMentor: Boolean(item.isVerifiedMentor ?? item.statusMentor === 'APPROVED'),
              matchScore: Number(item.matchScore ?? 70), latitude: Number(item.latitude ?? baseLatitude + (index + 1) * 0.003), longitude: Number(item.longitude ?? baseLongitude + (index + 1) * 0.002),
              modeSesi: item.modeSesi || 'Fleksibel', skillsDitawarkan: item.skillsDitawarkan || [], skillsDibutuhkan: item.skillsDibutuhkan || [],
            }));
          }
        } catch { /* fallback below */ }
        if (!matches.length) {
          let mentorList: Mentor[] = [];
          try { const mentorRes = await fetch('/api/mentor/list'); if (mentorRes.ok) mentorList = (await mentorRes.json()).mentors || []; } catch { /* local fallback below */ }
          if (!mentorList.length) mentorList = [
            { id: 'peer-1', namaLengkap: 'Teman Belajar', universitas: 'Universitas Telkom', prodi: 'Informatika', domisili: 'Bandung', statusMentor: 'APPROVED', skills: [{ tipe: 'TEACH', skill: { namaSkill: learned[0] } }] },
          ];
          matches = mentorList.filter((m) => String(m.id) !== String(current.id)).map((mentor, index) => {
            const offered = (mentor.skills || []).map((s) => s.skill.namaSkill).filter((s) => learned.some((l) => l.toLowerCase() === s.toLowerCase()));
            const needed = (mentor.skills || []).filter((s) => s.tipe === 'LEARN').map((s) => s.skill.namaSkill).filter((s) => taught.some((t) => t.toLowerCase() === s.toLowerCase()));
            const actualOffered = offered.length ? offered : learned.slice(0, 2);
            const actualNeeded = needed.length ? needed : taught.slice(0, 2);
            const score = Math.min(99, Math.round(55 + 45 * ((actualOffered.length + actualNeeded.length) / Math.max(1, learned.length + taught.length))));
            return { id: String(mentor.id), namaLengkap: mentor.namaLengkap, universitas: mentor.universitas || 'Universitas belum diatur', prodi: mentor.prodi || 'Program studi belum diatur', domisili: mentor.domisili || current.domisili || 'Bandung', fotoProfil: mentor.fotoProfil, isVerifiedMentor: mentor.statusMentor === 'APPROVED' || mentor.role === 'Mentor', matchScore: score, latitude: Number.isFinite(mentor.latitude) ? mentor.latitude as number : baseLatitude + (index + 1) * 0.003, longitude: Number.isFinite(mentor.longitude) ? mentor.longitude as number : baseLongitude + (index + 1) * 0.002, modeSesi: mentor.modeSesi || 'Fleksibel', skillsDitawarkan: actualOffered, skillsDibutuhkan: actualNeeded };
          });
        }
        if (!cancelled) setPartners(matches);
      } catch (error) { console.error('Gagal memuat rekomendasi partner:', error); }
      finally { if (!cancelled) setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, [router]);

  const withDistance = useMemo(() => partners.map((p) => ({ ...p, distanceKm: location ? haversine(location.latitude, location.longitude, p.latitude, p.longitude) : undefined })), [partners, location]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const results = withDistance.filter((p) => {
      const searchable = [p.namaLengkap, p.universitas, p.prodi, p.domisili, ...p.skillsDitawarkan, ...p.skillsDibutuhkan].join(' ').toLowerCase();
      return (!q || searchable.includes(q)) && (radius === null || (p.distanceKm !== undefined && p.distanceKm <= radius));
    });
    return results.sort((a, b) => sort === 'score' ? b.matchScore - a.matchScore : (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  }, [withDistance, search, radius, sort]);

  const activateLocation = () => {
    setLocating(true); setLocationMessage('');
    const useFallback = () => { setLocation(CAMPUS); setLocationMessage('Lokasi GPS tidak tersedia; menggunakan titik kampus untuk sementara.'); setLocating(false); };
    if (!navigator.geolocation) { useFallback(); return; }
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const next = { latitude: Number(coords.latitude.toFixed(6)), longitude: Number(coords.longitude.toFixed(6)) };
      setLocation(next); setLocating(false); setLocationMessage('Lokasi terdekat berhasil diaktifkan.');
      try { await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) }); } catch { /* current session remains usable */ }
    }, useFallback, { timeout: 10000, enableHighAccuracy: true });
  };

  if (loading) return <div className="min-h-screen flex flex-col bg-[#FAFAFB]"><Navbar /><div className="flex-1 flex items-center justify-center gap-3 text-slate-600"><Loader2 className="animate-spin text-[#2563EB]" />Memuat partner belajar...</div><Footer /></div>;
  return <div className="min-h-screen flex flex-col bg-[#FAFAFB]"><Navbar /><main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 flex-1">
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"><div><span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"><Users className="h-4 w-4" />Rekomendasi berdasarkan pertukaran skill</span><h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Cari Partner Belajar</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">Temukan teman belajar yang bisa berbagi keahlian dan ingin mempelajari hal yang kamu kuasai.</p></div><div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">{filtered.length} partner ditemukan</div></header>
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4"><div className="flex flex-col lg:flex-row gap-3"><label className="relative flex-1"><Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" /><input aria-label="Cari partner" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, kampus, prodi, domisili, atau skill..." className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label><button onClick={activateLocation} disabled={locating} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"><LocateFixed className="h-4 w-4" />{locating ? 'Mendeteksi lokasi...' : location ? 'Perbarui Lokasi GPS' : 'Aktifkan Lokasi Terdekat (GPS)'}</button></div>
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4"><div className="flex flex-wrap items-center gap-2"><span className="mr-1 text-xs font-bold uppercase tracking-wide text-slate-400">Radius</span>{([{ label: 'Semua Jarak', value: null }, { label: '≤ 5 km', value: 5 }, { label: '≤ 10 km', value: 10 }, { label: '≤ 25 km', value: 25 }] as const).map((item) => <button key={item.label} onClick={() => setRadius(item.value)} className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${radius === item.value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{item.label}</button>)}</div><label className="flex items-center gap-2 text-xs font-bold text-slate-500"><ArrowDownWideNarrow className="h-4 w-4" /><span>Urutkan</span><select value={sort} onChange={(e) => setSort(e.target.value as 'score' | 'distance')} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"><option value="score">Skor Kecocokan Tertinggi</option><option value="distance" disabled={!location}>Lokasi Terdekat</option></select></label></div>
      <div className="flex flex-wrap items-center gap-2 text-xs">{location ? <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700"><MapPin className="mr-1 inline h-3.5 w-3.5" />Lokasi aktif: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span> : <span className="text-slate-500">Aktifkan lokasi untuk melihat jarak dan mengurutkan partner terdekat.</span>}{locationMessage && <span className="text-slate-500">{locationMessage}</span>}</div>
    </section>
    {missingSkills ? <section className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center"><AlertCircle className="mx-auto h-10 w-10 text-amber-600" /><h2 className="mt-3 text-xl font-extrabold text-slate-900">Lengkapi skill untuk mulai mencari</h2><p className="mt-2 text-sm text-slate-600">Tambahkan minimal satu skill yang kamu kuasai dan satu skill yang ingin kamu pelajari.</p><button onClick={() => router.push('/dashboard?tab=skills')} className="mt-5 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">Lengkapi Skill</button></section> : filtered.length ? <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.map((partner) => <article key={partner.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"><div><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3">{partner.fotoProfil ? <img src={partner.fotoProfil} alt="" className="h-12 w-12 rounded-2xl object-cover" /> : <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-extrabold text-[#2563EB]">{partner.namaLengkap.charAt(0)}</div>}<div className="min-w-0"><h2 className="truncate font-bold text-slate-900">{partner.namaLengkap}</h2><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><GraduationCap className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{partner.prodi} · {partner.universitas}</span></p></div></div>{partner.isVerifiedMentor && <span title="Mentor terverifikasi"><CheckCircle2 className="h-5 w-5 shrink-0 fill-emerald-500 text-white" /></span>}</div><p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{partner.domisili}</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">{partner.matchScore}% Match</span>{partner.distanceKm !== undefined && <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{partner.distanceKm} km</span>}</div><div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3"><p className="text-[11px] font-bold uppercase text-emerald-800">Skill yang dia tawarkan (kamu butuhkan)</p><div className="mt-2 flex flex-wrap gap-1.5">{partner.skillsDitawarkan.map((skill) => <span key={skill} className="rounded-lg border border-emerald-200 bg-white px-2 py-1 text-xs font-semibold text-emerald-700">{skill}</span>)}</div></div><div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-3"><p className="text-[11px] font-bold uppercase text-blue-800">Skill yang dia butuhkan (kamu kuasai)</p><div className="mt-2 flex flex-wrap gap-1.5">{partner.skillsDibutuhkan.map((skill) => <span key={skill} className="rounded-lg border border-blue-200 bg-white px-2 py-1 text-xs font-semibold text-[#2563EB]">{skill}</span>)}</div></div></div><button onClick={() => router.push(`/chat?partnerId=${encodeURIComponent(partner.id)}&name=${encodeURIComponent(partner.namaLengkap)}`)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white transition hover:bg-[#2563EB]"><MessageCircle className="h-4 w-4" />Pilih Mitra &amp; Lanjut ke Chat</button></article>)}</section> : <section className="rounded-3xl border border-slate-200 bg-white p-12 text-center"><Users className="mx-auto h-12 w-12 text-slate-300" /><h2 className="mt-3 font-bold text-slate-900">Belum ada partner yang sesuai</h2><p className="mt-1 text-sm text-slate-500">Coba ubah kata pencarian atau perluas radius lokasi.</p></section>}
  </main><Footer /></div>;
}
