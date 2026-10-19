import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'Admin') {
      return NextResponse.json(
        { message: 'Akses ditolak. Hanya Admin yang dapat melihat pengajuan verifikasi.' },
        { status: 403 }
      );
    }

    const applications = await prisma.mentorApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            namaLengkap: true,
            email: true,
            universitas: true,
            prodi: true,
            semester: true,
            domisili: true,
            statusMentor: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching admin applications:', error);
    return NextResponse.json({ message: 'Gagal memuat data pengajuan.' }, { status: 500 });
  }
}
