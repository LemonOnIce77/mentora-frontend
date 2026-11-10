import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Coba verifikasi lewat JWT token
    const authUser = await getAuthUser(req);
    if (authUser) {
      return NextResponse.json({ user: authUser });
    }

    // 2. Coba baca sesi cookie alternatif jika ada
    const sessionCookie = req.cookies.get('mentora_session')?.value;
    if (sessionCookie) {
      try {
        const parsed = JSON.parse(sessionCookie);
        if (parsed && parsed.email) {
          return NextResponse.json({ user: parsed });
        }
      } catch (err) {
        // Abaikan bila format cookie rusak
      }
    }

    // Tidak ada sesi aktif
    return NextResponse.json({ user: null });
  } catch (error) {
    console.error('Error fetching auth user session:', error);
    return NextResponse.json({ user: null });
  }
}
