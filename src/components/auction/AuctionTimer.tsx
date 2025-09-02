"use client";
import { useCountdown } from "@/hooks/useCountdown";

export default function AuctionTimer({ endsAt }: { endsAt: string }) {
  const { d, h, m, s, finished } = useCountdown(endsAt);
  if (finished) {
    return <span className="inline-flex items-center rounded px-2 py-0.5 text-xs bg-red-600/20 text-red-300">Sona erdi</span>;
  }
  return (
    <span className="inline-flex items-center rounded px-2 py-0.5 text-xs bg-emerald-600/15 text-emerald-300">
      {d ? `${d}g ` : ""}
      {h.toString().padStart(2,"0")}:
      {m.toString().padStart(2,"0")}:
      {s.toString().padStart(2,"0")}
      {" "}kaldı
    </span>
  );
}
