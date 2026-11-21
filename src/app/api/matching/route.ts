import { NextRequest, NextResponse } from 'next/server';
import { approvalCount, mentorIdentity } from '@/lib/mentor-eligibility';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { DEFAULT_COMMUNITY_MENTORS } from '@/lib/community-mentors';

export const dynamic = 'force-dynamic';

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const rad = (n: number) => (n * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Number((6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
}

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Autentikasi diperlukan.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const radiusParam = searchParams.get('radius');
    const radius = radiusParam ? parseFloat(radiusParam) : null;
    const sort = searchParams.get('sort') || 'score';

    const p = prisma as any;
    const currentUserId = BigInt(authUser.id);

    // Ambil skills milik pengguna yang sedang login
    let userSkills: any[] = [];
    try {
      userSkills = await (p.user_skills || p.userSkill)?.findMany({
        where: { user_id: currentUserId },
        include: { skills: true },
      }) || [];
    } catch {
      userSkills = [];
    }

    let taughtSkills = userSkills
      .filter((s: any) => s.type?.toLowerCase() === 'teach' || s.tipe?.toLowerCase() === 'teach')
      .map((s: any) => s.skills?.nama_skill || s.skill?.namaSkill || s.skill?.nama_skill || '')
      .filter(Boolean);

    let learnSkills = userSkills
      .filter((s: any) => s.type?.toLowerCase() === 'learn' || s.tipe?.toLowerCase() === 'learn')
      .map((s: any) => s.skills?.nama_skill || s.skill?.namaSkill || s.skill?.nama_skill || '')
      .filter(Boolean);

    // Fallback ke authUser.skills jika data database kosong (cloud serverless / session fallback)
    if (taughtSkills.length === 0 && learnSkills.length === 0 && Array.isArray((authUser as any).skills)) {
      const authSkills = (authUser as any).skills;
      taughtSkills = authSkills
        .filter((s: any) => String(s.tipe || s.type).toLowerCase() === 'teach')
        .map((s: any) => s.skill?.namaSkill || s.skills?.nama_skill || s.namaSkill || '')
        .filter(Boolean);
      learnSkills = authSkills
        .filter((s: any) => String(s.tipe || s.type).toLowerCase() === 'learn')
        .map((s: any) => s.skill?.namaSkill || s.skills?.nama_skill || s.namaSkill || '')
        .filter(Boolean);
    }

    // Kasus Tepi FR-08 SCRUM-136: Hanya gagal jika sama sekali tidak memiliki skill (baik teach maupun learn)
    if (taughtSkills.length === 0 && learnSkills.length === 0) {
      return NextResponse.json({
        success: false,
        missing_skills: true,
        message: 'Pengguna tanpa data skill diarahkan melengkapi skill terlebih dahulu.',
        matches: [],
      }, { status: 422 });
    }

    // Ambil daftar kandidat pengguna lain
    let candidates: any[] = [];
    try {
      candidates = await (p.users || p.user)?.findMany({
        where: {
          id: { not: currentUserId },
        },
        include: {
          _count: approvalCount,
          user_skills: {
            include: { skills: true },
          },
        },
      }) || [];
    } catch {
      candidates = [];
    }

    // Fallback kandidat komunitas jika database pengguna lain belum terisi
    if (!candidates.length) {
      candidates = DEFAULT_COMMUNITY_MENTORS.filter((m) => m.id !== Number(currentUserId)).map((m) => ({
        id: BigInt(m.id),
        nama_lengkap: m.namaLengkap,
        nama_panggilan: m.namaPanggilan,
        universitas: m.universitas,
        prodi: m.prodi,
        domisili: m.domisili,
        foto_profil: m.fotoProfil,
        role: m.role,
        mode_sesi: m.modeSesi,
        latitude: -6.9740 + Math.random() * 0.01,
        longitude: 107.6303 + Math.random() * 0.01,
        user_skills: m.skills.map((s: any) => ({
          type: 'teach',
          skills: { nama_skill: s.skill.namaSkill },
        })),
        _count: { mentor_applications: 1 },
      }));
    }

    const userLat = Number((authUser as any).latitude ?? -6.9740);
    const userLng = Number((authUser as any).longitude ?? 107.6303);

    const matches = candidates.map((cand: any, idx: number) => {
      const cSkills = cand.user_skills || [];
      const cTeach = cSkills
        .filter((s: any) => s.type?.toLowerCase() === 'teach' || s.tipe?.toLowerCase() === 'teach')
        .map((s: any) => s.skills?.nama_skill || s.skill?.namaSkill || s.skill?.nama_skill || '')
        .filter(Boolean);

      const cLearn = cSkills
        .filter((s: any) => s.type?.toLowerCase() === 'learn' || s.tipe?.toLowerCase() === 'learn')
        .map((s: any) => s.skills?.nama_skill || s.skill?.namaSkill || s.skill?.nama_skill || '')
        .filter(Boolean);

      // Two-way matching calculation
      const theyTeachMe = cTeach.filter((ts: string) =>
        learnSkills.some((ls: string) => ls.toLowerCase() === ts.toLowerCase())
      );
      const iTeachThem = taughtSkills.filter((myTs: string) =>
        cLearn.some((cls: string) => cls.toLowerCase() === myTs.toLowerCase())
      );

      const isTwoWay = theyTeachMe.length > 0 && iTeachThem.length > 0;
      let score = isTwoWay
        ? 75 + Math.min(20, (theyTeachMe.length + iTeachThem.length) * 5)
        : 50 + Math.min(25, Math.max(theyTeachMe.length, iTeachThem.length) * 8);

      const isVerified = mentorIdentity(cand).statusMentor === 'APPROVED';
      if (isVerified) score = Math.min(99, score + 5);

      const candLat = Number(cand.latitude ?? userLat + (idx + 1) * 0.003);
      const candLng = Number(cand.longitude ?? userLng + (idx + 1) * 0.002);
      const dist = haversine(userLat, userLng, candLat, candLng);

      return {
        id: String(cand.id),
        namaLengkap: cand.nama_lengkap || cand.namaLengkap || 'Mahasiswa',
        namaPanggilan: cand.nama_panggilan || cand.namaPanggilan,
        universitas: cand.universitas || 'Universitas Telkom',
        prodi: cand.prodi || 'Informatika',
        domisili: cand.domisili || 'Lokasi belum diatur',
        fotoProfil: cand.foto_profil || cand.fotoProfil,
        isVerifiedMentor: isVerified,
        matchScore: score,
        isTwoWay,
        latitude: candLat,
        longitude: candLng,
        distanceKm: dist,
        modeSesi: cand.mode_sesi || cand.modeSesi || 'Fleksibel',
        skillsDitawarkan: theyTeachMe.length ? theyTeachMe : (cTeach.length ? cTeach : learnSkills.slice(0, 2)),
        skillsDibutuhkan: iTeachThem.length ? iTeachThem : (cLearn.length ? cLearn : taughtSkills.slice(0, 2)),
      };
    });

    let filteredMatches = matches;
    if (radius !== null && !isNaN(radius)) {
      filteredMatches = filteredMatches.filter((m: any) => m.distanceKm <= radius);
    }

    if (sort === 'distance') {
      filteredMatches.sort((a: any, b: any) => a.distanceKm - b.distanceKm);
    } else {
      filteredMatches.sort((a: any, b: any) => b.matchScore - a.matchScore);
    }

    return NextResponse.json({
      success: true,
      total: filteredMatches.length,
      matches: filteredMatches,
    });
  } catch (error) {
    console.error('Gagal memuat rekomendasi:', error);
    return NextResponse.json({ message: 'Gagal memuat rekomendasi.' }, { status: 500 });
  }
}
