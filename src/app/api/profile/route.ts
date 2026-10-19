import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/profile: Lihat data profil (SCRUM-95)
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

// PUT /api/profile: Pembaruan data profil dan lokasi (SCRUM-96)
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

    return NextResponse.json({
      success: true,
      message: 'Data profil berhasil diperbarui.',
      profile: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Gagal memperbarui profil' }, { status: 500 });
  }
}
