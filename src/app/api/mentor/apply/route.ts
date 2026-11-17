
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Validasi autentikasi
    const authUser = await getAuthUser(req);

    if (!authUser || !authUser.id) {
      return NextResponse.json(
        { message: 'Tidak terautentikasi.' },
        { status: 401 }
      );
    }

    // 2. Ambil data dari frontend
    const body = await req.json();

    const {
      skillsOffered,
      pengalamanMengajar,
      dokumenNama,
    } = body;

    // 3. Validasi data
    const cleanSkills =
      typeof skillsOffered === 'string'
        ? skillsOffered.trim()
        : Array.isArray(skillsOffered)
          ? skillsOffered.join(', ').trim()
          : '';

    const cleanExperience =
      typeof pengalamanMengajar === 'string'
        ? pengalamanMengajar.trim()
        : '';

    const cleanDocName =
      typeof dokumenNama === 'string'
        ? dokumenNama.trim()
        : '';

    if (!cleanSkills || !cleanDocName) {
      return NextResponse.json(
        {
          message: 'Skill dan dokumen kredensial wajib diisi.',
        },
        { status: 400 }
      );
    }

    const userId = BigInt(authUser.id);

    // 4. Buat alasan pengajuan
    const alasanMengajar =
      `Saya ingin menjadi mentor untuk membagikan keahlian di bidang ${cleanSkills}.` +
      (cleanExperience
        ? ` Pengalaman mengajar: ${cleanExperience}`
        : '');

    // 5. Simpan menggunakan transaksi database
    const result = await prisma.$transaction(async (tx) => {

      // Simpan pengajuan mentor
      const application = await tx.mentor_applications.create({
        data: {
          user_id: userId,
          alasan_mengajar: alasanMengajar,
          bidang_keahlian: cleanSkills,
          status: 'PENDING',
        },
      });

      // Update status pengguna
      const updatedUser = await tx.users.update({
        where: {
          id: userId,
        },
        data: {
          status_mentor: 'PENDING',
          dokumen_kredensial: cleanDocName,
        },
        select: {
          id: true,
          nama_lengkap: true,
          status_mentor: true,
          dokumen_kredensial: true,
        },
      });

      return {
        application,
        updatedUser,
      };
    });

    // 6. Kirim respons
    return NextResponse.json({
      success: true,
      message: 'Pengajuan akun Mentor berhasil dikirim!',

      application: {
        id: result.application.id.toString(),
        user_id: result.application.user_id.toString(),
        bidang_keahlian: result.application.bidang_keahlian,
        alasan_mengajar: result.application.alasan_mengajar,
        status: result.application.status,
      },

      user: {
        id: result.updatedUser.id.toString(),
        namaLengkap: result.updatedUser.nama_lengkap,
        statusMentor: result.updatedUser.status_mentor,
        dokumenKredensial:
          result.updatedUser.dokumen_kredensial,
      },
    });

  } catch (error) {
    console.error('Error applying for mentor:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengajukan upgrade akun mentor.',
      },
      { status: 500 }
    );
  }
}
