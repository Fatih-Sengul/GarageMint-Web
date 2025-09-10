"use client";
import Link from "next/link";
import { useState } from "react";
import {
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/lib/auth/store";
import SignupPromptModal from "@/components/auth/SignupPromptModal";
import NavAuth from "./NavAuth";

export default function SiteHeader() {
    const isAuthed = useAuthStore((s) => s.isAuthed());
    const [showModal, setShowModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleAuctionsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setMenuOpen(false);
        if (!isAuthed) {
            e.preventDefault();
            setShowModal(true);
        }
    };

    return (
        <>
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
                        <Link className="hover:text-neutral-900 dark:hover:text-white" href="/auctions" onClick={handleAuctionsClick}>Mezat</Link>
                        <Link className="hover:text-neutral-900 dark:hover:text-white" href="/about">Hakkımızda</Link>
                    </nav>

                    {/* Sağ aksiyonlar */}
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-white/10"
                            onClick={() => setMenuOpen(true)}
                            aria-label="Menüyü aç"
                        >
                            <Bars3Icon className="h-6 w-6" aria-hidden />
                        </button>
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
                        <NavAuth />
                    </div>
                </div>
            </header>
            <SignupPromptModal open={showModal} onClose={() => setShowModal(false)} />
            {menuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMenuOpen(false)}
                        aria-hidden
                    />
                    <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-neutral-900 p-4 shadow-xl">
                        <button
                            className="mb-4 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-white/10"
                            onClick={() => setMenuOpen(false)}
                            aria-label="Menüyü kapat"
                        >
                            <XMarkIcon className="h-6 w-6" aria-hidden />
                        </button>
                        <nav className="flex flex-col gap-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            <Link
                                className="hover:text-neutral-900 dark:hover:text-white"
                                href="/listings"
                                onClick={() => setMenuOpen(false)}
                            >
                                Keşfet
                            </Link>
                            <Link
                                className="hover:text-neutral-900 dark:hover:text-white"
                                href="/collections"
                                onClick={() => setMenuOpen(false)}
                            >
                                Koleksiyonlar
                            </Link>
                            <Link
                                className="hover:text-neutral-900 dark:hover:text-white"
                                href="/sell"
                                onClick={() => setMenuOpen(false)}
                            >
                                Satış
                            </Link>
                            <Link
                                className="hover:text-neutral-900 dark:hover:text-white"
                                href="/auctions"
                                onClick={handleAuctionsClick}
                            >
                                Mezat
                            </Link>
                            <Link
                                className="hover:text-neutral-900 dark:hover:text-white"
                                href="/about"
                                onClick={() => setMenuOpen(false)}
                            >
                                Hakkımızda
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
