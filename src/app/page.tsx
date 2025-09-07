import Link from "next/link";
import {
    ShieldCheckIcon,
    FireIcon,
    StarIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { API_BASE } from "@/lib/api";
import { formatCountdown } from "@/lib/utils/time";

async function getLatestListings() {
    const r = await fetch(
        `${API_BASE}/api/v1/listings?size=4&sortBy=createdAt&sortDir=DESC`,
        { cache: "no-store" }
    );
    const data = await r.json();
    return data?.content ?? [];
}

async function getLatestAuctions() {
    const r = await fetch(
        `${API_BASE}/api/v1/auctions?size=4&sortBy=createdAt&sortDir=DESC`,
        { cache: "no-store" }
    );
    const data = await r.json();
    return data?.content ?? [];
}

export default async function HomePage() {
    const listings = await getLatestListings();
    const auctions = await getLatestAuctions();

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
            {/* HERO */}
            <section className="relative border-b border-neutral-200 dark:border-white/10">
                {/* Arka plan: foto + mavi tonlu karartma */}
                <div
                    className="h-[520px] bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(2,132,199,.25), rgba(2,132,199,.45)), url('https://images.unsplash.com/photo-1520975922284-5f7f83a43dfd?q=80&w=1800&auto=format&fit=crop')",
                    }}
                    aria-hidden
                />
                {/* Parıltı efektleri */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-24 -left-16 w-[60%] h-64 rotate-[12deg] bg-gradient-to-r from-white/25 to-transparent blur-2xl" />
                    <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 bg-sky-500/20 blur-3xl rounded-full" />
                </div>

                {/* İçerik */}
                <div className="absolute inset-0 grid place-items-center">
                    <div className="mx-auto max-w-6xl px-4 text-white">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-500/90 to-blue-600/90 px-3 py-1 text-xs font-bold tracking-wide shadow-sm ring-1 ring-white/30">
              Koleksiyonunu Vitrine Çıkar • Güvenle Ticaret Yap • Topluluğa Katıl
            </span>

                        <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight">
                            Premium die-cast koleksiyonunu
                            <br className="hidden sm:block" /> inşa et, sergile ve takas et.
                        </h1>

                        <p className="mt-3 max-w-2xl text-base sm:text-lg text-white/90">
                            GarageMint: Sadece minyatür değil, <b>hikâye</b>. Sınırlı
                            üretimler, nadir parçalar ve koleksiyoner kalitesinde ilanlar tek
                            bir yerde.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            {/* Primary CTA */}
                            <Link
                                href="/listings"
                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-95 ring-1 ring-white/30"
                            >
                                Takasları Gör
                                <ArrowRightIcon className="h-4 w-4" aria-hidden />
                            </Link>

                            {/* Secondary CTA */}
                            <Link
                                href="/me"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/60 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                            >
                                Profil Oluştur
                            </Link>
                        </div>

                        {/* Rozetler */}
                        <div className="mt-5 space-y-2">
                            <div className="flex flex-wrap gap-2">
                                {[
                                    "Sınırlı Üretim",
                                    "Nadir Parçalar",
                                    "Özel Seri",
                                    "Mint Durum",
                                    "Collector Grade",
                                ].map((b) => (
                                    <span
                                        key={b}
                                        className="rounded-full border border-sky-300/40 bg-sky-400/20 px-3 py-1 text-xs font-semibold backdrop-blur text-white/90"
                                    >
                    {b}
                  </span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {["JDM", "Euro", "USDM", "Klasik", "Ralli", "Supercar"].map(
                                    (b) => (
                                        <span
                                            key={b}
                                            className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur"
                                        >
                      {b}
                    </span>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DEĞER ÖNERİLERİ */}
            <section className="mx-auto max-w-6xl px-4 py-14">
                <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                    Neden GarageMint?
                </h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Feature
                        icon={
                            <ShieldCheckIcon
                                className="h-5 w-5 text-sky-600 dark:text-sky-400"
                                aria-hidden
                            />
                        }
                        title="Doğrulanmış profiller"
                        desc="Topluluk güveni için doğrulanmış satıcılar ve koleksiyoner rozetleri."
                    />
                    <Feature
                        icon={
                            <FireIcon
                                className="h-5 w-5 text-sky-600 dark:text-sky-400"
                                aria-hidden
                            />
                        }
                        title="Trend yayınlar"
                        desc="Nadir modeller, sınırlı üretimler ve sıcak ‘drop’lar akışta öne çıkar."
                    />
                    <Feature
                        icon={
                            <StarIcon
                                className="h-5 w-5 text-sky-600 dark:text-sky-400"
                                aria-hidden
                            />
                        }
                        title="Profesyonel ilanlar"
                        desc="Zengin kartlar, galeri, etiketler, marka/seri bilgileri ve daha fazlası."
                    />
                </div>
            </section>

            {/* TREND GRID */}
            <section className="mx-auto max-w-6xl px-4 pb-16">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                        Şu An Trend Olan Takas / Satış İlanları
                    </h2>
                    <Link
                        href="/listings"
                        className="text-sm font-semibold text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
                    >
                        Tümünü gör →
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {listings.map((l: any) => (
                        <article
                            key={l.id}
                            className="group overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="relative">
                                <img
                                    src={l.images?.[0]?.url ?? `https://picsum.photos/seed/listing${l.id}/1200/800`}
                                    alt={`${l.brandName ?? ""} – ${l.title}`}
                                    className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                                {l.brandName && (
                                    <span className="absolute top-2 left-2 rounded-md bg-gradient-to-r from-sky-400 to-blue-600 text-white text-xs font-bold px-2 py-1 shadow-sm ring-1 ring-white/30">
                                        {l.brandName}
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold">{l.title}</h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {l.type === "TRADE" ? "Takas" : l.price ? `${l.price} ${l.currency ?? ""}` : "Satış"}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* NEW AUCTIONS GRID */}
            <section className="mx-auto max-w-6xl px-4 pb-16">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                        Yeni Gelen Mezatlar
                    </h2>
                    <Link
                        href="/auctions"
                        className="text-sm font-semibold text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
                    >
                        Tümünü gör →
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {auctions.map((a: any) => (
                        <article
                            key={a.id}
                            className="group overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="relative">
                                <img
                                    src={a.coverUrl ?? `https://picsum.photos/seed/auction${a.id}/1200/800`}
                                    alt={`auction-${a.id}`}
                                    className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                                <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                                    {formatCountdown(a.endsAt)}
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold">Başlangıç {Number(a.startPrice).toFixed(2)} {a.currency}</h3>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

        </div>
    );
}

/* ---------- Yardımcı Bileşen ---------- */
function Feature({
                     icon,
                     title,
                     desc,
                 }: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) {
    return (
        <div className="rounded-2xl border border-neutral-200 dark:border:white/10 p-5 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 dark:border-white/10 bg-gradient-to-br from-sky-400/20 to-blue-600/20">
                    {icon}
                </div>
                <h3 className="font-bold">{title}</h3>
            </div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {desc}
            </p>
        </div>
    );
}
