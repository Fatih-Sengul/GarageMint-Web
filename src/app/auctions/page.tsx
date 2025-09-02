"use client";
import Link from "next/link";
import { useAuctions } from "@/lib/queries/auction";
import AuctionCard from "@/components/auction/AuctionCard";

export default function AuctionsPage() {
  const { data, isLoading, isError } = useAuctions();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6">
      {/* breadcrumb */}
      <nav className="text-sm">
        <Link href="/" className="text-sky-400 hover:underline">Anasayfa</Link>
        <span className="mx-2 text-neutral-500">/</span>
        <span className="text-neutral-300">Mezat</span>
      </nav>

      {/* başlık + CTA */}
      <header className="relative z-10 flex flex-wrap items-end gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold">Mezatlar</h1>
          <p className="text-sm text-neutral-400">
            Buradan açık artırmalara katıl, koleksiyonunu büyütürken rekabetin keyfini yaşa. 
            Minimum teklif artışı <b>10 TL</b>’dir; son teklifi en az 10 TL geçmen gerekir.
          </p>
        </div>

        <Link
          href="/auctions/new"
          className="ml-auto inline-flex shrink-0 rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow ring-1 ring-white/30 hover:opacity-95"
        >
          Yeni Mezat Oluştur
        </Link>
      </header>

      {isLoading && <p className="text-sm text-neutral-400">Yükleniyor…</p>}
      {isError && <p className="text-sm text-red-400">Mezatlar alınamadı.</p>}

      {data?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((a) => <AuctionCard key={a.id} a={a} />)}
        </div>
      ) : (
        !isLoading && <p className="text-sm text-neutral-400">Şu an aktif mezat yok.</p>
      )}
    </div>
  );
}
