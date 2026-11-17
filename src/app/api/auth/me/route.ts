
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        {
          user: null,
          message: 'Sesi tidak valid. Silakan login kembali.',
        },
        {
          status: 401,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate',
        },
      }
    );

  } catch (error) {
    console.error('Auth me error:', error);

    return NextResponse.json(
      {
        user: null,
        message: 'Gagal mengambil data pengguna.',
      },
      { status: 500 }
    );
  }
}
