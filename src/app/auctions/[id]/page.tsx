"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuction, useAuctionBids } from "@/lib/queries/auction";
import { formatTRY } from "@/lib/format";
import AuctionTimer from "@/components/auction/AuctionTimer";
import BidForm from "@/components/auction/BidForm";
import BidList from "@/components/auction/BidList";

export default function AuctionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: auction, isLoading, isError } = useAuction(id, 5_000);      // 5sn polling
  const { data: bids } = useAuctionBids(id, auction?.status === "ACTIVE" ? 5_000 : undefined);

  if (isLoading) {
    return <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-neutral-400">Yükleniyor…</div>;
  }
  if (isError || !auction) {
    return <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-red-400">Mezat bulunamadı.</div>;
  }

  const highest = auction.highestBidAmount ? Number(auction.highestBidAmount) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6">
      {/* Breadcrumb */}
      <nav className="text-sm">
        <Link href="/" className="text-sky-400 hover:underline">Anasayfa</Link>
        <span className="mx-2 text-neutral-500">/</span>
        <Link href="/auctions" className="text-sky-400 hover:underline">Mezat</Link>
        <span className="mx-2 text-neutral-500">/</span>
        <span className="text-neutral-300">#{auction.id}</span>
      </nav>

      {/* Üst bilgi */}
      <section className="rounded-2xl border border-neutral-200 dark:border-white/10 p-5 bg-white dark:bg-neutral-900 shadow-sm grid gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold">Mezat #{auction.id}</h1>
          <AuctionTimer endsAt={auction.endsAt} />
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <Stat label="Durum" value={auction.status} />
          <Stat label="Başlangıç" value={formatTRY(auction.startPrice)} />
          <Stat label="En yüksek teklif" value={highest ? formatTRY(highest) : "-"} />
        </div>

        <img
          src={`https://picsum.photos/seed/auction-${auction.id}/1200/600`}
          alt="auction"
          className="rounded-xl border border-neutral-200 dark:border-white/10 h-56 w-full object-cover"
        />
      </section>

      {/* 2 kolon: Bid form + Bid list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-2xl border border-neutral-200 dark:border-white/10 p-5 bg-white dark:bg-neutral-900 shadow-sm">
          <h2 className="text-lg font-bold mb-3">Teklifler</h2>
          <BidList bids={bids ?? []} />
        </section>

        <section className="rounded-2xl border border-neutral-200 dark:border-white/10 p-5 bg-white dark:bg-neutral-900 shadow-sm">
          <h2 className="text-lg font-bold mb-3">Teklif Ver</h2>
          <BidForm auction={auction} />
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/10 p-4">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
