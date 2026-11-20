const wibFormat = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Jakarta" });

/** Hari kalender untuk reservasi Mentora, terlepas dari zona waktu perangkat. */
export function dayInWib(now: number = Date.now()) {
  return wibFormat.format(now);
}

export function shiftDay(day: string, offset: number) {
  const date = new Date(day + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}
