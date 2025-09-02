import Link from "next/link";
import AuctionTimer from "./AuctionTimer";
import { formatTRY } from "@/lib/format";
import type { AuctionListItemDto } from "@/lib/types/auction";

export default function AuctionCard({ a }: { a: AuctionListItemDto }) {
  return (
    <Link
      href={`/auctions/${a.id}`}
      className="group block overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Görsel - şimdilik placeholder */}
      <div className="relative">
        <img
          src={`https://picsum.photos/seed/auction-${a.id}/800/480`}
          alt="Auction"
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute top-2 left-2 rounded-md bg-neutral-900/80 text-white text-xs font-bold px-2 py-1">
          #{a.id}
        </span>
      </div>

      <div className="p-4 grid gap-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">Başlangıç</span>
          <span className="font-semibold">{formatTRY(a.startPrice)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">En yüksek</span>
          <span className="font-semibold">{a.highestBidAmount ? formatTRY(a.highestBidAmount) : "-"}</span>
        </div>
        <div className="pt-2">
          <AuctionTimer endsAt={a.endsAt} />
        </div>
      </div>
    </Link>
  );
}
