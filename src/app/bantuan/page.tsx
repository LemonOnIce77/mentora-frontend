import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const topics = [
  {
    title: 'Akun dan Profil',
    description: 'Bantuan terkait login, registrasi, dan pengaturan profil.',
    questions: [
      'Bagaimana cara membuat akun Mentora?',
      'Bagaimana cara mengubah informasi profil?',
      'Bagaimana jika lupa password?',
    ],
  },
  {
    title: 'Mentor',
    description: 'Informasi mencari mentor dan proses menjadi mentor.',
    questions: [
      'Bagaimana cara mencari mentor?',
      'Bagaimana cara mendaftar menjadi mentor?',
      'Apa fungsi verifikasi mentor?',
    ],
  },
  {
    title: 'Sesi Belajar',
    description: 'Panduan pemesanan dan pengelolaan sesi belajar.',
    questions: [
      'Bagaimana cara memesan sesi belajar?',
      'Bagaimana cara mengatur jadwal sesi?',
      'Apakah sesi bisa dilakukan secara online?',
    ],
  },
  {
    title: 'EduPoints dan Sertifikat',
    description: 'Informasi mengenai poin dan sertifikat Mentora.',
    questions: [
      'Bagaimana cara mendapatkan EduPoints?',
      'Bagaimana cara menukarkan poin?',
      'Bagaimana mendapatkan sertifikat?',
    ],
  },
];

export default function BantuanPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-canvas text-ink">

        {/* Hero */}
        <section className="px-6 py-20 text-center">
          <span className="inline-block rounded-full bg-primary-tint px-5 py-2 text-sm font-bold text-primary">
            PUSAT BANTUAN MENTORA
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold">
            Ada yang bisa kami bantu?
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-ink-muted text-lg">
            Temukan panduan dan jawaban untuk membantu
            pengalaman belajarmu bersama Mentora.
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <Link
              href="/faq"
              className="block rounded-xl border border-line bg-surface px-5 py-4 text-left text-ink-muted shadow-sm hover:border-primary-accent"
            >
              Cari pertanyaan di halaman FAQ...
            </Link>
          </div>
        </section>

        {/* Topics */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="mb-10">
            <h2 className="text-2xl font-bold">
              Jelajahi Topik Bantuan
            </h2>
            <p className="mt-2 text-ink-muted">
              Pilih kategori sesuai informasi yang kamu butuhkan.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="rounded-2xl border border-line bg-surface p-7 shadow-sm"
              >

                <h3 className="text-xl font-bold">
                  {topic.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {topic.description}
                </p>

                <div className="mt-5 space-y-3">
                  {topic.questions.map((question, i) => (
                    <div
                      key={i}
                      className="border-b border-line pb-3"
                    >
                      <p className="text-sm text-ink-secondary">
                        {question}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/faq"
                  className="mt-5 inline-block font-semibold text-primary hover:text-primary-hover"
                >
                  Lihat FAQ →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-primary-soft bg-primary-tint p-10 md:flex-row">
            <div>
              <h2 className="text-2xl font-bold">
                Belum menemukan jawaban?
              </h2>
              <p className="mt-3 text-ink-muted">
                Kunjungi halaman FAQ untuk melihat
                kumpulan pertanyaan dan jawaban Mentora.
              </p>
            </div>

            <Link
              href="/faq"
              className="rounded-xl action-primary px-7 py-4 font-bold shadow-lg transition"
            >
              Lihat Semua FAQ →
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
