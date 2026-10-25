import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'Tidak ada berkas yang diunggah.' }, { status: 400 });
    }

    // Validasi tipe berkas (FR-05: Dokumen Kredensial PDF / Gambar Bukti)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Format berkas tidak didukung. Harap unggah PDF, JPG, atau PNG.' },
        { status: 400 }
      );
    }

    // Validasi ukuran berkas (Maks 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { message: 'Ukuran berkas melebihi batas maksimal 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitasi nama file dan tambahkan timestamp unik
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${Date.now()}_${sanitizedFileName}`;

    // Target folder penyimpanan di /public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueFileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      message: 'Berkas kredensial berhasil diunggah.',
      fileName: file.name,
      fileUrl: fileUrl,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: 'Gagal memproses unggahan berkas.' }, { status: 500 });
  }
}