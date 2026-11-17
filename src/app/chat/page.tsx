'use client';

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, MessageCircle, Send, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type ChatMessage = { id: string; senderId: string; content: string; createdAt: string };
type ChatRoom = { id: string; participantIds: string[]; partnerId: string; partnerName: string; messages: ChatMessage[] };
const STORAGE_KEY = 'mentora_chat_rooms';

export default function ChatPage() {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState('');
  const [partnerName, setPartnerName] = useState('Partner belajar');
  const [userId, setUserId] = useState('');
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPartnerId(params.get('partnerId') || '');
    setPartnerName(params.get('name') || 'Partner belajar');
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadRoom = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) { router.replace('/auth'); return; }
        const data = await res.json();
        if (!data.user) { router.replace('/auth'); return; }
        const currentId = String(data.user.id);
        if (cancelled) return;
        setUserId(currentId);
        const stored: ChatRoom[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (partnerId && partnerId !== currentId) {
          let selected = stored.find((item) => item.participantIds.includes(currentId) && item.participantIds.includes(partnerId));
          if (!selected) {
            selected = { id: `room-${[currentId, partnerId].sort().join('-')}`, participantIds: [currentId, partnerId], partnerId, partnerName, messages: [] };
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...stored, selected]));
          }
          if (!selected.participantIds.includes(currentId)) { setDenied(true); return; }
          setRoom(selected);
        } else {
          const own = stored.find((item) => item.participantIds.includes(currentId));
          if (own && !own.participantIds.includes(currentId)) setDenied(true);
          else if (own) setRoom(own);
        }
      } catch (error) { console.error('Gagal membuka ruang diskusi:', error); }
      finally { if (!cancelled) setLoading(false); }
    };
    loadRoom();
    return () => { cancelled = true; };
  }, [router, partnerId, partnerName]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [room?.messages.length]);

  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault();
    const content = message.trim();
    if (!content || !room || !room.participantIds.includes(userId)) return;
    const next = { ...room, messages: [...room.messages, { id: `${Date.now()}`, senderId: userId, content, createdAt: new Date().toISOString() }] };
    const stored: ChatRoom[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored.map((item) => item.id === next.id ? next : item)));
    setRoom(next); setMessage('');
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } };

  return <div className="min-h-screen flex flex-col bg-[#FAFAFB]"><Navbar /><main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col"><div className="mb-5 flex items-center justify-between"><button onClick={() => router.push('/matching')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2563EB]"><ArrowLeft className="h-4 w-4" />Cari partner lain</button><span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">Pesan tersimpan di perangkat ini</span></div><section className="flex-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm min-h-[560px] flex flex-col">{loading ? <div className="flex flex-1 items-center justify-center gap-3 text-slate-500"><Loader2 className="h-5 w-5 animate-spin" />Membuka ruang diskusi...</div> : denied ? <div className="m-auto max-w-lg p-8 text-center"><ShieldCheck className="mx-auto h-12 w-12 text-rose-500" /><h1 className="mt-3 text-xl font-bold text-slate-900">Akses Ditolak</h1><p className="mt-2 text-sm text-slate-600">Percakapan ini bersifat privat antara dua pengguna yang terlibat.</p></div> : room ? <><header className="flex items-center gap-3 border-b border-slate-100 p-5"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]"><MessageCircle className="h-5 w-5" /></div><div><h1 className="font-bold text-slate-900">{room.partnerName}</h1><p className="text-xs text-slate-500">Diskusi pertukaran skill</p></div></header><div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-5"><div className="mx-auto max-w-xl rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center text-xs leading-relaxed text-blue-800">Diskusi pertukaran skill dimulai. Sepakati topik materi dan jadwal sesi belajar kalian di sini.</div>{room.messages.map((item) => <div key={item.id} className={`flex ${item.senderId === userId ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${item.senderId === userId ? 'rounded-tr-sm bg-[#2563EB] text-white' : 'rounded-tl-sm border border-slate-200/60 bg-slate-100 text-slate-800'}`}><p className="whitespace-pre-wrap">{item.content}</p><time className={`mt-1 block text-right text-[10px] ${item.senderId === userId ? 'text-blue-100' : 'text-slate-400'}`}>{new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</time></div></div>)}<div ref={messagesEndRef} /></div><form onSubmit={sendMessage} className="flex items-end gap-3 border-t border-slate-100 p-4"><textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} rows={2} placeholder="Tulis pesan... (Enter untuk mengirim)" className="max-h-32 min-h-12 flex-1 resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /><button type="submit" disabled={!message.trim()} aria-label="Kirim pesan" className="rounded-xl bg-[#2563EB] p-3 text-white hover:bg-blue-700 disabled:opacity-50"><Send className="h-5 w-5" /></button></form></> : <div className="m-auto max-w-lg p-8 text-center"><MessageCircle className="mx-auto h-12 w-12 text-slate-300" /><h1 className="mt-3 text-xl font-bold text-slate-900">Belum ada ruang diskusi</h1><p className="mt-2 text-sm text-slate-500">Pilih partner belajar terlebih dahulu untuk memulai percakapan.</p><button onClick={() => router.push('/matching')} className="mt-5 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">Cari Partner Belajar</button></div>}</section></main><Footer /></div>;
}
