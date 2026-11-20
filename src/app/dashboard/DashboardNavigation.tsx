import Link from "next/link";
import {
  Award,
  BadgeCheck,
  CalendarDays,
  ClipboardCheck,
  Clock,
  GraduationCap,
  Layers,
  LayoutDashboard,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { key: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { key: "mentors", label: "Daftar mentor", icon: Users },
  { key: "sessions", label: "Sesi belajar", icon: CalendarDays },
  { key: "skills", label: "Keahlian saya", icon: Layers },
  { key: "profile", label: "Profil saya", icon: UserRound },
  { key: "apply", label: "Status mentor", icon: ShieldCheck },
  { key: "admin", label: "Verifikasi mentor", icon: ClipboardCheck },
] as const;

export type DashboardTab = (typeof sections)[number]["key"];

function availableSections(isAdmin: boolean) {
  return sections.filter(({ key }) =>
    isAdmin ? key !== "apply" : key !== "admin" && key !== "overview",
  );
}

export function dashboardTab(
  query: string | null,
  isAdmin: boolean,
): DashboardTab {
  return (
    availableSections(isAdmin).find(({ key }) => key === query)?.key ??
    (isAdmin ? "overview" : "mentors")
  );
}

export function dashboardUrl(tab: DashboardTab) {
  return tab === "overview" ? "/dashboard" : `/dashboard?tab=${tab}`;
}

export function cleanInitials(
  primary?: string | null,
  fallback?: string | null,
): string {
  const source = (primary ?? "").trim() || (fallback ?? "").trim();
  const words = source
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "U";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
}

type NavigationProps = {
  active: DashboardTab;
  sessionCount?: number;
  pendingCount?: number;
  user: {
    fotoProfil?: string;
    namaLengkap: string;
    namaPanggilan?: string;
    universitas?: string;
    prodi?: string;
    domisili?: string;
    role: string;
    statusMentor: string;
    totalPoin: number;
  };
};

/* Minimal Beranda-tinted Sub-Header:
 * - No redundant large profile block or duplicate Navbar buttons
 * - Vibrant bg-primary-soft band with sculpted white segmented tab dock (ReUI c-tabs-6/8)
 * - Clean separated status & EduPoints pills on the right
 */
export default function DashboardNavigation({
  active,
  sessionCount = 0,
  pendingCount = 0,
  user,
}: NavigationProps) {
  const isAdmin = user.role === "Admin";
  const verified = !isAdmin && user.statusMentor === "APPROVED";
  const pending = !isAdmin && user.statusMentor === "PENDING";
  const items = availableSections(isAdmin);

  const countFor = (key: DashboardTab) => {
    if (key === "sessions" && sessionCount > 0) return sessionCount;
    if (key === "admin" && pendingCount > 0) return pendingCount;
    return null;
  };

  return (
    <header className="border-b border-line bg-primary-soft/75 text-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <nav
          aria-label="Bagian dashboard"
          className="inline-flex flex-wrap items-center gap-1 rounded-2xl border border-line bg-surface p-1.5 shadow-soft-card"
        >
          {items.map(({ key, label, icon: Icon }) => {
            const isCurrent = active === key;
            const badgeCount = countFor(key);
            return (
              <Link
                key={key}
                href={dashboardUrl(key)}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-xs font-bold transition-colors sm:text-sm",
                  isCurrent
                    ? "bg-primary text-white"
                    : "text-ink-secondary hover:bg-canvas hover:text-primary",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    isCurrent ? "text-white" : "text-ink-muted",
                  )}
                  aria-hidden="true"
                />
                <span>{label}</span>
                {badgeCount !== null && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-extrabold tabular-nums",
                      isCurrent
                        ? "bg-white/20 text-white"
                        : "bg-primary-soft text-primary",
                    )}
                  >
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin ? (
            <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-xs font-bold text-ink-secondary">
              <ShieldCheck
                className="size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>Administrator Mentora</span>
            </span>
          ) : verified ? (
            <Link
              href={dashboardUrl("apply")}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-xs font-bold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
            >
              <BadgeCheck className="size-4 shrink-0 text-success" aria-hidden="true" />
              <span>Mentor terverifikasi</span>
            </Link>
          ) : pending ? (
            <Link
              href={dashboardUrl("apply")}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-warning-soft bg-warning-tint px-4 text-xs font-bold text-ink transition-colors hover:border-warning-accent"
            >
              <Clock
                className="size-4 shrink-0 text-warning-accent"
                aria-hidden="true"
              />
              <span>Verifikasi ditinjau</span>
            </Link>
          ) : (
            <Link
              href={dashboardUrl("profile")}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-xs font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
            >
              <GraduationCap
                className="size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>
                {user.universitas ? user.universitas : "Mahasiswa / Mentee"}
              </span>
            </Link>
          )}

          {!isAdmin && (
            <Link
              href={dashboardUrl("apply")}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-xs font-bold text-ink transition-colors hover:border-primary"
            >
              <Award
                className="size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span className="tabular-nums text-primary">
                {user.totalPoin}
              </span>
              <span>EduPoints</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
