"use client";

import Link from "next/link";
import { useMyProfile, useInitMyProfile } from "@/lib/queries/profile";
import FollowPanel from "@/components/me/FollowPanel";

import ProfileHeader from "@/components/me/ProfileHeader";
import ProfileForm from "@/components/me/ProfileForm";
import PrefsForm from "@/components/me/PrefsForm";
import NotificationsForm from "@/components/me/NotificationsForm";
import MyStats from "@/components/me/MyStats";
import MyListingsGrid from "@/components/me/MyListingsGrid";

export default function MePage() {
    const { data, isLoading, isError } = useMyProfile();
    const init = useInitMyProfile();

    if (isLoading) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="text-sm text-neutral-400">Yükleniyor…</div>
            </div>
        );
    }

    // Profil yoksa başlat
    if (isError || !data) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 grid gap-4">
                <h1 className="text-2xl font-bold">Profil bulunamadı</h1>
                <p className="text-neutral-400">
                    Henüz bir profiliniz yok gibi görünüyor. Aşağıdaki butona tıklayarak
                    oluşturabilirsiniz.
                </p>
                <button
                    onClick={() => init.mutate()}
                    disabled={init.isPending}
                    className="w-fit rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-white disabled:opacity-60"
                >
                    {init.isPending ? "Oluşturuluyor…" : "Profilimi Başlat"}
                </button>

                <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-200">
                    ← Anasayfa
                </Link>
            </div>
        );
    }

    // --------- VERİ VAR ---------
    const me = data;

    return (
        <div className="mx-auto max-w-6xl px-4 py-6">
            {/* Breadcrumbs */}
            <nav className="mb-4 text-sm">
                <Link href="/" className="text-sky-400 hover:underline">
                    Anasayfa
                </Link>
                <span className="mx-2 text-neutral-500">/</span>
                <span className="text-neutral-300">Profilim</span>
            </nav>

            {/* Üst kısım: Header + İstatistikler */}
            <div className="grid gap-6">
                <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-sm p-0 overflow-hidden">
                    <ProfileHeader
                        username={me.username}
                        displayName={me.displayName}
                        avatarUrl={me.avatarUrl}
                        bannerUrl={me.bannerUrl}
                        isVerified={me.isVerified ?? false}
                    />
                </section>

                <section>
                    <MyStats me={me} />
                </section>
            </div>

            {/* Ana içerik: 2 kolon */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sol kolon */}
                <div className="lg:col-span-2 grid gap-6">
                    {/* Profil Bilgileri */}
                    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Profil Bilgileri</h2>
                        <ProfileForm me={me} />
                    </section>

                    {/* İlanlarım */}
                    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">İlanlarım</h2>
                        <MyListingsGrid me={me} />
                    </section>
                </div>

                {/* Sağ kolon */}
                <div className="lg:col-span-1 grid gap-6">
                    <FollowPanel
                        username={me.username}
                        followersCount={me.stats?.followersCount ?? me.followersCount}
                        followingCount={me.stats?.followingCount ?? me.followingCount}
                    />

                    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Tercihler</h2>
                        <PrefsForm me={me} />
                    </section>

                    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Bildirimler</h2>
                        <NotificationsForm me={me} />
                    </section>
                </div>
            </div>
        </div>
    );
}
