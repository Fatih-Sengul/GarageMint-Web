"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

type ListingImage = { url: string; idx?: number };
type Listing = {
  id: number;
  title: string;
  brandName?: string;
  seriesName?: string;
  modelName?: string;
  price?: number;
  currency?: string;
  images?: ListingImage[];
};

type PageResponse = {
  content: Listing[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page
};

const THEME_BY_SLUG: Record<string, string> = {
  "fast-and-furious": "Fast & Furious",
  jdm: "JDM",
  "bond-007": "007",
  "euro-legends": "Euro",
  "usdm-muscle": "USDM",
  rally: "Rally",
  lemans: "Le Mans",
  supercars: "Supercar",
  "movie-cars": "Movie Car",
  classic: "Classic",
};

// Basit fiyat yazımı
const fmtPrice = (p?: number, c?: string) =>
  typeof p === "number" ? `${p} ${c ?? ""}` : "";

export default function ClientView({ slug, pageIdx }: { slug: string; pageIdx: number }) {
  const [data, setData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const title = useMemo(() => {
    // Başlık: map’te varsa onu kullan, yoksa slug’ı başlık formatla
    return THEME_BY_SLUG[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  }, [slug]);

  useEffect(() => {
    let canceled = false;

    async function run() {
      try {
        setLoading(true);
        setErr(null);

        const theme = THEME_BY_SLUG[slug];

        // 1) THEME ile ara (varsa)
        if (theme) {
          const url = new URL(`${API_BASE}/api/v1/cars/listings`);
          url.searchParams.set("theme", theme);
          url.searchParams.set("status", "ACTIVE");
          url.searchParams.set("page", String(pageIdx));
          url.searchParams.set("size", "24");
          url.searchParams.set("sortBy", "createdAt");
          url.searchParams.set("sortDir", "DESC");

          const res = await fetch(url.toString(), { cache: "no-store" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json: PageResponse = await res.json();
          if (!canceled) setData(json);
          return;
        }

        // 2) Tag slug çöz (yoksa): /tags -> /listings?tagIds=...
        const tagsRes = await fetch(`${API_BASE}/api/v1/cars/tags`, { cache: "no-store" });
        if (!tagsRes.ok) throw new Error(`Tags HTTP ${tagsRes.status}`);
        const tags: { id: number; name: string; slug: string }[] = await tagsRes.json();
        const tag = tags.find((t) => t.slug.toLowerCase() === slug.toLowerCase());

        const url = new URL(`${API_BASE}/api/v1/cars/listings`);
        if (tag) url.searchParams.set("tagIds", String(tag.id));
        else url.searchParams.set("theme", title); // son çare: slug->başlık theme olarak dene
        url.searchParams.set("status", "ACTIVE");
        url.searchParams.set("page", String(pageIdx));
        url.searchParams.set("size", "24");
        url.searchParams.set("sortBy", "createdAt");
        url.searchParams.set("sortDir", "DESC");

        const res2 = await fetch(url.toString(), { cache: "no-store" });
        if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
        const json2: PageResponse = await res2.json();
        if (!canceled) setData(json2);
      } catch (e: unknown) {
        if (!canceled) {
          const message = e instanceof Error ? e.message : "Beklenmeyen hata";
          setErr(message);
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    run();
    return () => {
      canceled = true;
    };
  }, [slug, pageIdx, title]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* HERO mini */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <nav className="text-sm">
            <Link href="/" className="text-sky-400 hover:underline">
              Anasayfa
            </Link>
            <span className="mx-2 text-neutral-500">/</span>
            <Link href="/collections" className="text-sky-400 hover:underline">
              Koleksiyonlar
            </Link>
            <span className="mx-2 text-neutral-500">/</span>
            <span className="text-neutral-300">{title}</span>
          </nav>
          <h1 className="mt-2 text-3xl font-extrabold">{title}</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Bu temaya ait aktif ilanlar.
          </p>
        </div>
      </section>

      {/* STATE’ler */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        {loading && <div className="text-sm text-neutral-400">Yükleniyor…</div>}
        {err && (
          <div className="text-sm text-red-400">
            Hata: {err} — Daha sonra tekrar deneyin.
          </div>
        )}
        {!loading && !err && data && data.content.length === 0 && (
          <div className="text-sm text-neutral-400">
            Bu koleksiyon için aktif ilan bulunamadı.
          </div>
        )}

        {/* GRID */}
        {data && data.content.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.content.map((t) => (
                <article
                  key={t.id}
                  className="group overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={
                        t.images?.[0]?.url ??
                        "https://picsum.photos/seed/fallback/800/600"
                      }
                      alt={t.title}
                      className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    {(t.brandName || t.seriesName) && (
                      <span className="absolute top-2 left-2 rounded-md bg-gradient-to-r from-sky-400 to-blue-600 text-white text-xs font-bold px-2 py-1 shadow-sm ring-1 ring-white/30">
                        {t.brandName ?? t.seriesName}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold line-clamp-1">{t.title}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                      {t.modelName ?? t.seriesName ?? ""}
                    </p>
                    <p className="mt-1 text-sm">
                      {fmtPrice(t.price, t.currency)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Basit sayfalama (ileri/geri) */}
            <div className="mt-6 flex items-center justify-center gap-3">
              {pageIdx > 0 && (
                <Link
                  href={`/collections/${slug}?page=${pageIdx - 1}`}
                  className="rounded-lg border border-neutral-300 dark:border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
                >
                  ← Önceki
                </Link>
              )}
              {data.number + 1} / {data.totalPages || 1}
              {data.number + 1 < data.totalPages && (
                <Link
                  href={`/collections/${slug}?page=${pageIdx + 1}`}
                  className="rounded-lg border border-neutral-300 dark:border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
                >
                  Sonraki →
                </Link>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

