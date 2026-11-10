export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface MentorDocument {
  id: string;
  namaDokumen: string;
  jenis: 'CV' | 'SERTIFIKAT' | 'PORTOFOLIO' | 'TRANSKRIP';
  url: string;
  ukuran: string;
}

export interface MentorApplication {
  id: string;
  userId: string;
  namaLengkap: string;
  email: string;
  nim: string;
  universitas: string;
  prodi: string;
  semester: string;
  ipk: string;
  keahlianDiajukan: string[];
  motivasi: string;
  pengalamanSingkat: string;
  tanggalPengajuan: string;
  status: VerificationStatus;
  alasanPenolakan?: string;
  dokumen: MentorDocument[];
}

export const INITIAL_APPLICATIONS: MentorApplication[] = [
  {
    id: 'APP-2026-001',
    userId: 'USR-101',
    namaLengkap: 'Rizky Pratama Putra',
    email: 'rizky.pratama@student.telkomuniversity.ac.id',
    nim: '102062400045',
    universitas: 'Telkom University Surabaya',
    prodi: 'Sistem Informasi',
    semester: '5',
    ipk: '3.78',
    keahlianDiajukan: ['Next.js & TypeScript', 'UI/UX Design (Figma)', 'Tailwind CSS'],
    motivasi: 'Ingin membantu mahasiswa tingkat awal memahami fundamental pengembangan web modern dan membangun portofolio proyek nyata.',
    pengalamanSingkat: 'Asisten Praktikum Pemrograman Web (2025), Juara 2 UI/UX Nasional GEMASTIK, Frontend Developer Intern.',
    tanggalPengajuan: '2026-11-08T14:30:00Z',
    status: 'PENDING',
    dokumen: [
      {
        id: 'DOC-01',
        namaDokumen: 'CV_Rizky_Pratama_2026.pdf',
        jenis: 'CV',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        ukuran: '1.2 MB',
      },
      {
        id: 'DOC-02',
        namaDokumen: 'Sertifikat_Asisten_Praktikum_Web.pdf',
        jenis: 'SERTIFIKAT',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        ukuran: '840 KB',
      },
      {
        id: 'DOC-03',
        namaDokumen: 'KHS_Transkrip_Semester_4.pdf',
        jenis: 'TRANSKRIP',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        ukuran: '520 KB',
      },
    ],
  },
  {
    id: 'APP-2026-002',
    userId: 'USR-102',
    namaLengkap: 'Nabila Putri Maharani',
    email: 'nabila.putri@student.telkomuniversity.ac.id',
    nim: '102062400089',
    universitas: 'Telkom University Bandung',
    prodi: 'Sistem Informasi',
    semester: '5',
    ipk: '3.85',
    keahlianDiajukan: ['Business Analysis', 'System Modeling (UML/BPMN)', 'SQL & Database Design'],
    motivasi: 'Berbagi ilmu terkait pemodelan proses bisnis dan analisis sistem informasi untuk persiapan kompetisi bisnis TI.',
    pengalamanSingkat: 'Lead System Analyst di proyek Capstone, Finalis Business Plan Competition Nasional 2026.',
    tanggalPengajuan: '2026-11-09T09:15:00Z',
    status: 'PENDING',
    dokumen: [
      {
        id: 'DOC-04',
        namaDokumen: 'Portofolio_Business_Analyst_Nabila.pdf',
        jenis: 'PORTOFOLIO',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        ukuran: '2.4 MB',
      },
      {
        id: 'DOC-05',
        namaDokumen: 'Sertifikat_Juara_BPC_2026.pdf',
        jenis: 'SERTIFIKAT',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        ukuran: '1.1 MB',
      },
    ],
  },
  {
    id: 'APP-2026-003',
    userId: 'USR-103',
    namaLengkap: 'Dimas Wahyu Saputra',
    email: 'dimas.wahyu@student.telkomuniversity.ac.id',
    nim: '102062400112',
    universitas: 'Telkom University Surabaya',
    prodi: 'Informatika',
    semester: '3',
    ipk: '3.20',
    keahlianDiajukan: ['Laravel REST API', 'MySQL'],
    motivasi: 'Ingin mengasah kemampuan komunikasi teknis dengan mengajar rekan mahasiswa.',
    pengalamanSingkat: 'Membangun sistem informasi manajemen perpustakaan berbasis Laravel.',
    tanggalPengajuan: '2026-11-06T16:45:00Z',
    status: 'REJECTED',
    alasanPenolakan: 'Dokumen sertifikat pendukung dan portofolio proyek Laravel belum dilampirkan atau tautan tidak dapat diakses.',
    dokumen: [
      {
        id: 'DOC-06',
        namaDokumen: 'CV_Dimas_Wahyu.pdf',
        jenis: 'CV',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        ukuran: '610 KB',
      },
    ],
  },
];