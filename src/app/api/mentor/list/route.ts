import { NextRequest, NextResponse } from 'next/server';
import { verifiedMentor } from '@/lib/mentor-eligibility';
import { prisma } from '@/lib/prisma';
import { DEFAULT_COMMUNITY_MENTORS } from '@/lib/community-mentors';

export const dynamic = 'force-dynamic';

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
