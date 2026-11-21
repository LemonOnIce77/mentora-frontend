import { redirect } from "next/navigation";
import { getSessionHome } from "@/lib/session-home";
import Link from "next/link";
import Image from "next/image";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import LearningRoadmap from "@/components/LearningRoadmap";
import { ChevronDown } from "lucide-react";
import { ArrowRight, Check } from "@/components/animated-icons";

export default async function LandingPage() {
  const home = await getSessionHome();
  if (home) redirect(home);

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main>
        <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden bg-canvas min-h-[700px] lg:min-h-[720px] flex items-center">
          <div className="absolute inset-y-0 right-0 w-full lg:w-[75%] z-0 pointer-events-none">
            <Image
              src="/images/students-studying.jpg"
              alt="Mahasiswa belajar bersama"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 75vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-canvas/25" />
            <div className="absolute inset-0 hero-image-overlay" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-canvas" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
              <div className="max-w-[680px]">
                <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-ink tracking-tight leading-[1.12]">
                  Belajar bareng
                  <br />
                  mahasiswa lain,
                  <br />
                  <span className="text-primary">berkembang lewat skill.</span>
                </h1>

                <p className="text-base md:text-lg text-ink-secondary max-w-xl leading-relaxed mt-6">
                  Mentora adalah platform untuk mahasiswa belajar dari teman
                  sejawat, bertukar skill, dan berkembang lewat sesi belajar
                  yang fleksibel.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-7">
                  <Link
                    href="/auth?tab=daftar"
                    className="action-primary inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors"
                  >
                    <span>Mulai Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="#cara-kerja"
                    className="action-secondary inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors"
                  >
                    <span>Pelajari cara kerja</span>
                    <ChevronDown aria-hidden="true" className="size-4" />
                  </a>
                </div>
              </div>

              <div className="relative z-20 flex flex-col items-end justify-center gap-4 lg:pr-2">
                <div className="font-handwriting text-ink text-3xl font-bold leading-none text-right sm:text-4xl">
                  More Skills<br />Brighter Friends
                </div>

                <div className="w-full max-w-[390px] rounded-[26px] border border-primary-soft bg-primary-soft px-7 py-6 text-primary shadow-soft-card -rotate-1">
                  <p className="max-w-60 text-lg font-bold leading-snug sm:text-xl">
                    Skill baru ini bisa jadi peluang besar nanti!
                  </p>
                </div>

                <div className="w-full max-w-[400px] rounded-[24px] bg-surface px-7 py-6 shadow-soft-card rotate-1 border border-line">
                  <ul className="space-y-3 text-sm md:text-base font-semibold text-ink">
                    {["Skill baru", "Teman baru", "Peluang baru", "Versi terbaik dirimu"].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cara-kerja" aria-labelledby="judul-cara-kerja" className="bg-canvas py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <LearningRoadmap />

            <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl border border-line bg-white p-6 text-ink sm:p-8 md:flex-row md:items-center lg:mt-16 lg:p-10">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold">
                  Siap menemukan teman belajar?
                </h3>
                <p className="text-ink-secondary text-sm mt-2 max-w-xl leading-relaxed">
                  Buat profil, pilih skill yang ingin kamu pelajari, lalu temukan partner belajarmu.
                </p>
              </div>
              <Link href="/auth?tab=daftar" className="action-primary inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors">
                Mulai Sekarang <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
