export async function uploadMentorDocument(file: File): Promise<{ fileName: string; fileUrl: string }> {
  const form = new FormData();
  form.append('file', file);
  const response = await fetch('/api/upload', { method: 'POST', body: form });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Gagal mengunggah berkas.');
  return result;
}
