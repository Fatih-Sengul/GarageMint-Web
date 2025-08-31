"use client";

import Link from "next/link";
import {
    UserCircleIcon,
    MagnifyingGlassIcon,
    RocketLaunchIcon,
    ShieldCheckIcon,
    FireIcon,
    StarIcon,
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
        <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
            {/* NAVBAR */}
            <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-neutral-950/70 border-b border-black/10 dark:border-white/10">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
                    {/* Marka */}
                    <Link href="/" className="flex items-center gap-2" aria-label="Anasayfa">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500" />
                        <span className="font-extrabold tracking-tight text-xl">GarageMint</span>
                    </Link>

                    {/* Orta menü */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600 dark:text-neutral-300">
                        <Link className="hover:text-black dark:hover:text-white" href="/listings">Keşfet</Link>
                        <Link className="hover:text-black dark:hover:text-white" href="/collections">Koleksiyonlar</Link>
                        <Link className="hover:text-black dark:hover:text-white" href="/sell">Satış Yap</Link>
                        <Link className="hover:text-black dark:hover:text-white" href="/about">Hakkımızda</Link>
                    </nav>

                    {/* Sağ aksiyonlar */}
                    <div className="flex items-center gap-3">
                        <label className="hidden sm:flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-3 py-1.5">
                            <MagnifyingGlassIcon className="h-4 w-4 opacity-70" aria-hidden />
                            <input
                                placeholder="Modeller, markalar ara…"
                                className="bg-transparent outline-none text-sm w-48"
                                aria-label="Arama"
                            />
                        </label>
                        <Link
                            href="/me"
                            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10"
                            title="Profilim"
                            aria-label="Profilim"
                        >
                            <UserCircleIcon className="h-5 w-5" aria-hidden />
                            <span className="hidden sm:inline">Profilim</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="relative border-b border-black/10 dark:border-white/10">
                <div
                    className="h-[520px] bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.6)), url('https://images.unsplash.com/photo-1520975922284-5f7f83a43dfd?q=80&w=1800&auto=format&fit=crop')",
                    }}
                    aria-hidden
                />
                <div className="absolute inset-0 grid place-items-center">
                    <div className="mx-auto max-w-6xl px-4 text-white">
                        {/* Yaratıcı, kapsayıcı etiket */}
                        <span className="inline-flex items-center rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold tracking-wide">
              Koleksiyonunu Vitrine Çıkar • Güvenle Ticaret Yap • Topluluğa Katıl
            </span>

                        <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight">
                            Premium die-cast koleksiyonunu
                            <br className="hidden sm:block" /> inşa et, sergile ve takas et.
                        </h1>

                        <p className="mt-3 max-w-2xl text-base sm:text-lg opacity-90">
                            GarageMint: Sadece minyatür değil, <b>hikâye</b>. Sınırlı üretimler, nadir parçalar ve
                            koleksiyoner kalitesinde ilanlar tek bir yerde.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            {/* İstenen şekilde: butonda SADECE bu metin */}
                            <Link
                                href="/listings"
                                className="inline-flex items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-semibold hover:opacity-90"
                            >
                                Takasları Gör
                            </Link>

                            <Link
                                href="/me"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/60 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                            >
                                <RocketLaunchIcon className="h-4 w-4" aria-hidden />
                                Profil Oluştur
                            </Link>
                        </div>

                        {/* Tematik rozetler – görsel zenginlik */}
                        <div className="mt-5 space-y-2">
                            <div className="flex flex-wrap gap-2">
                                {["Sınırlı Üretim", "Nadir Parçalar", "Özel Seri", "Mint Durum", "Collector Grade"].map((b) => (
                                    <span
                                        key={b}
                                        className="rounded-full border border-white/50 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur"
                                    >
                    {b}
                  </span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {["JDM", "Euro", "USDM", "Klasik", "Ralli", "Supercar"].map((b) => (
                                    <span
                                        key={b}
                                        className="rounded-full border border-white/50 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur"
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
                <h2 className="text-3xl font-extrabold">Neden GarageMint?</h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Feature
                        icon={<ShieldCheckIcon className="h-5 w-5" aria-hidden />}
                        title="Doğrulanmış profiller"
                        desc="Topluluk güveni için doğrulanmış satıcılar ve koleksiyoner rozetleri."
                    />
                    <Feature
                        icon={<FireIcon className="h-5 w-5" aria-hidden />}
                        title="Trend yayınlar"
                        desc="Nadir modeller, sınırlı üretimler ve sıcak ‘drop’lar akışta öne çıkar."
                    />
                    <Feature
                        icon={<StarIcon className="h-5 w-5" aria-hidden />}
                        title="Profesyonel ilanlar"
                        desc="Zengin kartlar, galeri, etiketler, marka/seri bilgileri ve daha fazlası."
                    />
                </div>
            </section>

            {/* TREND GRID */}
            <section className="mx-auto max-w-6xl px-4 pb-16">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-3xl font-extrabold">Şu an trend olanlar</h2>
                    <Link
                        href="/listings"
                        className="text-sm font-semibold text-gray-600 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                    >
                        Tümünü gör →
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {trending.map((t) => (
                        <article
                            key={t.id}
                            className="group overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900"
                        >
                            <div className="relative">
                                <img
                                    src={t.img}
                                    alt={`${t.brand} – ${t.title}`}
                                    className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                                <span className="absolute top-2 left-2 rounded-md bg-emerald-500/90 text-white text-xs font-bold px-2 py-1">
                  {t.brand}
                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold">{t.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-neutral-400">{t.price}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-black/10 dark:border-white/10 py-8">
                <div className="mx-auto max-w-6xl px-4 flex items-center justify-between flex-wrap gap-3 text-sm text-gray-600 dark:text-neutral-400">
                    <p>© {new Date().getFullYear()} GarageMint</p>
                    <nav className="flex gap-4">
                        <Link href="/terms" className="hover:text-black dark:hover:text-white">Şartlar</Link>
                        <Link href="/privacy" className="hover:text-black dark:hover:text-white">Gizlilik</Link>
                        <Link href="/about" className="hover:text-black dark:hover:text-white">Hakkımızda</Link>
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
        <div className="rounded-2xl border border-black/10 dark:border-white/10 p-5 bg-white dark:bg-neutral-900">
            <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full border border-black/10 dark:border-white/10">
                    {icon}
                </div>
                <h3 className="font-bold">{title}</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">{desc}</p>
        </div>
    );
}
