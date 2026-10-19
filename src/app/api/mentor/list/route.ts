import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skillQuery = searchParams.get('skill');
    const searchQuery = searchParams.get('q');

    const mentors = await prisma.user.findMany({
      where: {
        statusMentor: 'APPROVED',
        ...(searchQuery
          ? {
              OR: [
                { namaLengkap: { contains: searchQuery } },
                { universitas: { contains: searchQuery } },
                { prodi: { contains: searchQuery } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        namaLengkap: true,
        namaPanggilan: true,
        universitas: true,
        prodi: true,
        semester: true,
        domisili: true,
        bio: true,
        fotoProfil: true,
        role: true,
        statusMentor: true,
        totalPoin: true,
        modeSesi: true,
        skills: {
          where: { tipe: 'TEACH' },
          include: { skill: true },
        },
      },
      orderBy: { totalPoin: 'desc' },
    });

    // If filtered by skill name
    let filtered = mentors;
    if (skillQuery) {
      filtered = mentors.filter((m) =>
        m.skills.some((s) => s.skill.namaSkill.toLowerCase().includes(skillQuery.toLowerCase()))
      );
    }

    return NextResponse.json({ mentors: filtered });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json({ message: 'Gagal mengambil daftar mentor.' }, { status: 500 });
  }
}
