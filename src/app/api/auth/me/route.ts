import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memuat sesi pengguna' }, { status: 500 });
  }
}
