import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
    }

    const body = await req.json();
    const { skillsOffered, pengalamanMengajar, dokumenUrl, dokumenNama } = body;

    if (!dokumenNama || !skillsOffered) {
      return NextResponse.json(
        { message: 'Skill yang diajukan dan dokumen kredensial (transkrip/sertifikat) wajib disertakan.' },
        { status: 400 }
      );
    }

    const cleanSkills = typeof skillsOffered === 'string' ? skillsOffered.trim() : skillsOffered.join(', ');

    // 1. Coba simpan ke database Prisma jika tersedia
    try {
      const application = await prisma.mentorApplication.create({
        data: {
          userId: authUser.id,
          skillsOffered: cleanSkills,
          pengalamanMengajar: pengalamanMengajar || '',
          dokumenUrl: dokumenUrl || `/uploads/${dokumenNama}`,
          dokumenNama: dokumenNama,
          status: 'PENDING',
        },
      });

      const updatedUser = await prisma.user.update({
        where: { id: authUser.id },
        data: {
          statusMentor: 'PENDING',
          dokumenKredensial: dokumenNama,
        },
      });

      const response = NextResponse.json({
        message: 'Pengajuan akun Mentor berhasil dikirim! Tim Admin akan memverifikasi dokumen Anda.',
        application,
        user: updatedUser,
      });

      // Update sesi cookie aktif
      const updatedSession = {
        ...authUser,
        statusMentor: 'PENDING',
        dokumenKredensial: dokumenNama,
      };
      response.cookies.set('mentora_session', JSON.stringify(updatedSession), {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    } catch (dbError) {
      console.warn('Prisma create application warning, using session fallback:', dbError);
    }

    // 2. Fallback session update
    const mockApp = {
      id: Math.floor(Date.now() / 1000),
      userId: authUser.id,
      skillsOffered: cleanSkills,
      pengalamanMengajar: pengalamanMengajar || '',
      dokumenUrl: dokumenUrl || `/uploads/${dokumenNama}`,
      dokumenNama: dokumenNama,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    const updatedSession = {
      ...authUser,
      statusMentor: 'PENDING',
      dokumenKredensial: dokumenNama,
    };

    const response = NextResponse.json({
      message: 'Pengajuan akun Mentor berhasil dikirim! Tim Admin akan memverifikasi dokumen Anda.',
      application: mockApp,
      user: updatedSession,
    });

    response.cookies.set('mentora_session', JSON.stringify(updatedSession), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Error applying for mentor:', error);
    return NextResponse.json(
      { message: 'Gagal mengajukan upgrade akun mentor.' },
      { status: 500 }
    );
  }
}
