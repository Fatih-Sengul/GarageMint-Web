"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { FollowersList, FollowingList } from "@/components/profile/FollowList";

export default function FollowPanel({
  username,
  followersCount,
  followingCount,
}: {
  username: string;
  followersCount?: number;
  followingCount?: number;
}) {
  const [open, setOpen] = React.useState<null | "followers" | "following">(null);

  return (
    <>
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Takip</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setOpen("followers")}
            className="rounded-xl border border-white/10 p-4 text-center hover:bg-white/5"
          >
            <div className="text-2xl font-extrabold">{followersCount ?? 0}</div>
            <div className="text-xs text-neutral-400">Takipçi</div>
          </button>
          <button
            onClick={() => setOpen("following")}
            className="rounded-xl border border-white/10 p-4 text-center hover:bg-white/5"
          >
            <div className="text-2xl font-extrabold">{followingCount ?? 0}</div>
            <div className="text-xs text-neutral-400">Takip</div>
          </button>
        </div>
      </section>

      <Modal
        open={open === "followers"}
        onCloseAction={() => setOpen(null)}
        title="Takipçilerim"
      >
        <FollowersList username={username} />
      </Modal>
      <Modal
        open={open === "following"}
        onCloseAction={() => setOpen(null)}
        title="Takip Ettiklerim"
      >
        <FollowingList username={username} />
      </Modal>
    </>
  );
}
