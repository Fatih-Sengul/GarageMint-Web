"use client";

import Link from "next/link";
import type { ListingResponseDto } from "@/lib/types/listing";

export default function ListingCard({ it }: { it: ListingResponseDto }) {
    const img = it.images?.[0]?.url ?? "/listing-placeholder.jpg";
    const isTrade = it.type === "TRADE";
    const badge = isTrade ? "Takas" : (it.price ? `${formatMoney(it.price, it.currency)}` : "Satış");

    return (
        <Link href={`/listings/${it.id}`} className="group block overflow-hidden rounded-xl border border-white/10 bg-neutral-900 hover:border-white/20">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={it.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                <div className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-semibold text-white shadow">
                    {it.brandName ?? "—"}
                </div>
            </div>
            <div className="space-y-1 p-3">
                <div className="line-clamp-1 font-semibold">{it.title}</div>
                <div className="text-xs text-neutral-400">
                    {(it.modelName ?? it.seriesName ?? it.theme ?? "").toString()}
                    {it.scale ? ` • ${it.scale}` : ""}
                    {it.modelYear ? ` • ${it.modelYear}` : ""}
                </div>
                <div className="flex items-center justify-between pt-1">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${isTrade ? "bg-violet-500/15 text-violet-300" : "bg-emerald-500/15 text-emerald-300"}`}>
                        {badge}
                    </span>
                    {it.location && <span className="text-xs text-neutral-400">{it.location}</span>}
                </div>
                {it.seller?.username && (
                    <div className="mt-1 text-xs text-neutral-400">
                        Satıcı:{" "}
                        <Link
                            href={`/u/${it.seller.username}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sky-400 hover:underline"
                        >
                            @{it.seller.username}
                        </Link>
                    </div>
                )}
            </div>
        </Link>
    );
}

function formatMoney(v: number | string | null | undefined, cur?: string | null) {
    const n = typeof v === "string" ? Number(v) : v ?? 0;
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: cur ?? "TRY", maximumFractionDigits: 0 }).format(n);
}
