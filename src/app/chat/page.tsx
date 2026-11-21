'use client';

import { FormEvent, KeyboardEvent, useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Loader2, Video } from 'lucide-react';
import { ArrowLeft, Clock, MapPin, MessageCircle, Send, ShieldCheck } from '@/components/animated-icons';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type ChatMessage = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
};

type ChatRoom = {
  id: string;
  participantIds: string[];
  partnerId: string;
  partnerName: string;
  partnerPhoto?: string;
  messages: ChatMessage[];
};

type BookedSession = {
  id: string;
  mentorId: number | string;
  mentorName: string;
  mentorPhoto?: string;
  skill: string;
  tanggalSesi: string;
  jamMulai: string;
  jamSelesai: string;
  metode: string;
  lokasi: string;
  topik?: string;
  status: string;
  createdAt: string;
};

const STORAGE_KEY = 'mentora_chat_rooms';
const BOOKINGS_KEY = 'mentora_booked_sessions';

export default function ChatPage() {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState('');
  const [partnerName, setPartnerName] = useState('Partner belajar');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [allRooms, setAllRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ambil query param dari URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pId = params.get('partnerId') || '';
    const pName = params.get('name') || '';
    if (pId) setPartnerId(pId);
    if (pName) setPartnerName(decodeURIComponent(pName));
  }, []);

  // Muat data sesi auth dan rooms
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.replace('/auth');
          return;
        }
        const data = await res.json();
        if (!data.user) {
          router.replace('/auth');
          return;
        }

        const currentId = String(data.user.id);
        const currentName = data.user.namaLengkap || data.user.namaPanggilan || 'Saya';
        if (cancelled) return;

        setUserId(currentId);
        setUserName(currentName);

        // Ambil riwayat chat dari localStorage
        let stored: ChatRoom[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

        // Ambil data booking sesi untuk menghubungkan room
        const storedBookings: BookedSession[] = JSON.parse(
          localStorage.getItem(BOOKINGS_KEY) || '[]'
        );
        setBookedSessions(storedBookings);

        // Jika ada booking tapi belum ada room, otomatis inisialisasi room dari booking
        storedBookings.forEach((b) => {
          const mId = String(b.mentorId);
          const exists = stored.find(
            (r) => r.participantIds.includes(currentId) && r.participantIds.includes(mId)
          );
          if (!exists) {
            const newRoom: ChatRoom = {
              id: `room-${[currentId, mId].sort().join('-')}`,
              participantIds: [currentId, mId],
              partnerId: mId,
              partnerName: b.mentorName,
              partnerPhoto: b.mentorPhoto,
              messages: [
                {
                  id: `welcome-${Date.now()}-${mId}`,
                  senderId: mId,
                  content: `Halo! Sesi belajar untuk materi ${b.skill} sudah dijadwalkan pada ${b.tanggalSesi} pukul ${b.jamMulai} - ${b.jamSelesai} WIB. Silakan diskusikan persiapan atau pertanyaanmu di sini ya!`,
                  createdAt: b.createdAt || new Date().toISOString(),
                },
              ],
            };
            stored = [newRoom, ...stored];
          }
        });

        // Jika ada partnerId di URL
        if (partnerId && partnerId !== currentId) {
          let selected = stored.find(
            (item) => item.participantIds.includes(currentId) && item.participantIds.includes(partnerId)
          );

          if (!selected) {
            const relatedBooking = storedBookings.find((b) => String(b.mentorId) === partnerId);
            selected = {
              id: `room-${[currentId, partnerId].sort().join('-')}`,
              participantIds: [currentId, partnerId],
              partnerId,
              partnerName,
              partnerPhoto: relatedBooking?.mentorPhoto || '',
              messages: [],
            };
            stored = [selected, ...stored];
          }

          if (!selected.participantIds.includes(currentId)) {
            setDenied(true);
            return;
          }

          localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
          setAllRooms(stored);
          setCurrentRoom(selected);
        } else {
          // Jika tidak ada partnerId di URL, buka room pertama yang tersedia
          const myRooms = stored.filter((r) => r.participantIds.includes(currentId));
          setAllRooms(stored);
          if (myRooms.length > 0) {
            setCurrentRoom(myRooms[0]);
            setPartnerId(myRooms[0].partnerId);
            setPartnerName(myRooms[0].partnerName);
          }
        }
      } catch (error) {
        console.error('Gagal membuka ruang diskusi:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [router, partnerId, partnerName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentRoom?.messages.length]);

  // Cari sesi yang relevan dengan partner yang sedang dibuka
  const activeSession = useMemo(() => {
    if (!currentRoom) return null;
    return bookedSessions.find(
      (b) => String(b.mentorId) === String(currentRoom.partnerId) && b.status === 'BOOKED'
    );
  }, [bookedSessions, currentRoom]);

  const selectRoom = (room: ChatRoom) => {
    setCurrentRoom(room);
    setPartnerId(room.partnerId);
    setPartnerName(room.partnerName);
    window.history.replaceState(
      {},
      '',
      `/chat?partnerId=${room.partnerId}&name=${encodeURIComponent(room.partnerName)}`
    );
  };

  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault();
    const content = message.trim();
    if (!content || !currentRoom || !currentRoom.participantIds.includes(userId)) return;

    const newMessage: ChatMessage = {
      id: `${Date.now()}`,
      senderId: userId,
      content,
      createdAt: new Date().toISOString(),
    };

    const nextRoom = {
      ...currentRoom,
      messages: [...currentRoom.messages, newMessage],
    };

    const stored: ChatRoom[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updatedStored = stored.map((item) => (item.id === nextRoom.id ? nextRoom : item));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStored));
    setAllRooms(updatedStored);
    setCurrentRoom(nextRoom);
    setMessage('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        {/* Top Header Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-1.5 text-xs font-bold text-ink shadow-2xs transition hover:border-primary hover:text-primary hover:bg-primary-soft/30 active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4 text-primary" />
              <span>Kembali ke Dashboard</span>
            </Link>
            <span aria-hidden="true" className="h-4 border-l border-line" />
            <span className="text-xs font-semibold text-ink-muted">
              Ruang Diskusi & Sesi Belajar
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-canvas border border-line px-3 py-1 text-[11px] font-bold text-ink-secondary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>Real-time Chat Aktif</span>
            </span>
          </div>
        </div>

        {/* Main Chat Box Container */}
        <section className="flex-1 overflow-hidden rounded-3xl border border-line bg-surface shadow-soft-card min-h-[620px] flex flex-col md:flex-row">
          {loading ? (
            <div className="flex flex-1 items-center justify-center gap-3 text-ink-muted">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm font-semibold">Membuka ruang diskusi...</span>
            </div>
          ) : denied ? (
            <div className="m-auto max-w-lg p-8 text-center">
              <ShieldCheck className="mx-auto h-12 w-12 text-danger" />
              <h1 className="mt-3 text-xl font-bold text-ink">Akses Ditolak</h1>
              <p className="mt-2 text-sm text-ink-muted">
                Percakapan ini bersifat privat antara dua pengguna yang terlibat.
              </p>
            </div>
          ) : (
            <>
              {/* Sidebar Daftar Percakapan (Inbox) */}
              <aside className="w-full md:w-80 border-r border-line flex flex-col bg-canvas">
                <div className="p-4 border-b border-line flex items-center justify-between">
                  <h2 className="font-extrabold text-sm text-ink flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span>Daftar Percakapan</span>
                  </h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-tint text-primary border border-primary-soft">
                    {allRooms.length}
                  </span>
                </div>

                {/* List Room */}
                <div className="flex-1 overflow-y-auto divide-y divide-line">
                  {allRooms.length > 0 ? (
                    allRooms.map((r) => {
                      const isSelected = currentRoom?.id === r.id;
                      const lastMsg = r.messages[r.messages.length - 1];
                      return (
                        <button
                          key={r.id}
                          onClick={() => selectRoom(r)}
                          className={`w-full p-4 text-left transition flex items-start gap-3 ${
                            isSelected
                              ? 'bg-primary-tint border-l-4 border-primary shadow-xs'
                              : 'hover:bg-primary-tint'
                          }`}
                        >
                          {r.partnerPhoto ? (
                            <img
                              src={r.partnerPhoto}
                              alt={r.partnerName}
                              className="w-11 h-11 rounded-2xl object-cover shrink-0 border border-line shadow-xs"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-2xl bg-primary text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                              {r.partnerName.charAt(0)}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h3
                                className={`text-xs font-bold truncate ${
                                  isSelected ? 'text-primary' : 'text-ink-secondary'
                                }`}
                              >
                                {r.partnerName}
                              </h3>
                              {lastMsg && (
                                <time className="text-[10px] text-ink-muted shrink-0">
                                  {new Date(lastMsg.createdAt).toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </time>
                              )}
                            </div>
                            <p className="text-[11px] text-ink-muted truncate mt-0.5">
                              {lastMsg ? lastMsg.content : 'Belum ada pesan...'}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-xs text-ink-muted">
                      <p>Belum ada percakapan aktif.</p>
                      <Link
                        href="/dashboard"
                        className="inline-block mt-3 px-3 py-1.5 rounded-lg action-primary text-[11px] font-bold shadow-xs transition"
                      >
                        Cari Mentor
                      </Link>
                    </div>
                  )}
                </div>
              </aside>

              {/* Area Chat Room Aktif */}
              <div className="flex-1 flex flex-col min-w-0">
                {currentRoom ? (
                  <>
                    {/* Header Chat */}
                    <header className="p-4 sm:px-6 border-b border-line flex items-center justify-between bg-surface">
                      <div className="flex items-center gap-3 min-w-0">
                        {currentRoom.partnerPhoto ? (
                          <img
                            src={currentRoom.partnerPhoto}
                            alt={currentRoom.partnerName}
                            className="w-10 h-10 rounded-2xl object-cover border border-line"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold">
                            {currentRoom.partnerName.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h1 className="font-extrabold text-ink text-sm truncate flex items-center gap-1.5">
                            <span>{currentRoom.partnerName}</span>
                            <ShieldCheck className="w-4 h-4 text-success shrink-0" />
                          </h1>
                          <p className="text-[11px] text-ink-muted truncate">
                            Diskusi pertukaran skill & koordinasi sesi belajar
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/mentors/${currentRoom.partnerId}`}
                        className="px-3 py-1.5 rounded-xl border border-line hover:bg-canvas text-[11px] font-bold text-ink-secondary transition shrink-0 hidden sm:inline-block"
                      >
                        Lihat Profil Mentor
                      </Link>
                    </header>

                    {/* Banner Info Sesi yang Dipesan */}
                    {activeSession && (
                      <div className="bg-canvas border-b border-line px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                              <span>Sesi Belajar: {activeSession.skill}</span>
                              <span className="px-2 py-0.5 rounded-full bg-success-tint text-success border border-success-soft text-[10px] font-extrabold">
                                Terkonfirmasi
                              </span>
                            </p>
                            <p className="text-[11px] text-ink-muted flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-ink-muted" />
                                {activeSession.tanggalSesi} ({activeSession.jamMulai} -{' '}
                                {activeSession.jamSelesai} WIB)
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                {activeSession.metode === 'Online' ? (
                                  <Video className="w-3 h-3 text-primary" />
                                ) : (
                                  <MapPin className="w-3 h-3 text-ink-muted" />
                                )}
                                {activeSession.metode}
                              </span>
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] text-primary font-semibold bg-surface px-2.5 py-1 rounded-lg border border-line shadow-2xs">
                          {activeSession.lokasi}
                        </span>
                      </div>
                    )}

                    {/* Chat Messages Stream */}
                    <div className="flex-1 space-y-4 overflow-y-auto bg-canvas p-4 sm:p-6">
                      <div className="mx-auto max-w-md rounded-2xl border border-line bg-surface p-3.5 text-center text-xs leading-relaxed text-ink-muted shadow-soft-card">
                        Ruang diskusi privat bersama{' '}
                        <strong className="text-ink">{currentRoom.partnerName}</strong>.
                        Sepakati topik materi, media belajar, dan persiapan sesi di sini.
                      </div>

                      {currentRoom.messages.map((item) => {
                        const isMe = item.senderId === userId;
                        return (
                          <div
                            key={item.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-soft-card ${
                                isMe
                                  ? 'rounded-tr-xs border border-primary-soft bg-primary-tint text-ink'
                                  : 'rounded-tl-xs border border-line bg-surface text-ink'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{item.content}</p>
                              <time
                                className="mt-1 block text-right text-[10px] font-medium text-ink-muted"
                              >
                                {new Date(item.createdAt).toLocaleTimeString('id-ID', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </time>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input Bar */}
                    <form
                      onSubmit={sendMessage}
                      className="flex items-end gap-2.5 border-t border-line p-3 sm:p-4 bg-surface"
                    >
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        placeholder="Tulis pesan... (Enter untuk kirim)"
                        className="max-h-28 min-h-11 flex-1 resize-y rounded-2xl border border-line px-4 py-2.5 text-xs sm:text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary-accent/20"
                      />
                      <button
                        type="submit"
                        disabled={!message.trim()}
                        aria-label="Kirim pesan"
                        className="h-11 w-11 rounded-2xl action-primary disabled:opacity-50 flex items-center justify-center shrink-0 transition shadow-xs"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="m-auto max-w-sm p-8 text-center">
                    <MessageCircle className="mx-auto h-12 w-12 text-ink-muted mb-3" />
                    <h3 className="text-base font-bold text-ink">
                      Pilih Percakapan
                    </h3>
                    <p className="mt-1 text-xs text-ink-muted">
                      Pilih salah satu pesan di sidebar kiri atau booking sesi belajar baru.
                    </p>
                    <Link
                      href="/dashboard"
                      className="mt-4 inline-block px-5 py-2.5 rounded-xl action-primary text-xs font-bold transition shadow-xs"
                    >
                      Jelajahi Mentor
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer workspace />
    </div>
  );
}
