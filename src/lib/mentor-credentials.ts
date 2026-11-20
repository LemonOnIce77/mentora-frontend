import path from 'node:path';

export function credentialPath(userId: bigint, relative: string) {
  const prefix = `credentials/${userId}/`;
  const name = relative.slice(prefix.length);
  if (!relative.startsWith(prefix) || !/^[\w-]+\.(pdf|jpe?g|png)$/i.test(name)) {
    throw new Error('Lokasi dokumen tidak valid.');
  }
  const root = process.env.MENTORA_CREDENTIAL_ROOT ||
    path.resolve(process.cwd(), '../mentora-backend/storage/app/private');
  return path.join(root, relative);
}

export function credentialUrl(id: bigint) {
  return `/api/mentor/credentials/${id}/download`;
}
