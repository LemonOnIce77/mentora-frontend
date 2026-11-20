import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { credentialUrl } from '@/lib/mentor-credentials';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthUser(req);
    if (admin?.role !== 'Admin') return NextResponse.json({ message: 'Hanya admin yang dapat meninjau pengajuan.' }, { status: 403 });
    const rows = await prisma.mentor_applications.findMany({
      orderBy: { id: 'desc' },
      include: {
        users_mentor_applications_user_idTousers: { select: {
          nama_lengkap: true, email: true, universitas: true, prodi: true, domisili: true, semester: true, status_mentor: true,
        } },
        mentor_credentials: { select: { id: true, file_name: true }, orderBy: { id: 'desc' } },
      },
    });
    const applications = rows.map(row => {
      const person = row.users_mentor_applications_user_idTousers;
      const doc = row.mentor_credentials[0];
      return {
        id: Number(row.id), userId: Number(row.user_id), skillsOffered: row.bidang_keahlian, pengalamanMengajar: row.alasan_mengajar,
        dokumenNama: doc?.file_name ?? '', dokumenUrl: doc ? credentialUrl(doc.id) : '', status: row.status,
        catatanAdmin: row.catatan_admin, createdAt: row.created_at, reviewedAt: row.reviewed_at, reviewedBy: row.reviewed_by?.toString(),
        user: { id: Number(row.user_id), namaLengkap: person.nama_lengkap, email: person.email, universitas: person.universitas,
          prodi: person.prodi, semester: person.semester, domisili: person.domisili, statusMentor: person.status_mentor },
      };
    });
    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Daftar pengajuan gagal dimuat:', error);
    return NextResponse.json({ message: 'Daftar pengajuan tidak dapat dimuat.' }, { status: 500 });
  }
}
