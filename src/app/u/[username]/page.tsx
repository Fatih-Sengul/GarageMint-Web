"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Modal from "@/components/ui/Modal";
import FollowButton from "@/components/profile/FollowButton";
import { FollowersList, FollowingList } from "@/components/profile/FollowList";
import ListingCard from "@/components/listings/ListingCard";
import { useMyProfile } from "@/lib/queries/profile"; // sizde me hook farklı dosyada olabilir
import { usePublicProfile } from "@/lib/queries/profile";

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const me = useMyProfile?.().data; // me hook'unuz nasıl export ediliyorsa öyle kullanın
  const { data: p, isLoading, isError } = usePublicProfile(username, me?.userId);

  const [open, setOpen] = React.useState<null | "followers" | "following">(null);

  if (isLoading) return <div className="mx-auto max-w-4xl px-4 py-10 text-sm text-neutral-400">Yükleniyor…</div>;
  if (isError || !p) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 grid gap-4">
        <h1 className="text-2xl font-bold">Profil bulunamadı</h1>
        <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-200">← Anasayfa</Link>
      </div>
    );
  }

  const s = p.stats ?? {};

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 grid gap-6">
      {/* breadcrumbs */}
      <nav className="text-sm">
        <Link href="/" className="text-sky-400 hover:underline">Anasayfa</Link>
        <span className="mx-2 text-neutral-500">/</span>
        <span className="text-neutral-300">@{p.username}</span>
      </nav>

      {/* header */}
      <section className="rounded-2xl border border-white/10 bg-neutral-900/60 shadow-sm p-0 overflow-hidden">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.bannerUrl ?? "/banner-placeholder.jpg"}
            alt="banner"
            className="h-40 w-full object-cover"
          />
        </div>

        <div className="p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.avatarUrl ?? "/avatar-placeholder.png"}
              alt={p.username}
              className="h-20 w-20 rounded-xl ring-2 ring-white object-cover -mt-12 bg-white"
            />
            <div>
              <h1 className="text-xl font-extrabold">{p.displayName ?? p.username}</h1>
              <div className="text-sm text-neutral-400">@{p.username}</div>
            </div>
          </div>

          {me?.username !== p.username && (
            <FollowButton username={p.username} initiallyFollowing={p.isFollowing} />
          )}
        </div>
      </section>

      {/* stats */}
      <section className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { key: "listingsActive", label: "Aktif İlan", value: s.listingsActiveCount ?? 0 },
          { key: "listingsTotal", label: "Toplam İlan", value: s.listingsTotalCount ?? 0 },
          { key: "followers", label: "Takipçi", value: s.followersCount ?? 0, clickable: true },
          { key: "following", label: "Takip", value: s.followingCount ?? 0, clickable: true },
          { key: "responseRate", label: "Cevap Oranı", value: `${s.responseRate ?? 0}%` },
        ].map((c) => (
          <button
            key={c.key}
            className="rounded-xl border border-white/10 p-4 bg-neutral-900 text-center shadow-sm hover:shadow-md disabled:cursor-default"
            onClick={() => c.clickable && setOpen(c.key as "followers" | "following")}
            disabled={!c.clickable}
          >
            <div className="text-2xl font-extrabold">{c.value}</div>
            <div className="text-xs text-neutral-400">{c.label}</div>
          </button>
        ))}
      </section>

      {/* bio */}
      <section className="rounded-2xl border border-white/10 bg-neutral-900/60 shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-2">Hakkında</h2>
        <p className="text-sm text-neutral-300 whitespace-pre-wrap">{p.bio ?? "—"}</p>
        <div className="mt-3 grid gap-2 text-sm text-neutral-400">
          {p.location && <div><span className="text-neutral-500">Konum:</span> {p.location}</div>}
          {p.language && <div><span className="text-neutral-500">Dil:</span> {p.language}</div>}
          {p.websiteUrl && (
            <div>
              <span className="text-neutral-500">Web:</span>{" "}
              <a href={p.websiteUrl} target="_blank" className="text-sky-400 hover:underline">
                {p.websiteUrl}
              </a>
            </div>
          )}
          {p.links?.map((l) => (
            <div key={l.id}>
              <span className="text-neutral-500">{l.label ?? l.type}:</span>{" "}
              <a href={l.url} target="_blank" className="text-sky-400 hover:underline">
                {l.url}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* listings */}
      {p.listings?.length ? (
        <section className="rounded-2xl border border-white/10 bg-neutral-900/60 shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-4">İlanlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {p.listings.map((l) => (
              <ListingCard key={l.id} it={l} />
            ))}
          </div>
        </section>
      ) : null}

      {/* modal’lar */}
      <Modal open={open === "followers"} onClose={() => setOpen(null)} title="Takipçiler">
        <FollowersList username={p.username} />
      </Modal>
      <Modal open={open === "following"} onClose={() => setOpen(null)} title="Takip Edilenler">
        <FollowingList username={p.username} />
      </Modal>
    </div>
  );
}
