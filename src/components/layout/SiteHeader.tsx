"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/lib/auth/store";
import SignupPromptModal from "@/components/auth/SignupPromptModal";
import NavAuth from "./NavAuth";

export default function SiteHeader() {
    const isAuthed = useAuthStore((s) => s.isAuthed());
    const [showModal, setShowModal] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    const handleAuctionsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
                        <Image
                            src="/logo.svg"
                            alt="GarageMint logo"
                            width={28}
                            height={28}
                            className="h-7 w-7 rounded-lg shadow-sm ring-1 ring-white/40 dark:ring-white/10"
                        />
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
                        <button
                            onClick={toggleTheme}
                            className="rounded-full p-2 border border-neutral-200 dark:border-white/10 bg-white/60 dark:bg-white/5"
                            aria-label="Temayı değiştir"
                        >
                            {mounted && (theme === "dark" ? (
                                <SunIcon className="h-5 w-5" />
                            ) : (
                                <MoonIcon className="h-5 w-5" />
                            ))}
                        </button>
                        <NavAuth />
                    </div>
                </div>
            </header>
            <SignupPromptModal open={showModal} onClose={() => setShowModal(false)} />
        </>
    );
}
