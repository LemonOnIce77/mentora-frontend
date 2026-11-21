export interface CommunityMentor {
  id: number;
  namaLengkap: string;
  namaPanggilan: string;
  universitas: string;
  prodi: string;
  semester: string;
  domisili: string;
  bio: string;
  fotoProfil: string;
  role: string;
  statusMentor: string;
  totalPoin: number;
  modeSesi: string;
  skills: Array<{
    id: number;
    skill: { id: number; namaSkill: string; kategori: string };
  }>;
}

export const DEFAULT_COMMUNITY_MENTORS: CommunityMentor[] = [
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
