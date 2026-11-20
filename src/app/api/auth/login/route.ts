
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { approvalCount, mentorIdentity } from '@/lib/mentor-eligibility';
import {
  comparePassword,
  signToken,
  getUserSkills,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = (body.email || '').toLowerCase().trim();
    const password = body.password || '';

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        {
          message: 'Email dan password wajib diisi.',
        },
        { status: 400 }
      );
    }

    // 1. Cari akun di database
    const dbUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
      include: { _count: approvalCount },
    });

    if (!dbUser) {
      return NextResponse.json(
        {
          message: 'Email atau password salah.',
        },
        { status: 401 }
      );
    }

    // 2. Verifikasi password
    const isMatch = await comparePassword(
      password,
      dbUser.password
    );

    if (!isMatch) {
      return NextResponse.json(
        {
          message: 'Email atau password salah.',
        },
        { status: 401 }
      );
    }

    // 3. Ambil role asli dari database
    const { role: roleNormalized, statusMentor } = mentorIdentity(dbUser);

    // 4. Ambil skill pengguna
    const skills = await getUserSkills(dbUser.id);

    // 5. Generate token
    const token = signToken({
      userId: Number(dbUser.id),
      email: dbUser.email,
      role: roleNormalized,
    });

    // 6. Data pengguna tanpa password
    const safeUser = {
      id: Number(dbUser.id),

      namaLengkap: dbUser.nama_lengkap || '',
      namaPanggilan: dbUser.nama_panggilan || '',

      email: dbUser.email,

      universitas: dbUser.universitas || '',
      prodi: dbUser.prodi || '',
      semester: dbUser.semester || '',
      domisili: dbUser.domisili || '',
      bio: dbUser.bio || '',

      fotoProfil: dbUser.foto_profil || '',

      role: roleNormalized,

      statusMentor,

      onboardingCompleted:
        dbUser.onboarding_completed || false,

      dokumenKredensial:
        dbUser.dokumen_kredensial || '',

      totalPoin: dbUser.total_poin || 0,

      modeSesi: dbUser.mode_sesi || 'Fleksibel',

      skills,
    };

    // 7. Response login
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil!',
      user: safeUser,
      token,
    });

    // 8. Simpan JWT cookie
    response.cookies.set('mentora_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    // 9. Simpan session terbaru
    response.cookies.set(
      'mentora_session',
      JSON.stringify(safeUser),
      {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return response;

  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat login.',
      },
      { status: 500 }
    );
  }
}
