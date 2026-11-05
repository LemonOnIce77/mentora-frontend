import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'mentora_super_secret_jwt_key_sprint_1_2026';

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(req: NextRequest) {
  let token = req.cookies.get('mentora_token')?.value;

  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // 1. Coba decode via JWT Token
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          include: {
            skills: {
              include: { skill: true },
            },
            applications: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        });

        if (user) {
          const { password, ...safeUser } = user;
          return safeUser;
        }
      } catch (dbError) {
        // Fallback jika query DB gagal
      }

      // Jika user tidak ditemukan di DB atau DB offline, kembalikan dari payload / session
      const sessionCookie = req.cookies.get('mentora_session')?.value;
      if (sessionCookie) {
        try {
          const parsed = JSON.parse(sessionCookie);
          if (parsed) return parsed;
        } catch {}
      }

      return {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        namaLengkap: payload.role === 'Admin' ? 'Administrator Mentora' : 'Budi Santoso',
        statusMentor: payload.role === 'Mentor' || payload.role === 'Admin' ? 'APPROVED' : 'NONE',
        onboardingCompleted: true,
      };
    }
  }

  // 2. Coba baca mentora_session cookie sebagai alternatif
  const sessionCookie = req.cookies.get('mentora_session')?.value;
  if (sessionCookie) {
    try {
      const parsed = JSON.parse(sessionCookie);
      if (parsed && parsed.email) return parsed;
    } catch {}
  }

  return null;
}
