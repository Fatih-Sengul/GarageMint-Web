"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuction, useBids, usePlaceBid } from "@/lib/queries/auction";
import { useMyProfile } from "@/lib/queries/profile";
import { formatCountdown, formatDateTime } from "@/lib/utils/time";
import { trAuctionStatus } from "@/lib/utils/i18n";
import { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/lib/auth/store";
import SignupPromptModal from "@/components/auth/SignupPromptModal";

export default function AuctionDetailPage() {
  const params = useParams(); // { id: "123" }
  const id = Number(params?.id);
  const isAuthed = useAuthStore((s) => s.isAuthed());
  if (!isAuthed) {
    return (
      <SignupPromptModal
        open={true}
        onClose={() => {
          if (typeof window !== "undefined") window.location.href = "/";
        }}
      />
    );
  }
  const { data: auction } = useAuction(id);
  const { data: bids } = useBids(id);
  const { data: me } = useMyProfile();
  const mBid = usePlaceBid(id);

  const minNext = useMemo(() => {
    if (!auction) return 0;
    const base = auction.highestBidAmount ? Number(auction.highestBidAmount) : Number(auction.startPrice);
    return base + 10; // 10 TL artış
  }, [auction]);

    const [amount, setAmount] = useState<number>(0);
    const inc = () => setAmount((v) => (v || minNext) + 10);
    const dec = () => setAmount((v) => Math.max(minNext, (v || minNext) - 10));

  const imgs = (
    auction?.images?.length
      ? [...auction.images]
      : [{ url: `https://picsum.photos/seed/au${id}/1600/900`, idx: 0 }]
  ).sort((a, b) => a.idx - b.idx);
  const [imgIdx, setImgIdx] = useState(0);
  const prevImg = () => setImgIdx((i) => (i - 1 + imgs.length) % imgs.length);
  const nextImg = () => setImgIdx((i) => (i + 1) % imgs.length);

  if (!auction) return null;
  const sellerUsername = auction.sellerUsername ?? auction.seller?.username;

  const submit = () => {
    const val = amount || minNext;
    mBid.mutate({ amount: val.toFixed(2) });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6">
      {/* üst kısım: görsel kaydırıcı */}
      <section className="overflow-hidden rounded-2xl border border-white/10">
        <div className="relative w-full">
          <img src={imgs[imgIdx]?.url} alt="" className="w-full h-72 sm:h-96 object-cover" />
          {imgs.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}
          <span className="absolute top-3 left-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-white/10">
            {formatCountdown(auction.endsAt)}
          </span>
          <span className="absolute top-3 right-3 rounded-md bg-white/10 px-2 py-1 text-xs font-semibold ring-1 ring-white/10">
            {trAuctionStatus(auction.status)}
          </span>
        </div>
      </section>

      {/* bilgi + teklif paneli */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid gap-3">
          <h1 className="text-2xl font-extrabold">{auction.title ?? `Mezat #${auction.id}`}</h1>
          {sellerUsername && (
            <div className="text-sm text-neutral-400">
              Satıcı:{" "}
              <Link
                href={me?.username === sellerUsername ? "/me" : `/u/${sellerUsername}`}
                className="text-sky-400 hover:underline"
              >
                @{sellerUsername}
              </Link>
            </div>
          )}
          <p className="text-sm text-neutral-400">{auction.description ?? "Açıklama bulunmuyor."}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <Info label="Marka" value={auction.brand ?? "-"} />
            <Info label="Model" value={auction.model ?? "-"} />
            <Info label="Konum" value={auction.location ?? "-"} />
            <Info label="Başlangıç" value={`${Number(auction.startPrice).toFixed(2)} ${auction.currency}`} />
            <Info label="En yüksek" value={auction.highestBidAmount ? `${Number(auction.highestBidAmount).toFixed(2)} ${auction.currency}` : "-"} />
            <Info label="Bitiş" value={formatDateTime(auction.endsAt)} />
          </div>
        </div>

        {/* teklif ver */}
        <div className="rounded-2xl border border-white/10 p-4 bg-neutral-900 grid gap-3">
          <div className="text-sm text-neutral-400">Minimum sonraki teklif</div>
          <div className="text-2xl font-extrabold">
            {minNext.toFixed(2)} {auction.currency}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={dec} className="h-9 w-9 rounded-md bg-white/10">-</button>
            <input
              className="flex-1 h-9 rounded-md bg-neutral-800 px-3"
              type="number"
              step={10}
              min={minNext}
              value={amount || minNext}
              onChange={(e)=> setAmount(Math.max(minNext, Number(e.target.value || minNext)))}
            />
            <button onClick={inc} className="h-9 w-9 rounded-md bg-white/10">+</button>
          </div>

          <button
            onClick={submit}
            disabled={mBid.isPending}
            className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Teklif Ver
          </button>

          {mBid.isError && <p className="text-xs text-red-400">Teklif gönderilemedi.</p>}
        </div>
      </section>

      {/* teklifler listesi */}
      <section className="rounded-2xl border border-white/10 p-4">
        <h2 className="text-lg font-bold mb-3">Teklifler</h2>
        <div className="grid gap-2">
          {(bids ?? []).map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
              {b.bidder?.username ? (
                <Link href={`/u/${b.bidder.username}`} className="flex items-center gap-3">
                  <img
                    src={b.bidder?.avatarUrl ?? "/avatar-placeholder.png"}
                    className="h-8 w-8 rounded-full object-cover"
                    alt={b.bidder?.username ?? "user"}
                  />
                  <div className="text-sm">
                    <div className="font-semibold">
                      {b.bidder?.displayName ?? b.bidder?.username}
                    </div>
                    <div className="text-xs text-neutral-400">{formatDateTime(b.createdAt)}</div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <img
                    src={b.bidder?.avatarUrl ?? "/avatar-placeholder.png"}
                    className="h-8 w-8 rounded-full object-cover"
                    alt={b.bidder?.username ?? "user"}
                  />
                  <div className="text-sm">
                    <div className="font-semibold">
                      {b.bidder?.displayName ?? b.bidder?.username ?? `Kullanıcı ${b.bidderUserId}`}
                    </div>
                    <div className="text-xs text-neutral-400">{formatDateTime(b.createdAt)}</div>
                  </div>
                </div>
              )}
              <div className="text-sm font-bold">{Number(b.amount).toFixed(2)} {auction.currency}</div>
            </div>
          ))}
          {!bids?.length && <p className="text-sm text-neutral-400">Henüz teklif yok.</p>}
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label:string; value:string }) {
  return (
    <div className="rounded-lg bg-white/5 px-3 py-2">
      <div className="text-xs text-neutral-400">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
