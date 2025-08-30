"use client";
import { Button, FormControl, TextInput, Textarea, Checkbox } from "@primer/react";
import { useEffect, useState, type FormEvent } from "react";
import type { ProfileOwnerDto, ProfileUpdateRequest } from "@/lib/types/profile";
import { useUpdateMyProfile } from "@/lib/queries/profile";

export function MyProfileForm({ me }: { me: ProfileOwnerDto }) {
  const [form, setForm] = useState<ProfileUpdateRequest>({});
  const m = useUpdateMyProfile();

  useEffect(() => {
    setForm({
      username: me.username,
      displayName: me.displayName,
      bio: me.bio,
      location: me.location,
      websiteUrl: me.websiteUrl,
      language: me.language,
      isPublic: me.isPublic,
    });
  }, [me]);

  const onChange = <K extends keyof ProfileUpdateRequest>(
    k: K,
    v: ProfileUpdateRequest[K]
  ) => setForm((s) => ({ ...s, [k]: v }));

  return (
    <form style={{ display: "grid", gap: 16 }} onSubmit={(e: FormEvent<HTMLFormElement>) => { e.preventDefault(); m.mutate(form); }}>
      <FormControl>
        <FormControl.Label>Display name</FormControl.Label>
        <TextInput value={form.displayName ?? ""} onChange={(e) => onChange("displayName", e.target.value)} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Bio</FormControl.Label>
        <Textarea rows={4} value={form.bio ?? ""} onChange={(e) => onChange("bio", e.target.value)} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Location</FormControl.Label>
        <TextInput value={form.location ?? ""} onChange={(e) => onChange("location", e.target.value)} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Website</FormControl.Label>
        <TextInput value={form.websiteUrl ?? ""} onChange={(e) => onChange("websiteUrl", e.target.value)} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Language</FormControl.Label>
        <TextInput value={form.language ?? ""} onChange={(e) => onChange("language", e.target.value)} />
      </FormControl>
      <FormControl>
        <Checkbox
          id="isPublic"
          checked={!!form.isPublic}
          onChange={(e) => onChange("isPublic", e.target.checked)}
        />
        <FormControl.Label htmlFor="isPublic">Public profile</FormControl.Label>
      </FormControl>

      <Button type="submit" variant="primary" loading={m.isPending}>Save changes</Button>
    </form>
  );
}
