"use client";

import { Component, useState, type ReactNode } from "react";
import Link from "next/link";
import { Map, MapMarker, MarkerContent } from "@/components/ui/map";

type Partner = { id: string; namaLengkap: string; domisili: string; universitas: string; modeSesi: string; skillsDitawarkan: string[]; isVerifiedMentor: boolean };

// Public city centres. A marker represents an area, never a partner's GPS position.
const cities = [
  { name: "Bandung", point: [107.6098, -6.9175] },
  { name: "Surabaya", point: [112.7508, -7.2575] },
  { name: "Depok", point: [106.8186, -6.4025] },
  { name: "Jakarta", point: [106.8272, -6.1754] },
];

class MapBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <p className="p-6 text-sm">Peta tidak dapat ditampilkan. Pilih area di bawah untuk melihat partner.</p> : this.props.children;
  }
}

export default function PartnerMap({ partners }: { partners: Partner[] }) {
  const [selected, setSelected] = useState("");
  const groups = cities.map(city => ({
    ...city, members: partners.filter(p => !p.id.startsWith("peer-") && !/^(online|daring)$/i.test(p.modeSesi) && p.domisili.toLowerCase().includes(city.name.toLowerCase())),
  })).filter(group => group.members.length);
  const active = groups.find(group => group.name === selected) ?? groups[0];
  if (!active) return <p className="rounded-xl border border-line bg-surface p-5 text-sm">Belum ada area yang bisa dipetakan untuk hasil ini. Partner tetap tersedia di daftar.</p>;
  const positions = groups.map(g => g.point);
  return <section aria-label="Peta area partner" className="overflow-hidden rounded-2xl border border-line bg-surface">
    <p className="px-5 py-3 text-sm text-ink-secondary">Penanda menunjukkan pusat kota untuk partner luring atau fleksibel. Sepakati tempat pertemuan lewat chat.</p>
    <MapBoundary><div className="h-80 bg-canvas">
      <Map key={groups.map(g=>g.name).join("-")} theme="light" styles={{ light: "https://tiles.openfreemap.org/styles/positron" }}
        center={[active.point[0],active.point[1]]} zoom={11} scrollZoom={false}
        bounds={groups.length > 1 ? [[Math.min(...positions.map(p=>p[0])),Math.min(...positions.map(p=>p[1]))],[Math.max(...positions.map(p=>p[0])),Math.max(...positions.map(p=>p[1]))]] : undefined}
        fitBoundsOptions={{padding:45}}>
        {groups.map(g=><MapMarker key={g.name} longitude={g.point[0]} latitude={g.point[1]}><MarkerContent>
          <button type="button" onClick={()=>setSelected(g.name)} aria-label={g.name + ", " + g.members.length + " partner"} className="rounded-full border-2 border-white bg-primary px-3 py-2 text-xs font-bold text-white shadow-md">{g.name} · {g.members.length}</button>
        </MarkerContent></MapMarker>)}
      </Map>
    </div></MapBoundary>
    <div className="space-y-3 p-5">
      <div className="flex flex-wrap gap-2">{groups.map(g=><button type="button" key={g.name} aria-pressed={active.name===g.name} onClick={()=>setSelected(g.name)} className="rounded-full border border-line px-3 py-1 text-sm aria-pressed:bg-primary-tint aria-pressed:text-primary">{g.name}</button>)}</div>
      <ul className="divide-y divide-line">{active.members.map(p=><li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-2">
        <div><strong>{p.namaLengkap}</strong><p className="text-sm text-ink-muted">{[p.universitas,...p.skillsDitawarkan].filter(Boolean).join(" · ")}</p></div>
        <Link className="text-sm font-bold text-primary hover:underline" href={p.isVerifiedMentor ? "/mentors/"+encodeURIComponent(p.id) : "/chat?partnerId="+encodeURIComponent(p.id)+"&name="+encodeURIComponent(p.namaLengkap)}>{p.isVerifiedMentor ? "Lihat profil mentor" : "Buka chat"}</Link>
      </li>)}</ul>
    </div>
  </section>;
}
