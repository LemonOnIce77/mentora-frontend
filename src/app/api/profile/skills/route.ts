
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);

    if (!authUser?.id) {
      return NextResponse.json(
        { message: 'Tidak terautentikasi.' },
        { status: 401 }
      );
    }

    const userSkills = await prisma.user_skills.findMany({
      where: {
        user_id: BigInt(authUser.id),
      },
      include: {
        skills: true,
      },
    });

    const skillsToLearn = userSkills
      .filter((item) => item.type === 'learn')
      .map((item) => ({
        id: item.id.toString(),
        namaSkill: item.skills.nama_skill,
        type: item.type,
        level: item.level,
      }));

    const skillsPossessed = userSkills
      .filter((item) => item.type === 'teach')
      .map((item) => ({
        id: item.id.toString(),
        namaSkill: item.skills.nama_skill,
        type: item.type,
        level: item.level,
      }));

    return NextResponse.json({
      success: true,
      skillsToLearn,
      skillsPossessed,
    });
  } catch (error) {
    console.error('GET USER SKILLS ERROR:', error);

    return NextResponse.json(
      { message: 'Gagal mengambil data keahlian.' },
      { status: 500 }
    );
  }
}
