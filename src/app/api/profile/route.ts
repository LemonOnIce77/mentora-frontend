
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const profileSelect = {
  id: true,
  nama_lengkap: true,
  nama_panggilan: true,
  email: true,
  universitas: true,
  prodi: true,
  semester: true,
  domisili: true,
  tgl_lahir: true,
  bio: true,
  foto_profil: true,
  mode_sesi: true,
  latitude: true,
  longitude: true,
  onboarding_completed: true,
};

function formatProfile(user: any) {
  return {
    id: user.id.toString(),
    namaLengkap: user.nama_lengkap ?? '',
    namaPanggilan: user.nama_panggilan ?? '',
    email: user.email ?? '',
    universitas: user.universitas ?? '',
    prodi: user.prodi ?? '',
    semester: user.semester ?? '',
    domisili: user.domisili ?? '',
    tglLahir: user.tgl_lahir ?? '',
    bio: user.bio ?? '',
    fotoProfil: user.foto_profil ?? '',
    modeSesi: user.mode_sesi ?? 'Fleksibel',
    latitude: user.latitude,
    longitude: user.longitude,
    onboardingCompleted: user.onboarding_completed,
  };
}

// GET PROFILE DARI DATABASE
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);

    if (!authUser?.id) {
      return NextResponse.json(
        { message: 'Tidak terautentikasi.' },
        { status: 401 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { id: BigInt(authUser.id) },
      select: profileSelect,
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Pengguna tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: formatProfile(user),
    });
  } catch (error) {
    console.error('GET PROFILE ERROR:', error);

    return NextResponse.json(
      { message: 'Gagal mengambil data profil.' },
      { status: 500 }
    );
  }
}

// UPDATE PROFILE KE DATABASE
export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);

    if (!authUser?.id) {
      return NextResponse.json(
        { message: 'Tidak terautentikasi.' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const nullableString = (value: unknown) => {
      if (value === undefined) return undefined;
      if (value === null) return null;

      const result = String(value).trim();
      return result === '' ? null : result;
    };

    const data: Prisma.usersUpdateInput = {};

    if (body.namaLengkap !== undefined) {
      data.nama_lengkap = String(body.namaLengkap).trim();
    }

    if (body.namaPanggilan !== undefined) {
      data.nama_panggilan = nullableString(body.namaPanggilan);
    }

    if (body.universitas !== undefined) {
      data.universitas = nullableString(body.universitas);
    }

    if (body.prodi !== undefined) {
      data.prodi = nullableString(body.prodi);
    }

    if (body.semester !== undefined) {
      data.semester = nullableString(body.semester);
    }

    if (body.domisili !== undefined) {
      data.domisili = nullableString(body.domisili);
    }

    if (body.tglLahir !== undefined) {
      data.tgl_lahir = nullableString(body.tglLahir);
    }

    if (body.bio !== undefined) {
      data.bio = nullableString(body.bio);
    }

    if (body.fotoProfil !== undefined) {
      data.foto_profil = nullableString(body.fotoProfil);
    }

    if (body.modeSesi !== undefined) {
      data.mode_sesi = body.modeSesi;
    }

    if (body.latitude !== undefined) {
      if (body.latitude === null || body.latitude === '') {
        data.latitude = null;
      } else {
        const parsed = Number(body.latitude);
        data.latitude = isNaN(parsed) ? null : parsed;
      }
    }

    if (body.longitude !== undefined) {
      if (body.longitude === null || body.longitude === '') {
        data.longitude = null;
      } else {
        const parsed = Number(body.longitude);
        data.longitude = isNaN(parsed) ? null : parsed;
      }
    }

    if (body.onboardingCompleted !== undefined) {
      data.onboarding_completed = Boolean(body.onboardingCompleted);
    }

    const updatedUser = await prisma.users.update({
      where: { id: BigInt(authUser.id) },
      data,
      select: profileSelect,
    });

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      profile: formatProfile(updatedUser),
    });
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error);

    return NextResponse.json(
      { message: 'Gagal memperbarui profil.' },
      { status: 500 }
    );
  }
}
