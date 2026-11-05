import React from 'react';
import Link from 'next/link';
import { Heart, MapPin, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-auto py-12 transition-colors duration-200">
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
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">Mentora</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Platform Peer-to-Peer Skill Exchange mahasiswa untuk berbagi ilmu, menambah koneksi, dan membangun portofolio keaktifan resmi.
            </p>
            <div className="text-lg font-handwriting text-[#2563EB] dark:text-blue-400">
              More Skills Brighter Friends ✨
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Fitur Utama</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/#fitur" className="hover:text-[#2563EB] dark:hover:text-blue-400 transition">Skill Matching Dua Arah</Link></li>
              <li><Link href="/#fitur" className="hover:text-[#2563EB] dark:hover:text-blue-400 transition">Nearby Peer-Finder</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#2563EB] dark:hover:text-blue-400 transition">Verifikasi & Profil Mentor</Link></li>
              <li><Link href="/#fitur" className="hover:text-[#2563EB] dark:hover:text-blue-400 transition">Gamifikasi EduPoints & Sertifikat</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-wider uppercase">
              Kontak & Alamat
            </h4>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Jl. Telekomunikasi No. 1, Terusan Buahbatu, Sukapura, Kec. Dayeuhkolot, Bandung, Jawa Barat 40257
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a
                  href="mailto:support@mentora.id"
                  className="hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors"
                >
                  support@mentora.id
                </a>
              </div>

              {/* Jam Operasional */}
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Senin – Jumat, 08:00 – 17:00 WIB</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Tim Pengembang</h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li>• Ahmad Nurtajalla Garda Islam (102062400012)</li>
              <li>• Sulthoni Prima Rafasya (102062400110)</li>
              <li>• Aulia Az Zahra (102062430013)</li>
              <li>• Muhammad Yaumil Aditya Warman (102062430012)</li>
            </ul>
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              Mendukung SDGs Tujuan 4: Pendidikan Berkualitas yang Inklusif dan Merata.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <p>© 2026 Mentora Project. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-[#2563EB] fill-current" /> untuk mahasiswa Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
