"use client";
import { useState } from "react";
import { useFollow, useUnfollow } from "@/lib/queries/profile";
import { useToast } from "@/components/ui/toast";

type Props = {
  username: string;
  initiallyFollowing?: boolean | null;
  compact?: boolean; // küçük badge tarzı
};

export default function FollowButton({ username, initiallyFollowing, compact }: Props) {
  const [isFollowing, setIsFollowing] = useState(!!initiallyFollowing);
  const follow = useFollow(username);
  const unfollow = useUnfollow(username);
  const { push } = useToast();

  const toggle = () => {
    if (isFollowing) {
      unfollow.mutate(undefined, {
        onSuccess: () => { setIsFollowing(false); push({ type:"success", title:"Takipten çıkıldı" }); },
        onError: (e) => push({ type:"error", title:"İşlem başarısız", description:String(e) }),
      });
    } else {
      follow.mutate(undefined, {
        onSuccess: () => { setIsFollowing(true); push({ type:"success", title:"Takip edildi" }); },
        onError: (e) => push({ type:"error", title:"İşlem başarısız", description:String(e) }),
      });
    }
  };

  const loading = follow.isPending || unfollow.isPending;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={
        isFollowing
          ? "rounded-lg px-3 py-1.5 text-sm font-semibold bg-neutral-800 text-white hover:bg-neutral-700 disabled:opacity-60"
          : "rounded-lg px-3 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-600 hover:opacity-95 disabled:opacity-60"
      }
      aria-pressed={isFollowing}
    >
      {loading ? "…" : isFollowing ? (compact ? "Takip" : "Takiptesin") : (compact ? "Takip Et" : "Takip Et")}
    </button>
  );
}
