"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit3,
  FileText,
  Loader2,
  MapPin,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Video,
  X,
  XCircle,
} from "lucide-react";
import { uploadMentorDocument } from "@/lib/upload-mentor-document";
import { dayInWib } from "@/lib/session-date";
import { cn } from "@/lib/utils";
import MentorDocumentType from "@/components/MentorDocumentType";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal, { BookingMentor } from "@/components/BookingModal";
import {
  Badge,
  FileDropzone,
  Frame,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
  InlineDot,
  MiniCalendarStrip,
} from "@/components/dashboard-ui/primitives";
import DashboardNavigation, {
  cleanInitials,
  dashboardTab,
  dashboardUrl,
} from "./DashboardNavigation";
import AdminOverview from "./DashboardOverview";
import StudyAgenda from "./StudyAgenda";
import MentorCard from "./MentorCard";

interface CurrentUser {
  id: number;
  namaLengkap: string;
  namaPanggilan?: string;
  email: string;
  universitas?: string;
  prodi?: string;
  semester?: string;
  domisili?: string;
  tglLahir?: string;
  bio?: string;
  fotoProfil?: string;
  modeSesi?: string;
  role: string;
  statusMentor: string;
  dokumenKredensial?: string;
  totalPoin: number;
  skills: Array<{
    id: number;
    tipe: string;
    level: string;
    skill: { id: number; namaSkill: string; kategori: string };
  }>;
}

interface MentorApplication {
  id: number;
  userId: number;
  skillsOffered: string;
  pengalamanMengajar?: string;
  dokumenUrl: string;
  dokumenNama: string;
  status: string;
  catatanAdmin?: string;
  createdAt: string;
  user: {
    id: number;
    namaLengkap: string;
    email: string;
    universitas?: string;
    prodi?: string;
    semester?: string;
    domisili?: string;
    statusMentor: string;
  };
}

interface MentorUser {
  id: number;
  namaLengkap: string;
  namaPanggilan?: string;
  universitas?: string;
  prodi?: string;
  semester?: string;
  domisili?: string;
  bio?: string;
  fotoProfil?: string;
  totalPoin: number;
  modeSesi?: string;
  statusMentor: string;
  skills: Array<{
    id: number;
    skill: { id: number; namaSkill: string; kategori: string };
  }>;
}

interface BookedSession {
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
}

const fullDateLabel = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "long",
  timeZone: "UTC",
});

const PAGE_INTRO_COPY: Record<string, { title: string; sub: string }> = {
  mentors: {
    title: "Temukan Mentor Sebayamu",
    sub: "Belajar langsung dari mahasiswa lain yang sudah lebih dulu menguasai materinya — santai, kolaboratif, dan saling berkembang.",
  },
  sessions: {
    title: "Sesi Belajarmu",
    sub: "Pantau jadwal sesi 1-on-1 yang telah kamu pesan atau agendakan bersama mentor.",
  },
  skills: {
    title: "Keahlian Saya",
    sub: "Keahlian yang kamu kuasai dan ingin kamu bagikan kepada sesama mahasiswa.",
  },
  profile: {
    title: "Profil Saya",
    sub: "Informasi akademik dan preferensi belajar yang tampil pada akun Mentora kamu.",
  },
  apply: {
    title: "Status Pengajuan Mentor",
    sub: "Perjalanan pengajuan verifikasi menjadi mentor resmi di komunitas Mentora.",
  },
  overview: {
    title: "Ringkasan Verifikasi",
    sub: "Pantau antrean pengajuan mentor dan status verifikasi akun mahasiswa.",
  },
  admin: {
    title: "Verifikasi Pengajuan Mentor",
    sub: "Tinjau kelayakan dokumen dan verifikasi akun mentor baru.",
  },
};

const JIRO_SAMPLE_MENTORS: MentorUser[] = [
  {
    id: 901,
    namaLengkap: "Rangga Pratama",
    namaPanggilan: "Rangga",
    universitas: "Universitas Telkom",
    prodi: "Teknik Informatika",
    semester: "6",
    domisili: "Bandung",
    modeSesi: "Online",
    bio: "Fokus ke struktur data, algoritma, dan persiapan technical interview untuk magang pertama kamu.",
    totalPoin: 41,
    statusMentor: "APPROVED",
    skills: [
      { id: 101, skill: { id: 1, namaSkill: "Programming", kategori: "Teknologi" } },
      { id: 102, skill: { id: 2, namaSkill: "Data Analysis", kategori: "Data" } },
    ],
  },
  {
    id: 902,
    namaLengkap: "Alya Syahrani",
    namaPanggilan: "Alya",
    universitas: "Universitas Telkom",
    prodi: "Desain Komunikasi Visual",
    semester: "4",
    domisili: "Bandung",
    modeSesi: "Online",
    bio: "Membantu menyusun case study portofolio UI/UX dari riset kecil sampai prototipe yang rapi di Figma.",
    totalPoin: 33,
    statusMentor: "APPROVED",
    skills: [
      { id: 103, skill: { id: 3, namaSkill: "UI/UX Design", kategori: "Desain" } },
    ],
  },
  {
    id: 903,
    namaLengkap: "Bima Saputra",
    namaPanggilan: "Bima",
    universitas: "Institut Teknologi Sepuluh Nopember",
    prodi: "Teknik Informatika",
    semester: "5",
    domisili: "Surabaya",
    modeSesi: "Online",
    bio: "Ngulik React, API, dan deployment. Senang menemani teman yang baru pertama kali membangun aplikasi web utuh.",
    totalPoin: 18,
    statusMentor: "APPROVED",
    skills: [
      { id: 104, skill: { id: 4, namaSkill: "Web Development", kategori: "Teknologi" } },
      { id: 105, skill: { id: 1, namaSkill: "Programming", kategori: "Teknologi" } },
    ],
  },
  {
    id: 904,
    namaLengkap: "Dinda Maharani",
    namaPanggilan: "Dinda",
    universitas: "Universitas Airlangga",
    prodi: "Statistika",
    semester: "6",
    domisili: "Surabaya",
    modeSesi: "Online",
    bio: "Mengolah data skripsi dengan Python dan SPSS, dari membersihkan data sampai membaca hasilnya dengan jujur.",
    totalPoin: 27,
    statusMentor: "APPROVED",
    skills: [
      { id: 106, skill: { id: 2, namaSkill: "Data Analysis", kategori: "Data" } },
    ],
  },
  {
    id: 905,
    namaLengkap: "Fajar Nugroho",
    namaPanggilan: "Fajar",
    universitas: "Universitas Brawijaya",
    prodi: "Sistem Informasi",
    semester: "5",
    domisili: "Malang",
    modeSesi: "Online",
    bio: "Menjembatani desain dan kode: dari wireframe Figma menjadi antarmuka web yang responsif dan rapi.",
    totalPoin: 15,
    statusMentor: "APPROVED",
    skills: [
      { id: 107, skill: { id: 4, namaSkill: "Web Development", kategori: "Teknologi" } },
      { id: 108, skill: { id: 3, namaSkill: "UI/UX Design", kategori: "Desain" } },
    ],
  },
  {
    id: 906,
    namaLengkap: "Kirana Dewi",
    namaPanggilan: "Kirana",
    universitas: "Universitas Gadjah Mada",
    prodi: "Ilmu Komputer",
    semester: "6",
    domisili: "Yogyakarta",
    modeSesi: "Online",
    bio: "Pemrograman Python untuk pemula dan visualisasi data yang enak dibaca saat sidang maupun presentasi kelas.",
    totalPoin: 36,
    statusMentor: "APPROVED",
    skills: [
      { id: 109, skill: { id: 1, namaSkill: "Programming", kategori: "Teknologi" } },
      { id: 110, skill: { id: 2, namaSkill: "Data Analysis", kategori: "Data" } },
    ],
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const activeTab = dashboardTab(
    searchParams.get("tab"),
    user?.role === "Admin",
  );
  const showCalendar = searchParams.get("view") === "calendar";

  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([]);
  const [bookingMentor, setBookingMentor] = useState<BookingMentor | null>(
    null,
  );
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [todayWib, setTodayWib] = useState(() => dayInWib());
  const [agendaDay, setAgendaDay] = useState<string | null>(null);
  const [bookingDay, setBookingDay] = useState<string>();
  const [brokenImageUrls, setBrokenImageUrls] = useState<
    Record<string, boolean>
  >({});

  const markImageBroken = (url?: string | null) => {
    if (!url) return;
    setBrokenImageUrls((prev) => (prev[url] ? prev : { ...prev, [url]: true }));
  };

  useEffect(() => {
    setTodayWib(dayInWib());
  }, []);

  const loadBookedSessions = () => {
    try {
      const data: BookedSession[] = JSON.parse(
        localStorage.getItem("mentora_booked_sessions") || "[]",
      );
      setBookedSessions(Array.isArray(data) ? data : []);
    } catch {
      setBookedSessions([]);
    }
  };

  useEffect(() => {
    loadBookedSessions();
  }, [isBookingOpen]);

  const handleCancelSession = (sessionId: string) => {
    if (
      confirm(
        "Apakah kamu yakin ingin membatalkan reservasi sesi belajar ini?",
      )
    ) {
      const updated = bookedSessions.filter((s) => s.id !== sessionId);
      localStorage.setItem("mentora_booked_sessions", JSON.stringify(updated));
      setBookedSessions(updated);
    }
  };

  // Mentors list state
  const [mentors, setMentors] = useState<MentorUser[]>([]);
  const [mentorListState, setMentorListState] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [mentorListRetry, setMentorListRetry] = useState(0);
  const [searchMentorQuery, setSearchMentorQuery] = useState("");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState("");

  // Admin applications state
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [applicationsReady, setApplicationsReady] = useState(false);
  const [adminError, setAdminError] = useState(false);

  // Mentor application form state
  const [applySkills, setApplySkills] = useState("");
  const [applyExperience, setApplyExperience] = useState("");
  const [applyDocName, setApplyDocName] = useState("");
  const [applyDocSize, setApplyDocSize] = useState<number>();
  const [applyDocUrl, setApplyDocUrl] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");

  // Profile edit state
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [profileForm, setProfileForm] = useState<{
    namaLengkap: string;
    namaPanggilan: string;
    universitas: string;
    prodi: string;
    semester: string;
    domisili: string;
    bio: string;
    latitude?: number | null;
    longitude?: number | null;
  }>({
    namaLengkap: "",
    namaPanggilan: "",
    universitas: "",
    prodi: "",
    semester: "",
    domisili: "",
    bio: "",
    latitude: null,
    longitude: null,
  });

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung fitur Geolocation API.");
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        setProfileForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          domisili: prev.domisili || "Bandung, Jawa Barat",
        }));
        setDetectingLocation(false);
        alert(
          `Lokasi GPS berhasil dideteksi: (${lat}, ${lng}) untuk fitur nearby!`,
        );
      },
      () => {
        setDetectingLocation(false);
        setProfileForm((prev) => ({
          ...prev,
          latitude: -6.974,
          longitude: 107.6303,
          domisili: prev.domisili || "Dayeuhkolot, Bandung",
        }));
        alert(
          "Izin lokasi browser tidak diberikan. Menggunakan koordinat simulasi kampus Bandung (-6.9740, 107.6303).",
        );
      },
      { timeout: 8000 },
    );
  };

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [authRes, profileRes, skillsRes] = await Promise.all([
        fetch("/api/auth/me", { cache: "no-store" }),
        fetch("/api/profile", { cache: "no-store" }),
        fetch("/api/profile/skills", { cache: "no-store" }),
      ]);

      if (authRes.status === 401) {
        setUser(null);
        window.location.replace("/auth?tab=masuk");
        return;
      }
      if (!authRes.ok) throw new Error("Gagal memuat sesi pengguna.");

      const authData = await authRes.json();
      const authUser = authData.user ?? {};
      const profileData = profileRes.ok ? await profileRes.json() : {};
      const skillsData = skillsRes.ok ? await skillsRes.json() : {};
      const profile = profileData.profile ?? authUser;

      const skillsFromAPI = [
        ...(skillsData.skillsToLearn ?? []).map((s: any) => ({
          id: Number(s.id),
          tipe: "LEARN",
          level: s.level,
          skill: { id: Number(s.id), namaSkill: s.namaSkill, kategori: "" },
        })),
        ...(skillsData.skillsPossessed ?? []).map((s: any) => ({
          id: Number(s.id),
          tipe: "TEACH",
          level: s.level,
          skill: { id: Number(s.id), namaSkill: s.namaSkill, kategori: "" },
        })),
      ];

      const fallbackSkills = (authUser.skills ?? []).map((s: any) => ({
        ...s,
        tipe:
          String(s.type ?? s.tipe).toLowerCase() === "learn"
            ? "LEARN"
            : "TEACH",
        skill: s.skill ?? s.skills,
      }));

      const mergedUser: CurrentUser = {
        ...authUser,
        ...profile,
        id: Number(profile.id ?? authUser.id),
        namaLengkap: profile.namaLengkap ?? authUser.namaLengkap ?? "",
        email: profile.email ?? authUser.email ?? "",
        role: authUser.role ?? profile.role ?? "Mentee",
        statusMentor: authUser.statusMentor ?? profile.statusMentor ?? "NONE",
        totalPoin: Number(authUser.totalPoin ?? profile.totalPoin ?? 0),
        skills: skillsFromAPI.length > 0 ? skillsFromAPI : fallbackSkills,
      };

      setUser(mergedUser);
      setProfileForm({
        namaLengkap: mergedUser.namaLengkap,
        namaPanggilan: mergedUser.namaPanggilan ?? "",
        universitas: mergedUser.universitas ?? "",
        prodi: mergedUser.prodi ?? "",
        semester: mergedUser.semester ?? "",
        domisili: mergedUser.domisili ?? "",
        bio: mergedUser.bio ?? "",
        latitude: (mergedUser as any).latitude ?? null,
        longitude: (mergedUser as any).longitude ?? null,
      });
    } catch (err) {
      console.error("LOAD DASHBOARD ERROR:", err);
      if (user) alert("Gagal memperbarui data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  const loadAdminApplications = async () => {
    if (!user || user.role !== "Admin") return;
    setAdminLoading(true);
    setAdminError(false);
    try {
      const res = await fetch("/api/admin/applications");
      if (!res.ok) throw new Error("Pengajuan mentor belum bisa dimuat.");
      const data = await res.json();
      setApplications(data.applications || []);
      setApplicationsReady(true);
    } catch (err) {
      setAdminError(true);
      setApplicationsReady(false);
      console.error(err);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (!user || activeTab !== "mentors") return;
    let isSubscribed = true;
    const load = async () => {
      setMentorListState("loading");
      try {
        const response = await fetch("/api/mentor/list");
        if (!response.ok) throw new Error("Daftar mentor belum bisa dimuat.");
        const data = await response.json();
        if (isSubscribed) {
          const loaded = (data.mentors || []) as MentorUser[];
          const combined = [
            ...loaded,
            ...JIRO_SAMPLE_MENTORS.filter(
              (sample) => !loaded.some((m) => m.id === sample.id),
            ),
          ];
          setMentors(combined);
          setMentorListState("ready");
        }
      } catch {
        if (isSubscribed) setMentorListState("error");
      }
    };
    void load();
    return () => {
      isSubscribed = false;
    };
  }, [activeTab, user?.id, mentorListRetry]);

  useEffect(() => {
    if (user?.role === "Admin") {
      loadAdminApplications();
    }
  }, [user]);

  const handleUploadCredential = async (file: File) => {
    setApplyError("");
    const MAX_SIZE = 4.5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setApplyError(
        `Ukuran berkas (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal 4.5 MB serverless. Harap kompres berkas atau pilih dokumen yang lebih kecil.`
      );
      return;
    }
    setUploadingDocument(true);
    try {
      const doc = await uploadMentorDocument(file);
      setApplyDocName(doc.fileName);
      setApplyDocSize(file.size);
      setApplyDocUrl(doc.fileUrl);
    } catch (error) {
      setApplyDocName("");
      setApplyDocSize(undefined);
      setApplyDocUrl("");
      setApplyError(
        error instanceof Error ? error.message : "Gagal mengunggah berkas."
      );
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleApplyMentor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApplyError("");
    if (!applySkills || !applyDocUrl || uploadingDocument) {
      setApplyError("Mohon isi skill yang ditawarkan dan unggah dokumen kredensial terlebih dahulu.");
      return;
    }
    setApplyLoading(true);
    try {
      const res = await fetch("/api/mentor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillsOffered: applySkills,
          pengalamanMengajar: applyExperience,
          dokumenNama: applyDocName,
          dokumenUrl: applyDocUrl,
          jenisDokumen: new FormData(e.currentTarget).get("jenisDokumen"),
        }),
      });

      if (res.ok) {
        setApplySuccess(true);
        setApplyError("");
        await loadUserData();
      } else {
        const d = await res.json().catch(() => ({}));
        setApplyError(d.message || "Gagal mengirim pengajuan.");
      }
    } catch {
      setApplyError("Terjadi kesalahan pada server saat mengirim pengajuan.");
    } finally {
      setApplyLoading(false);
    }
  };

  const handleReviewApplication = async (
    appId: number,
    action: "APPROVE" | "REJECT",
  ) => {
    const confirmMsg =
      action === "APPROVE"
        ? "Apakah Anda yakin ingin menyetujui dan mengaktifkan akun pengguna ini menjadi Mentor?"
        : "Apakah Anda yakin ingin menolak pengajuan ini?";
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/applications/${appId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        await loadAdminApplications();
        alert(
          action === "APPROVE"
            ? "Pengajuan berhasil disetujui. Pengguna kini berstatus Mentor aktif."
            : "Pengajuan telah ditolak.",
        );
      } else {
        alert("Gagal memproses review.");
      }
    } catch {
      alert("Terjadi kesalahan server.");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Gagal memperbarui profil.");
        return;
      }
      window.dispatchEvent(new Event("profile-updated"));
      await loadUserData();
      setEditProfileMode(false);
      alert("Profil berhasil diperbarui!");
    } catch (err) {
      console.error("SAVE PROFILE ERROR:", err);
      alert("Terjadi kesalahan saat menyimpan profil.");
    }
  };

  const taughtSkills = user?.skills?.filter((s) => s.tipe === "TEACH") || [];
  const learnedSkills = user?.skills?.filter((s) => s.tipe === "LEARN") || [];

  const query = searchMentorQuery.trim().toLocaleLowerCase("id");
  const hasActiveFilter = Boolean(query || selectedSkillFilter);
  const skillOptions = Array.from(
    new Set(
      mentors.flatMap((mentor) =>
        mentor.skills.map((item) => item.skill.namaSkill),
      ),
    ),
  ).sort((a, b) => a.localeCompare(b, "id"));

  const visibleMentors = mentors.filter(
    (mentor) =>
      (!selectedSkillFilter ||
        mentor.skills.some(
          (item) => item.skill.namaSkill === selectedSkillFilter,
        )) &&
      [
        mentor.namaLengkap,
        mentor.namaPanggilan,
        mentor.universitas,
        mentor.prodi,
      ].some((value) => value?.toLocaleLowerCase("id").includes(query)),
  );

  const pendingApps = applications.filter((a) => a.status === "PENDING").length;

  const bookedDaysSet = new Set(
    bookedSessions
      .filter((s) => s.status === "BOOKED")
      .map((s) => s.tanggalSesi),
  );
  const activeMiniDay = agendaDay ?? todayWib;

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
          {loading ? (
            <div
              role="status"
              aria-label="Memuat dashboard"
              className="flex flex-col gap-6 motion-safe:animate-pulse"
            >
              <div className="h-12 w-72 rounded-xl bg-line/60" />
              <div className="h-10 border-b border-line" />
              <div className="h-64 rounded-2xl border border-line bg-surface" />
            </div>
          ) : (
            <Frame className="mx-auto mt-8 max-w-md">
              <FramePanel className="flex flex-col items-center gap-3 text-center">
                <p role="status" className="text-sm font-semibold text-ink">
                  Dashboard belum bisa dimuat.
                </p>
                <button
                  type="button"
                  onClick={loadUserData}
                  className="action-primary inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold transition-colors"
                >
                  Coba lagi
                </button>
              </FramePanel>
            </Frame>
          )}
        </main>
        <Footer workspace />
      </div>
    );
  }

  const openBooking = (mentor: BookingMentor) => {
    setBookingMentor(mentor);
    setIsBookingOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex-1 bg-canvas">
        <DashboardNavigation
          active={activeTab}
          user={user}
          sessionCount={bookedSessions.length}
          pendingCount={pendingApps}
        />

        <header className="border-b border-line/60 bg-gradient-to-b from-primary-soft/50 to-canvas">
          <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-6 sm:px-6 md:pt-10 md:pb-7 lg:px-8">
            <p className="mb-2 text-xs font-bold tracking-[0.14em] text-primary uppercase">
              Dasbor Mentora
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {PAGE_INTRO_COPY[activeTab]?.title || "Dasbor Pembelajaran"}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-secondary">
              {PAGE_INTRO_COPY[activeTab]?.sub ||
                "Kelola aktivitas belajar dan mentoring kamu di Mentora."}
            </p>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* ================= ADMIN OVERVIEW ================= */}
          {activeTab === "overview" && user.role === "Admin" && (
            <div className="flex flex-col gap-6">
              <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                    Ringkasan pengajuan
                  </h1>
                  <p className="text-sm text-ink-secondary">
                    Pantau antrean verifikasi mentor dan status persetujuan terbaru.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadAdminApplications}
                  disabled={adminLoading}
                  className="action-secondary inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors disabled:opacity-60"
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" />
                  <span>{adminLoading ? "Memuat…" : "Muat ulang"}</span>
                </button>
              </header>

              <AdminOverview
                applications={applicationsReady ? applications : null}
                error={adminError}
              />
            </div>
          )}

          {/* ================= TAB 1: DAFTAR MENTOR ================= */}
          {activeTab === "mentors" && (
            <div className="flex flex-col gap-6">
              <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-ink">
                    Mentor Tersedia
                  </h2>
                  <p className="text-xs text-ink-muted">
                    Pilih mentor mahasiswa terverifikasi untuk menjadwalkan sesi belajar 1-on-1.
                  </p>
                </div>

                {mentorListState === "ready" && (
                  <span className="self-start rounded-full border border-line bg-surface px-3.5 py-1 text-xs font-semibold text-ink-muted shadow-2xs sm:self-auto">
                    Menampilkan <strong className="font-bold text-primary">{visibleMentors.length}</strong> Mentor
                  </span>
                )}
              </header>

              <div className="rounded-2xl border border-line bg-surface p-3.5 shadow-soft-card sm:p-5">
                <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
                  <div
                    role="search"
                    aria-label="Pencarian mentor"
                    className="relative w-full lg:max-w-sm"
                  >
                    <Search
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted sm:left-4"
                    />
                    <input
                      type="search"
                      value={searchMentorQuery}
                      onChange={(event) =>
                        setSearchMentorQuery(event.target.value)
                      }
                      aria-label="Cari mentor, kampus, atau prodi"
                      placeholder="Cari nama mentor, kampus, prodi..."
                      className="w-full rounded-full border border-line bg-canvas py-2 pr-9 pl-10 text-xs text-ink placeholder:text-ink-muted transition-colors focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-accent/20 sm:py-2.5 sm:pr-10 sm:pl-11 sm:text-sm"
                    />
                    {searchMentorQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchMentorQuery("")}
                        aria-label="Bersihkan pencarian"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                      >
                        <X aria-hidden="true" className="size-4" />
                      </button>
                    )}
                  </div>

                  {skillOptions.length > 0 && (
                    <div className="-mx-1 overflow-x-auto px-1 pb-1 sm:overflow-visible sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <div
                        role="group"
                        aria-label="Filter keahlian"
                        className="inline-flex min-w-max flex-wrap items-center gap-1.5 sm:gap-2"
                      >
                        <span className="mr-1 hidden items-center gap-1.5 text-xs font-bold text-ink-muted sm:inline-flex">
                          <SlidersHorizontal className="size-3.5" />
                          Keahlian:
                        </span>
                        {["", ...skillOptions].map((name) => {
                          const isActive = selectedSkillFilter === name;
                          return (
                            <button
                              key={name || "all"}
                              type="button"
                              aria-pressed={isActive}
                              onClick={() =>
                                setSelectedSkillFilter(isActive ? "" : name)
                              }
                              className={cn(
                                "whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors sm:px-3.5 sm:py-1.5 sm:text-xs",
                                isActive
                                  ? "border-primary bg-primary-soft text-primary"
                                  : "border-line bg-surface text-ink-secondary hover:border-slate-300 hover:text-ink",
                              )}
                            >
                              {name || "Semua"}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {bookingDay && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-primary-soft bg-primary-soft/50 px-5 py-3 text-sm text-ink-secondary">
                  <span>
                    Tanggal sesi pilihanmu:{" "}
                    <strong className="font-semibold text-ink">
                      {fullDateLabel.format(new Date(bookingDay + "T00:00:00Z"))}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setBookingDay(undefined)}
                    className="min-h-9 font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Hapus tanggal
                  </button>
                </div>
              )}

              {mentorListState !== "ready" ? (
                <div className="rounded-3xl border border-line bg-surface p-6">
                  {mentorListState === "loading" ? (
                    <div
                      role="status"
                      aria-label="Memuat daftar mentor"
                      className="grid grid-cols-1 gap-6 motion-safe:animate-pulse md:grid-cols-2 lg:grid-cols-3"
                    >
                      <div className="h-64 rounded-2xl bg-canvas" />
                      <div className="h-64 rounded-2xl bg-canvas" />
                      <div className="h-64 rounded-2xl bg-canvas" />
                    </div>
                  ) : (
                    <div
                      role="status"
                      className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-secondary"
                    >
                      <span>Daftar mentor belum bisa dimuat.</span>
                      <button
                        type="button"
                        onClick={() => setMentorListRetry((n) => n + 1)}
                        className="action-secondary min-h-10 rounded-full px-4 text-xs font-semibold transition-colors"
                      >
                        Coba lagi
                      </button>
                    </div>
                  )}
                </div>
              ) : visibleMentors.length === 0 ? (
                <div className="mx-auto max-w-lg rounded-3xl border border-line bg-surface p-12 text-center">
                  <h3 className="text-base font-bold text-ink">
                    {hasActiveFilter
                      ? "Tidak ada mentor ditemukan"
                      : "Belum ada mentor tersedia"}
                  </h3>
                  <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-ink-muted sm:text-sm">
                    {hasActiveFilter
                      ? "Coba kata kunci lain atau hapus filter keahlian untuk melihat seluruh mentor."
                      : "Kamu juga bisa mencari teman belajar melalui pencocokan partner."}
                  </p>
                  <div className="mt-5">
                    {hasActiveFilter ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchMentorQuery("");
                          setSelectedSkillFilter("");
                        }}
                        className="action-secondary inline-flex min-h-10 items-center rounded-full px-5 text-xs font-semibold transition-colors"
                      >
                        Hapus filter pencarian
                      </button>
                    ) : (
                      <Link
                        href="/matching"
                        className="action-primary inline-flex min-h-10 items-center rounded-full px-5 text-xs font-bold transition-colors"
                      >
                        Cari partner belajar
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleMentors.map((mentor) => (
                    <MentorCard
                      key={mentor.id}
                      mentor={mentor}
                      own={mentor.id === user.id}
                      onBook={openBooking}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: SESI BELAJAR ================= */}
          {activeTab === "sessions" && (
            <div className="flex flex-col gap-6">
              <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                    Sesi belajar
                  </h1>
                  <p className="text-sm text-ink-secondary">
                    Jadwal sesi mentoring yang telah kamu reservasi bersama mentor.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <nav
                    aria-label="Tampilan sesi belajar"
                    className="inline-flex rounded-full border border-line bg-surface p-1"
                  >
                    {[
                      {
                        label: "Daftar sesi",
                        calendar: false,
                        href: dashboardUrl("sessions"),
                      },
                      {
                        label: "Kalender",
                        calendar: true,
                        href: dashboardUrl("sessions") + "&view=calendar",
                      },
                    ].map((view) => (
                      <Link
                        key={view.href}
                        href={view.href}
                        aria-current={
                          showCalendar === view.calendar ? "page" : undefined
                        }
                        className={`inline-flex min-h-9 items-center rounded-full px-4 text-xs font-semibold transition-colors sm:text-sm ${
                          showCalendar === view.calendar
                            ? "bg-primary-soft text-primary"
                            : "text-ink-muted hover:text-ink"
                        }`}
                      >
                        {view.label}
                      </Link>
                    ))}
                  </nav>

                  <button
                    type="button"
                    onClick={() => router.push(dashboardUrl("mentors"))}
                    className="action-primary inline-flex min-h-10 items-center gap-1.5 rounded-full px-5 text-xs font-bold transition-colors sm:text-sm"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    <span>Pesan sesi</span>
                  </button>
                </div>
              </header>

              {showCalendar ? (
                <Frame>
                  <FramePanel padded={false}>
                    <StudyAgenda
                      sessions={bookedSessions}
                      chosenDay={agendaDay}
                      onChooseDay={setAgendaDay}
                      canBook={user.role !== "Admin"}
                      onPickMentor={() => {
                        setBookingDay(agendaDay ?? todayWib);
                        router.push(dashboardUrl("mentors"));
                      }}
                    />
                  </FramePanel>
                </Frame>
              ) : (
                <Frame>
                  <FramePanel>
                    <MiniCalendarStrip
                      today={todayWib}
                      selectedDay={activeMiniDay}
                      bookedDays={bookedDaysSet}
                      onSelectDay={(day) => {
                        setAgendaDay(day);
                        if (bookedDaysSet.has(day)) {
                          router.push(
                            dashboardUrl("sessions") + "&view=calendar",
                          );
                        }
                      }}
                    />
                  </FramePanel>

                  {bookedSessions.length > 0 ? (
                    bookedSessions.map((session) => (
                      <article
                        key={session.id}
                        className="flex flex-col gap-4 bg-surface px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="flex min-w-0 items-start gap-3 sm:gap-3.5">
                          {session.mentorPhoto &&
                          !brokenImageUrls[session.mentorPhoto] ? (
                            <img
                              src={session.mentorPhoto}
                              alt={session.mentorName}
                              onError={() =>
                                markImageBroken(session.mentorPhoto)
                              }
                              className="size-10 shrink-0 rounded-xl border border-line object-cover object-top sm:size-11"
                            />
                          ) : (
                            <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-primary-soft text-xs font-extrabold text-primary sm:size-11 sm:text-sm">
                              {cleanInitials(session.mentorName)}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <h3 className="text-sm font-bold text-ink sm:text-base">
                                {session.mentorName}
                              </h3>
                              <Badge variant="success-light">
                                Terkonfirmasi
                              </Badge>
                            </div>
                            <p className="mt-0.5 text-xs text-ink-secondary sm:text-sm">
                              Materi:{" "}
                              <strong className="font-semibold text-primary">
                                {session.skill}
                              </strong>
                            </p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] tabular-nums text-ink-muted sm:mt-2 sm:gap-x-3 sm:text-xs">
                              <span className="inline-flex items-center gap-1 sm:gap-1.5">
                                <Calendar
                                  className="size-3.5"
                                  aria-hidden="true"
                                />
                                <span>
                                  {session.tanggalSesi} · {session.jamMulai}–
                                  {session.jamSelesai} WIB
                                </span>
                              </span>
                              <InlineDot />
                              <span className="inline-flex items-center gap-1 sm:gap-1.5">
                                {session.metode === "Online" ? (
                                  <Video
                                    className="size-3.5 text-primary"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <MapPin
                                    className="size-3.5 text-ink-muted"
                                    aria-hidden="true"
                                  />
                                )}
                                <span>
                                  {session.metode} ({session.lokasi})
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 border-t border-line/60 pt-3 sm:gap-3 lg:border-t-0 lg:pt-0">
                          <button
                            type="button"
                            onClick={() => handleCancelSession(session.id)}
                            className="inline-flex min-h-9 items-center px-2 text-xs font-semibold text-danger underline-offset-4 hover:underline sm:min-h-10"
                          >
                            Batalkan sesi
                          </button>
                          <Link
                            href={`/mentors/${session.mentorId}`}
                            className="inline-flex min-h-9 items-center px-2 text-xs font-semibold text-primary underline-offset-4 hover:underline sm:min-h-10 sm:text-sm"
                          >
                            Profil
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/chat?partnerId=${session.mentorId}&name=${encodeURIComponent(
                                  session.mentorName,
                                )}`,
                              )
                            }
                            className="action-primary inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition-colors sm:min-h-10 sm:px-4 sm:text-sm"
                          >
                            <MessageCircle
                              className="size-3.5"
                              aria-hidden="true"
                            />
                            <span>Buka chat</span>
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <FramePanel className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-bold text-ink">
                          Belum ada sesi belajar yang dipesan
                        </h3>
                        <p className="text-sm text-ink-secondary">
                          Pilih mentor dari direktori atau klik tanggal pada kalender untuk menjadwalkan sesi pertukaran skill.
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                        <Link
                          href={dashboardUrl("sessions") + "&view=calendar"}
                          className="action-secondary inline-flex min-h-10 items-center rounded-full px-4 text-xs font-semibold transition-colors sm:text-sm"
                        >
                          Buka kalender
                        </Link>
                        <button
                          type="button"
                          onClick={() => router.push(dashboardUrl("mentors"))}
                          className="action-primary inline-flex min-h-10 items-center rounded-full px-5 text-xs font-bold transition-colors sm:text-sm"
                        >
                          Lihat daftar mentor
                        </button>
                      </div>
                    </FramePanel>
                  )}
                </Frame>
              )}
            </div>
          )}

          {/* ================= TAB 3: KEAHLIAN SAYA ================= */}
          {activeTab === "skills" && (
            <div className="flex flex-col gap-6">
              <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                    Keahlian saya
                  </h1>
                  <p className="text-sm text-ink-secondary">
                    Keahlian yang kamu kuasai untuk diajarkan dan materi yang ingin dipelajari.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/onboarding")}
                  className="action-primary inline-flex min-h-10 items-center gap-2 rounded-full px-5 text-xs font-bold transition-colors sm:text-sm"
                >
                  <Edit3 className="size-4" aria-hidden="true" />
                  <span>Ubah pilihan skill</span>
                </button>
              </header>

              <Frame>
                <div className="grid grid-cols-1 divide-y divide-line md:grid-cols-2 md:divide-x md:divide-y-0">
                  <div className="flex flex-col gap-4 p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h2 className="text-base font-bold text-ink">
                          Skill yang ingin dipelajari
                        </h2>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          Target belajar kamu sebagai mentee
                        </p>
                      </div>
                      <Badge variant="outline">Mentee</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {learnedSkills.map((s) => (
                        <Badge key={s.id} variant="outline">
                          {s.skill.namaSkill}
                        </Badge>
                      ))}
                      {learnedSkills.length === 0 && (
                        <p className="text-sm text-ink-muted">
                          Belum ada skill yang ditambahkan.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h2 className="text-base font-bold text-ink">
                          Skill yang sudah dimiliki
                        </h2>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          Materi yang dapat kamu bagikan ke teman belajar
                        </p>
                      </div>
                      <Badge variant="outline">Mentor</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {taughtSkills.map((s) => (
                        <Badge key={s.id} variant="outline">
                          {s.skill.namaSkill}
                        </Badge>
                      ))}
                      {taughtSkills.length === 0 && (
                        <p className="text-sm text-ink-muted">
                          Belum ada skill yang ditambahkan.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <FrameFooter>
                  <span>
                    Perbarui daftar keahlian kapan saja agar rekomendasi partner semakin akurat.
                  </span>
                  <Link
                    href="/skills"
                    className="inline-flex min-h-9 items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    <span>Buka halaman keahlian</span>
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </FrameFooter>
              </Frame>
            </div>
          )}

          {/* ================= TAB 4: PROFIL SAYA (blocks.so form-layout-02) ================= */}
          {activeTab === "profile" && (
            <div className="flex flex-col gap-8">
              <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                    Profil saya
                  </h1>
                  <p className="text-sm text-ink-secondary">
                    Kelola informasi akademik, domisili GPS untuk fitur Nearby, dan bio singkatmu.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/onboarding"
                    className="inline-flex min-h-10 items-center gap-1 px-2 text-xs font-semibold text-primary underline-offset-4 hover:underline sm:text-sm"
                  >
                    <span>Ulangi onboarding</span>
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setEditProfileMode(!editProfileMode)}
                    className="action-secondary inline-flex min-h-10 items-center gap-2 rounded-full px-5 text-xs font-semibold transition-colors sm:text-sm"
                  >
                    <Edit3 className="size-4" aria-hidden="true" />
                    <span>
                      {editProfileMode ? "Batal edit" : "Edit profil"}
                    </span>
                  </button>
                </div>
              </header>

              <form
                onSubmit={handleSaveProfile}
                className="flex flex-col gap-8"
              >
                <div className="grid grid-cols-1 gap-6 border-t border-line pt-8 md:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-base font-bold text-ink">
                      Identitas &amp; Akademik
                    </h2>
                    <p className="text-sm leading-relaxed text-ink-muted">
                      Informasi kampus dan program studi yang tampil pada profil publikmu.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2">
                    <div>
                      <label
                        htmlFor="profile-nama-lengkap"
                        className="mb-1.5 block text-xs font-bold text-ink-secondary"
                      >
                        Nama Lengkap
                      </label>
                      <input
                        id="profile-nama-lengkap"
                        type="text"
                        disabled={!editProfileMode}
                        value={profileForm.namaLengkap}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            namaLengkap: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20 disabled:bg-surface/60 disabled:text-ink-secondary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="profile-nama-panggilan"
                        className="mb-1.5 block text-xs font-bold text-ink-secondary"
                      >
                        Nama Panggilan
                      </label>
                      <input
                        id="profile-nama-panggilan"
                        type="text"
                        disabled={!editProfileMode}
                        value={profileForm.namaPanggilan}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            namaPanggilan: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20 disabled:bg-surface/60 disabled:text-ink-secondary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="profile-universitas"
                        className="mb-1.5 block text-xs font-bold text-ink-secondary"
                      >
                        Universitas
                      </label>
                      <input
                        id="profile-universitas"
                        type="text"
                        disabled={!editProfileMode}
                        value={profileForm.universitas}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            universitas: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20 disabled:bg-surface/60 disabled:text-ink-secondary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="profile-prodi"
                        className="mb-1.5 block text-xs font-bold text-ink-secondary"
                      >
                        Program Studi
                      </label>
                      <input
                        id="profile-prodi"
                        type="text"
                        disabled={!editProfileMode}
                        value={profileForm.prodi}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            prodi: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20 disabled:bg-surface/60 disabled:text-ink-secondary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="profile-semester"
                        className="mb-1.5 block text-xs font-bold text-ink-secondary"
                      >
                        Semester
                      </label>
                      <input
                        id="profile-semester"
                        type="text"
                        disabled={!editProfileMode}
                        value={profileForm.semester}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            semester: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20 disabled:bg-surface/60 disabled:text-ink-secondary"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 border-t border-line pt-8 md:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-base font-bold text-ink">
                      Lokasi &amp; Perkenalan
                    </h2>
                    <p className="text-sm leading-relaxed text-ink-muted">
                      Domisili membantu menemukan teman belajar di sekitar lokasi kampusmu.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 md:col-span-2">
                    <div>
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <label
                          htmlFor="profile-domisili"
                          className="block text-xs font-bold text-ink-secondary"
                        >
                          Domisili &amp; Lokasi (Nearby)
                        </label>
                        {editProfileMode && (
                          <button
                            type="button"
                            onClick={handleDetectLocation}
                            disabled={detectingLocation}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary underline-offset-4 hover:underline"
                          >
                            <MapPin className="size-3.5" aria-hidden="true" />
                            <span>
                              {detectingLocation
                                ? "Mendeteksi…"
                                : "Deteksi GPS"}
                            </span>
                          </button>
                        )}
                      </div>
                      <input
                        id="profile-domisili"
                        type="text"
                        disabled={!editProfileMode}
                        value={profileForm.domisili}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            domisili: e.target.value,
                          })
                        }
                        placeholder="mis. Bandung, Jawa Barat"
                        className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20 disabled:bg-surface/60 disabled:text-ink-secondary"
                      />
                      {profileForm.latitude && profileForm.longitude && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold tabular-nums text-success">
                          <Check className="size-3.5" aria-hidden="true" />
                          <span>
                            Koordinat terkunci: {profileForm.latitude},{" "}
                            {profileForm.longitude}
                          </span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="profile-bio"
                        className="mb-1.5 block text-xs font-bold text-ink-secondary"
                      >
                        Bio Singkat
                      </label>
                      <textarea
                        id="profile-bio"
                        rows={3}
                        disabled={!editProfileMode}
                        value={profileForm.bio}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            bio: e.target.value,
                          })
                        }
                        className="w-full resize-none rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20 disabled:bg-surface/60 disabled:text-ink-secondary"
                      />
                    </div>
                  </div>
                </div>

                {editProfileMode && (
                  <div className="flex justify-end gap-3 border-t border-line pt-5">
                    <button
                      type="button"
                      onClick={() => setEditProfileMode(false)}
                      className="action-secondary inline-flex min-h-10 items-center rounded-full px-5 text-xs font-semibold transition-colors sm:text-sm"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="action-primary inline-flex min-h-10 items-center rounded-full px-6 text-xs font-bold transition-colors sm:text-sm"
                    >
                      Simpan perubahan
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* ================= TAB 5: STATUS MENTOR (blocks.so form-layout-02) ================= */}
          {activeTab === "apply" && user.role !== "Admin" && (
            <div className="flex flex-col gap-8">
              <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                    Status mentor
                  </h1>
                  <p className="text-sm text-ink-secondary">
                    {user.statusMentor === "APPROVED"
                      ? "Profil mentormu telah diverifikasi dan aktif di direktori mentor."
                      : user.statusMentor === "PENDING"
                        ? "Pantau pengajuanmu selama tim admin meninjau dokumen kredensial."
                        : "Ajukan keahlian dan dokumen pendukung untuk mulai mengajar di Mentora."}
                  </p>
                </div>

                {user.statusMentor === "APPROVED" ? (
                  <Badge variant="success-light">Mentor terverifikasi</Badge>
                ) : user.statusMentor === "PENDING" ? (
                  <Badge variant="warning-light">Sedang ditinjau</Badge>
                ) : (
                  <Badge variant="outline">Belum mengajukan</Badge>
                )}
              </header>

              <div className="grid grid-cols-1 gap-8 border-t border-line pt-8 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <h2 className="text-base font-bold text-ink">
                    Kredensial &amp; EduPoints
                  </h2>
                  <p className="text-sm leading-relaxed text-ink-muted">
                    Setiap sesi mentoring yang selesai memberikan{" "}
                    <strong className="font-semibold tabular-nums text-primary">
                      +5 EduPoints
                    </strong>{" "}
                    yang dapat ditukar menjadi e-certificate resmi untuk portofoliomu.
                  </p>
                </div>

                <div className="md:col-span-2">
                  {user.statusMentor === "APPROVED" ? (
                    <Frame>
                      <FramePanel className="flex flex-col gap-5">
                        <div className="flex items-start gap-3.5">
                          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-success-soft text-success">
                            <Check className="size-5" aria-hidden="true" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-ink">
                              Kamu sudah terverifikasi sebagai mentor
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                              Profil dan keahlianmu tampil di daftar mentor. Mahasiswa lain dapat melihat profil dan memesan sesi belajar denganmu.
                            </p>
                          </div>
                        </div>

                        {taughtSkills.length > 0 && (
                          <div className="flex flex-col gap-2 border-t border-line pt-4">
                            <p className="text-xs font-bold text-ink-secondary">
                              Keahlian yang tampil di profil mentor
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {taughtSkills.map((s) => (
                                <Badge key={s.id} variant="outline">
                                  {s.skill.namaSkill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
                          <Link
                            href={`/mentors/${user.id}`}
                            className="action-primary inline-flex min-h-10 items-center rounded-full px-5 text-xs font-bold transition-colors sm:text-sm"
                          >
                            Lihat profil publik
                          </Link>
                          <Link
                            href={dashboardUrl("skills")}
                            className="action-secondary inline-flex min-h-10 items-center rounded-full px-5 text-xs font-semibold transition-colors sm:text-sm"
                          >
                            Kelola keahlian
                          </Link>
                        </div>
                      </FramePanel>
                    </Frame>
                  ) : user.statusMentor === "PENDING" ? (
                    <Frame>
                      <FramePanel className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                          <Clock
                            className="mt-0.5 size-5 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <div>
                            <h3 className="text-base font-bold text-ink">
                              Pengajuan mentor sedang ditinjau
                            </h3>
                            <p className="mt-0.5 text-xs text-ink-secondary">
                              Dokumen kredensial:{" "}
                              <strong className="font-semibold text-ink">
                                {user.dokumenKredensial || "Belum tersedia"}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-ink-secondary">
                          Tim Admin Mentora sedang memvalidasi kesesuaian nilai dan kualifikasi keahlianmu. Status akunmu akan otomatis berubah setelah disetujui.
                        </p>
                      </FramePanel>
                    </Frame>
                  ) : (
                    <form
                      onSubmit={handleApplyMentor}
                      className="flex flex-col gap-5"
                    >
                      {applyError && (
                        <div
                          role="alert"
                          className="flex items-center gap-2 rounded-xl border border-danger-soft bg-danger-soft p-4 text-xs font-semibold text-danger"
                        >
                          <AlertCircle
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{applyError}</span>
                        </div>
                      )}

                      {applySuccess && (
                        <div
                          role="status"
                          className="flex items-center gap-2 rounded-xl border border-success-soft bg-success-soft p-4 text-xs font-semibold text-success"
                        >
                          <CheckCircle2
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span>
                            Pengajuan berhasil dikirim! Menunggu validasi Admin.
                          </span>
                        </div>
                      )}

                      <div>
                        <label
                          htmlFor="apply-skills"
                          className="mb-1.5 block text-xs font-bold text-ink-secondary"
                        >
                          Skill yang Ingin Kamu Ajarkan{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          id="apply-skills"
                          type="text"
                          value={applySkills}
                          onChange={(e) => setApplySkills(e.target.value)}
                          placeholder="mis. UI/UX Design, Figma, Programming Web Dasar"
                          required
                          className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20"
                        />
                        <p className="mt-1 text-xs text-ink-muted">
                          Pisahkan dengan koma jika lebih dari satu.
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="apply-experience"
                          className="mb-1.5 block text-xs font-bold text-ink-secondary"
                        >
                          Pengalaman Bimbingan / Mengajar (Opsional)
                        </label>
                        <textarea
                          id="apply-experience"
                          rows={3}
                          value={applyExperience}
                          onChange={(e) => setApplyExperience(e.target.value)}
                          placeholder="mis. Asisten praktikum mata kuliah DKV semester lalu, aktif sharing ilmu di kelompok belajar..."
                          className="w-full resize-none rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <MentorDocumentType />
                        <label
                          htmlFor="apply-credential-doc"
                          className="block text-xs font-bold text-ink-secondary"
                        >
                          Upload Dokumen Kredensial{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <FileDropzone
                          id="apply-credential-doc"
                          fileName={applyDocName}
                          fileSize={applyDocSize}
                          uploading={uploadingDocument}
                          disabled={applyLoading}
                          onFileSelected={handleUploadCredential}
                          onClear={() => {
                            setApplyDocName("");
                            setApplyDocSize(undefined);
                            setApplyDocUrl("");
                          }}
                        />
                      </div>

                      <div className="flex justify-end border-t border-line pt-5">
                        <button
                          type="submit"
                          disabled={applyLoading || uploadingDocument}
                          className="action-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-colors disabled:opacity-60"
                        >
                          {applyLoading && (
                            <Loader2
                              className="size-4 animate-spin"
                              aria-hidden="true"
                            />
                          )}
                          <span>Kirim pengajuan akun mentor</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 6: ADMIN VERIFIKASI MENTOR ================= */}
          {activeTab === "admin" && user.role === "Admin" && (
            <div className="flex flex-col gap-6">
              <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                    Verifikasi mentor
                  </h1>
                  <p className="text-sm text-ink-secondary">
                    Validasi transkrip nilai dan kredensial calon mentor sebelum status aktif dipublikasikan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadAdminApplications}
                  disabled={adminLoading}
                  className="action-secondary inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors disabled:opacity-60"
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" />
                  <span>{adminLoading ? "Memuat…" : "Muat ulang"}</span>
                </button>
              </header>

              <Frame>
                <FrameHeader>
                  <FrameTitle>Antrean pengajuan kredensial</FrameTitle>
                  <Badge variant="outline" className="tabular-nums">
                    {applications.length} total pengajuan
                  </Badge>
                </FrameHeader>

                <FramePanel padded={false}>
                  {adminError || (adminLoading && !applicationsReady) ? (
                    <p role="status" className="p-6 text-sm text-ink-secondary">
                      {adminError
                        ? "Pengajuan belum bisa dimuat. Coba muat ulang."
                        : "Memuat pengajuan…"}
                    </p>
                  ) : applications.length > 0 ? (
                    <ol className="divide-y divide-line">
                      {applications.map((app) => (
                        <li
                          key={app.id}
                          className="flex flex-col items-start justify-between gap-4 p-5 sm:px-6 md:flex-row md:items-center"
                        >
                          <div className="flex min-w-0 flex-col gap-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-bold text-ink sm:text-base">
                                {app.user.namaLengkap}
                              </h3>
                              <span className="text-xs text-ink-muted">
                                {app.user.email}
                              </span>
                              <Badge
                                variant={
                                  app.status === "APPROVED"
                                    ? "success-light"
                                    : app.status === "REJECTED"
                                      ? "destructive-light"
                                      : "warning-light"
                                }
                              >
                                {app.status}
                              </Badge>
                            </div>

                            <div className="flex flex-col gap-1 text-xs text-ink-secondary sm:text-sm">
                              <p className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-ink">
                                  {app.user.universitas}
                                </span>
                                <InlineDot />
                                <span>
                                  {app.user.prodi} (Semester{" "}
                                  {app.user.semester})
                                </span>
                              </p>
                              <p>
                                <span className="font-semibold text-ink">
                                  Skill yang ditawarkan:
                                </span>{" "}
                                {app.skillsOffered}
                              </p>
                              {app.pengalamanMengajar && (
                                <p>
                                  <span className="font-semibold text-ink">
                                    Pengalaman:
                                  </span>{" "}
                                  {app.pengalamanMengajar}
                                </p>
                              )}
                              <p className="flex items-center gap-1.5 pt-1 font-semibold text-primary">
                                <FileText
                                  className="size-4 shrink-0"
                                  aria-hidden="true"
                                />
                                {app.dokumenUrl ? (
                                  <a
                                    className="underline underline-offset-4"
                                    href={app.dokumenUrl}
                                  >
                                    Unduh {app.dokumenNama}
                                  </a>
                                ) : (
                                  <span>Berkas belum tersedia</span>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            {app.status === "PENDING" ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleReviewApplication(app.id, "APPROVE")
                                  }
                                  className="inline-flex min-h-10 items-center gap-1.5 action-primary rounded-full px-4 text-xs font-bold transition-colors"
                                >
                                  <Check
                                    className="size-4"
                                    aria-hidden="true"
                                  />
                                  <span>Setujui</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleReviewApplication(app.id, "REJECT")
                                  }
                                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-danger-soft bg-danger-tint px-4 text-xs font-bold text-danger-hover transition-colors hover:bg-danger-soft"
                                >
                                  <XCircle
                                    className="size-4"
                                    aria-hidden="true"
                                  />
                                  <span>Tolak</span>
                                </button>
                              </>
                            ) : (
                              <Badge variant="outline">
                                Sudah diproses ({app.status})
                              </Badge>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="p-10 text-center text-sm text-ink-muted">
                      Belum ada pengajuan mentor yang masuk.
                    </p>
                  )}
                </FramePanel>
              </Frame>
            </div>
          )}
        </div>
      </main>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={(bookedDate) => {
          if (bookedDate) {
            setAgendaDay(bookedDate);
            setBookingDay(undefined);
          }
          setIsBookingOpen(false);
        }}
        mentor={bookingMentor}
        initialDate={bookingDay}
      />

      <Footer workspace />
    </div>
  );
}
