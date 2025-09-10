"use client";

import { useSearchParams } from "next/navigation";
import ListingCard from "@/components/listings/ListingCard";
import { useListings } from "@/lib/queries/listings";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") ?? "";
    const { data, isLoading, isError } = useListings({ q });

    return (
        <main className="mx-auto w-full max-w-[1200px] px-4 py-6 space-y-6">
            <header className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight">Arama</h1>
                {q && <p className="text-sm text-neutral-400">"{q}" için sonuçlar</p>}
            </header>

            {isLoading && <div className="text-neutral-400">Yükleniyor…</div>}
            {isError && <div className="text-rose-400">Bir hata oluştu.</div>}

            {!isLoading && !data?.content?.length && (
                <div className="text-neutral-400">Hiç sonuç bulunamadı.</div>
            )}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {data?.content?.map((it) => (
                    <ListingCard key={it.id} it={it} />
                ))}
            </div>
        </main>
    );
}

