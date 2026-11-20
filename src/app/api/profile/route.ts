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
    latitude: user.latitude ?? null,
    longitude: user.longitude ?? null,
    onboardingCompleted: user.onboarding_completed ?? true,
  };
}

// GET PROFILE
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);

    if (!authUser?.id) {
      return NextResponse.json(
        { message: 'Tidak terautentikasi.' },
        { status: 401 }
      );
    }

    let user = null;
    try {
      user = await prisma.users.findUnique({
        where: { id: BigInt(authUser.id) },
        select: profileSelect,
      });
    } catch (dbErr) {
      console.warn('DB unreachable in GET profile, using authUser data:', dbErr);
    }

    if (!user) {
      return NextResponse.json({
        success: true,
        profile: {
          id: authUser.id.toString(),
          namaLengkap: authUser.namaLengkap ?? '',
          namaPanggilan: authUser.namaPanggilan ?? '',
          email: authUser.email ?? '',
          universitas: authUser.universitas ?? '',
          prodi: authUser.prodi ?? '',
          semester: authUser.semester ?? '',
          domisili: authUser.domisili ?? '',
          tglLahir: '',
          bio: authUser.bio ?? '',
          fotoProfil: authUser.fotoProfil ?? '',
          modeSesi: authUser.modeSesi ?? 'Online',
          latitude: (authUser as any).latitude ?? null,
          longitude: (authUser as any).longitude ?? null,
          onboardingCompleted: true,
        },
      });
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

// UPDATE PROFILE
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

    let updatedProfile = {
      id: authUser.id.toString(),
      namaLengkap: (data.nama_lengkap as string) ?? authUser.namaLengkap ?? '',
      namaPanggilan: (data.nama_panggilan as string) ?? authUser.namaPanggilan ?? '',
      email: authUser.email ?? '',
      universitas: (data.universitas as string) ?? authUser.universitas ?? '',
      prodi: (data.prodi as string) ?? authUser.prodi ?? '',
      semester: (data.semester as string) ?? authUser.semester ?? '',
      domisili: (data.domisili as string) ?? authUser.domisili ?? '',
      tglLahir: (data.tgl_lahir as string) ?? '',
      bio: (data.bio as string) ?? authUser.bio ?? '',
      fotoProfil: (data.foto_profil as string) ?? authUser.fotoProfil ?? '',
      modeSesi: (data.mode_sesi as string) ?? authUser.modeSesi ?? 'Fleksibel',
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      onboardingCompleted: true,
    };

    // Coba update ke database bila tersambung
    try {
      const dbUser = await prisma.users.update({
        where: { id: BigInt(authUser.id) },
        data,
        select: profileSelect,
      });
      updatedProfile = formatProfile(dbUser);
    } catch (dbErr) {
      console.warn("Database tidak dapat diakses saat update profil, memperbarui cookie sesi:", dbErr);
    }

    // Perbarui session cookie agar sinkron
    const response = NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      profile: updatedProfile,
    });

    const currentSession = {
      ...authUser,
      ...updatedProfile,
      id: Number(authUser.id),
    };

    response.cookies.set(
      'mentora_session',
      JSON.stringify(currentSession),
      {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return response;
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error);

    return NextResponse.json(
      { message: 'Gagal memperbarui profil.' },
      { status: 500 }
    );
  }
}
