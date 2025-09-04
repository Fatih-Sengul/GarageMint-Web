"use client";
import { useState } from "react";
import type { ProfileOwnerDto } from "@/lib/types/profile";
import Modal from "@/components/ui/Modal";
import { FollowersList, FollowingList } from "@/components/profile/FollowList";

export default function MyStats({ me }: { me: ProfileOwnerDto }) {
  const s = me.stats ?? {};
  const cards = [
    { key: "listingsActive", label: "Aktif İlan", value: s.listingsActiveCount ?? 0 },
    { key: "listingsTotal",  label: "Toplam İlan", value: s.listingsTotalCount ?? 0 },
    { key: "followers",      label: "Takipçi", value: s.followersCount ?? me.followersCount ?? 0, clickable: true },
    { key: "following",      label: "Takip",   value: s.followingCount ?? me.followingCount ?? 0, clickable: true },
    { key: "responseRate",   label: "Cevap Oranı", value: `${s.responseRate ?? 0}%` },
  ];

  const [open, setOpen] = useState<null | "followers" | "following">(null);

  return (
    <>
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map((c) => (
          <button
            key={c.label}
            className="rounded-xl border border-neutral-200 dark:border-white/10 p-4 bg-white dark:bg-neutral-900 text-center shadow-sm hover:shadow-md transition-shadow disabled:cursor-default"
            onClick={() => c.clickable && setOpen(c.key === "followers" ? "followers" : "following")}
            disabled={!c.clickable}
          >
            <div className="text-2xl font-extrabold">{c.value}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">{c.label}</div>
          </button>
        ))}
      </section>

      <Modal
        open={open === "followers"}
        onCloseAction={() => setOpen(null)}
        title="Takipçiler"
      >
        <FollowersList username={me.username} />
      </Modal>
      <Modal
        open={open === "following"}
        onCloseAction={() => setOpen(null)}
        title="Takip Edilenler"
      >
        <FollowingList username={me.username} />
      </Modal>
    </>
  );
}
