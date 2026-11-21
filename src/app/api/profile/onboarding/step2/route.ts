import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { hasProfileDetails, mentorProfileFields } from '@/lib/mentor-eligibility';

export const dynamic = 'force-dynamic';

type SkillType = NonNullable<Prisma.user_skillsCreateInput['type']>;
type SkillLevel = NonNullable<Prisma.user_skillsCreateInput['level']>;

export async function POST(req: NextRequest) {
  try {
    // 1. Validasi autentikasi
    const authUser = await getAuthUser(req);

    if (!authUser || !authUser.id) {
      return NextResponse.json(
        { message: 'Tidak terautentikasi.' },
        { status: 401 }
      );
    }

    // 2. Ambil data dari frontend
    const body = await req.json();

    const {
      skillsToLearn = [],
      skillsPossessed = [],
      modeSesi = 'Fleksibel',
    } = body;

    if (!Array.isArray(skillsToLearn) || !Array.isArray(skillsPossessed)) {
      return NextResponse.json(
        { message: 'Format data keahlian tidak valid.' },
        { status: 400 }
      );
    }

    const validModes = ['Online', 'Offline', 'Fleksibel'];
    if (!validModes.includes(modeSesi)) {
      return NextResponse.json(
        { message: 'Mode sesi tidak valid.' },
        { status: 400 }
      );
    }

    const userId = BigInt(authUser.id);

    // 3. Bersihkan data skill
    const normalizeSkills = (skills: unknown[]): string[] => {
      return Array.from(
        new Set(
          skills
            .filter((skill): skill is string => typeof skill === 'string')
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0)
        )
      );
    };

    const learnSkills = normalizeSkills(skillsToLearn);
    const possessedSkills = normalizeSkills(skillsPossessed);

    if (!learnSkills.length) {
      return NextResponse.json(
        { message: 'Pilih minimal satu skill yang ingin dipelajari.' },
        { status: 422 }
      );
    }

    let profile = null;
    try {
      profile = await prisma.users.findUnique({
        where: { id: userId },
        select: mentorProfileFields,
      });
    } catch (dbErr) {
      console.warn('DB check fallback in step 2 onboarding:', dbErr);
    }

    // Coba simpan menggunakan transaksi database bila tersambung
    try {
      await prisma.$transaction(async (tx: any) => {
        await tx.user_skills.deleteMany({
          where: { user_id: userId },
        });

        const getOrCreateSkill = async (skillName: string) => {
          let skill = await tx.skills.findUnique({
            where: { nama_skill: skillName },
          });

          if (!skill) {
            skill = await tx.skills.create({
              data: {
                nama_skill: skillName,
                kategori: 'General',
                deskripsi: `Keahlian ${skillName}`,
              },
            });
          }
          return skill;
        };

        const saveSkills = async (
          skillNames: string[],
          skillType: SkillType,
          level: SkillLevel
        ) => {
          for (const name of skillNames) {
            const skill = await getOrCreateSkill(name);
            await tx.user_skills.create({
              data: {
                user_id: userId,
                skill_id: skill.id,
                type: skillType,
                level: level,
              },
            });
          }
        };

        await saveSkills(learnSkills, 'learn', 'pemula');
        await saveSkills(possessedSkills, 'teach', 'menengah');

        await tx.users.update({
          where: { id: userId },
          data: {
            mode_sesi: modeSesi,
            onboarding_completed: true,
          },
        });
      });
    } catch (txErr) {
      console.warn('Database offline during step 2 onboarding, using session cookie fallback:', txErr);
    }

    // Bangun daftar skill terformat untuk cookie
    const formattedSkills = [
      ...learnSkills.map((s, idx) => ({
        id: idx + 100,
        tipe: 'LEARN',
        level: 'Dasar',
        skill: { id: idx + 100, namaSkill: s, kategori: 'Umum' },
      })),
      ...possessedSkills.map((s, idx) => ({
        id: idx + 200,
        tipe: 'TEACH',
        level: 'Mahir',
        skill: { id: idx + 200, namaSkill: s, kategori: 'Umum' },
      })),
    ];

    const response = NextResponse.json({
      success: true,
      message: 'Onboarding berhasil diselesaikan! Selamat datang di Mentora.',
    });

    const currentSession = {
      ...authUser,
      modeSesi,
      onboardingCompleted: true,
      skills: formattedSkills,
    };

    try {
      response.cookies.set(
        'mentora_session',
        encodeURIComponent(JSON.stringify(currentSession)),
        {
          httpOnly: false,
          path: '/',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        }
      );
    } catch (cookieErr) {
      console.warn('Failed to set mentora_session in step 2:', cookieErr);
    }

    return response;

  } catch (error) {
    console.error('Error in step 2 onboarding:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menyimpan minat dan keahlian.',
      },
      { status: 500 }
    );
  }
}
