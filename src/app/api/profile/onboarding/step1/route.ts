import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);

    if (!authUser || !authUser.id) {
      return NextResponse.json(
        { message: 'Tidak terautentikasi.' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      namaLengkap,
      namaPanggilan,
      universitas,
      prodi,
      semester,
      domisili,
      tglLahir,
      bio,
      fotoProfil,
    } = body;

    if (!namaLengkap || !namaLengkap.trim()) {
      return NextResponse.json(
        { message: 'Nama lengkap wajib diisi.' },
        { status: 400 }
      );
    }

    const nullableString = (value: unknown) => {
      if (value === undefined) return undefined;
      if (value === null || value === '') return null;
      return String(value).trim();
    };

    let userResult = {
      id: authUser.id.toString(),
      namaLengkap: namaLengkap.trim(),
      namaPanggilan: nullableString(namaPanggilan) ?? authUser.namaPanggilan ?? '',
    };

    try {
      const updatedUser = await prisma.users.update({
        where: {
          id: BigInt(authUser.id),
        },
        data: {
          nama_lengkap: namaLengkap.trim(),
          nama_panggilan: nullableString(namaPanggilan),
          universitas: nullableString(universitas),
          prodi: nullableString(prodi),
          semester: nullableString(semester),
          domisili: nullableString(domisili),
          tgl_lahir: nullableString(tglLahir),
          bio: nullableString(bio),
          foto_profil: nullableString(fotoProfil),
        },
        select: {
          id: true,
          nama_lengkap: true,
          nama_panggilan: true,
        },
      });

      userResult = {
        id: updatedUser.id.toString(),
        namaLengkap: updatedUser.nama_lengkap,
        namaPanggilan: updatedUser.nama_panggilan ?? '',
      };
    } catch (dbErr) {
      console.warn('Database offline during onboarding step 1, using cookie fallback:', dbErr);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Data diri berhasil disimpan!',
      user: userResult,
    });

    // Update mentora_session cookie
    const currentSession = {
      ...authUser,
      namaLengkap: namaLengkap.trim(),
      namaPanggilan: nullableString(namaPanggilan) ?? authUser.namaPanggilan ?? '',
      universitas: nullableString(universitas) ?? authUser.universitas ?? '',
      prodi: nullableString(prodi) ?? authUser.prodi ?? '',
      semester: nullableString(semester) ?? authUser.semester ?? '',
      domisili: nullableString(domisili) ?? authUser.domisili ?? '',
      tglLahir: nullableString(tglLahir) ?? (authUser as any).tglLahir ?? '',
      bio: nullableString(bio) ?? authUser.bio ?? '',
      fotoProfil:
        fotoProfil && String(fotoProfil).startsWith('data:')
          ? (authUser.fotoProfil || '')
          : (nullableString(fotoProfil) ?? authUser.fotoProfil ?? ''),
    };

    try {
      response.cookies.set(
        'mentora_session',
        encodeURIComponent(JSON.stringify(currentSession)),
        {
          httpOnly: false,
          path: '/',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        }
      );
    } catch (cookieErr) {
      console.warn('Failed to set mentora_session in step 1:', cookieErr);
    }

    return response;

  } catch (error) {
    console.error('Error saving step 1 data:', error);

    return NextResponse.json(
      { message: 'Gagal menyimpan data diri.' },
      { status: 500 }
    );
  }
}
