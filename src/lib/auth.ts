
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

const JWT_SECRET =
  process.env.JWT_SECRET || 'mentora_super_secret_jwt_key_sprint_1_2026';

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

// HASH PASSWORD
export async function hashPassword(
  password: string
): Promise<string> {
  return bcrypt.hash(password, 10);
}

// CHECK PASSWORD
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// GENERATE JWT
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

// VERIFY JWT
export function verifyToken(
  token: string
): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// AMBIL SKILL USER DARI TABEL TERPISAH
export async function getUserSkills(userId: bigint) {
  const userSkills = await prisma.user_skills.findMany({
    where: {
      user_id: userId,
    },
  });

  const results = await Promise.all(
    userSkills.map(async (item) => {
      const skill = await prisma.skills.findUnique({
        where: {
          id: item.skill_id,
        },
      });

      if (!skill) return null;

      return {
        id: Number(item.id),
        tipe: String(item.type).toUpperCase(),
        level: item.level,
        skill: {
          id: Number(skill.id),
          namaSkill: skill.nama_skill,
          kategori: skill.kategori,
        },
      };
    })
  );

  return results.filter((item) => item !== null);
}

// AMBIL USER BERDASARKAN TOKEN
export async function getAuthUser(req: NextRequest) {
  const token =
    req.cookies.get('mentora_token')?.value ||
    (req.headers.get('authorization')?.startsWith('Bearer ')
      ? req.headers.get('authorization')!.substring(7)
      : null);

  if (!token) return null;

  const payload = verifyToken(token);

  if (!payload) return null;

  try {
    // Ambil data terbaru dari database
    const user = await prisma.users.findUnique({
      where: {
        id: BigInt(payload.userId),
      },
    });

    if (!user) return null;

    // Ambil skill dari tabel user_skills
    const skills = await getUserSkills(user.id);

    return {
      id: Number(user.id),
      namaLengkap: user.nama_lengkap || '',
      namaPanggilan: user.nama_panggilan || '',
      email: user.email,

      universitas: user.universitas || '',
      prodi: user.prodi || '',
      semester: user.semester || '',
      domisili: user.domisili || '',
      bio: user.bio || '',

      fotoProfil: user.foto_profil || '',

      role: user.role,

      statusMentor: user.status_mentor || 'NONE',

      onboardingCompleted:
        user.onboarding_completed || false,

      dokumenKredensial:
        user.dokumen_kredensial || '',

      totalPoin: user.total_poin || 0,

      modeSesi: user.mode_sesi || 'Fleksibel',

      skills,
    };

  } catch (error) {
    console.error('Error getAuthUser:', error);
    return null;
  }
}
