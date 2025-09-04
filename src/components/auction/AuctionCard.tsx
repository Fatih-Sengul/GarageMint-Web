"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMyProfile } from "@/lib/queries/profile";
import { AuctionListItemDto } from "@/lib/types/auction";
import { formatCountdown } from "@/lib/utils/time";
import { trAuctionStatus } from "@/lib/utils/i18n";

export default function AuctionCard({ a }: { a: AuctionListItemDto }) {
  const highest = a.highestBidAmount ?? "-";
  const cover = a.coverUrl ?? `https://picsum.photos/seed/auction${a.id}/1200/800`;
  const router = useRouter();
  const { data: me } = useMyProfile();

  return (
    <div>
      <Link
        href={`/auctions/${a.id}`}
        className="group overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="relative">
          <img
            src={cover}
            alt={`auction-${a.id}`}
            className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {/* Üst şerit: Kalan süre */}
          <span className="absolute top-3 left-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-white/10">
            {formatCountdown(a.endsAt)}
          </span>
          {/* Sağ üst: durum */}
          <span className="absolute top-3 right-3 rounded-md bg-white/10 px-2 py-1 text-xs font-semibold ring-1 ring-white/10">
            {trAuctionStatus(a.status)}
          </span>
        </div>

        <div className="p-4 grid gap-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Başlangıç</span>
            <span className="font-bold">{Number(a.startPrice).toFixed(2)} {a.currency}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">En yüksek</span>
            <span className="font-bold">
              {highest === "-" ? "-" : `${Number(highest).toFixed(2)} ${a.currency}`}
            </span>
          </div>
          {a.sellerUsername && (
            <div className="mt-2 text-xs text-neutral-400">
              Satıcı:{" "}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  const u = a.sellerUsername!;
                  router.push(me?.username === u ? "/me" : `/u/${u}`);
                }}
                className="cursor-pointer text-sky-400 hover:underline"
              >
                @{a.sellerUsername}
              </span>
            </div>
          )}
        </div>
      </Link>
      {me?.username && me?.username === a.sellerUsername && (
        <div className="mt-2 flex justify-end gap-3 text-xs">
          <Link href={`/auctions/${a.id}/edit`} className="text-sky-400 hover:underline">Düzenle</Link>
        </div>
      )}
    </div>
  );
}
