"use client";
import Link from "next/link";
import { useAuctions } from "@/lib/queries/auction";
import AuctionCard from "@/components/auction/AuctionCard";

export default function AuctionsPage() {
  const { data, isLoading, isError } = useAuctions();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6">
      {/* Breadcrumb */}
      <nav className="text-sm">
        <Link href="/" className="text-sky-400 hover:underline">Anasayfa</Link>
        <span className="mx-2 text-neutral-500">/</span>
        <span className="text-neutral-300">Mezat</span>
      </nav>

      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Mezatlar</h1>
          <p className="text-sm text-neutral-500">Devam eden açık artırmalar</p>
        </div>
        <Link
          href="/auctions/new"
          className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Yeni Mezat
        </Link>
      </header>

      {isLoading && <p className="text-sm text-neutral-400">Yükleniyor…</p>}
      {isError && <p className="text-sm text-red-400">Mezatlar alınamadı.</p>}

      {data?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((a) => <AuctionCard key={a.id} a={a} />)}
        </div>
      ) : (
        !isLoading && <p className="text-sm text-neutral-400">Şu an aktif mezat yok.</p>
      )}
    </div>
  );
}
