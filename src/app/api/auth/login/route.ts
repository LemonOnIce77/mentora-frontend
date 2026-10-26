import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Mock data user langsung tanpa query database
    const mockUser = {
      id: 1,
      namaLengkap: email.includes('admin') ? 'Admin Mentora' : 'Budi Pratama',
      email: email || 'budi@mentora.com',
      universitas: 'Telkom University',
      prodi: 'Sistem Informasi',
      semester: '5',
      role: email.includes('admin') ? 'ADMIN' : 'STUDENT',
      statusMentor: email.includes('admin') ? 'APPROVED' : 'NONE',
    };

    const response = NextResponse.json({
      message: 'Login berhasil (Mock Session)',
      user: mockUser,
    });

    // Simpan cookie sesi login agar Next.js mengenali status aktif
    response.cookies.set('mentora_session', JSON.stringify(mockUser), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 hari
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Terjadi kesalahan internal.' }, { status: 500 });
  }
}