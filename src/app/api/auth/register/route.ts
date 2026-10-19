import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { namaLengkap, email, password } = body;

    if (!namaLengkap || !email || !password) {
      return NextResponse.json(
        { message: 'Nama lengkap, email, dan password wajib diisi.' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Format email tidak valid.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password minimal 6 karakter.' },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' },
        { status: 409 }
      );
    }

    // Hash password with bcrypt
    const hashedPassword = await hashPassword(password);

    // Create user with default Mentee role
    const newUser = await prisma.user.create({
      data: {
        namaLengkap: namaLengkap.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'Mentee',
        statusMentor: 'NONE',
        onboardingCompleted: false,
        totalPoin: 0,
      },
    });

    // Generate JWT token
    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json(
      {
        message: 'Registrasi berhasil!',
        user: {
          id: newUser.id,
          namaLengkap: newUser.namaLengkap,
          email: newUser.email,
          role: newUser.role,
          statusMentor: newUser.statusMentor,
          onboardingCompleted: newUser.onboardingCompleted,
        },
        token,
      },
      { status: 201 }
    );

    // Set auth cookie
    response.cookies.set('mentora_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat registrasi.' },
      { status: 500 }
    );
  }
}
