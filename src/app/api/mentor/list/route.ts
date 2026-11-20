import { NextRequest, NextResponse } from 'next/server';
import { verifiedMentor } from '@/lib/mentor-eligibility';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Seed mentor cadangan saat database cloud belum tersambung
const DEFAULT_COMMUNITY_MENTORS = [
  {
    id: 4,
    namaLengkap: "Sulthoni Prima Rafasya",
    namaPanggilan: "Sulthoni",
    universitas: "Universitas Telkom",
    prodi: "Informatika",
    semester: "6",
    domisili: "Bandung, Jawa Barat",
    bio: "Pengembang fullstack dan pegiat competitive programming. Senang berbagi logika pemrograman dan backend web.",
    fotoProfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    role: "Mentor",
    statusMentor: "APPROVED",
    totalPoin: 45,
    modeSesi: "Fleksibel",
    skills: [
      { id: 20, skill: { id: 20, namaSkill: "Programming", kategori: "Pemrograman Web" } },
      { id: 21, skill: { id: 21, namaSkill: "Web Development", kategori: "Pemrograman Web" } },
    ],
  },
  {
    id: 5,
    namaLengkap: "Aulia Rahisa Putri",
    namaPanggilan: "Aulia",
    universitas: "Universitas Telkom",
    prodi: "Desain Komunikasi Visual",
    semester: "4",
    domisili: "Depok, Jawa Barat",
    bio: "Mahasiswa DKV yang berfokus pada desain produk, visual branding, dan perancangan prototipe interaktif di Figma.",
    fotoProfil: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    role: "Mentor",
    statusMentor: "APPROVED",
    totalPoin: 30,
    modeSesi: "Online",
    skills: [
      { id: 16, skill: { id: 16, namaSkill: "UI/UX Design", kategori: "Desain UI/UX" } },
      { id: 17, skill: { id: 17, namaSkill: "Figma", kategori: "Desain UI/UX" } },
      { id: 19, skill: { id: 19, namaSkill: "Design Thinking", kategori: "Desain UI/UX" } },
    ],
  },
  {
    id: 7,
    namaLengkap: "Nara (Mentor Contoh)",
    namaPanggilan: "Nara",
    universitas: "Universitas Contoh Mentora",
    prodi: "Sistem Informasi",
    semester: "6",
    domisili: "Surabaya",
    bio: "Senang mengulik dasar logika pemrograman, HTML, CSS, hingga web modern secara bertahap dan santai.",
    fotoProfil: "",
    role: "Mentor",
    statusMentor: "APPROVED",
    totalPoin: 20,
    modeSesi: "Online",
    skills: [
      { id: 20, skill: { id: 20, namaSkill: "Programming", kategori: "Pemrograman Web" } },
      { id: 21, skill: { id: 21, namaSkill: "Web Development", kategori: "Pemrograman Web" } },
    ],
  },
  {
    id: 901,
    namaLengkap: "Rangga Pratama",
    namaPanggilan: "Rangga",
    universitas: "Universitas Telkom",
    prodi: "Teknik Informatika",
    semester: "6",
    domisili: "Bandung",
    bio: "Fokus ke struktur data, algoritma, dan persiapan technical interview untuk magang pertama kamu.",
    fotoProfil: "",
    role: "Mentor",
    statusMentor: "APPROVED",
    totalPoin: 41,
    modeSesi: "Online",
    skills: [
      { id: 101, skill: { id: 1, namaSkill: "Programming", kategori: "Teknologi" } },
      { id: 102, skill: { id: 2, namaSkill: "Data Analysis", kategori: "Data" } },
    ],
  },
  {
    id: 902,
    namaLengkap: "Alya Syahrani",
    namaPanggilan: "Alya",
    universitas: "Universitas Telkom",
    prodi: "Desain Komunikasi Visual",
    semester: "4",
    domisili: "Bandung",
    bio: "Membantu menyusun case study portofolio UI/UX dari riset kecil sampai prototipe yang rapi di Figma.",
    fotoProfil: "",
    role: "Mentor",
    statusMentor: "APPROVED",
    totalPoin: 33,
    modeSesi: "Online",
    skills: [
      { id: 103, skill: { id: 3, namaSkill: "UI/UX Design", kategori: "Desain" } },
    ],
  },
  {
    id: 903,
    namaLengkap: "Bima Saputra",
    namaPanggilan: "Bima",
    universitas: "Institut Teknologi Sepuluh Nopember",
    prodi: "Teknik Informatika",
    semester: "5",
    domisili: "Surabaya",
    bio: "Ngulik React, API, dan deployment. Senang menemani teman yang baru pertama kali membangun aplikasi web utuh.",
    fotoProfil: "",
    role: "Mentor",
    statusMentor: "APPROVED",
    totalPoin: 18,
    modeSesi: "Online",
    skills: [
      { id: 104, skill: { id: 4, namaSkill: "Web Development", kategori: "Teknologi" } },
      { id: 105, skill: { id: 1, namaSkill: "Programming", kategori: "Teknologi" } },
    ],
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const skillQuery = searchParams.get('skill');
  const searchQuery = searchParams.get('q');

  try {
    const mentors = await prisma.users.findMany({
      where: {
        ...verifiedMentor,
        ...(searchQuery
          ? {
              OR: [
                { nama_lengkap: { contains: searchQuery } },
                { universitas: { contains: searchQuery } },
                { prodi: { contains: searchQuery } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        nama_lengkap: true,
        nama_panggilan: true,
        universitas: true,
        prodi: true,
        semester: true,
        domisili: true,
        bio: true,
        foto_profil: true,
        role: true,
        status_mentor: true,
        total_poin: true,
        mode_sesi: true,
        user_skills: {
          where: { type: 'teach' },
          include: { skills: true },
        },
      },
      orderBy: { total_poin: 'desc' },
    });

    let mappedMentors = mentors.map((m) => ({
      id: Number(m.id),
      namaLengkap: m.nama_lengkap,
      namaPanggilan: m.nama_panggilan ?? '',
      universitas: m.universitas ?? '',
      prodi: m.prodi ?? '',
      semester: m.semester ?? '',
      domisili: m.domisili ?? '',
      bio: m.bio ?? '',
      fotoProfil: m.foto_profil ?? '',
      role: m.role,
      statusMentor: m.status_mentor,
      totalPoin: m.total_poin,
      modeSesi: m.mode_sesi,
      skills: m.user_skills.map((us) => ({
        id: Number(us.id),
        skill: {
          id: Number(us.skills.id),
          namaSkill: us.skills.nama_skill,
          kategori: us.skills.kategori,
        },
      })),
    }));

    // Bila data dari DB lokal sedikit, gabungkan mentor komunitas
    if (mappedMentors.length < 3) {
      mappedMentors = [
        ...mappedMentors,
        ...DEFAULT_COMMUNITY_MENTORS.filter(
          (cm) => !mappedMentors.some((m) => m.id === cm.id)
        ),
      ];
    }

    if (skillQuery) {
      mappedMentors = mappedMentors.filter((m) =>
        m.skills.some((s) => s.skill.namaSkill.toLowerCase().includes(skillQuery.toLowerCase()))
      );
    }
    return NextResponse.json({ mentors: mappedMentors });
  } catch (error) {
    console.warn('DB offline saat memuat mentor, memakai data cadangan komunitas:', error);

    // Fallback data langsung agar dashboard tidak error di serverless
    let fallback = DEFAULT_COMMUNITY_MENTORS;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      fallback = fallback.filter((m) =>
        [m.namaLengkap, m.universitas, m.prodi, m.domisili].some((v) =>
          v.toLowerCase().includes(q)
        )
      );
    }
    if (skillQuery) {
      fallback = fallback.filter((m) =>
        m.skills.some((s) => s.skill.namaSkill.toLowerCase().includes(skillQuery.toLowerCase()))
      );
    }
    return NextResponse.json({ mentors: fallback });
  }
}
