"use client";

import { useSession } from "@/components/SessionProvider";
import { accountHome } from "@/lib/account-home";
import Link from "next/link";
import Image from "next/image";

import {
  Users,
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  TrendingUp,
} from "@/components/animated-icons";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const nilaiUtama = [
  {
    icon: Users,
    title: "Peer-to-Peer Learning",
    desc: "Belajar terasa lebih cair, relevan, dan minim intimidasi saat berdiskusi langsung dengan sesama mahasiswa yang baru saja melalui tantangan serupa.",
  },
  {
    icon: HeartHandshake,
    title: "Prinsip Resiprokal (Skill Exchange)",
    desc: "Setiap mahasiswa punya keunggulan unik. Mengajar skill yang kamu kuasai sekaligus belajar skill baru melalui ekosistem pertukaran nilai.",
  },
  {
    icon: ShieldCheck,
    title: "Kualifikasi Terverifikasi",
    desc: "Calon mentor melewati proses kurasi dokumen akademik dan portofolio oleh tim verifikator sebelum dapat membuka sesi mentoring.",
  },
  {
    icon: TrendingUp,
    title: "Portofolio Nyata",
    desc: "Bukan sekadar teori hafalan, sesi mentoring difokuskan pada pemecahan studi kasus, tugas besar perkuliahan, dan persiapan proyek kompetisi.",
  },
];

const statistik = [
  { angka: "100%", label: "Koneksi Mahasiswa Antar Kampus" },
  { angka: "1-on-1", label: "Mentoring Interaktif & Terarah" },
  { angka: "24/7", label: "Akses Komunitas Belajar" },
  { angka: "0 Rp", label: "Model Pertukaran Nilai Fair" },
];

export default function TentangPage() {
  const { profile: currentUser, authLoading: checkingAuth } = useSession();
  const home = currentUser ? accountHome(currentUser) : "/";

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden bg-canvas">
          <div className="absolute inset-0">
            <Image
              src="/images/about-team.jpg"
              alt="Tim pengembang Mentora"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-white/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-canvas/80 via-transparent to-canvas" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
            <span className="inline-flex rounded-full border border-line bg-white/80 px-5 py-2 text-sm font-bold text-primary mb-7">
              TENTANG INISIATIF MENTORA
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-ink">
              Menghubungkan Potensi,
              <span className="block text-primary">
                Berkembang Bersama Lewat Kolaborasi.
              </span>
            </h1>

            <p className="mt-7 max-w-3xl mx-auto text-lg leading-relaxed text-ink-secondary">
              Mentora adalah platform peer-to-peer skill exchange yang
              dirancang khusus bagi mahasiswa untuk saling berbagi keahlian,
              mendiskusikan tugas proyek, dan mempersiapkan jenjang karier
              secara kolaboratif.
            </p>
          </div>
        </section>

        <section id="visi-misi" aria-label="Visi dan misi Mentora" className="border-b border-line bg-surface px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-2 md:gap-16">
            <div className="rounded-3xl border border-primary-soft bg-primary-tint/70 p-6 sm:p-9 shadow-soft-card">
              <span className="inline-block rounded-full bg-primary px-3.5 py-1 text-xs font-bold text-white shadow-2xs">Visi Kami</span>
              <p className="mt-5 text-xl sm:text-2xl font-extrabold leading-snug tracking-tight text-ink">
                Menciptakan ekosistem pembelajaran sebaya digital nomor satu di lingkungan perguruan tinggi,
                di mana setiap mahasiswa memiliki akses setara untuk meningkatkan keahlian tanpa batasan biaya formalitas bimbingan belajar konvensional.
              </p>
              <p className="mt-6 border-t border-primary-soft pt-4 text-xs font-semibold text-ink-muted">Kolaboratif · Aksesibel · Berkelanjutan</p>
            </div>
            <div className="px-1 md:py-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">Misi Kami</h2>
              <ul className="mt-4 divide-y divide-line border-y border-line text-sm sm:text-base leading-relaxed text-ink-secondary">
                <li className="py-4">Menyediakan wadah terpercaya untuk pencocokan mentor dan mentee berbasis keahlian spesifik.</li>
                <li className="py-4">Menjamin kualitas sesi bimbingan melalui kurasi dan verifikasi dokumen portofolio secara transparan.</li>
                <li className="py-4">Mendorong mahasiswa mengasah keterampilan <em>soft skill</em> komunikasi dan kepemimpinan melalui pengajaran.</li>
              </ul>
              <p className="mt-4 text-xs font-semibold text-ink-muted">Transparansi · Pembelajaran Praktis</p>
            </div>
          </div>
        </section>

        {/* NILAI UTAMA */}
        <section className="py-16 sm:py-20 bg-canvas border-b border-line">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
                Mengapa Memilih Mentora?
              </h2>
              <p className="text-sm text-ink-muted">
                Pilar keunggulan sistem yang kami bangun untuk mendukung
                perkembangan belajar mahasiswa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {nilaiUtama.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-surface p-6 rounded-3xl border border-primary-soft shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary-tint text-primary border border-primary-soft flex items-center justify-center mb-5">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-ink mb-3">
                      {item.title}
                    </h3>
                    <p className="text-xs text-ink-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* STATISTIK */}
        <section className="py-14 sm:py-16 bg-surface border-b border-line">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {statistik.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-3xl sm:text-4xl font-extrabold text-primary">
                    {stat.angka}
                  </p>
                  <p className="text-xs sm:text-sm text-ink-muted font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA DINAMIS BERDASARKAN STATUS LOGIN */}
        {!checkingAuth && (
          <section className="py-16 sm:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
                {currentUser
                  ? "Siap Bertukar Keterampilan Hari Ini?"
                  : "Siap Bergabung dengan Mentora?"}
              </h2>

              <p className="text-sm text-ink-muted">
                {currentUser
                  ? `Halo, ${currentUser.namaPanggilan || currentUser.namaLengkap}! Lanjutkan perjalanan belajarmu dan temukan kesempatan berbagi ilmu bersama mahasiswa lainnya.`
                  : "Bergabunglah bersama mahasiswa lainnya dan perluas pengalaman belajarmu bersama Mentora."}
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {currentUser ? (
                  <Link
                    href={home}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full action-primary text-sm font-bold transition shadow-sm"
                  >
                    {home === "/admin" ? "Buka Portal Admin" : home === "/onboarding" ? "Lengkapi profil" : "Buka Dashboard"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href="/auth?tab=daftar"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full action-primary text-sm font-bold transition shadow-sm"
                  >
                    Daftar Akun Mentora
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                {!currentUser && <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-line text-ink-secondary hover:bg-canvas text-sm font-bold transition"
                >
                  Kembali ke Beranda
                </Link>}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
