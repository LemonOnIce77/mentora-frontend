import { NextRequest, NextResponse } from 'next/server';
import { verifiedMentor } from '@/lib/mentor-eligibility';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skillQuery = searchParams.get('skill');
    const searchQuery = searchParams.get('q');

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

    if (skillQuery) {
      mappedMentors = mappedMentors.filter((m) =>
        m.skills.some((s) => s.skill.namaSkill.toLowerCase().includes(skillQuery.toLowerCase()))
      );
    }
    return NextResponse.json({ mentors: mappedMentors });
  } catch (error) {
    console.error('Daftar mentor gagal dimuat:', error);
    return NextResponse.json({ message: 'Gagal memuat mentor.' }, { status: 500 });
  }
}
