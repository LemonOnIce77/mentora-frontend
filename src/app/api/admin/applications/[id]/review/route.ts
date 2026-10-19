import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'Admin') {
      return NextResponse.json(
        { message: 'Akses ditolak. Hanya Admin yang dapat memverifikasi pengajuan.' },
        { status: 403 }
      );
    }

    const applicationId = parseInt(params.id, 10);
    if (isNaN(applicationId)) {
      return NextResponse.json({ message: 'ID pengajuan tidak valid' }, { status: 400 });
    }

    const body = await req.json();
    const { action, catatanAdmin } = body; // action: "APPROVE" | "REJECT"

    if (action !== 'APPROVE' && action !== 'REJECT') {
      return NextResponse.json(
        { message: 'Aksi harus berupa APPROVE atau REJECT' },
        { status: 400 }
      );
    }

    const app = await prisma.mentorApplication.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!app) {
      return NextResponse.json({ message: 'Pengajuan tidak ditemukan' }, { status: 404 });
    }

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    // Update application
    const updatedApplication = await prisma.mentorApplication.update({
      where: { id: applicationId },
      data: {
        status: newStatus,
        catatanAdmin: catatanAdmin || (action === 'APPROVE' ? 'Dokumen kredensial valid dan disetujui.' : 'Dokumen tidak memenuhi persyaratan kelayakan.'),
        reviewedAt: new Date(),
      },
    });

    // Update user status & role (FR-07: Aktivasi Status Mentor)
    const updatedUser = await prisma.user.update({
      where: { id: app.userId },
      data: {
        statusMentor: newStatus,
        ...(action === 'APPROVE' ? { role: 'Mentor' } : {}),
      },
    });

    return NextResponse.json({
      message:
        action === 'APPROVE'
          ? `Pengajuan ${app.user.namaLengkap} berhasil disetujui. Akun diaktifkan sebagai Mentor!`
          : `Pengajuan ${app.user.namaLengkap} ditolak.`,
      application: updatedApplication,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error reviewing application:', error);
    return NextResponse.json({ message: 'Gagal memproses verifikasi.' }, { status: 500 });
  }
}
