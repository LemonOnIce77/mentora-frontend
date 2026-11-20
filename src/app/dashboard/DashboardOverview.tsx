import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Badge,
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
  type BadgeVariant,
} from "@/components/dashboard-ui/primitives";
import { dashboardUrl } from "./DashboardNavigation";

type Application = {
  id: number;
  status: string;
  user: { namaLengkap: string };
  skillsOffered: string;
};

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  PENDING: { label: "Menunggu", variant: "warning-light" },
  APPROVED: { label: "Disetujui", variant: "success-light" },
  REJECTED: { label: "Ditolak", variant: "destructive-light" },
};

/* blocks.so stats-02 (single hairline-divided bar) + ReUI c-frame-4 stacked list */
export default function AdminOverview({
  applications,
  error,
}: {
  applications: Application[] | null;
  error: boolean;
}) {
  const counts = [
    {
      label: "Menunggu tinjauan",
      value:
        applications?.filter((item) => item.status === "PENDING").length ?? "—",
    },
    {
      label: "Mentor disetujui",
      value:
        applications?.filter((item) => item.status === "APPROVED").length ??
        "—",
    },
    {
      label: "Pengajuan ditolak",
      value:
        applications?.filter((item) => item.status === "REJECTED").length ??
        "—",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <dl className="grid grid-cols-1 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {counts.map((item) => (
          <div key={item.label} className="flex flex-col gap-1 px-6 py-5">
            <dt className="text-xs font-medium text-ink-muted">{item.label}</dt>
            <dd className="text-2xl font-extrabold tracking-tight tabular-nums text-ink">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <Frame>
        <FrameHeader>
          <FrameTitle>Pengajuan terbaru</FrameTitle>
          <Link
            href={dashboardUrl("admin")}
            className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-primary underline-offset-4 hover:underline"
          >
            <span>Buka verifikasi</span>
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </FrameHeader>

        <FramePanel padded={false}>
          {applications?.length ? (
            <ul className="divide-y divide-line">
              {applications.slice(0, 5).map((item) => {
                const st = statusConfig[item.status] ?? {
                  label: item.status,
                  variant: "outline" as BadgeVariant,
                };
                return (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-4 sm:px-6"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-sm font-bold text-ink">
                        {item.user.namaLengkap}
                      </p>
                      <p className="mt-0.5 break-words text-xs text-ink-muted">
                        {item.skillsOffered}
                      </p>
                    </div>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p role="status" className="p-6 text-sm text-ink-muted">
              {error
                ? "Pengajuan belum bisa dimuat. Buka verifikasi untuk mencoba lagi."
                : applications
                  ? "Belum ada pengajuan mentor."
                  : "Memuat pengajuan…"}
            </p>
          )}
        </FramePanel>
      </Frame>
    </div>
  );
}
