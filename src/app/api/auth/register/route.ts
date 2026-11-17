
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

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = namaLengkap.trim();

    // Cek email di tabel users MySQL
    const existingUser = await prisma.users.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Simpan akun ke database MySQL
    const newUser = await prisma.users.create({
      data: {
        nama_lengkap: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        role: 'Mentee',
        status_mentor: 'NONE',
        onboarding_completed: false,
        total_poin: 0,
      },
    });

    // BigInt dikonversi menjadi Number
    const userId = Number(newUser.id);

    const safeUser = {
      id: userId,
      namaLengkap: newUser.nama_lengkap,
      email: newUser.email,
      role: newUser.role,
      statusMentor: newUser.status_mentor,
      onboardingCompleted: newUser.onboarding_completed,
      totalPoin: newUser.total_poin,
    };

    const token = signToken({
      userId: userId,
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json(
      {
        message: 'Pendaftaran akun berhasil!',
        user: safeUser,
        token,
      },
      { status: 201 }
    );

    response.cookies.set('mentora_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

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
    console.error('Registration database error:', error);

    return NextResponse.json(
      {
        message: 'Registrasi gagal. Data tidak berhasil disimpan ke database.',
      },
      { status: 500 }
    );
  }
}
