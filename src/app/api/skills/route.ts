import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { namaSkill: 'asc' },
    });
    return NextResponse.json({ skills });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data skill' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { namaSkill, kategori, deskripsi } = body;

    if (!namaSkill) {
      return NextResponse.json({ message: 'Nama skill wajib diisi' }, { status: 400 });
    }

    const skill = await prisma.skill.upsert({
      where: { namaSkill: namaSkill.trim() },
      update: {},
      create: {
        namaSkill: namaSkill.trim(),
        kategori: kategori || 'General',
        deskripsi: deskripsi || `Keahlian ${namaSkill.trim()}`,
      },
    });

    return NextResponse.json({ skill }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menambahkan skill' }, { status: 500 });
  }
}
