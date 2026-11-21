export async function uploadMentorDocument(file: File): Promise<{ fileName: string; fileUrl: string }> {
  const MAX_SIZE = 4.5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `Ukuran dokumen (${sizeInMb} MB) melebihi batas maksimal 4.5 MB serverless. Harap kompres dokumen atau gunakan berkas yang lebih kecil.`
    );
  }

  const form = new FormData();
  form.append('file', file);

  let response: Response;
  try {
    response = await fetch('/api/upload', { method: 'POST', body: form });
  } catch {
    throw new Error('Koneksi terputus saat mengunggah dokumen. Silakan periksa jaringan Anda.');
  }

  if (response.status === 413) {
    throw new Error(
      'Ukuran berkas terlalu besar untuk serverless cloud (maks 4.5 MB). Silakan perkecil atau kompres dokumen Anda terlebih dahulu.'
    );
  }

  let result: any = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      result = await response.json();
    } catch {
      result = null;
    }
  }

  if (!response.ok) {
    const errorMsg = result?.message || (await response.text().catch(() => '')) || 'Gagal mengunggah berkas.';
    throw new Error(
      typeof errorMsg === 'string' && errorMsg.length > 0 && errorMsg.length < 150
        ? errorMsg
        : 'Gagal mengunggah dokumen kredensial ke server.'
    );
  }

  if (!result) {
    try {
      result = await response.json();
    } catch {
      throw new Error('Respon server tidak valid saat mengunggah dokumen.');
    }
  }

  return result;
}
