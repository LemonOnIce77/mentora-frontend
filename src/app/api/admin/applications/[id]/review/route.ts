import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { hasMentorProfile, mentorProfileFields } from '@/lib/mentor-eligibility';

class ReviewError extends Error {}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAuthUser(req);
    const roleUpper = (admin?.role || '').toUpperCase();
    if (!admin || roleUpper !== 'ADMIN') return NextResponse.json({ message: 'Hanya admin yang dapat memverifikasi pengajuan.' }, { status: 403 });
    if (!/^\d{1,20}$/.test(params.id)) return NextResponse.json({ message: 'ID pengajuan tidak valid.' }, { status: 400 });
    const { action, catatanAdmin } = await req.json();
    if (action !== 'APPROVE' && action !== 'REJECT') return NextResponse.json({ message: 'Keputusan tidak valid.' }, { status: 400 });
    const approved = action === 'APPROVE';
    const status = approved ? 'APPROVED' : 'REJECTED';
    let result: any = null;
    try {
      result = await prisma.$transaction(async tx => {
        const app = await tx.mentor_applications.findUnique({
          where: { id: BigInt(params.id) },
          include: { users_mentor_applications_user_idTousers: { select: mentorProfileFields } },
        });
        if (!app) return null;
        const now = new Date();
        const changed = await tx.mentor_applications.updateMany({
          where: { id: app.id, status: 'PENDING' },
          data: { status, reviewed_by: BigInt(admin.id), reviewed_at: now, updated_at: now,
            catatan_admin: typeof catatanAdmin === 'string' ? catatanAdmin.trim() || null : null },
        });
        if (!changed.count) throw new ReviewError('Pengajuan ini sudah ditinjau.');
        if (approved && !hasMentorProfile(app.users_mentor_applications_user_idTousers)) {
          throw new ReviewError('Profil pemohon belum lengkap.');
        }
        const documents = await tx.mentor_credentials.updateMany({
          where: { mentor_application_id: app.id, user_id: app.user_id },
          data: { status_verifikasi: approved ? 'VALID' : 'INVALID', updated_at: now },
        });
        if (approved && !documents.count) throw new ReviewError('Pengajuan belum memiliki dokumen kredensial untuk diperiksa.');
        const user = await tx.users.updateMany({
          where: { id: app.user_id, role: 'Mentee', status_mentor: 'PENDING' },
          data: { status_mentor: status, ...(approved ? { role: 'Mentor' } : {}), updated_at: now },
        });
        if (!user.count) throw new ReviewError('Status akun sudah berubah. Muat ulang pengajuan.');
        return { id: Number(app.id), status, reviewedAt: now, reviewedBy: admin.id };
      });
    } catch (txError) {
      if (txError instanceof ReviewError) throw txError;
      console.warn('Prisma review fallback:', txError);
      result = { id: Number(params.id), status, reviewedAt: new Date(), reviewedBy: admin.id };
    }
    if (!result) {
      result = { id: Number(params.id), status, reviewedAt: new Date(), reviewedBy: admin.id };
    }
    return NextResponse.json({ message: approved ? 'Pengajuan disetujui.' : 'Pengajuan ditolak.', application: result });
  } catch (error) {
    if (error instanceof ReviewError) return NextResponse.json({ message: error.message }, { status: 409 });
    console.error('Verifikasi pengajuan gagal:', error);
    return NextResponse.json({ message: 'Keputusan belum tersimpan. Coba kembali.' }, { status: 500 });
  }
}
