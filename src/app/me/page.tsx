"use client";
import { useInitMyProfile, useMyProfile } from "@/src/lib/queries/profile";
import { Box, PageLayout, Button } from "@primer/react";
import { MyProfileHeader } from "@/src/components/profile/MyProfileHeader";
import { MyProfileForm } from "@/src/components/profile/MyProfileForm";

export default function MePage() {
  const { data, isLoading, isError } = useMyProfile();
  const init = useInitMyProfile();

  if (isLoading) return <Box sx={{ p: 4 }}>Loading…</Box>;

  if (isError || !data) {
    return (
      <Box sx={{ p: 4, display: "grid", gap: 3 }}>
        <div>No profile found.</div>
        <Button onClick={() => init.mutate()} loading={init.isPending}>Initialize my profile</Button>
      </Box>
    );
  }

  return (
    <PageLayout>
      <PageLayout.Header>
        <MyProfileHeader
          username={data.username}
          displayName={data.displayName}
          avatarUrl={data.avatarUrl}
          bannerUrl={data.bannerUrl}
          isVerified={data.isVerified}
        />
      </PageLayout.Header>
      <PageLayout.Content sx={{ display: "grid", gap: 4, p: 3 }}>
        <MyProfileForm me={data} />
      </PageLayout.Content>
    </PageLayout>
  );
}
