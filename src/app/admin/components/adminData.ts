export type TabKey = "overview" | "verification" | "mentors";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type Submission = {
  id: string;
  realId?: number;
  name: string;
  email: string;
  initials: string;
  tone: string;
  university: string;
  program: string;
  semester: string;
  city: string;
  skills: string[];
  experience: string;
  documentName: string;
  documentUrl: string;
  status: SubmissionStatus;
  rejectionReason?: string;
  submittedAt: string;
};

export type Mentor = {
  id: string;
  name: string;
  initials: string;
  tone: string;
  program: string;
  university: string;
  city: string;
  mode: "Online" | "Tatap Muka";
  skills: string[];
  eduPoints: number;
};

export type ToastItem = {
  id: string;
  tone: "success" | "danger";
  title: string;
  message: string;
};

const DOC = "/uploads/Transkrip_Kredensial_Resmi.pdf";

// Nada avatar konsisten & tenang sesuai konsep Mentora (tanpa warna pelangi mencolok)
const CALM_AVATAR = "bg-primary-soft text-primary border border-primary/20";

export const initialSubmissions: Submission[] = [
  {
    id: "SUB-1041",
    realId: 1041,
    name: "Nadia Pramesti",
    email: "nadia.pramesti@student.untar.ac.id",
    initials: "NP",
    tone: CALM_AVATAR,
    university: "Universitas Tarumanagara",
    program: "Desain Komunikasi Visual",
    semester: "Semester 6",
    city: "Jakarta Barat",
    skills: ["UI/UX Design", "Figma", "Design Thinking"],
    experience:
      "Asisten praktikum mata kuliah Perancangan Antarmuka selama 2 semester, serta mendampingi 14 mahasiswa tingkat awal dalam menyusun portofolio desain pertama mereka.",
    documentName: "Transkrip_Nilai_DKV.pdf",
    documentUrl: DOC,
    status: "pending",
    submittedAt: "2 jam lalu",
  },
  {
    id: "SUB-1040",
    realId: 1040,
    name: "Rafi Alfarizi",
    email: "rafi.alfarizi@students.itb.ac.id",
    initials: "RA",
    tone: CALM_AVATAR,
    university: "Institut Teknologi Bandung",
    program: "Teknik Informatika",
    semester: "Semester 7",
    city: "Bandung",
    skills: ["Algoritma & Struktur Data", "Python", "Competitive Programming"],
    experience:
      "Tutor laboratorium Pemrograman Dasar sejak 2023 dan pelatih tim olimpiade pemrograman fakultas dengan kelas rutin dua kali sepekan.",
    documentName: "Sertifikat_Asisten_Lab_IF.pdf",
    documentUrl: DOC,
    status: "pending",
    submittedAt: "5 jam lalu",
  },
  {
    id: "SUB-1039",
    realId: 1039,
    name: "Salsabila Hanum",
    email: "salsabila.hanum@mail.ugm.ac.id",
    initials: "SH",
    tone: CALM_AVATAR,
    university: "Universitas Gadjah Mada",
    program: "Akuntansi",
    semester: "Semester 5",
    city: "Yogyakarta",
    skills: ["Akuntansi Keuangan", "Excel Lanjutan", "Analisis Laporan"],
    experience:
      "Mendampingi kelompok belajar Akuntansi Dasar beranggotakan 20 mahasiswa dan menjadi asisten dosen untuk kelas Praktikum Pengantar Akuntansi.",
    documentName: "Transkrip_Nilai_Akuntansi.pdf",
    documentUrl: DOC,
    status: "pending",
    submittedAt: "1 hari lalu",
  },
  {
    id: "SUB-1038",
    realId: 1038,
    name: "Dimas Anggara",
    email: "dimas.anggara@student.undip.ac.id",
    initials: "DA",
    tone: CALM_AVATAR,
    university: "Universitas Diponegoro",
    program: "Ilmu Komunikasi",
    semester: "Semester 6",
    city: "Semarang",
    skills: ["Public Speaking", "Copywriting", "Social Media Strategy"],
    experience:
      "Fasilitator pelatihan public speaking internal kampus sebanyak 9 batch serta mentor klub debat bahasa Indonesia tingkat fakultas.",
    documentName: "Portofolio_Pelatihan_Komunikasi.pdf",
    documentUrl: DOC,
    status: "pending",
    submittedAt: "1 hari lalu",
  },
  {
    id: "SUB-1037",
    realId: 1037,
    name: "Kirana Maheswari",
    email: "kirana.maheswari@student.unair.ac.id",
    initials: "KM",
    tone: CALM_AVATAR,
    university: "Universitas Airlangga",
    program: "Statistika",
    semester: "Semester 8",
    city: "Surabaya",
    skills: ["Statistika Terapan", "SPSS", "Data Visualization"],
    experience:
      "Asisten praktikum Metode Statistika selama 3 semester dan pembimbing olah data skripsi untuk 11 mahasiswa tingkat akhir.",
    documentName: "Surat_Keterangan_Asisten.pdf",
    documentUrl: DOC,
    status: "pending",
    submittedAt: "2 hari lalu",
  },
  {
    id: "SUB-1036",
    realId: 1036,
    name: "Bagas Wicaksono",
    email: "bagas.wicaksono@student.ui.ac.id",
    initials: "BW",
    tone: CALM_AVATAR,
    university: "Universitas Indonesia",
    program: "Sistem Informasi",
    semester: "Semester 7",
    city: "Depok",
    skills: ["Basis Data", "Laravel", "System Analysis"],
    experience:
      "Koordinator asisten laboratorium Basis Data dan mentor bootcamp web internal himpunan mahasiswa selama dua periode.",
    documentName: "Transkrip_Nilai_SI.pdf",
    documentUrl: DOC,
    status: "approved",
    submittedAt: "4 hari lalu",
  },
  {
    id: "SUB-1035",
    realId: 1035,
    name: "Alya Rahmadani",
    email: "alya.rahmadani@student.telkomuniversity.ac.id",
    initials: "AR",
    tone: CALM_AVATAR,
    university: "Telkom University",
    program: "Desain Produk",
    semester: "Semester 6",
    city: "Bandung",
    skills: ["Sketching", "Rhinoceros 3D", "Product Research"],
    experience:
      "Mentor studio desain produk untuk mahasiswa semester dua serta juri internal pameran karya tingkat program studi.",
    documentName: "Portofolio_Desain_Produk.pdf",
    documentUrl: DOC,
    status: "approved",
    submittedAt: "5 hari lalu",
  },
  {
    id: "SUB-1034",
    realId: 1034,
    name: "Yoga Prasetya",
    email: "yoga.prasetya@student.unpad.ac.id",
    initials: "YP",
    tone: CALM_AVATAR,
    university: "Universitas Padjadjaran",
    program: "Manajemen",
    semester: "Semester 4",
    city: "Bandung",
    skills: ["Manajemen Keuangan", "Business Plan"],
    experience:
      "Baru mengikuti satu kegiatan pendampingan kelompok belajar dan belum memiliki rekam jejak pengajaran terstruktur.",
    documentName: "Scan_Kartu_Mahasiswa.pdf",
    documentUrl: DOC,
    status: "rejected",
    rejectionReason:
      "Dokumen kredensial yang diunggah belum berupa transkrip nilai resmi dan pengalaman mengajar belum memenuhi standar minimum Mentora.",
    submittedAt: "6 hari lalu",
  },
];

export const mentors: Mentor[] = [
  {
    id: "MTR-201",
    name: "Bagas Wicaksono",
    initials: "BW",
    tone: CALM_AVATAR,
    program: "Sistem Informasi",
    university: "Universitas Indonesia",
    city: "Depok",
    mode: "Online",
    skills: ["Basis Data", "Laravel", "System Analysis", "SQL"],
    eduPoints: 120,
  },
  {
    id: "MTR-202",
    name: "Alya Rahmadani",
    initials: "AR",
    tone: CALM_AVATAR,
    program: "Desain Produk",
    university: "Telkom University",
    city: "Bandung",
    mode: "Tatap Muka",
    skills: ["Sketching", "Rhinoceros 3D", "Product Research"],
    eduPoints: 96,
  },
  {
    id: "MTR-203",
    name: "Farhan Maulana",
    initials: "FM",
    tone: CALM_AVATAR,
    program: "Teknik Elektro",
    university: "Institut Teknologi Sepuluh Nopember",
    city: "Surabaya",
    mode: "Online",
    skills: ["Mikrokontroler", "IoT", "Arduino", "Embedded C", "PCB Design"],
    eduPoints: 184,
  },
  {
    id: "MTR-204",
    name: "Tiara Oktaviani",
    initials: "TO",
    tone: CALM_AVATAR,
    program: "Sastra Inggris",
    university: "Universitas Negeri Malang",
    city: "Malang",
    mode: "Online",
    skills: ["IELTS Preparation", "Academic Writing", "Conversation Class"],
    eduPoints: 142,
  },
  {
    id: "MTR-205",
    name: "Reza Hidayat",
    initials: "RH",
    tone: CALM_AVATAR,
    program: "Ilmu Hukum",
    university: "Universitas Brawijaya",
    city: "Malang",
    mode: "Tatap Muka",
    skills: ["Hukum Perdata", "Legal Drafting", "Moot Court", "Legal Opinion"],
    eduPoints: 88,
  },
  {
    id: "MTR-206",
    name: "Gita Larasati",
    initials: "GL",
    tone: CALM_AVATAR,
    program: "Psikologi",
    university: "Universitas Padjadjaran",
    city: "Bandung",
    mode: "Online",
    skills: ["Metodologi Penelitian", "SPSS", "Psikologi Kognitif"],
    eduPoints: 131,
  },
  {
    id: "MTR-207",
    name: "Arif Nugroho",
    initials: "AN",
    tone: CALM_AVATAR,
    program: "Teknik Industri",
    university: "Universitas Sebelas Maret",
    city: "Surakarta",
    mode: "Tatap Muka",
    skills: ["Lean Manufacturing", "Six Sigma", "Supply Chain"],
    eduPoints: 77,
  },
  {
    id: "MTR-208",
    name: "Meutia Zahra",
    initials: "MZ",
    tone: CALM_AVATAR,
    program: "Kedokteran Gigi",
    university: "Universitas Sumatera Utara",
    city: "Medan",
    mode: "Online",
    skills: ["Anatomi", "Histologi", "Skill Lab Preparation"],
    eduPoints: 160,
  },
  {
    id: "MTR-209",
    name: "Daniel Kusuma",
    initials: "DK",
    tone: CALM_AVATAR,
    program: "Ilmu Komputer",
    university: "Universitas Bina Nusantara",
    city: "Jakarta Selatan",
    mode: "Online",
    skills: ["React", "TypeScript", "Frontend Architecture", "Tailwind CSS"],
    eduPoints: 205,
  },
];

export const TOTAL_SUBMISSIONS = 28;
export const BASE_ACTIVE_MENTORS = 23;

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
