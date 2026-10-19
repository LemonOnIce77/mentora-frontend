import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mentora - Peer-to-Peer Skill Exchange Mahasiswa',
  description: 'Belajar bareng mahasiswa lain, berkembang lewat skill. Platform peer-to-peer mentoring dan pertukaran keahlian mahasiswa.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#FAFAFB] text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
