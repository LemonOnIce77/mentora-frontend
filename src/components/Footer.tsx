import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, BookOpen, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center">
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
              Platform Peer-to-Peer Skill Exchange mahasiswa untuk berbagi ilmu, menambah koneksi, dan membangun portofolio keaktifan resmi.
            </p>
            <div className="text-lg font-handwriting text-[#2563EB]">
              More Skills Brighter Friends ✨
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Fitur Utama</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/#fitur" className="hover:text-[#ED3875] transition">Skill Matching Dua Arah</Link></li>
              <li><Link href="/#fitur" className="hover:text-[#ED3875] transition">Nearby Peer-Finder</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#ED3875] transition">Verifikasi & Profil Mentor</Link></li>
              <li><Link href="/#fitur" className="hover:text-[#ED3875] transition">Gamifikasi EduPoints & Sertifikat</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Pengembangan</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><span className="font-semibold text-slate-700">Sprint 1:</span> Akun dan Mentor (Fase 1)</li>
              <li><span className="font-semibold text-slate-700">Sprint 2:</span> Skill Exchange & Chat</li>
              <li><span className="font-semibold text-slate-700">Sprint 3:</span> EduPoints & E-Certificate</li>
              <li><span className="font-semibold text-slate-700">Metode:</span> Agile Scrum</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Tim Pengembang</h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>• Ahmad Nurtajalla Garda Islam (102062400012)</li>
              <li>• Sulthoni Prima Rafasya (102062400110)</li>
              <li>• Aulia Az Zahra (102062430013)</li>
              <li>• Muhammad Yaumil Aditya Warman (102062430012)</li>
            </ul>
            <p className="mt-3 text-xs text-slate-400">
              Mendukung SDGs Tujuan 4: Pendidikan Berkualitas yang Inklusif dan Merata.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 Mentora Project. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-[#ED3875] fill-current" /> untuk mahasiswa Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
