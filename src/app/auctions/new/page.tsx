"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useCreateAuction } from "@/lib/queries/auction";
import { useMyActiveListings } from "@/lib/queries/listings";
import type { AuctionCreateRequest } from "@/lib/types/auction";
import { useToast } from "@/components/ui/toast";
import { formatTRY } from "@/lib/format";

function toISO(datetimeLocal?: string | null) {
  if (!datetimeLocal) return null;
  // Safari uyumu için: "YYYY-MM-DDTHH:mm" -> new Date(...)
  const d = new Date(datetimeLocal);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default function NewAuctionPage() {
  const router = useRouter();
  const { push } = useToast();
  const m = useCreateAuction();
  const { data: myListings } = useMyActiveListings();

  // form state
  const [listingId, setListingId] = useState<number | "">("");
  const [startPrice, setStartPrice] = useState<number>(100);
  const [startsAt, setStartsAt] = useState<string>("");       // datetime-local
  const [durationDays, setDurationDays] = useState<number>(7); // 1..15

  const endsAtPreview = useMemo(() => {
    const base = startsAt ? new Date(startsAt) : new Date();
    const end = new Date(base.getTime() + durationDays * 24 * 3600 * 1000);
    return end.toLocaleString("tr-TR");
  }, [startsAt, durationDays]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (startPrice < 0.01) {
      push({ type: "error", title: "Başlangıç fiyatı geçersiz", description: "En az 0.01 TL olmalı." });
      return;
    }
    if (durationDays < 1 || durationDays > 15) {
      push({ type: "error", title: "Süre geçersiz", description: "Süre 1 ile 15 gün arasında olmalıdır." });
      return;
    }

    const startsAtIso = toISO(startsAt);              // null olursa backend NOW başlatır
    const base = startsAt ? new Date(startsAt) : new Date();
    const endsAtIso = new Date(base.getTime() + durationDays * 24 * 3600 * 1000).toISOString();

    const payload: AuctionCreateRequest = {
      listingId: listingId === "" ? null : Number(listingId),
      startPrice,
      startsAt: startsAtIso ?? undefined,
      endsAt: endsAtIso,
    };

    m.mutate(payload, {
      onSuccess: (res) => {
        push({ type: "success", title: "Mezat oluşturuldu", description: `#${res.id} başarıyla başlatıldı (${formatTRY(startPrice)}).` });
        router.push(`/auctions/${res.id}`);
      },
      onError: (err) => {
        push({
          type: "error",
          title: "Oluşturma başarısız",
          description: err instanceof Error ? err.message : "Bilinmeyen hata",
        });
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 grid gap-6">
      {/* Breadcrumb */}
      <nav className="text-sm">
        <Link href="/" className="text-sky-400 hover:underline">Anasayfa</Link>
        <span className="mx-2 text-neutral-500">/</span>
        <Link href="/auctions" className="text-sky-400 hover:underline">Mezat</Link>
        <span className="mx-2 text-neutral-500">/</span>
        <span className="text-neutral-300">Yeni</span>
      </nav>

      <header>
        <h1 className="text-2xl font-extrabold">Yeni Mezat Başlat</h1>
        <p className="text-sm text-neutral-500">Başlangıç fiyatı zorunlu; süre 1–15 gün arasında olmalı.</p>
      </header>

      <form onSubmit={onSubmit} className="rounded-2xl border border-neutral-200 dark:border-white/10 p-5 bg-white dark:bg-neutral-900 shadow-sm grid gap-4">
        {/* İlanla ilişkilendir (opsiyonel) */}
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">İlan (opsiyonel)</span>
          <select
            value={listingId}
            onChange={(e) => setListingId((e.target.value === "" ? "" : Number(e.target.value)) as any)}
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2"
          >
            <option value="">— İlan bağlama —</option>
            {(myListings ?? []).map((l) => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
          <span className="text-xs text-neutral-500">İsterseniz mezatı bir ilana bağlayabilirsiniz.</span>
        </label>

        {/* Başlangıç fiyatı */}
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Başlangıç Fiyatı (TRY)</span>
          <input
            type="number"
            min={0.01}
            step={1}
            value={startPrice}
            onChange={(e) => setStartPrice(Number(e.target.value))}
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        {/* Başlangıç zamanı (opsiyonel) */}
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Başlama Zamanı (opsiyonel)</span>
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2"
          />
          <span className="text-xs text-neutral-500">Boş bırakırsanız mezat hemen başlar.</span>
        </label>

        {/* Süre gün */}
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Süre (gün)</span>
          <select
            value={durationDays}
            onChange={(e) => setDurationDays(Number(e.target.value))}
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 px-3 py-2"
          >
            {Array.from({ length: 15 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <span className="text-xs text-neutral-500">Bitiş: <b>{endsAtPreview}</b></span>
        </label>

        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={m.isPending}
            className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {m.isPending ? "Oluşturuluyor…" : "Mezatı Başlat"}
          </button>

          <Link href="/auctions" className="text-sm text-neutral-400 hover:text-neutral-200">İptal</Link>
        </div>
      </form>

      <aside className="text-xs text-neutral-500">
        Kurallar: Süre <b>1–15 gün</b>, teklif artışı <b>≥ 10 TL</b>, satıcı kendi mezadına teklif veremez.
      </aside>
    </div>
  );
}

