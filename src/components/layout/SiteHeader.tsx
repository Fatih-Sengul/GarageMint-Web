import Link from "next/link";
import {
    UserCircleIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-neutral-950/60 border-b border-neutral-200 dark:border-white/10">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
                {/* Marka */}
                <Link href="/" className="flex items-center gap-2" aria-label="Anasayfa">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 shadow-sm ring-1 ring-white/40 dark:ring-white/10" />
                    <span className="font-extrabold tracking-tight text-xl">GarageMint</span>
                </Link>

                {/* Orta menü */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                    <Link className="hover:text-neutral-900 dark:hover:text-white" href="/listings">Keşfet</Link>
                    <Link className="hover:text-neutral-900 dark:hover:text-white" href="/collections">Koleksiyonlar</Link>
                    <Link className="hover:text-neutral-900 dark:hover:text-white" href="/sell">Satış</Link>
                    <Link className="hover:text-neutral-900 dark:hover:text-white" href="/auctions">Mezat</Link>
                    <Link className="hover:text-neutral-900 dark:hover:text-white" href="/about">Hakkımızda</Link>
                </nav>

                {/* Sağ aksiyonlar */}
                <div className="flex items-center gap-3">
                    <div
                        role="search"
                        className="hidden sm:flex items-center gap-2 rounded-full border border-neutral-200 dark:border-white/10 px-3 py-1.5 bg-white/60 dark:bg-white/5"
                    >
                        <MagnifyingGlassIcon className="h-4 w-4 text-neutral-500 dark:text-neutral-400" aria-hidden />
                        <input
                            placeholder="Modeller, markalar ara…"
                            className="bg-transparent outline-none text-sm w-48 placeholder:text-neutral-400"
                            aria-label="Arama"
                        />
                    </div>
                    <Link
                        href="/me"
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-white/10"
                        title="Profilim"
                        aria-label="Profilim"
                    >
                        <UserCircleIcon className="h-5 w-5" aria-hidden />
                        <span className="hidden sm:inline">Profilim</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
