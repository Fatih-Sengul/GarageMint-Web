"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { usePublicListing } from "@/lib/queries/listings";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const listingId = Number(id);
  const { data, isLoading, isError } = usePublicListing(listingId);

  if (isLoading)
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-400">
        Yükleniyor…
      </div>
    );
  if (isError || !data)
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">İlan bulunamadı.</div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6">
      <nav className="text-sm">
        <Link href="/" className="text-sky-400 hover:underline">
          Anasayfa
        </Link>
        <span className="mx-2 text-neutral-500">/</span>
        <Link href="/listings" className="text-sky-400 hover:underline">
          İlanlar
        </Link>
        <span className="mx-2 text-neutral-500">/</span>
        <span className="text-neutral-300">{data.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Görsel */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-white/10 bg-neutral-900">
          <img
            src={
              data.images?.[0]?.url ??
              "https://picsum.photos/seed/fallback/1200/800"
            }
            alt={data.title}
            className="w-full h-[360px] object-cover"
          />
        </div>

        {/* Right */}
        <aside className="rounded-2xl border border-white/10 bg-neutral-900 p-5 grid gap-3">
          <h1 className="text-xl font-bold">{data.title}</h1>
          <div className="text-sm text-neutral-400">
            {(data.brandName || data.modelName) && (
              <div>
                {[data.brandName, data.modelName].filter(Boolean).join(" • ")}
              </div>
            )}
            {data.location && <div>Konum: {data.location}</div>}
          </div>
          {data.type === "SALE" && data.price != null && (
            <div className="text-2xl font-extrabold mt-2">
              {data.price} {data.currency ?? "TRY"}
            </div>
          )}
          {data.seller?.username && (
            <Link
              href={`/u/${data.seller.username}`}
              className="mt-2 inline-flex items-center gap-2 text-sm text-sky-400 hover:underline"
            >
              {data.seller.avatarUrl && (
                <img
                  src={data.seller.avatarUrl}
                  alt={data.seller.username}
                  className="h-6 w-6 rounded-full object-cover"
                />
              )}
              {data.seller.displayName ?? data.seller.username}
            </Link>
          )}
        </aside>
      </div>

      {data.description && (
        <section className="rounded-2xl border border-white/10 bg-neutral-900 p-5">
          <h2 className="text-lg font-semibold mb-2">Açıklama</h2>
          <p className="text-sm text-neutral-300 whitespace-pre-line">
            {data.description}
          </p>
        </section>
      )}
    </div>
  );
}
