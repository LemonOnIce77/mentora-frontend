
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

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

    return NextResponse.json({
      message: 'Data diri berhasil disimpan!',
      user: {
        id: updatedUser.id.toString(),
        namaLengkap: updatedUser.nama_lengkap,
        namaPanggilan: updatedUser.nama_panggilan,
      },
    });

  } catch (error) {
    console.error('Error saving step 1 data:', error);

    return NextResponse.json(
      { message: 'Gagal menyimpan data diri.' },
      { status: 500 }
    );
  }
}
