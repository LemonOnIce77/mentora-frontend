import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_SKILLS = [
  { id: 1, namaSkill: 'UI/UX Design', kategori: 'Design', deskripsi: 'Mendesain antarmuka dan pengalaman pengguna untuk aplikasi dan web.' },
  { id: 2, namaSkill: 'Figma', kategori: 'Design', deskripsi: 'Prototyping, wireframing, dan visual design menggunakan Figma.' },
  { id: 3, namaSkill: 'Web Development', kategori: 'Tech', deskripsi: 'Pengembangan web modern dengan React, Next.js, dan Node.js.' },
  { id: 4, namaSkill: 'Programming', kategori: 'Tech', deskripsi: 'Dasar algoritma, Python, JavaScript, TypeScript, dan PHP.' },
  { id: 5, namaSkill: 'Data Analysis', kategori: 'Tech', deskripsi: 'Analisis statistik data, SQL, Pandas, dan visualisasi data.' },
  { id: 6, namaSkill: 'Public Speaking', kategori: 'Communication', deskripsi: 'Teknik presentasi dan komunikasi percaya diri di depan publik.' },
  { id: 7, namaSkill: 'English', kategori: 'Language', deskripsi: 'Academic conversation and TOEFL preparation.' },
  { id: 8, namaSkill: 'Design Thinking', kategori: 'Design', deskripsi: 'Metode inovasi berpusat pada empati pengguna.' },
];

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { namaSkill: 'asc' },
    });
    if (skills && skills.length > 0) {
      return NextResponse.json({ skills });
    }
    return NextResponse.json({ skills: DEFAULT_SKILLS });
  } catch (error) {
    return NextResponse.json({ skills: DEFAULT_SKILLS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { namaSkill, kategori, deskripsi } = body;

    if (!namaSkill) {
      return NextResponse.json({ message: 'Nama skill wajib diisi' }, { status: 400 });
    }

    try {
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
    } catch (dbError) {
      return NextResponse.json({
        skill: {
          id: Math.floor(Date.now() / 1000),
          namaSkill: namaSkill.trim(),
          kategori: kategori || 'General',
        },
      }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menambahkan skill' }, { status: 500 });
  }
}
