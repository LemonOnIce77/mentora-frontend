
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[650px] overflow-hidden bg-[#FAFAFB] flex items-center">

      {/* BACKGROUND FOTO DI SISI KANAN */}
      <div className="absolute inset-y-0 right-0 w-[65%]">
        <Image
          src="/images/hero-mentora.jpg"
          alt="Mahasiswa belajar bersama"
          fill
          priority
          sizes="65vw"
          className="object-cover object-center"
        />

        {/* Transparansi foto */}
        <div className="absolute inset-0 bg-white/35" />

        {/* Gradasi agar foto menyatu dengan area teks kiri */}
        <div className="absolute inset-0 bg-gradient-to-r
          from-[#FAFAFB] via-[#FAFAFB]/70 to-transparent"
        />
      </div>

      {/* KONTEN UTAMA */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* BAGIAN KIRI */}
          <div className="max-w-[650px]">

            <div className="inline-flex items-center gap-2 rounded-full
              border border-blue-100 bg-blue-50 px-4 py-2 mb-6">
              <span className="text-blue-600">✧</span>
              <span className="text-xs font-bold tracking-wide text-blue-600">
                TEMUKAN BELAJAR, TUMBUH BERSAMA
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[58px]
              leading-[1.08] font-extrabold tracking-tight text-slate-900">
              Belajar bareng mahasiswa lain,
              <span className="text-blue-600">
                {' '}berkembang lewat skill.
              </span>
            </h1>

            <p className="mt-6 text-base md:text-lg leading-relaxed
              text-slate-600 max-w-xl">
              Mentora adalah platform untuk mahasiswa belajar dari teman
              sejawat, bertukar skill, dan berkembang lewat sesi belajar
              yang fleksibel.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/skills"
                className="rounded-full bg-blue-600 px-8 py-4
                  text-sm font-bold text-white shadow-lg
                  hover:bg-blue-700 transition"
              >
                Mulai Sekarang →
              </Link>

              <Link
                href="/tentang"
                className="rounded-full border border-slate-300
                  bg-white/90 px-8 py-4 text-sm font-bold
                  text-slate-700 hover:bg-slate-50 transition"
              >
                ▶ Lihat Cara Kerja
              </Link>
            </div>

          </div>

          {/* BAGIAN KANAN: TETAP ADA DI DEPAN FOTO */}
          <div className="relative z-20 flex flex-col items-end
            justify-center gap-5 lg:pr-2">

            {/* TAGLINE */}
            <div className="font-handwriting text-blue-950
              text-3xl md:text-4xl font-bold leading-tight
              text-right mb-1">
              More Skills
              <br />
              Brighter Friends ✨
            </div>

            {/* KARTU BIRU */}
            <div className="w-full max-w-[390px]
              rounded-[28px] bg-blue-600/95
              px-7 py-6 text-white shadow-xl
              -rotate-1">
              <p className="text-base md:text-lg font-bold leading-snug">
                Skill baru ini
                <br />
                bisa jadi peluang
                <br />
                besar nanti! ✨
              </p>
            </div>

            {/* KARTU KUNING */}
            <div className="w-full max-w-[400px]
              rounded-[24px] bg-yellow-200/95
              px-7 py-6 shadow-lg rotate-1">
              <ul className="space-y-3 text-sm md:text-base
                font-semibold text-slate-900">
                {[
                  'Skill baru',
                  'Teman baru',
                  'Peluang baru',
                  'Versi terbaik dirimu',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center
                      justify-center rounded-full bg-emerald-500
                      text-white text-sm">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* GRADASI BAWAH AGAR MENYATU DENGAN SECTION BERIKUTNYA */}
      <div className="absolute bottom-0 left-0 right-0 h-20
        bg-gradient-to-b from-transparent to-[#FAFAFB]
        pointer-events-none z-10" />

    </section>
  );
}
