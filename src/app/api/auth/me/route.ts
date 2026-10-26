import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Ambil cookie sesi yang tadi diset saat login
  const sessionCookie = req.cookies.get('mentora_session')?.value;

  let userData = null;
  if (sessionCookie) {
    try {
      userData = JSON.parse(sessionCookie);
    } catch (e) {
      userData = null;
    }
  }

  const user = userData || {
  id: 1,
  namaLengkap: 'Budi Pratama',
  email: 'budi@mentora.com',
  universitas: 'Telkom University',
  prodi: 'Sistem Informasi',
  semester: '5',
  role: 'STUDENT',
  statusMentor: 'NONE',
  skills: [
    { id: 1, namaSkill: 'Figma UI/UX', tipe: 'TEACH', tingkat: 'Mahir' },
    { id: 2, namaSkill: 'Next.js Dasar', tipe: 'LEARN', tingkat: 'Pemula' },
  ],
};

  return NextResponse.json({ user });
}