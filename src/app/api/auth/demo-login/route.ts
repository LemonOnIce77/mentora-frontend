import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roleParam = (searchParams.get('role') || 'admin').toLowerCase();

  let user: any = {
    id: 3,
    namaLengkap: "Admin Mentora",
    namaPanggilan: "Admin",
    email: "admin@mentora.my.id",
    universitas: "Universitas Mentora",
    prodi: "Administrasi",
    semester: "8",
    domisili: "Jakarta",
    bio: "Pengelola dan verifikator komunitas Mentora.",
    role: "Admin",
    statusMentor: "NONE",
    totalPoin: 100,
    modeSesi: "Online",
    onboardingCompleted: true,
    dokumenKredensial: "",
    skills: [],
  };

  let targetUrl = '/admin';

  if (roleParam === 'mentor') {
    user = {
      id: 4,
      namaLengkap: "Sulthoni Prima Rafasya",
      namaPanggilan: "Sulthoni",
      email: "sulthoni@telkomuniversity.ac.id",
      universitas: "Universitas Telkom",
      prodi: "Informatika",
      semester: "6",
      domisili: "Bandung, Jawa Barat",
      bio: "Pengembang fullstack dan pegiat competitive programming. Senang berbagi logika pemrograman dan backend web.",
      role: "Mentor",
      statusMentor: "APPROVED",
      totalPoin: 45,
      modeSesi: "Fleksibel",
      onboardingCompleted: true,
      dokumenKredensial: "",
      skills: [
        { id: 20, tipe: "TEACH", level: "Mahir", skill: { id: 20, namaSkill: "Programming", kategori: "Pemrograman Web" } },
        { id: 21, tipe: "TEACH", level: "Mahir", skill: { id: 21, namaSkill: "Web Development", kategori: "Pemrograman Web" } },
      ],
    };
    targetUrl = '/dashboard';
  } else if (roleParam === 'mentee') {
    user = {
      id: 1,
      namaLengkap: "Budi Pratama",
      namaPanggilan: "Budi",
      email: "mentee@mentora.my.id",
      universitas: "Universitas Telkom",
      prodi: "Teknik Informatika",
      semester: "4",
      domisili: "Bandung",
      bio: "Mahasiswa aktif yang antusias belajar teknologi web dan bertukar skill.",
      role: "Mentee",
      statusMentor: "NONE",
      totalPoin: 30,
      modeSesi: "Online",
      onboardingCompleted: true,
      dokumenKredensial: "",
      skills: [
        { id: 1, tipe: "LEARN", level: "Dasar", skill: { id: 1, namaSkill: "Programming", kategori: "Teknologi" } },
      ],
    };
    targetUrl = '/dashboard';
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.redirect(new URL(targetUrl, req.url));

  response.cookies.set('mentora_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.set('mentora_session', encodeURIComponent(JSON.stringify(user)), {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
