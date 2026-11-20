"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { accountHome } from "@/lib/account-home";

interface SessionUser {
  id: number;
  namaLengkap: string;
  namaPanggilan?: string;
  email: string;
  fotoProfil?: string | null;
  foto_profil?: string | null;
  role: string;
  onboardingCompleted: boolean;
}

const SessionContext = createContext<{ profile: SessionUser | null; authLoading: boolean }>({
  profile: null,
  authLoading: true,
});

export const useSession = () => useContext(SessionContext);

export default function SessionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<SessionUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let latest = 0;
    const refresh = async () => {
      const request = ++latest;
      try {
        const response = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
        if (request !== latest) return;
        if (response.status === 401) {
          setProfile(null);
          return;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const { user } = await response.json();
        if (request !== latest) return;
        setProfile(user ?? null);
        if (user && window.location.pathname === "/") window.location.replace(accountHome(user));
      } catch (error) {
        if (request === latest) console.error("Gagal memeriksa sesi pengguna:", error);
      } finally {
        if (request === latest) setAuthLoading(false);
      }
    };
    void refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("auth-changed", refresh);
    window.addEventListener("profile-updated", refresh);
    return () => {
      ++latest;
      window.removeEventListener("focus", refresh);
      window.removeEventListener("auth-changed", refresh);
      window.removeEventListener("profile-updated", refresh);
    };
  }, [pathname]);

  return <SessionContext.Provider value={{ profile, authLoading }}>{children}</SessionContext.Provider>;
}
