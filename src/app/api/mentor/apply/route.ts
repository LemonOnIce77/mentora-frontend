import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { adminApproval, hasMentorProfile, mentorProfileFields } from '@/lib/mentor-eligibility';

class ApplicationError extends Error {}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ message: 'Silakan masuk terlebih dahulu.' }, { status: 401 });
    const body = await req.json();
    const skills = (Array.isArray(body.skillsOffered) ? body.skillsOffered.join(', ') : String(body.skillsOffered ?? '')).trim();
    const experience = typeof body.pengalamanMengajar === 'string' ? body.pengalamanMengajar.trim() : '';
    const kind = body.jenisDokumen ?? 'portofolio';
    if (kind !== 'portofolio' && kind !== 'sertifikat' && kind !== 'transkrip') {
      return NextResponse.json({ message: 'Pilih jenis dokumen yang sesuai.' }, { status: 422 });
    }
    const credential = /^\/api\/mentor\/credentials\/(\d{1,20})\/download$/.exec(body.dokumenUrl || '');
    if (!skills || skills.length > 255 || !credential) {
      return NextResponse.json({ message: 'Isi keahlian dan unggah berkas kredensial terlebih dahulu.' }, { status: 422 });
    }
    const userId = BigInt(user.id);
    const application = await prisma.$transaction(async tx => {
      const applicant = await tx.users.findUniqueOrThrow({ where: { id: userId }, select: mentorProfileFields });
      if (!hasMentorProfile(applicant)) throw new ApplicationError('Lengkapi profil dan selesaikan onboarding sebelum mengajukan diri.');
      const doc = await tx.mentor_credentials.findFirst({
        where: { id: BigInt(credential[1]), user_id: userId, mentor_application_id: null },
      });
      if (!doc) throw new ApplicationError('Unggah berkas milik akun ini untuk pengajuan baru.');
      const now = new Date();
      const claimed = await tx.users.updateMany({
        where: { id: userId, role: { in: ['Mentee', 'Mentor'] }, onboarding_completed: true,
          OR: [
            { status_mentor: { in: ['NONE', 'REJECTED'] } },
            { status_mentor: 'APPROVED', mentor_applications_mentor_applications_user_idTousers: { none: adminApproval } },
          ],
          mentor_applications_mentor_applications_user_idTousers: { none: { status: 'PENDING' } },
        },
        data: { role: 'Mentee', status_mentor: 'PENDING', dokumen_kredensial: doc.file_name, updated_at: now },
      });
      if (!claimed.count) throw new ApplicationError('Akun sudah menjadi mentor atau memiliki pengajuan yang sedang ditinjau.');
      const app = await tx.mentor_applications.create({
        data: { user_id: userId, bidang_keahlian: skills, alasan_mengajar: experience || `Ingin mengajarkan ${skills}.`,
          status: 'PENDING', created_at: now, updated_at: now },
      });
      const linked = await tx.mentor_credentials.updateMany({
        where: { id: doc.id, user_id: userId, mentor_application_id: null },
        data: { mentor_application_id: app.id, jenis_dokumen: kind, updated_at: now },
      });
      if (!linked.count) throw new ApplicationError('Berkas sudah dipakai untuk pengajuan lain.');
      return { id: app.id.toString(), user_id: userId.toString(), bidang_keahlian: skills, alasan_mengajar: app.alasan_mengajar, status: app.status };
    });
    return NextResponse.json({ success: true, application, message: 'Pengajuan dikirim untuk ditinjau admin.',
      user: { id: userId.toString(), namaLengkap: user.namaLengkap, statusMentor: 'PENDING', dokumenKredensial: body.dokumenNama } });
  } catch (error) {
    if (error instanceof ApplicationError) return NextResponse.json({ message: error.message }, { status: 409 });
    console.error('Pengajuan mentor gagal:', error);
    return NextResponse.json({ message: 'Gagal menyimpan pengajuan mentor.' }, { status: 500 });
  }
}
