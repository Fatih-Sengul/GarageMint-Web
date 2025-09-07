"use client";

import Link from "next/link";
import { useMyProfile } from "@/lib/queries/profile";
import { useFollowers, useFollowing } from "@/lib/queries/follow";

export function FollowersList({ username }: { username: string }) {
  const { data, isLoading, isError } = useFollowers(username);
  if (isLoading) return <p className="text-sm text-neutral-400">Yükleniyor…</p>;
  if (isError) return <p className="text-sm text-red-400">Takipçiler alınamadı.</p>;

  if (!data?.items?.length) return <p className="text-sm text-neutral-400">Takipçi yok.</p>;
  return <UserList items={data.items} />;
}

export function FollowingList({ username }: { username: string }) {
  const { data, isLoading, isError } = useFollowing(username);
  if (isLoading) return <p className="text-sm text-neutral-400">Yükleniyor…</p>;
  if (isError) return <p className="text-sm text-red-400">Takip edilenler alınamadı.</p>;

  if (!data?.items?.length) return <p className="text-sm text-neutral-400">Kimseyi takip etmiyorsun.</p>;
  return <UserList items={data.items} />;
}

function UserList({ items }: { items: {username:string;displayName?:string|null;avatarUrl?:string|null;isVerified?:boolean|null}[] }) {
  const { data: me } = useMyProfile();
  return (
    <ul className="grid gap-2">
      {items.map((u) => {
        const url = me?.username === u.username ? "/me" : `/u/${u.username}`;
        return (
          <li key={u.username} className="flex items-center justify-between rounded-xl border border-white/10 p-2">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u.avatarUrl ?? "/avatar-placeholder.png"} alt={u.username} className="h-9 w-9 rounded-lg object-cover ring-1 ring-white/10"/>
              <div>
                <Link href={url} className="font-semibold hover:underline">
                  {u.displayName ?? u.username}
                </Link>
                <div className="text-xs text-neutral-400">@{u.username}</div>
              </div>
            </div>
            <Link href={url} className="text-xs text-sky-400 hover:underline">Profili gör →</Link>
          </li>
        );
      })}
    </ul>
  );
}
