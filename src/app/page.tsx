"use client";

import Link from "next/link";
import {
    UserCircleIcon,
    MagnifyingGlassIcon,
    RocketLaunchIcon,
    ShieldCheckIcon,
    FireIcon,
    StarIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

// Örnek "trend" verileri (dummy)
const trending = [
    { id: 1, title: "Nissan Skyline GT-R R34", brand: "Hot Wheels", price: "₺6.499", img: "https://picsum.photos/seed/diecast1/1200/800" },
    { id: 2, title: "Porsche 911 GT3 RS", brand: "Tarmac Works", price: "₺4.999", img: "https://picsum.photos/seed/diecast2/1200/800" },
    { id: 3, title: "Honda NSX Type-R", brand: "INNO64", price: "₺4.299", img: "https://picsum.photos/seed/diecast3/1200/800" },
    { id: 4, title: "Toyota Supra MK4", brand: "Hot Wheels Premium", price: "₺5.299", img: "https://picsum.photos/seed/diecast4/1200/800" },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
            {/* NAVBAR */}

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

                {/* Parıltı/Gloss efektleri */}
                <div className="pointer-events-none absolute inset-0">
                    {/* Diagonal light streak */}
                    <div className="absolute -top-24 -left-16 w-[60%] h-64 rotate-[12deg] bg-gradient-to-r from-white/25 to-transparent blur-2xl" />
                    {/* Soft blue bloom */}
                    <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 bg-sky-500/20 blur-3xl rounded-full" />
                </div>

                {/* İçerik */}
                <div className="absolute inset-0 grid place-items-center">
                    <div className="mx-auto max-w-6xl px-4 text-white">
                        {/* Yaratıcı, kapsayıcı slogan */}
                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-500/90 to-blue-600/90 px-3 py-1 text-xs font-bold tracking-wide shadow-sm ring-1 ring-white/30">
              Koleksiyonunu Vitrine Çıkar • Güvenle Ticaret Yap • Topluluğa Katıl
            </span>

                        <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight">
                            Premium die-cast koleksiyonunu
                            <br className="hidden sm:block" /> inşa et, sergile ve takas et.
                        </h1>

                        <p className="mt-3 max-w-2xl text-base sm:text-lg text-white/90">
                            GarageMint: Sadece minyatür değil, <b>hikâye</b>. Sınırlı üretimler, nadir parçalar ve
                            koleksiyoner kalitesinde ilanlar tek bir yerde.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            {/* Primary CTA – mavi parlak */}
                            <Link
                                href="/listings"
                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-95 ring-1 ring-white/30"
                            >
                                Takasları Gör
                                <ArrowRightIcon className="h-4 w-4" aria-hidden />
                            </Link>

                            {/* Secondary CTA – gri çizgili */}
                            <Link
                                href="/me"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/60 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                            >
                                <RocketLaunchIcon className="h-4 w-4" aria-hidden />
                                Profil Oluştur
                            </Link>
                        </div>

                        {/* Tematik rozetler – mavi aksanlı */}
                        <div className="mt-5 space-y-2">
                            <div className="flex flex-wrap gap-2">
                                {["Sınırlı Üretim", "Nadir Parçalar", "Özel Seri", "Mint Durum", "Collector Grade"].map((b) => (
                                    <span
                                        key={b}
                                        className="rounded-full border border-sky-300/40 bg-sky-400/20 px-3 py-1 text-xs font-semibold backdrop-blur text-white/90"
                                    >
                    {b}
                  </span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {["JDM", "Euro", "USDM", "Klasik", "Ralli", "Supercar"].map((b) => (
                                    <span
                                        key={b}
                                        className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur"
                                    >
                    {b}
                  </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DEĞER ÖNERİLERİ */}
            <section className="mx-auto max-w-6xl px-4 py-14">
                <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Neden GarageMint?</h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Feature
                        icon={<ShieldCheckIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" aria-hidden />}
                        title="Doğrulanmış profiller"
                        desc="Topluluk güveni için doğrulanmış satıcılar ve koleksiyoner rozetleri."
                    />
                    <Feature
                        icon={<FireIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" aria-hidden />}
                        title="Trend yayınlar"
                        desc="Nadir modeller, sınırlı üretimler ve sıcak ‘drop’lar akışta öne çıkar."
                    />
                    <Feature
                        icon={<StarIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" aria-hidden />}
                        title="Profesyonel ilanlar"
                        desc="Zengin kartlar, galeri, etiketler, marka/seri bilgileri ve daha fazlası."
                    />
                </div>
            </section>

            {/* TREND GRID */}
            <section className="mx-auto max-w-6xl px-4 pb-16">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Şu an trend olanlar</h2>
                    <Link
                        href="/listings"
                        className="text-sm font-semibold text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
                    >
                        Tümünü gör →
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {trending.map((t) => (
                        <article
                            key={t.id}
                            className="group overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="relative">
                                <img
                                    src={t.img}
                                    alt={`${t.brand} – ${t.title}`}
                                    className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                                <span className="absolute top-2 left-2 rounded-md bg-gradient-to-r from-sky-400 to-blue-600 text-white text-xs font-bold px-2 py-1 shadow-sm ring-1 ring-white/30">
                  {t.brand}
                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold">{t.title}</h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">{t.price}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-neutral-200 dark:border-white/10 py-8 bg-white/60 dark:bg-white/[0.02] backdrop-blur">
                <div className="mx-auto max-w-6xl px-4 flex items-center justify-between flex-wrap gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <p>© {new Date().getFullYear()} GarageMint</p>
                    <nav className="flex gap-4">
                        <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white">Şartlar</Link>
                        <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white">Gizlilik</Link>
                        <Link href="/about" className="hover:text-neutral-900 dark:hover:text-white">Hakkımızda</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

/* --------- Yardımcı Bileşen --------- */
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
        <div className="rounded-2xl border border-neutral-200 dark:border-white/10 p-5 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 dark:border-white/10 bg-gradient-to-br from-sky-400/20 to-blue-600/20">
                    {icon}
                </div>
                <h3 className="font-bold">{title}</h3>
            </div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{desc}</p>
        </div>
    );
}
