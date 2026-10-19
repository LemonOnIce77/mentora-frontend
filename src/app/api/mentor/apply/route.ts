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
        { message: 'Skill yang ditawarkan dan dokumen kredensial (transkrip/sertifikat) wajib disertakan.' },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.mentorApplication.create({
      data: {
        userId: authUser.id,
        skillsOffered: typeof skillsOffered === 'string' ? skillsOffered : skillsOffered.join(', '),
        pengalamanMengajar: pengalamanMengajar || '',
        dokumenUrl: dokumenUrl || '/uploads/dummy_transkrip.pdf',
        dokumenNama: dokumenNama,
        status: 'PENDING',
      },
    });

    // Update user mentor status to PENDING
    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        statusMentor: 'PENDING',
        dokumenKredensial: dokumenNama,
      },
    });

    return NextResponse.json({
      message: 'Pengajuan akun Mentor berhasil dikirim! Tim Admin akan memverifikasi dokumen Anda.',
      application,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error applying for mentor:', error);
    return NextResponse.json(
      { message: 'Gagal mengajukan upgrade akun mentor.' },
      { status: 500 }
    );
  }
}
