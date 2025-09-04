"use client";
import { useEffect, useState } from "react";
import { formatTRY, toMinBid } from "@/lib/format";
import { usePlaceBid } from "@/lib/queries/auction";
import type { AuctionResponseDto } from "@/lib/types/auction";
import { useToast } from "@/components/ui/toast";

export default function BidForm({ auction }: { auction: AuctionResponseDto }) {
  const highest = auction.highestBidAmount ? Number(auction.highestBidAmount) : null;
  const start = Number(auction.startPrice);
  const min = toMinBid(start, highest);
  const [amount, setAmount] = useState<number>(min);
  const m = usePlaceBid(auction.id);
  const { push } = useToast();

  useEffect(() => {
    // auction güncellendiğinde min değişebilir
    const newMin = toMinBid(Number(auction.startPrice), auction.highestBidAmount ? Number(auction.highestBidAmount) : null);
    setAmount((prev) => (prev < newMin ? newMin : prev));
  }, [auction.startPrice, auction.highestBidAmount]);

  const disabled = auction.status !== "ACTIVE";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < min) return;
    m.mutate(
      { amount: amount.toString() },
      {
        onSuccess: () => {
          push({ type: "success", title: "Teklif verildi", description: `${formatTRY(amount)} ile teklifiniz alındı.` });
        },
        onError: (err) => {
          push({ type: "error", title: "Teklif başarısız", description: err instanceof Error ? err.message : "Hata oluştu" });
        },
      }
    );
  };

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-[1fr_auto] gap-3">
      <div>
        <label className="text-xs text-neutral-400">Minimum tutar</label>
        <input
          type="number"
          min={min}
          step={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2 outline-none"
        />
        <p className="mt-1 text-xs text-neutral-500">En az {formatTRY(min)} teklif verebilirsiniz.</p>
      </div>
      <button
        type="submit"
        disabled={disabled || m.isPending}
        className="h-10 self-end rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 text-white font-semibold disabled:opacity-60"
      >
        {disabled ? "Aktif Değil" : m.isPending ? "Gönderiliyor…" : "Teklif Ver"}
      </button>
    </form>
  );
}
