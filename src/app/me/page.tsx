"use client";

import Link from "next/link";
import { useInitMyProfile, useMyProfile } from "@/lib/queries/profile";
import ProfileHeader from "@/components/me/ProfileHeader";
import ProfileForm from "@/components/me/ProfileForm";
import PrefsForm from "@/components/me/PrefsForm";
import NotificationsForm from "@/components/me/NotificationsForm";
import MyStats from "@/components/me/MyStats";
import MyListingsGrid from "@/components/me/MyListingsGrid";

export default function MePage() {
    const { data, isLoading, isError, error } = useMyProfile();
    const init = useInitMyProfile();

    if (isLoading) {
        return <div className="p-6">Yükleniyor…</div>;
    }

    if (isError || !data) {
        const msg =
            error instanceof Error ? error.message : "Bilinmeyen hata. API / CORS / URL’leri kontrol et.";
        return (
            <div className="p-6 grid gap-3">
                <div className="text-red-600 font-semibold">Profil yüklenemedi.</div>
                <pre className="text-xs opacity-70">{msg}</pre>
                <button
                    onClick={() => init.mutate()}
                    disabled={init.isPending}
                    className="w-fit rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                    Profilimi Başlat
                </button>
            </div>
        );
    }

    const me = data;

    return (
        <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between">
                <nav className="text-sm">
                    <Link className="text-sky-700 dark:text-sky-300 hover:underline" href="/">
                        Anasayfa
                    </Link>
                    <span className="mx-2 text-neutral-400">/</span>
                    <span className="text-neutral-600 dark:text-neutral-300 font-semibold">Profilim</span>
                </nav>
            </div>

            {/* Header + Stats */}
            <ProfileHeader
                username={me.username}
                displayName={me.displayName}
                avatarUrl={me.avatarUrl}
                bannerUrl={me.bannerUrl}
                isVerified={me.isVerified}
            />
            <MyStats me={me} />

            {/* Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid gap-6">
                    <ProfileForm me={me} />
                    <MyListingsGrid me={me} />
                </div>
                <div className="grid gap-6">
                    <PrefsForm me={me} />
                    <NotificationsForm me={me} />
                </div>
            </div>
        </div>
    );
}
