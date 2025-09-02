"use client";
import type { BidResponseDto } from "@/lib/types/auction";
import { formatTRY } from "@/lib/format";

export default function BidList({ bids }: { bids: BidResponseDto[] }) {
  if (!bids.length) {
    return <p className="text-sm text-neutral-500">Henüz teklif yok.</p>;
  }
  return (
    <ul className="grid gap-2">
      {bids.map((b) => (
        <li key={b.id} className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-white/10 px-3 py-2">
          <span className="text-sm text-neutral-400">kullanıcı #{b.bidderUserId}</span>
          <span className="font-semibold">{formatTRY(b.amount)}</span>
        </li>
      ))}
    </ul>
  );
}
