
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronDown,
  ExternalLink,
  CircleHelp,
  UserRound,
  GraduationCap,
  CalendarDays,
  Award,
} from 'lucide-react';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const categories = [
  'Semua Topik',
  'Umum',
  'Mentor',
  'Sesi',
  'Akun',
  'EduPoints',
];

const faqData = [
  {
    category: 'Umum',
    questions: [
      {
        question: 'Apa itu platform Mentora?',
        answer:
          'Mentora adalah platform Peer-to-Peer Skill Exchange yang memungkinkan mahasiswa saling berbagi pengetahuan, bertukar keterampilan, dan belajar bersama teman mahasiswa lainnya.',
      },
      {
        question: 'Siapa saja yang bisa menggunakan Mentora?',
        answer:
          'Mentora ditujukan bagi mahasiswa yang ingin mengembangkan keterampilan, mencari teman belajar, maupun berbagi pengetahuan sebagai mentor.',
      },
      {
        question: 'Apakah Mentora dapat digunakan secara gratis?',
        answer:
          'Mentora dikembangkan sebagai platform pembelajaran kolaboratif mahasiswa. Informasi mengenai ketentuan penggunaan dapat dilihat melalui fitur dan informasi yang tersedia di platform.',
      },
      {
        question: 'Bagaimana cara kerja platform Mentora?',
        answer:
          'Pengguna dapat membuat profil, melengkapi informasi keterampilan, mencari partner belajar, dan mengikuti sesi pembelajaran bersama mentor atau mahasiswa lainnya.',
      },
    ],
  },
  {
    category: 'Mentor',
    questions: [
      {
        question: 'Bagaimana cara mencari mentor?',
        answer:
          'Kamu dapat membuka Dashboard, kemudian melihat daftar mentor yang tersedia. Gunakan pencarian dan filter keterampilan untuk menemukan mentor yang sesuai dengan kebutuhanmu.',
      },
      {
        question: 'Bagaimana cara mendaftar menjadi mentor?',
        answer:
          'Lengkapi profil dan keterampilan yang kamu kuasai. Selanjutnya, gunakan fitur pengajuan mentor untuk mengikuti proses pendaftaran dan verifikasi.',
      },
      {
        question: 'Apa fungsi verifikasi mentor?',
        answer:
          'Verifikasi mentor digunakan untuk memastikan informasi dan kredibilitas calon mentor sebelum mendapatkan status mentor terverifikasi di Mentora.',
      },
      {
        question: 'Apakah saya bisa menjadi mentor sekaligus mentee?',
        answer:
          'Ya. Mahasiswa dapat berbagi keterampilan yang dikuasai sekaligus mempelajari keterampilan baru dari mahasiswa lainnya.',
      },
    ],
  },
  {
    category: 'Sesi',
    questions: [
      {
        question: 'Bagaimana cara memesan sesi belajar?',
        answer:
          'Pilih mentor yang sesuai melalui Dashboard, kemudian gunakan fitur sesi atau booking untuk mengatur pembelajaran bersama mentor tersebut.',
      },
      {
        question: 'Apakah sesi belajar bisa dilakukan secara online dan offline?',
        answer:
          'Ya. Mentora mendukung pembelajaran secara online maupun offline sesuai kesepakatan dan ketersediaan mentor.',
      },
      {
        question: 'Bagaimana cara mengatur jadwal sesi?',
        answer:
          'Diskusikan jadwal dengan mentor melalui fitur komunikasi yang tersedia, kemudian sesuaikan waktu pembelajaran berdasarkan kesepakatan bersama.',
      },
      {
        question: 'Apakah saya bisa membatalkan sesi belajar?',
        answer:
          'Jika terdapat perubahan jadwal, komunikasikan terlebih dahulu dengan mentor dan ikuti ketentuan pengelolaan sesi yang tersedia pada platform.',
      },
    ],
  },
  {
    category: 'Akun',
    questions: [
      {
        question: 'Bagaimana cara membuat akun Mentora?',
        answer:
          'Buka halaman registrasi, kemudian lengkapi informasi yang diminta. Setelah proses pendaftaran selesai, kamu dapat masuk menggunakan akun yang telah dibuat.',
      },
      {
        question: 'Bagaimana cara mengubah informasi profil?',
        answer:
          'Masuk ke Dashboard, buka bagian Manajemen Profil, kemudian perbarui informasi yang ingin kamu ubah.',
      },
      {
        question: 'Bagaimana jika saya lupa password?',
        answer:
          'Gunakan pilihan Lupa Password pada halaman login apabila tersedia, kemudian ikuti instruksi pemulihan akun.',
      },
    ],
  },
  {
    category: 'EduPoints',
    questions: [
      {
        question: 'Apa itu EduPoints?',
        answer:
          'EduPoints merupakan sistem poin penghargaan di Mentora yang dapat dikumpulkan melalui aktivitas berbagi keterampilan dan membantu mahasiswa lainnya.',
      },
      {
        question: 'Bagaimana cara mendapatkan EduPoints?',
        answer:
          'Kamu dapat memperoleh EduPoints melalui aktivitas pembelajaran dan kontribusi sebagai mentor sesuai mekanisme yang diterapkan oleh Mentora.',
      },
      {
        question: 'Apakah EduPoints bisa ditukarkan dengan sertifikat?',
        answer:
          'EduPoints dirancang untuk mendukung sistem penghargaan dan perolehan e-certificate sebagai bagian dari pengembangan portofolio mahasiswa.',
      },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('Semua Topik');
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const filteredFAQ = useMemo(() => {
    return faqData
      .filter(
        (group) =>
          activeCategory === 'Semua Topik' ||
          group.category === activeCategory
      )
      .map((group) => ({
        ...group,
        questions: group.questions.filter((item) => {
          const search = searchQuery.toLowerCase();

          return (
            item.question.toLowerCase().includes(search) ||
            item.answer.toLowerCase().includes(search)
          );
        }),
      }))
      .filter((group) => group.questions.length > 0);
  }, [activeCategory, searchQuery]);

  const toggleQuestion = (question: string) => {
    setOpenQuestion((current) =>
      current === question ? null : question
    );
  };

  const categoryIcons = [
    { name: 'Umum', icon: CircleHelp },
    { name: 'Mentor', icon: GraduationCap },
    { name: 'Sesi', icon: CalendarDays },
    { name: 'Akun', icon: UserRound },
    { name: 'EduPoints', icon: Award },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAFAFB] text-slate-900">

        {/* HERO FAQ */}
        <section className="border-b border-slate-100 bg-white px-4 py-16 md:py-20">
          <div className="mx-auto max-w-5xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-5 py-2 text-sm font-bold tracking-wide text-blue-600">
              <CircleHelp size={17} />
              PUSAT BANTUAN & TANYA JAWAB
            </div>

            <h1 className="mt-7 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
              Pertanyaan yang Sering{' '}
              <span className="text-blue-600">
                Diajukan
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">
              Temukan jawaban seputar cara kerja platform,
              mekanisme verifikasi mentor, pelaksanaan sesi,
              dan pengelolaan akun Mentora.
            </p>

            {/* SEARCH */}
            <div className="mx-auto mt-9 max-w-2xl">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50">
                <Search
                  size={21}
                  className="shrink-0 text-slate-400"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setOpenQuestion(null);
                  }}
                  placeholder="Cari pertanyaan (misal: verifikasi mentor, sesi, akun)..."
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 md:text-base"
                />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ CONTENT */}
        <section className="mx-auto max-w-5xl px-4 py-14 md:py-16">

          {/* CATEGORY FILTER */}
          <div className="mb-12">
            <div className="mb-5 text-center">
              <h2 className="text-xl font-bold text-slate-900">
                Jelajahi Berdasarkan Topik
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Pilih kategori untuk menemukan jawaban yang kamu cari.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => {
                const active = activeCategory === category;

                return (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setOpenQuestion(null);
                    }}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      active
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* QUESTION LIST */}
          <div className="space-y-10">

            {filteredFAQ.length > 0 ? (
              filteredFAQ.map((group) => {
                const CategoryIcon =
                  categoryIcons.find(
                    (item) => item.name === group.category
                  )?.icon || CircleHelp;

                return (
                  <div key={group.category}>

                    {/* CATEGORY TITLE */}
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <CategoryIcon size={22} />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {group.category}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {group.questions.length} pertanyaan
                        </p>
                      </div>
                    </div>

                    {/* ACCORDION */}
                    <div className="space-y-3">
                      {group.questions.map((item) => {
                        const isOpen =
                          openQuestion === item.question;

                        return (
                          <div
                            key={item.question}
                            className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                              isOpen
                                ? 'border-blue-200 shadow-md shadow-blue-50'
                                : 'border-slate-200 shadow-sm hover:border-blue-200'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggleQuestion(item.question)
                              }
                              aria-expanded={isOpen}
                              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-7"
                            >
                              <span className="text-sm font-semibold leading-relaxed text-slate-800 md:text-base">
                                {item.question}
                              </span>

                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                                  isOpen
                                    ? 'rotate-180 bg-blue-600 text-white'
                                    : 'bg-blue-50 text-blue-600'
                                }`}
                              >
                                <ChevronDown size={19} />
                              </span>
                            </button>

                            {isOpen && (
                              <div className="border-t border-slate-100 px-5 py-5 md:px-7">
                                <p className="text-sm leading-7 text-slate-500 md:text-base">
                                  {item.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
                <Search
                  size={40}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-5 text-xl font-bold text-slate-800">
                  Pertanyaan tidak ditemukan
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Coba gunakan kata kunci lain atau pilih kategori berbeda.
                </p>

                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('Semua Topik');
                  }}
                  className="mt-5 font-semibold text-blue-600 hover:text-blue-700"
                >
                  Tampilkan Semua Pertanyaan
                </button>
              </div>
            )}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-16 md:pb-20">
          <div className="flex flex-col items-center justify-between gap-7 rounded-3xl border border-blue-100 bg-blue-50 px-7 py-10 md:flex-row md:px-12 md:py-12">

            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Masih memiliki pertanyaan lain?
              </h2>

              <p className="mt-4 text-base leading-relaxed text-slate-500 md:text-lg">
                Tim bantuan mahasiswa Mentora siap membantu
                kendala teknis dan sesi belajarmu.
              </p>
            </div>

            <Link
              href="/bantuan"
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:-translate-y-1 hover:bg-blue-700"
            >
              <ExternalLink size={20} />
              Pusat Bantuan
            </Link>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
