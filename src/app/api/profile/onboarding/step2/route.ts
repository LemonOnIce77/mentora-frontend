
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Mengikuti tipe enum dari Prisma
type SkillType = NonNullable<
  Prisma.user_skillsCreateInput['type']
>;

type SkillLevel = NonNullable<
  Prisma.user_skillsCreateInput['level']
>;

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

    if (
      !Array.isArray(skillsToLearn) ||
      !Array.isArray(skillsPossessed)
    ) {
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
            .filter(
              (skill): skill is string =>
                typeof skill === 'string'
            )
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0)
        )
      );
    };

    const learnSkills = normalizeSkills(skillsToLearn);
    const possessedSkills = normalizeSkills(skillsPossessed);

    // 4. Simpan menggunakan transaksi database
    await prisma.$transaction(async (tx: any) => {

      // Hapus skill lama pengguna
      await tx.user_skills.deleteMany({
        where: {
          user_id: userId,
        },
      });

      // Cari skill atau buat skill baru
      const getOrCreateSkill = async (skillName: string) => {
        let skill = await tx.skills.findUnique({
          where: {
            nama_skill: skillName,
          },
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

      // Fungsi menyimpan skill pengguna
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

      // 5. Skill yang ingin dipelajari
      await saveSkills(
        learnSkills,
        'learn',
        'pemula'
      );

      // 6. Skill yang sudah dikuasai
      await saveSkills(
        possessedSkills,
        'teach',
        'menengah'
      );

      // 7. Update profil pengguna
      await tx.users.update({
        where: {
          id: userId,
        },
        data: {
          mode_sesi: modeSesi,
          onboarding_completed: true,
        },
      });
    });

    // 8. Respons berhasil
    return NextResponse.json({
      success: true,
      message: 'Onboarding berhasil diselesaikan! Selamat datang di Mentora.',
    });

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
