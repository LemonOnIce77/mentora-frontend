'use client';

import React, { useEffect, useState } from 'react';
import { Edit3, Save } from 'lucide-react';
import { X } from '@/components/animated-icons';

interface AdminCMSBarProps {
  isEditing: boolean;
  isSaving: boolean;
  onToggleEdit: (status: boolean) => void;
  onSave: () => void;
  pageName: string;
}

export default function AdminCMSBar({ isEditing, isSaving, onToggleEdit, onSave, pageName }: AdminCMSBarProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const sessionData = localStorage.getItem('user_session');
    if (sessionData) {
      try {
        const user = JSON.parse(sessionData);
        if (user?.role?.toLowerCase() === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {}
    }
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-surface border border-subtle rounded-full shadow-2xl animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-2 mr-2">
        <span className="flex h-2.5 w-2.5 rounded-full bg-primary-accent animate-pulse"></span>
        <span className="text-xs font-extrabold text-black">Mode Admin ({pageName})</span>
      </div>
      <div className="h-4 w-px bg-line"></div>

      {!isEditing ? (
        <button
          onClick={() => onToggleEdit(true)}
          className="flex items-center gap-2 text-xs font-bold text-ink-secondary hover:text-black transition"
        >
          <Edit3 className="w-4 h-4" /> Edit Konten
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleEdit(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-canvas text-black hover:bg-line text-xs font-bold transition"
          >
            <X className="w-3.5 h-3.5" /> Batal
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full action-primary text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      )}
    </div>
  );
}
