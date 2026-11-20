
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SessionProvider from '@/components/SessionProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mentora - Peer-to-Peer Skill Exchange Mahasiswa',
  description:
    'Belajar bareng mahasiswa lain, berkembang lewat skill. Platform peer-to-peer mentoring dan pertukaran keahlian mahasiswa.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
