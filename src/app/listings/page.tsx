"use client";

import { useMemo, useState } from "react";
import { useListingsSearch, type ListingsSearchParams } from "@/lib/queries/listings";
import ListingCard from "@/components/listings/ListingCard";
import ListingFilters, { type Filters } from "@/components/listings/ListingFilters";

export default function ListingsPage() {
    const [params, setParams] = useState<ListingsSearchParams>({
        page: 0, size: 24, sortBy: "createdAt", sortDir: "DESC",
    });

    const { data, isLoading, isError } = useListingsSearch(params);
    const page = data?.number ?? 0;
    const totalPages = data?.totalPages ?? 0;

    const filters: Filters = useMemo(() => ({
        type: params.type, priceMin: params.priceMin, priceMax: params.priceMax,
        sortBy: params.sortBy, sortDir: params.sortDir, size: params.size
    }), [params]);

    return (
        <main className="mx-auto w-full max-w-[1200px] px-4 py-6 space-y-6">
            <header className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight">İlanlar</h1>
                <p className="text-sm text-neutral-400">En güncel modelleri keşfedin</p>
            </header>

            <ListingFilters
                value={filters}
                onChangeAction={(f: Filters) =>
                    setParams((s) => ({ ...s, ...f, page: 0 }))
                }
            />

            {isLoading && <div className="text-neutral-400">Yükleniyor…</div>}
            {isError && <div className="text-rose-400">Bir hata oluştu.</div>}

            {!isLoading && !data?.content?.length && (
                <div className="text-neutral-400">Hiç ilan bulunamadı.</div>
            )}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {data?.content?.map((it) => <ListingCard key={it.id} it={it} />)}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        disabled={page <= 0}
                        onClick={() => setParams((s) => ({ ...s, page: Math.max(0, (s.page ?? 0) - 1) }))}
                        className="rounded-lg border border-white/15 px-3 py-1.5 text-sm disabled:opacity-50"
                    >
                        ← Önceki
                    </button>
                    <span className="text-sm text-neutral-400">
                        Sayfa {page + 1} / {totalPages}
                    </span>
                    <button
                        disabled={page + 1 >= totalPages}
                        onClick={() => setParams((s) => ({ ...s, page: (s.page ?? 0) + 1 }))}
                        className="rounded-lg border border-white/15 px-3 py-1.5 text-sm disabled:opacity-50"
                    >
                        Sonraki →
                    </button>
                </div>
            )}
        </main>
    );
}
