const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // 1. Initial Skills
  const defaultSkills = [
    { namaSkill: 'UI/UX Design', kategori: 'Design', deskripsi: 'Mendesain antarmuka dan pengalaman pengguna untuk aplikasi dan web.' },
    { namaSkill: 'Figma', kategori: 'Design', deskripsi: 'Prototyping, wireframing, dan visual design menggunakan Figma.' },
    { namaSkill: 'Programming', kategori: 'Tech', deskripsi: 'Pemrograman web, algoritma dasar, JavaScript, TypeScript, dan Python.' },
    { namaSkill: 'Data Analysis', kategori: 'Tech', deskripsi: 'Analisis data statistik, SQL, Excel, dan visualisasi data.' },
    { namaSkill: 'Public Speaking', kategori: 'Communication', deskripsi: 'Teknik presentasi, komunikasi percaya diri di depan publik.' },
    { namaSkill: 'English', kategori: 'Language', deskripsi: 'Conversation, academic writing, and TOEFL/IELTS preparation.' },
    { namaSkill: 'Marketing', kategori: 'Business', deskripsi: 'Digital marketing, social media strategy, content marketing.' },
    { namaSkill: 'Design Thinking', kategori: 'Design', deskripsi: 'Metode pemecahan masalah kreatif berpusat pada pengguna.' },
    { namaSkill: 'Web Development', kategori: 'Tech', deskripsi: 'Pengembangan frontend dan backend modern dengan React & Node.' },
    { namaSkill: 'Business Management', kategori: 'Business', deskripsi: 'Dasar manajemen bisnis, pitch deck, dan model bisnis kanvas.' },
  ];

  for (const skill of defaultSkills) {
    await prisma.skill.upsert({
      where: { namaSkill: skill.namaSkill },
      update: {},
      create: skill,
    });
  }

  // 2. Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mentora.com' },
    update: {},
    create: {
      namaLengkap: 'Administrator Mentora',
      namaPanggilan: 'Admin',
      email: 'admin@mentora.com',
      password: adminPassword,
      universitas: 'Universitas Telkom',
      prodi: 'Sistem Informasi',
      semester: '8',
      domisili: 'Bandung',
      bio: 'Sistem Administrator dan Verifikator Kredensial Mentor.',
      role: 'Admin',
      statusMentor: 'APPROVED',
      onboardingCompleted: true,
      totalPoin: 100,
    },
  });

  // 3. Demo Verified Mentors (for UC-F1-05 Melihat Daftar Akun Mentor)
  const mentorPassword = await bcrypt.hash('password123', 10);
  const mentor1 = await prisma.user.upsert({
    where: { email: 'sulthoni@mentora.com' },
    update: {},
    create: {
      namaLengkap: 'Sulthoni Prima Rafasya',
      namaPanggilan: 'Sulthoni',
      email: 'sulthoni@mentora.com',
      password: mentorPassword,
      universitas: 'Universitas Telkom',
      prodi: 'Informatika',
      semester: '6',
      domisili: 'Bandung, Jawa Barat',
      bio: 'Fullstack developer & competitive programmer. Senang berbagi ilmu logic programming dan backend development.',
      fotoProfil: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      role: 'Mentor',
      statusMentor: 'APPROVED',
      dokumenKredensial: 'Transkrip_Sulthoni_IPK_3.85.pdf',
      onboardingCompleted: true,
      modeSesi: 'Fleksibel',
      totalPoin: 45,
    },
  });

  const mentor2 = await prisma.user.upsert({
    where: { email: 'aulia@mentora.com' },
    update: {},
    create: {
      namaLengkap: 'Aulia Rahisa Putri',
      namaPanggilan: 'Aulia',
      email: 'aulia@mentora.com',
      password: mentorPassword,
      universitas: 'Universitas Telkom',
      prodi: 'Desain Komunikasi Visual',
      semester: '4 (Semester Empat)',
      domisili: 'Depok, Jawa Barat',
      bio: 'Mahasiswa DKV yang tertarik dengan desain, branding, dan pengembangan UI/UX interaktif.',
      fotoProfil: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      role: 'Mentor',
      statusMentor: 'APPROVED',
      dokumenKredensial: 'Portofolio_UIUX_Aulia.pdf',
      onboardingCompleted: true,
      modeSesi: 'Online',
      totalPoin: 30,
    },
  });

  // Attach skills to mentor
  const uiux = await prisma.skill.findUnique({ where: { namaSkill: 'UI/UX Design' } });
  const figma = await prisma.skill.findUnique({ where: { namaSkill: 'Figma' } });
  const prog = await prisma.skill.findUnique({ where: { namaSkill: 'Programming' } });
  const dt = await prisma.skill.findUnique({ where: { namaSkill: 'Design Thinking' } });

  const mentor2Skills = [
    { skillId: uiux.id, tipe: 'TEACH', level: 'Advanced' },
    { skillId: figma.id, tipe: 'TEACH', level: 'Advanced' },
    { skillId: dt.id, tipe: 'TEACH', level: 'Intermediate' },
  ];

  for (const s of mentor2Skills) {
    const exists = await prisma.userSkill.findFirst({
      where: { userId: mentor2.id, skillId: s.skillId, tipe: s.tipe }
    });
    if (!exists) {
      await prisma.userSkill.create({
        data: { userId: mentor2.id, skillId: s.skillId, tipe: s.tipe, level: s.level }
      });
    }
  }

  const mentor1Skills = [
    { skillId: prog.id, tipe: 'TEACH', level: 'Advanced' },
    { skillId: uiux.id, tipe: 'LEARN', level: 'Beginner' },
  ];

  for (const s of mentor1Skills) {
    const exists = await prisma.userSkill.findFirst({
      where: { userId: mentor1.id, skillId: s.skillId, tipe: s.tipe }
    });
    if (!exists) {
      await prisma.userSkill.create({
        data: { userId: mentor1.id, skillId: s.skillId, tipe: s.tipe, level: s.level }
      });
    }
  }

  // 4. Sample pending application for Admin verification testing (FR-06)
  const applicantPassword = await bcrypt.hash('password123', 10);
  const applicant = await prisma.user.upsert({
    where: { email: 'budi@mentora.com' },
    update: {},
    create: {
      namaLengkap: 'Budi Santoso',
      namaPanggilan: 'Budi',
      email: 'budi@mentora.com',
      password: applicantPassword,
      universitas: 'Universitas Indonesia',
      prodi: 'Ilmu Komputer',
      semester: '5',
      domisili: 'Jakarta Selatan',
      bio: 'Tertarik mengajar Data Analysis dan Python untuk pemula.',
      role: 'Mentee',
      statusMentor: 'PENDING',
      dokumenKredensial: 'Transkrip_Budi_DataAnalysis.pdf',
      onboardingCompleted: true,
      totalPoin: 10,
    },
  });

  const dataAnalysis = await prisma.skill.findUnique({ where: { namaSkill: 'Data Analysis' } });
  if (dataAnalysis && applicant) {
    const exists = await prisma.userSkill.findFirst({
      where: { userId: applicant.id, skillId: dataAnalysis.id, tipe: 'TEACH' }
    });
    if (!exists) {
      await prisma.userSkill.create({
        data: { userId: applicant.id, skillId: dataAnalysis.id, tipe: 'TEACH', level: 'Intermediate' }
      });
    }

    const appExists = await prisma.mentorApplication.findFirst({
      where: { userId: applicant.id, status: 'PENDING' }
    });
    if (!appExists) {
      await prisma.mentorApplication.create({
        data: {
          userId: applicant.id,
          skillsOffered: 'Data Analysis, Python, SQL',
          pengalamanMengajar: 'Asisten Laboratorium Basis Data semester ganjil 2025/2026',
          dokumenUrl: '/uploads/transkrip_budi_sample.pdf',
          dokumenNama: 'Transkrip_Nilai_Resmi_Budi_Santoso.pdf',
          status: 'PENDING',
        },
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
