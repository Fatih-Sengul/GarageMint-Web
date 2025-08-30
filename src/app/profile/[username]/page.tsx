"use client";
import { usePublicProfile } from "@/src/lib/queries/profile";
import { Box, Avatar, Label, Text } from "@primer/react";

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  const username = params.username;
  const { data, isLoading, isError } = usePublicProfile(username);
  if (isLoading) return <Box sx={{ p: 4 }}>Loading…</Box>;
  if (isError || !data) return <Box sx={{ p: 4 }}>Profile not found.</Box>;

  return (
    <Box sx={{ display: "grid", gap: 3, p: 3 }}>
      <Box sx={{ height: 160, borderRadius: 12, background: `center/cover no-repeat url(${data.bannerUrl ?? "/banner-placeholder.jpg"})`, border: "1px solid", borderColor: "border.default" }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Avatar size={72} src={data.avatarUrl ?? ""} alt={data.username} square />
        <Box>
          <Text as="h2" sx={{ m: 0, fontWeight: 600 }}>{data.displayName ?? data.username}</Text>
          <Text sx={{ color: "fg.muted" }}>@{data.username}</Text>
        </Box>
        {data.isVerified && <Label variant="success">Verified</Label>}
      </Box>
      {data.bio && <Text>{data.bio}</Text>}
      <Box sx={{ color: "fg.muted" }}>
        Listings: {data.stats?.listingsActiveCount ?? 0} active / {data.stats?.listingsTotalCount ?? 0} total
      </Box>
    </Box>
  );
}
