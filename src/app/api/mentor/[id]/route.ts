import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_MENTORS: Record<number, any> = {
  2: {
    id: 2,
    namaLengkap: 'Sulthoni Prima Rafasya',
    namaPanggilan: 'Sulthoni',
    universitas: 'Universitas Telkom',
    prodi: 'Informatika',
    semester: '6',
    domisili: 'Bandung, Jawa Barat',
    bio: 'Fullstack developer & competitive programmer. Senang berbagi ilmu logic programming dan backend development.',
    fotoProfil: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    role: 'Mentor',
    statusMentor: 'APPROVED',
    totalPoin: 45,
    modeSesi: 'Fleksibel',
    skills: [
      { id: 1, tipe: 'TEACH', level: 'Mahir', skill: { id: 4, namaSkill: 'Programming', kategori: 'Tech' } },
      { id: 2, tipe: 'TEACH', level: 'Mahir', skill: { id: 3, namaSkill: 'Web Development', kategori: 'Tech' } },
    ],
  },
  3: {
    id: 3,
    namaLengkap: 'Aulia Rahisa Putri',
    namaPanggilan: 'Aulia',
    universitas: 'Universitas Telkom',
    prodi: 'Desain Komunikasi Visual',
    semester: '4',
    domisili: 'Bandung, Jawa Barat',
    bio: 'Mahasiswa DKV yang berfokus pada desain produk, visual branding, dan pembuatan prototype interaktif di Figma.',
    fotoProfil: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    role: 'Mentor',
    statusMentor: 'APPROVED',
    totalPoin: 30,
    modeSesi: 'Online',
    skills: [
      { id: 3, tipe: 'TEACH', level: 'Mahir', skill: { id: 1, namaSkill: 'UI/UX Design', kategori: 'Design' } },
      { id: 4, tipe: 'TEACH', level: 'Mahir', skill: { id: 2, namaSkill: 'Figma', kategori: 'Design' } },
    ],
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ message: 'ID mentor tidak valid.' }, { status: 400 });
  }

  try {
    const p = prisma as any;
    const user = await (p.users || p.user)?.findUnique({
      where: { id: BigInt(id) },
      include: {
        user_skills: {
          include: { skills: true, skill: true },
        },
      },
    });

    if (user) {
      const skills = (user.user_skills || []).map((us: any) => ({
        id: Number(us.id),
        tipe: us.type || us.tipe,
        level: us.level,
        skill: {
          id: Number(us.skills?.id || us.skill?.id || us.skill_id),
          namaSkill: us.skills?.nama_skill || us.skill?.namaSkill || us.skill?.nama_skill || 'Skill',
          kategori: us.skills?.kategori || us.skill?.kategori || 'Umum',
        },
      }));

      const mentor = {
        id: Number(user.id),
        namaLengkap: user.nama_lengkap || user.namaLengkap,
        namaPanggilan: user.nama_panggilan || user.namaPanggilan,
        email: user.email,
        universitas: user.universitas,
        prodi: user.prodi,
        semester: user.semester,
        domisili: user.domisili,
        bio: user.bio,
        fotoProfil: user.foto_profil || user.fotoProfil,
        totalPoin: user.total_poin ?? user.totalPoin ?? 0,
        modeSesi: user.mode_sesi || user.modeSesi || 'Fleksibel',
        statusMentor: user.status_mentor || user.statusMentor || 'APPROVED',
        skills,
      };

      return NextResponse.json({ success: true, mentor });
    }
  } catch (error) {
    console.warn('Prisma DB query failed, falling back to default mentor data:', error);
  }

  // Fallback to default mentors
  const fallback = DEFAULT_MENTORS[id];
  if (fallback) {
    return NextResponse.json({ success: true, mentor: fallback });
  }

  return NextResponse.json({ message: 'Mentor tidak ditemukan.' }, { status: 404 });
}
