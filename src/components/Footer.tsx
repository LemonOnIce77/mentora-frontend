import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </div>
              </div>
              <span className="text-xl font-extrabold text-slate-900">Mentora</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Platform Peer-to-Peer Skill Exchange mahasiswa untuk berbagi ilmu, menambah relasi, dan membangun portofolio keahlian resmi.
            </p>
            <div className="text-lg font-handwriting text-[#2563EB]">
              More Skills Brighter Friends ✨
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Fitur Utama</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/#fitur" className="hover:text-[#2563EB] transition">Pencocokan Keahlian</Link></li>
              <li><Link href="/#fitur" className="hover:text-[#2563EB] transition">Nearby Peer-Finder</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#2563EB] transition">Verifikasi Mentor</Link></li>
              <li><Link href="/#fitur" className="hover:text-[#2563EB] transition">EduPoints & Sertifikat</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/skills" className="hover:text-[#2563EB] transition">Katalog Keahlian</Link></li>
              <li><Link href="/mentor/apply" className="hover:text-[#2563EB] transition">Daftar Jadi Mentor</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#2563EB] transition">Jadwal Sesi Belajar</Link></li>
              <li><Link href="/#cara-kerja" className="hover:text-[#2563EB] transition">Panduan Komunitas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Tentang Platform</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Dikembangkan oleh mahasiswa Telkom University dalam inisiatif pembelajaran kolaboratif yang terarah dan menyenangkan.
            </p>
            <p className="text-xs text-slate-400">
              Mendukung SDGs Tujuan 4: Pendidikan Berkualitas yang Inklusif dan Merata.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Mentora Platform. Hak cipta dilindungi.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/" className="hover:text-slate-900">Kebijakan Privasi</Link>
            <Link href="/" className="hover:text-slate-900">Syarat Ketentuan</Link>
            <Link href="/" className="hover:text-slate-900">Pusat Bantuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
