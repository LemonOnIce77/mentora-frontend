import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { dayInWib, shiftDay } from "@/lib/session-date";
import { dashboardUrl } from "./DashboardNavigation";

type Session = {
  id: string;
  tanggalSesi: string;
  jamMulai: string;
  jamSelesai: string;
  skill: string;
  mentorName: string;
  status: string;
};
type Props = {
  sessions: Session[];
  chosenDay: string | null;
  onChooseDay: (day: string) => void;
  canBook: boolean;
  onPickMentor: () => void;
};

const fullDate = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "full",
  timeZone: "UTC",
});
const monthYear = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const shortDate = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const weekdayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function shiftMonth(day: string, offset: number) {
  const date = new Date(day + "T00:00:00Z");
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + offset;
  const last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(date.getUTCDate(), last)))
    .toISOString()
    .slice(0, 10);
}

function weekStart(day: string) {
  const weekday = new Date(day + "T00:00:00Z").getUTCDay();
  return shiftDay(day, -((weekday + 6) % 7));
}

export default function StudyAgenda({
  sessions,
  chosenDay,
  onChooseDay,
  canBook,
  onPickMentor,
}: Props) {
  const [today, setToday] = useState(() => dayInWib());
  const [nowMs, setNowMs] = useState(0);
  const [view, setView] = useState<"Bulan" | "Minggu">("Bulan");
  const daysRef = useRef<HTMLDivElement>(null);
  const focusDay = useRef(false);

  useEffect(() => {
    const syncClock = () => {
      const current = new Date().getTime();
      setNowMs(current);
      setToday(dayInWib(current));
    };
    syncClock();
    const timer = window.setInterval(syncClock, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const selected = chosenDay ?? today;
  const date = new Date(selected + "T00:00:00Z");
  const monthly = view === "Bulan";
  const monthStart = selected.slice(0, 7) + "-01";
  const first = weekStart(monthly ? monthStart : selected);
  const daysInMonth = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();
  const leadingDays = (new Date(monthStart + "T00:00:00Z").getUTCDay() + 6) % 7;
  const cells = monthly ? Math.ceil((leadingDays + daysInMonth) / 7) * 7 : 7;

  const bookings = sessions
    .filter(
      (session) =>
        session.status === "BOOKED" ||
        session.status === "CONFIRMED" ||
        session.status === "PENDING",
    )
    .sort((a, b) =>
      (a.tanggalSesi + a.jamMulai).localeCompare(b.tanggalSesi + b.jamMulai),
    );
  const bookedDays = new Set(bookings.map((session) => session.tanggalSesi));
  const daily = bookings.filter((session) => session.tanggalSesi === selected);
  const upcoming = bookings.filter((session) => {
    if (nowMs === 0) return session.tanggalSesi >= today;
    return Date.parse(`${session.tanggalSesi}T${session.jamMulai}+07:00`) >= nowMs;
  });
  const next = upcoming[0];

  useEffect(() => {
    if (focusDay.current) {
      daysRef.current
        ?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
        ?.focus();
      focusDay.current = false;
    }
  }, [selected]);

  function navigate(offset: number) {
    onChooseDay(
      monthly ? shiftMonth(selected, offset) : shiftDay(selected, offset * 7),
    );
  }

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, day: string) {
    let target: string;
    switch (event.key) {
      case "ArrowLeft":
        target = shiftDay(day, -1);
        break;
      case "ArrowRight":
        target = shiftDay(day, 1);
        break;
      case "ArrowUp":
        target = shiftDay(day, -7);
        break;
      case "ArrowDown":
        target = shiftDay(day, 7);
        break;
      case "Home":
        target = weekStart(day);
        break;
      case "End":
        target = shiftDay(weekStart(day), 6);
        break;
      default:
        return;
    }
    event.preventDefault();
    if (target === selected) return;
    focusDay.current = true;
    onChooseDay(target);
  }

  return (
    <section
      aria-labelledby="agenda-title"
      className="grid min-w-0 grid-cols-1 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]"
    >
      <div className="flex min-w-0 flex-col gap-3.5 p-4 sm:gap-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            id="agenda-title"
            className="text-sm font-bold tracking-tight text-ink sm:text-base"
          >
            Agenda belajar
          </h2>
          <div
            role="group"
            aria-label="Tampilan agenda"
            className="flex rounded-full border border-line bg-canvas p-0.5"
          >
            {(["Bulan", "Minggu"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={mode === view}
                onClick={() => setView(mode)}
                className={`min-h-7 rounded-full px-2.5 text-xs font-semibold transition-colors sm:min-h-8 sm:px-3 ${
                  mode === view
                    ? "bg-white text-primary shadow-2xs"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            aria-live="polite"
            className="text-xs font-bold tracking-tight text-ink sm:text-base"
          >
            {monthYear.format(date)}
          </p>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => onChooseDay(today)}
              className="min-h-8 rounded-full px-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary-soft sm:min-h-9 sm:px-3"
            >
              Hari ini
            </button>
            <button
              type="button"
              aria-label={view + " sebelumnya"}
              onClick={() => navigate(-1)}
              className="grid size-8 place-items-center rounded-full text-ink-secondary transition-colors hover:bg-canvas sm:size-9"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={view + " berikutnya"}
              onClick={() => navigate(1)}
              className="grid size-8 place-items-center rounded-full text-ink-secondary transition-colors hover:bg-canvas sm:size-9"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1 sm:gap-1.5">
          <div
            aria-hidden="true"
            className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-ink-muted sm:text-xs"
          >
            {weekdayNames.map((day) => (
              <span key={day} className="py-0.5 sm:py-1">
                {day}
              </span>
            ))}
          </div>

          <div
            ref={daysRef}
            role="group"
            aria-label="Pilih tanggal agenda"
            className="grid grid-cols-7 gap-1 sm:gap-1.5"
          >
            {Array.from({ length: cells }, (_, index) => {
              const iso = shiftDay(first, index);
              const day = new Date(iso + "T00:00:00Z");
              const isSelected = iso === selected;
              const hasBooking = bookedDays.has(iso);
              const outside =
                monthly && iso.slice(0, 7) !== selected.slice(0, 7);
              let color = outside
                ? "text-ink-muted/50 hover:bg-canvas"
                : "bg-canvas text-ink-secondary hover:bg-primary-soft";
              if (iso === today)
                color = "bg-white text-primary ring-1 ring-inset ring-primary";
              if (isSelected) color = "bg-primary text-white shadow-xs";
              return (
                <button
                  key={iso}
                  type="button"
                  aria-pressed={isSelected}
                  aria-current={iso === today ? "date" : undefined}
                  tabIndex={isSelected ? 0 : -1}
                  data-date={iso}
                  onClick={() => onChooseDay(iso)}
                  onKeyDown={(event) => moveFocus(event, iso)}
                  aria-label={
                    fullDate.format(day) + (hasBooking ? ", ada sesi" : "")
                  }
                  className={`relative grid h-8 sm:h-10 min-w-0 place-items-center rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold tabular-nums transition-colors ${color}`}
                >
                  {day.getUTCDate()}
                  {hasBooking && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0.5 sm:bottom-1 size-1 sm:size-1.5 rounded-full bg-current"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-line bg-canvas p-4 sm:p-6 xl:border-l xl:border-t-0">
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <CalendarDays className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-ink">
                {fullDate.format(date)}
              </h3>
              <p className="text-xs text-ink-muted">Jadwal sesi terpilih</p>
            </div>
          </div>
          <Link
            href={dashboardUrl("sessions")}
            className="inline-flex min-h-9 items-center text-xs font-semibold text-primary underline-offset-4 hover:underline"
          >
            Semua sesi
          </Link>
        </div>

        <div aria-live="polite" className="flex-1">
          {daily.length ? (
            <ul className="divide-y divide-line rounded-xl border border-line bg-white px-4">
              {daily.map((session) => (
                <li key={session.id} className="py-3.5">
                  <p className="break-words text-sm font-bold text-ink">
                    {session.skill}
                  </p>
                  <p className="mt-1 break-words text-xs tabular-nums text-ink-secondary">
                    {session.jamMulai}–{session.jamSelesai} WIB ·{" "}
                    {session.mentorName}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-line bg-white p-5 text-center">
              <p className="text-sm font-medium text-ink-secondary">
                Belum ada sesi pada tanggal ini.
              </p>
              {canBook && selected >= today && (
                <button
                  type="button"
                  onClick={onPickMentor}
                  className="action-secondary mt-3 inline-flex min-h-10 items-center rounded-full px-4 text-xs font-semibold transition-colors"
                >
                  Pilih mentor untuk tanggal ini
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-xs text-ink-muted">
          <span className="tabular-nums">
            {sessions.length > 0
              ? `${upcoming.length} sesi mendatang · ${sessions.length} total reservasi`
              : "Pilih tanggal untuk menjadwalkan sesi"}
          </span>
          {next && next.tanggalSesi !== selected && (
            <button
              type="button"
              onClick={() => onChooseDay(next.tanggalSesi)}
              className="inline-flex min-h-9 items-center font-semibold text-primary underline-offset-4 hover:underline"
            >
              Sesi berikutnya ·{" "}
              {shortDate.format(new Date(next.tanggalSesi + "T00:00:00Z"))}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
