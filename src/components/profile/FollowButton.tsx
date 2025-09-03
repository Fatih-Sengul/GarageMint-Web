"use client";
import { useFollow, useUnfollow } from "@/lib/queries/profile";

export default function FollowButton({
  username,
  initiallyFollowing,
}: {
  username: string;
  initiallyFollowing?: boolean | null;
}) {
  const follow = useFollow(username);
  const unfollow = useUnfollow(username);

  const isLoading = follow.isPending || unfollow.isPending;
  const isFollowing =
    unfollow.isPending ? true :
    follow.isPending ? false :
    !!initiallyFollowing;

  return isFollowing ? (
    <button
      onClick={() => unfollow.mutate()}
      disabled={isLoading}
      className="rounded-lg border border-white/20 px-3 py-1.5 text-sm font-semibold hover:bg-white/10 disabled:opacity-60"
    >
      Takipten Çık
    </button>
  ) : (
    <button
      onClick={() => follow.mutate()}
      disabled={isLoading}
      className="rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
    >
      Takip Et
    </button>
  );
}
