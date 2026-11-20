"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const steps = [
  { title: "Buat Profil", detail: "Ceritakan minat, skill, dan tujuan belajar pada proses onboarding yang interaktif." },
  { title: "Cari Partner", detail: "Temukan mahasiswa dengan skill yang sesuai, baik daring maupun luring di sekitar kampusmu." },
  { title: "Mulai Sesi", detail: "Diskusi, belajar, dan berkembang bersama, lalu kumpulkan EduPoints untuk ditukar sertifikat." },
];

export default function LearningRoadmap() {
  const [openStep, setOpenStep] = useState<number | null>(0);
  return (
    <div className="grid items-start gap-7 lg:grid-cols-[2fr_3fr] lg:gap-16">
      <div>
        <h2 id="judul-cara-kerja" className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Cara Kerja Mentora</h2>
        <p className="mt-3 max-w-sm text-base leading-relaxed text-ink-secondary">Mulai perjalanan belajarmu dalam tiga langkah sederhana.</p>
      </div>
      <ol className="overflow-hidden rounded-2xl border border-line bg-white">
        {steps.map(({ title, detail }, i) => {
          const open = openStep === i;
          return (
            <li key={title} className={`border-b border-line last:border-0 ${open ? "bg-primary-soft/45" : ""}`}>
              <h3>
                <button id={`langkah-${i}`} type="button" aria-expanded={open} aria-controls={`detail-langkah-${i}`}
                  onClick={() => setOpenStep(open ? null : i)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left text-base font-bold text-ink hover:text-primary focus-visible:outline-offset-[-3px] sm:px-6">
                  <span aria-hidden="true" className={`grid size-8 shrink-0 place-items-center rounded-full text-sm ${open ? "bg-primary text-white" : "bg-primary-soft text-primary"}`}>{i + 1}</span>
                  {title}
                  <ChevronDown aria-hidden="true" className={`ml-auto size-4 text-ink-muted motion-safe:transition-transform motion-safe:duration-200 ${open ? "rotate-180" : ""}`} />
                </button>
              </h3>
              <div id={`detail-langkah-${i}`} aria-hidden={!open} className={`grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-200 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="min-h-0 overflow-hidden">
                  <p className="pb-5 pl-[4.25rem] pr-5 text-sm leading-relaxed text-ink-secondary sm:pl-[4.5rem]">{detail}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
