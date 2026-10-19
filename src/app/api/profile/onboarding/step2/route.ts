import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

async function getOrCreateSkill(skillName: string) {
  const trimmed = skillName.trim();
  let skill = await prisma.skill.findUnique({
    where: { namaSkill: trimmed },
  });
  if (!skill) {
    skill = await prisma.skill.create({
      data: {
        namaSkill: trimmed,
        kategori: 'General',
        deskripsi: `Keahlian ${trimmed}`,
      },
    });
  }
  return skill;
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
    }

    const body = await req.json();
    const { skillsToLearn = [], skillsPossessed = [], modeSesi = 'Fleksibel' } = body;

    // Delete existing user skills to overwrite cleanly
    await prisma.userSkill.deleteMany({
      where: { userId: authUser.id },
    });

    // Insert LEARN skills
    for (const name of skillsToLearn) {
      if (!name) continue;
      const skill = await getOrCreateSkill(name);
      await prisma.userSkill.create({
        data: {
          userId: authUser.id,
          skillId: skill.id,
          tipe: 'LEARN',
          level: 'Beginner',
        },
      });
    }

    // Insert TEACH skills (skills already possessed)
    for (const name of skillsPossessed) {
      if (!name) continue;
      const skill = await getOrCreateSkill(name);
      await prisma.userSkill.create({
        data: {
          userId: authUser.id,
          skillId: skill.id,
          tipe: 'TEACH',
          level: 'Intermediate',
        },
      });
    }

    // Update user modeSesi and mark onboardingCompleted
    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        modeSesi,
        onboardingCompleted: true,
      },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });

    return NextResponse.json({
      message: 'Onboarding berhasil diselesaikan! Selamat datang di Mentora.',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error in step 2 onboarding:', error);
    return NextResponse.json(
      { message: 'Gagal menyimpan minat dan keahlian.' },
      { status: 500 }
    );
  }
}
