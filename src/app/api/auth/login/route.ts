import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Email atau password yang Anda masukkan salah.' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Email atau password yang Anda masukkan salah.' },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      message: 'Login berhasil!',
      user: {
        id: user.id,
        namaLengkap: user.namaLengkap,
        namaPanggilan: user.namaPanggilan,
        email: user.email,
        role: user.role,
        statusMentor: user.statusMentor,
        onboardingCompleted: user.onboardingCompleted,
        totalPoin: user.totalPoin,
        universitas: user.universitas,
        prodi: user.prodi,
        fotoProfil: user.fotoProfil,
      },
      token,
    });

    response.cookies.set('mentora_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat login.' },
      { status: 500 }
    );
  }
}
