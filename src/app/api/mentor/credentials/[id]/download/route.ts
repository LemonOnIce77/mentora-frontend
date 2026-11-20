import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { credentialPath } from '@/lib/mentor-credentials';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Silakan masuk.' }, { status: 401 });
  if (!/^\d{1,20}$/.test(params.id)) return new Response(null, { status: 404 });
  const doc = await prisma.mentor_credentials.findFirst({
    where: { id: BigInt(params.id), ...(user.role === 'Admin' ? {} : { user_id: BigInt(user.id) }) },
  });
  if (!doc) return new Response(null, { status: 404 });
  try {
    const bytes = await readFile(credentialPath(doc.user_id, doc.file_path));
    return new Response(new Uint8Array(bytes), { headers: {
      'Content-Type': doc.mime_type, 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(doc.file_name)}`,
      'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff',
    } });
  } catch {
    return NextResponse.json({ message: 'Berkas tidak tersedia.' }, { status: 404 });
  }
}
