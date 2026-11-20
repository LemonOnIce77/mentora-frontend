import { NextRequest, NextResponse } from 'next/server';
import { verifiedMentor } from '@/lib/mentor-eligibility';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ message: 'ID mentor tidak valid.' }, { status: 400 });
  }

  try {
    const user = await prisma.users.findFirst({
      where: { id: BigInt(id), ...verifiedMentor },
      include: {
        user_skills: {
          include: { skills: true },
        },
      },
    });

    if (user) {
      const skills = (user.user_skills || []).map((us: {
        id: bigint;
        type: string;
        level: string;
        skills: { id: bigint; nama_skill: string; kategori: string | null };
      }) => ({
        id: Number(us.id),
        tipe: us.type,
        level: us.level,
        skill: {
          id: Number(us.skills.id),
          namaSkill: us.skills.nama_skill,
          kategori: us.skills.kategori || 'Umum',
        },
      }));

      const mentor = {
        id: Number(user.id),
        namaLengkap: user.nama_lengkap,
        namaPanggilan: user.nama_panggilan || '',
        email: user.email,
        universitas: user.universitas || '',
        prodi: user.prodi || '',
        semester: user.semester || '',
        domisili: user.domisili || '',
        bio: user.bio || '',
        fotoProfil: user.foto_profil || '',
        totalPoin: user.total_poin,
        modeSesi: user.mode_sesi,
        statusMentor: user.status_mentor,
        skills,
      };

      return NextResponse.json({ success: true, mentor });
    }
  } catch (error) {
    console.error('Profil mentor gagal dimuat:', error);
    return NextResponse.json({ message: 'Gagal memuat mentor.' }, { status: 500 });
  }
  return NextResponse.json({ message: 'Mentor tidak ditemukan.' }, { status: 404 });
}
