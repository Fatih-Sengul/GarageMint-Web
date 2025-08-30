"use client";
import { Avatar, Button, Text, Label, TextInput } from "@primer/react";
import { useState } from "react";
import { useUpdateMyAvatar, useUpdateMyBanner } from "@/lib/queries/profile";

export function MyProfileHeader(props: {
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  isVerified?: boolean;
}) {
  const [avatar, setAvatar] = useState(props.avatarUrl ?? "");
  const [banner, setBanner] = useState(props.bannerUrl ?? "");
  const mAvatar = useUpdateMyAvatar();
  const mBanner = useUpdateMyBanner();

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          height: 160,
          borderRadius: 12,
          background: `center/cover no-repeat url(${props.bannerUrl ?? "/banner-placeholder.jpg"})`,
          border: "1px solid var(--borderColor-default)",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Avatar src={props.avatarUrl ?? ""} alt={props.username} size={72} square />
        <div style={{ display: "grid" }}>
          <Text as="h2" sx={{ m: 0, fontWeight: 600 }}>
            {props.displayName ?? props.username} {props.isVerified && <Label variant="success">Verified</Label>}
          </Text>
          <Text sx={{ color: "fg.muted" }}>@{props.username}</Text>
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <TextInput placeholder="Avatar URL" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
          <Button
            onClick={() => mAvatar.mutate({ avatarUrl: avatar })}
            loading={mAvatar.isPending}
          >Save avatar</Button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <TextInput placeholder="Banner URL" value={banner} onChange={(e) => setBanner(e.target.value)} />
          <Button
            onClick={() => mBanner.mutate({ bannerUrl: banner })}
            loading={mBanner.isPending}
          >Save banner</Button>
        </div>
      </div>
    </div>
  );
}
