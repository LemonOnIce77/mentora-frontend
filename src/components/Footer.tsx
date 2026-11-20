'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '@/components/SessionProvider';
import { accountHome } from '@/lib/account-home';

const groups = [
  {
    title: 'Fitur utama',
    links: [
      ['Pencocokan Keahlian', '/matching'],
      ['Nearby Peer-Finder', '/matching?sekitar=1'],
      ['Verifikasi Mentor', '/dashboard'],
      ['EduPoints & Sertifikat', '/dashboard'],
    ],
  },
  {
    title: 'Platform',
    links: [
      ['Katalog Keahlian', '/skills'],
      ['Daftar Jadi Mentor', '/mentor/apply'],
      ['Jadwal Sesi Belajar', '/dashboard'],
      ['Panduan & FAQ', '/faq'],
    ],
  },
];

const linkStyle = 'inline-flex min-h-11 items-center rounded text-sm font-medium text-ink-secondary underline-offset-4 hover:text-primary hover:underline focus-visible:text-primary';

export default function Footer({ workspace = false }: { workspace?: boolean }) {
  const { profile } = useSession();
  if (workspace || profile) {
    const home = profile ? accountHome(profile) : "/";
    return (
      <footer className="mt-auto border-t border-line bg-canvas text-ink">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 py-4 sm:px-6 lg:px-8">
          <Link href={home} className="inline-flex min-h-11 items-center gap-2 rounded-lg font-bold">
            <Image src="/Mentora.svg" alt="" width={26} height={26} /> Mentora
          </Link>
          <nav aria-label="Tautan pendukung" className="flex flex-wrap items-center gap-x-5">
            {home === '/dashboard' && <Link href="/skills" className={linkStyle}>Katalog keahlian</Link>}
            {home === '/dashboard' && <Link href="/mentor/apply" className={linkStyle}>Pengajuan mentor</Link>}
            <Link href="/faq" className={linkStyle}>FAQ</Link>
            <Link href="/bantuan" className={linkStyle}>Pusat bantuan</Link>
          </nav>
        </div>
      </footer>
    );
  }
  return (
    <footer className="mt-auto border-t border-line bg-primary-soft/50 text-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:py-12 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-14">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Beranda Mentora" className="inline-flex min-h-11 items-center gap-2.5 rounded-lg">
              <Image src="/Mentora.svg" alt="" width={36} height={36} />
              <span className="text-3xl font-extrabold tracking-tight">Mentora</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-secondary">
              Platform pertukaran keahlian antarmahasiswa untuk berbagi ilmu, menambah relasi, dan membangun portofolio.
            </p>
            <p className="mt-4 font-handwriting text-2xl text-primary">More Skills Brighter Friends</p>
          </div>
          {groups.map(({ title, links }) => (
            <nav key={title} aria-label={title} className="min-w-0">
              <h2 className="mb-2 text-base font-bold">{title}</h2>
              <ul>
                {links.map(([label, href]) => <li key={label}><Link href={href} className={linkStyle}>{label}</Link></li>)}
              </ul>
            </nav>
          ))}
        </div>
        <div className="grid items-center gap-x-8 gap-y-1 border-y border-line py-5 sm:grid-cols-[1fr_auto]">
          <p className="max-w-2xl text-sm leading-relaxed text-ink-secondary">
            Dikembangkan oleh mahasiswa Telkom University untuk mendukung pembelajaran kolaboratif dan pendidikan berkualitas yang inklusif.
          </p>
          <Link href="/tentang" className={linkStyle + ' justify-self-start gap-2 font-semibold text-primary'}>Kenali Mentora <span aria-hidden="true">→</span></Link>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-5 py-2">
          <p className="text-xs text-ink-muted">© {new Date().getFullYear()} Mentora Platform. Hak cipta dilindungi.</p>
          <Link href="/bantuan" className={linkStyle}>Pusat Bantuan</Link>
        </div>
      </div>
    </footer>
  );
}
