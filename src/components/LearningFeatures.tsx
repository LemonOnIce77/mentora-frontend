import Link from "next/link";
import { Award, ChevronDown } from "lucide-react";
import { ArrowRight } from "@/components/animated-icons";
import NearbyPartnerSearch from "@/components/NearbyPartnerSearch";

const features = [
  { title: "Pencocokan Skill yang Tepat", description: "Temukan partner belajar sesuai minat, skill, dan tujuanmu dengan rekomendasi Mentora.", action: "Cari partner", Preview: SkillPreview, nearby: true },
  { title: "Chat & Booking Sesi dengan Mudah", description: "Diskusi lewat chat, atur jadwal fleksibel, lalu mulai sesi secara online atau offline.", action: "Atur sesi", Preview: SessionPreview },
  { title: "EduPoints dan E-Certificate", description: "Kumpulkan poin dari sesi yang kamu bantu. Tukar menjadi e-certificate resmi untuk portofolio.", action: "Lihat EduPoints", Preview: CertificatePreview },
];

function SkillPreview() {
  return (
    <div aria-hidden="true" className="flex h-40 items-center justify-center border-b border-line bg-canvas px-6">
      <div className="w-52 rounded-xl border border-line bg-white px-4 py-3 shadow-soft-card">
        <div className="flex items-center justify-between gap-2 border-b border-line pb-2 text-xs">
          <span className="text-ink-muted">Bisa mengajar</span>
          <span className="font-semibold text-ink">Figma</span>
        </div>
        <div className="flex items-center justify-between gap-2 pt-2 text-xs">
          <span className="text-ink-muted">Ingin belajar</span>
          <span className="font-semibold text-primary">Analisis data</span>
        </div>
      </div>
    </div>
  );
}

function SessionPreview() {
  return (
    <div aria-hidden="true" className="flex h-40 items-center justify-center overflow-hidden border-b border-line bg-primary-soft/50 px-6">
      <div className="w-52 -rotate-3 rounded-xl border border-line bg-white p-3.5 shadow-soft-card">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <span className="text-xs font-semibold text-ink">Sesi belajar</span>
          <span className="flex -space-x-1.5">
            <span className="grid size-6 place-items-center rounded-full bg-primary-soft text-[10px] font-bold text-ink ring-2 ring-white">M</span>
            <span className="grid size-6 place-items-center rounded-full bg-line text-[10px] font-bold text-ink-secondary ring-2 ring-white">R</span>
          </span>
        </div>
        <p className="mt-2 text-sm font-bold text-ink">Dasar pemrograman</p>
        <p className="mt-1 text-xs text-ink-muted">Sabtu · 10.00 WIB</p>
      </div>
    </div>
  );
}

function CertificatePreview() {
  return (
    <div aria-hidden="true" className="flex h-40 items-center justify-center overflow-hidden border-b border-line bg-canvas px-6">
      <div className="w-52 rotate-3 rounded border border-line bg-white p-2 shadow-soft-card">
        <div className="flex items-end justify-between border border-line px-3.5 py-4">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-ink">MENTORA</span>
            <p className="mt-1 font-serif text-2xl leading-none text-ink">Sertifikat</p>
            <p className="mt-2 text-xs text-ink-muted">Mentoring sebaya</p>
          </div>
          <Award className="box-content size-6 rounded-full bg-canvas p-1.5 text-ink-muted" strokeWidth={1.4} />
        </div>
      </div>
    </div>
  );
}

export default function LearningFeatures() {
  return (
    <section id="fitur" aria-labelledby="judul-fitur" className="border-y border-line bg-primary-soft py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 sm:mb-8">
          <h2 id="judul-fitur" className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Fitur Mentora</h2>
          <a href="#cara-kerja" className="inline-flex min-h-11 items-center gap-1.5 rounded text-sm font-semibold text-primary underline-offset-4 hover:underline">
            Lihat cara kerja <ChevronDown aria-hidden="true" className="size-4" />
          </a>
        </div>
        <div className="grid gap-5 md:grid-cols-3 md:has-[[aria-expanded=true]]:items-start lg:gap-6">
          {features.map(({ title, description, action, Preview, nearby }) => {
            const link = (
              <Link href="/auth?tab=daftar" className="group mt-auto inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-primary hover:underline">
                {action}<ArrowRight className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" />
              </Link>
            );
            return (
              <article key={title} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-white">
                <Preview />
                <div className="flex flex-1 flex-col items-start p-5 sm:p-6">
                  <h3 className="text-lg font-bold leading-snug text-ink">{title}</h3>
                  <p className="mb-4 mt-2 text-sm leading-relaxed text-ink-secondary">{description}</p>
                  {nearby ? <NearbyPartnerSearch>{link}</NearbyPartnerSearch> : link}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
