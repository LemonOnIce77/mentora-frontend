import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_MENTORS = [
  {
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
      { id: 1, skill: { id: 4, namaSkill: 'Programming', kategori: 'Tech' } },
      { id: 2, skill: { id: 3, namaSkill: 'Web Development', kategori: 'Tech' } },
    ],
  },
  {
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
      { id: 3, skill: { id: 1, namaSkill: 'UI/UX Design', kategori: 'Design' } },
      { id: 4, skill: { id: 2, namaSkill: 'Figma', kategori: 'Design' } },
    ],
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skillQuery = searchParams.get('skill');
    const searchQuery = searchParams.get('q');

    try {
      const mentors = await prisma.users.findMany({
        where: {
          status_mentor: 'APPROVED',
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

      if (mentors && mentors.length > 0) {
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
      }
    } catch (dbError) {
      console.warn('Prisma mentor list warning, using default mentors:', dbError);
    }

    let result = DEFAULT_MENTORS;
    if (skillQuery) {
      result = result.filter((m: any) =>
        m.skills.some((s: any) => s.skill.namaSkill.toLowerCase().includes(skillQuery.toLowerCase()))
      );
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m: any) =>
          m.namaLengkap.toLowerCase().includes(q) ||
          m.prodi.toLowerCase().includes(q) ||
          m.universitas.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ mentors: result });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json({ mentors: DEFAULT_MENTORS });
  }
}
