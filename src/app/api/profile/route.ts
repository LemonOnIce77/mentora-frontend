import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/profile: Lihat data profil (FR-02)
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      profile: authUser,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data profil' }, { status: 500 });
  }
}

// PUT /api/profile: Pembaruan data profil dan lokasi (FR-02)
export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
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
      latitude,
      longitude,
      modeSesi,
    } = body;

    const updatedProfileData = {
      ...authUser,
      ...(namaLengkap ? { namaLengkap: namaLengkap.trim() } : {}),
      ...(namaPanggilan !== undefined ? { namaPanggilan: namaPanggilan?.trim() } : {}),
      ...(universitas !== undefined ? { universitas: universitas?.trim() } : {}),
      ...(prodi !== undefined ? { prodi: prodi?.trim() } : {}),
      ...(semester !== undefined ? { semester: semester?.trim() } : {}),
      ...(domisili !== undefined ? { domisili: domisili?.trim() } : {}),
      ...(tglLahir !== undefined ? { tglLahir: tglLahir?.trim() } : {}),
      ...(bio !== undefined ? { bio: bio?.trim() } : {}),
      ...(fotoProfil !== undefined ? { fotoProfil } : {}),
      ...(latitude !== undefined ? { latitude: Number(latitude) } : {}),
      ...(longitude !== undefined ? { longitude: Number(longitude) } : {}),
      ...(modeSesi !== undefined ? { modeSesi } : {}),
    };

    // 1. Coba update ke Prisma DB jika ada
    try {
      const updatedUser = await prisma.user.update({
        where: { id: authUser.id },
        data: {
          ...(namaLengkap ? { namaLengkap: namaLengkap.trim() } : {}),
          ...(namaPanggilan !== undefined ? { namaPanggilan: namaPanggilan?.trim() } : {}),
          ...(universitas !== undefined ? { universitas: universitas?.trim() } : {}),
          ...(prodi !== undefined ? { prodi: prodi?.trim() } : {}),
          ...(semester !== undefined ? { semester: semester?.trim() } : {}),
          ...(domisili !== undefined ? { domisili: domisili?.trim() } : {}),
          ...(tglLahir !== undefined ? { tglLahir: tglLahir?.trim() } : {}),
          ...(bio !== undefined ? { bio: bio?.trim() } : {}),
          ...(fotoProfil !== undefined ? { fotoProfil } : {}),
          ...(latitude !== undefined ? { latitude: Number(latitude) } : {}),
          ...(longitude !== undefined ? { longitude: Number(longitude) } : {}),
          ...(modeSesi !== undefined ? { modeSesi } : {}),
        },
      });

      const response = NextResponse.json({
        success: true,
        message: 'Data profil berhasil diperbarui.',
        profile: updatedUser,
      });

      response.cookies.set('mentora_session', JSON.stringify(updatedUser), {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    } catch (dbError) {
      console.warn('Prisma update warning, using session update fallback:', dbError);
    }

    // 2. Fallback update via session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Data profil berhasil diperbarui.',
      profile: updatedProfileData,
    });

    response.cookies.set('mentora_session', JSON.stringify(updatedProfileData), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Gagal memperbarui profil' }, { status: 500 });
  }
}
