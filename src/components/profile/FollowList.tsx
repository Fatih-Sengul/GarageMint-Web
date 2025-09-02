"use client";
import Link from "next/link";
import { useFollowers, useFollowing } from "@/lib/queries/profile";

export function FollowersList({ username }: { username: string }) {
  const { data } = useFollowers(username, 0, 50);
  if (!data) return null;
  return <List items={data.items} empty="Henüz takipçi yok." />;
}

export function FollowingList({ username }: { username: string }) {
  const { data } = useFollowing(username, 0, 50);
  if (!data) return null;
  return <List items={data.items} empty="Henüz kimseyi takip etmiyor." />;
}

function List({ items, empty }: { items: { username: string; displayName?: string; avatarUrl?: string; isVerified?: boolean | null }[]; empty: string }) {
  if (!items.length) return <p className="text-sm text-neutral-400">{empty}</p>;
  return (
    <ul className="grid gap-3">
      {items.map((u) => (
        <li key={u.username} className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-neutral-800 ring-1 ring-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u.avatarUrl ?? "/avatar-placeholder.png"} alt={u.username} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <Link href={`/u/${u.username}`} className="font-medium hover:underline truncate block">
              {u.displayName ?? u.username}
            </Link>
            <div className="text-xs text-neutral-500">@{u.username}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
