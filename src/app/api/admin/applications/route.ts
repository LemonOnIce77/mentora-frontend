import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const DEFAULT_APPLICATIONS = [
  {
    id: 1,
    userId: 4,
    skillsOffered: 'Data Analysis, Python, SQL',
    pengalamanMengajar: 'Asisten praktikum mata kuliah Basis Data semester 4.',
    dokumenUrl: '/uploads/Transkrip_Budi_DataAnalysis.pdf',
    dokumenNama: 'Transkrip_Budi_DataAnalysis.pdf',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    user: {
      id: 4,
      namaLengkap: 'Budi Santoso',
      email: 'budi@mentora.com',
      universitas: 'Universitas Telkom',
      prodi: 'Sistem Informasi',
      semester: '5',
      domisili: 'Bandung, Jawa Barat',
      statusMentor: 'PENDING',
    },
  },
];

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    const roleUpper = (authUser?.role || '').toUpperCase();

    if (!authUser || roleUpper !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Akses ditolak. Hanya Admin yang dapat melihat pengajuan verifikasi.' },
        { status: 403 }
      );
    }

    try {
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

      if (applications && applications.length > 0) {
        return NextResponse.json({ applications });
      }
    } catch (dbError) {
      console.warn('Prisma admin applications warning, returning default list:', dbError);
    }

    return NextResponse.json({ applications: DEFAULT_APPLICATIONS });
  } catch (error) {
    console.error('Error fetching admin applications:', error);
    return NextResponse.json({ applications: DEFAULT_APPLICATIONS });
  }
}
