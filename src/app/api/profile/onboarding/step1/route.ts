import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
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
    } = body;

    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        namaLengkap: namaLengkap || authUser.namaLengkap,
        namaPanggilan: namaPanggilan || authUser.namaPanggilan,
        universitas: universitas || authUser.universitas,
        prodi: prodi || authUser.prodi,
        semester: semester || authUser.semester,
        domisili: domisili || authUser.domisili,
        tglLahir: tglLahir || authUser.tglLahir,
        bio: bio || authUser.bio,
        fotoProfil: fotoProfil || authUser.fotoProfil,
      },
    });

    return NextResponse.json({
      message: 'Data diri berhasil disimpan!',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error saving step 1 data:', error);
    return NextResponse.json(
      { message: 'Gagal menyimpan data diri.' },
      { status: 500 }
    );
  }
}
