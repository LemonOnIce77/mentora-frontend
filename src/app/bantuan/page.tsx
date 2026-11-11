import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const topics = [
  {
    icon: '👤',
    title: 'Akun dan Profil',
    description: 'Bantuan terkait login, registrasi, dan pengaturan profil.',
    questions: [
      'Bagaimana cara membuat akun Mentora?',
      'Bagaimana cara mengubah informasi profil?',
      'Bagaimana jika lupa password?',
    ],
  },
  {
    icon: '🎓',
    title: 'Mentor',
    description: 'Informasi mencari mentor dan proses menjadi mentor.',
    questions: [
      'Bagaimana cara mencari mentor?',
      'Bagaimana cara mendaftar menjadi mentor?',
      'Apa fungsi verifikasi mentor?',
    ],
  },
  {
    icon: '📅',
    title: 'Sesi Belajar',
    description: 'Panduan pemesanan dan pengelolaan sesi belajar.',
    questions: [
      'Bagaimana cara memesan sesi belajar?',
      'Bagaimana cara mengatur jadwal sesi?',
      'Apakah sesi bisa dilakukan secara online?',
    ],
  },
  {
    icon: '🏆',
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

      <main className="min-h-screen bg-[#FAFAFB] text-slate-900">

        {/* Hero */}
        <section className="px-6 py-20 text-center">
          <span className="inline-block rounded-full bg-blue-50 px-5 py-2 text-sm font-bold text-blue-600">
            PUSAT BANTUAN MENTORA
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold">
            Ada yang bisa kami bantu?
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500 text-lg">
            Temukan panduan dan jawaban untuk membantu
            pengalaman belajarmu bersama Mentora.
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <Link
              href="/faq"
              className="block rounded-xl border border-slate-200 bg-white px-5 py-4 text-left text-slate-400 shadow-sm hover:border-blue-300"
            >
              🔍 Cari pertanyaan di halaman FAQ...
            </Link>
          </div>
        </section>

        {/* Topics */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="mb-10">
            <h2 className="text-2xl font-bold">
              Jelajahi Topik Bantuan
            </h2>
            <p className="mt-2 text-slate-500">
              Pilih kategori sesuai informasi yang kamu butuhkan.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="text-3xl">{topic.icon}</div>

                <h3 className="mt-4 text-xl font-bold">
                  {topic.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {topic.description}
                </p>

                <div className="mt-5 space-y-3">
                  {topic.questions.map((question, i) => (
                    <div
                      key={i}
                      className="border-b border-slate-100 pb-3"
                    >
                      <p className="text-sm text-slate-700">
                        {question}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/faq"
                  className="mt-5 inline-block font-semibold text-blue-600 hover:text-blue-700"
                >
                  Lihat FAQ →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-blue-100 bg-blue-50 p-10 md:flex-row">
            <div>
              <h2 className="text-2xl font-bold">
                Belum menemukan jawaban?
              </h2>
              <p className="mt-3 text-slate-500">
                Kunjungi halaman FAQ untuk melihat
                kumpulan pertanyaan dan jawaban Mentora.
              </p>
            </div>

            <Link
              href="/faq"
              className="rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-lg transition hover:bg-blue-700"
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
