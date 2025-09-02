export function formatCountdown(endsAtISO: string) {
  const ends = new Date(endsAtISO).getTime();
  const now = Date.now();
  let diff = Math.max(0, ends - now);

  const d = Math.floor(diff / (24*60*60*1000)); diff -= d*24*60*60*1000;
  const h = Math.floor(diff / (60*60*1000)); diff -= h*60*60*1000;
  const m = Math.floor(diff / (60*1000));
  return `${d}g ${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")} kaldı`;
}

export function formatDateTime(ts: string) {
  return new Date(ts).toLocaleString("tr-TR", { dateStyle:"medium", timeStyle:"short" });
}
