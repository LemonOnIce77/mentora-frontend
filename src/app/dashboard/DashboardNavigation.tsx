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
  { key: "apply", label: "Status mentor", icon: ShieldCheck },
  { key: "profile", label: "Profil saya", icon: UserRound },
  { key: "admin", label: "Verifikasi mentor", icon: ClipboardCheck },
] as const;

export type DashboardTab = (typeof sections)[number]["key"];

function availableSections(isAdmin: boolean) {
  return sections.filter(({ key }) =>
    isAdmin
      ? key !== "apply" && key !== "profile"
      : key !== "admin" && key !== "overview" && key !== "profile",
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

/* Modern Clean Sub-Header ala Jiro:
 * - Clean translucent surface bar with hairline bottom border
 * - Sculpted pill dock: rounded-2xl bg-canvas p-1 with rounded-xl active tab
 * - Floating campus & EduPoints badge pills on the right
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
    <nav
      aria-label="Navigasi dasbor"
      className="border-b border-line bg-surface/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-3 py-2.5 sm:px-6 sm:py-3 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="-mx-3 overflow-x-auto px-3 pb-1 sm:-mx-1 sm:px-1 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="inline-flex min-w-max items-center gap-1 rounded-2xl border border-line bg-canvas p-1 shadow-2xs">
            {items.map(({ key, label, icon: Icon }) => {
              const isCurrent = active === key;
              const badgeCount = countFor(key);
              return (
                <Link
                  key={key}
                  href={dashboardUrl(key)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold transition-all duration-150 sm:gap-2 sm:px-3.5 sm:text-[13.5px]",
                    isCurrent
                      ? "bg-primary text-white shadow-sm"
                      : "text-ink-secondary hover:bg-surface hover:text-ink active:scale-[0.98]",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-3.5 shrink-0 sm:size-4",
                      isCurrent ? "text-white" : "text-ink-muted",
                    )}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                  {badgeCount !== null && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-extrabold tabular-nums sm:px-2 sm:text-xs",
                        isCurrent
                          ? "bg-white/25 text-white"
                          : "bg-primary-soft text-primary",
                      )}
                    >
                      {badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-bold text-ink-secondary shadow-2xs sm:gap-2 sm:px-4 sm:py-2">
              <ShieldCheck
                className="size-3.5 shrink-0 text-primary sm:size-4"
                aria-hidden="true"
              />
              <span>Administrator Mentora</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-secondary shadow-2xs sm:px-4 sm:py-2">
              <GraduationCap
                className="size-3.5 shrink-0 text-primary sm:size-4"
                aria-hidden="true"
              />
              <span className="max-w-[150px] truncate sm:max-w-[220px]">
                {user.universitas ? user.universitas : "Mahasiswa / Mentee"}
              </span>
            </span>
          )}

          {!isAdmin && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-warning-soft/70 bg-warning-tint px-3 py-1.5 text-xs font-bold text-warning shadow-2xs sm:px-4 sm:py-2"
            >
              <Award
                className="size-3.5 shrink-0 text-warning sm:size-4"
                aria-hidden="true"
              />
              <span className="tabular-nums">
                {user.totalPoin}
              </span>
              <span>EduPoints</span>
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
