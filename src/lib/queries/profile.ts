"use client";
import { api } from "../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ProfilePublicDto, ProfileOwnerDto, ProfileUpdateRequest,
  ProfileLinkDto, ProfilePrefsDto, ProfilePrefsUpdateRequest,
  NotificationSettingsDto, NotificationSettingsUpdateRequest,
  UsernameAvailabilityDto, UsernameSuggestionsDto
} from "../types/profile";

export const qk = {
  me: ["profile","me"] as const,
  public: (username: string) => ["profile","public",username] as const,
  links: ["profile","me","links"] as const,
  prefs: ["profile","me","prefs"] as const,
  notif: ["profile","me","notifications"] as const,
  usernameCheck: (u: string) => ["profile","usernameCheck",u] as const,
  usernameSuggest: (b?: string) => ["profile","usernameSuggest",b ?? ""] as const,
};

// GETs
export function useMyProfile() {
  return useQuery<ProfileOwnerDto>({
    queryKey: qk.me,
    queryFn: async () => (await api.get("/profiles/me")).data,
  });
}

export function usePublicProfile(username: string) {
  return useQuery<ProfilePublicDto>({
    queryKey: qk.public(username),
    queryFn: async () => (await api.get(`/profiles/${encodeURIComponent(username)}`)).data,
    enabled: !!username,
  });
}

export function useCheckUsername(u: string) {
  return useQuery<UsernameAvailabilityDto>({
    queryKey: qk.usernameCheck(u),
    queryFn: async () => (await api.get("/profiles/check-username",{ params: { username: u }})).data,
    enabled: !!u && u.length >= 3,
    staleTime: 30_000,
  });
}

export function useSuggestUsername(base?: string) {
  return useQuery<UsernameSuggestionsDto>({
    queryKey: qk.usernameSuggest(base),
    queryFn: async () => (await api.get("/profiles/suggest-username",{ params: { base }})).data,
  });
}

// POST init
export function useInitMyProfile() {
  const qc = useQueryClient();
  return useMutation<ProfileOwnerDto, unknown, void>({
    mutationFn: async () => (await api.post("/profiles/me/init")).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.me }); },
  });
}

// PUTs (mutations)
export function useUpdateMyProfile() {
  const qc = useQueryClient();
  return useMutation<ProfileOwnerDto, unknown, ProfileUpdateRequest>({
    mutationFn: async (req) => (await api.put("/profiles/me", req)).data,
    onSuccess: (data) => {
      qc.setQueryData(qk.me, data);
    },
  });
}

export function useUpdateMyAvatar() {
  const qc = useQueryClient();
  return useMutation<ProfileOwnerDto, unknown, { avatarUrl: string }>({
    mutationFn: async ({ avatarUrl }) => (await api.put("/profiles/me/avatar", null, { params: { avatarUrl } })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.me }); },
  });
}

export function useUpdateMyBanner() {
  const qc = useQueryClient();
  return useMutation<ProfileOwnerDto, unknown, { bannerUrl: string }>({
    mutationFn: async ({ bannerUrl }) => (await api.put("/profiles/me/banner", null, { params: { bannerUrl } })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.me }); },
  });
}

export function useUpdateMyLinks() {
  const qc = useQueryClient();
  return useMutation<ProfileLinkDto[], unknown, ProfileLinkDto[]>({
    mutationFn: async (links) => (await api.put("/profiles/me/links", links)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.me }); qc.invalidateQueries({ queryKey: qk.links }); },
  });
}

export function useUpdateMyPrefs() {
  const qc = useQueryClient();
  return useMutation<ProfilePrefsDto, unknown, ProfilePrefsUpdateRequest>({
    mutationFn: async (req) => (await api.put("/profiles/me/prefs", req)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.me }); qc.invalidateQueries({ queryKey: qk.prefs }); },
  });
}

export function useUpdateMyNotifications() {
  const qc = useQueryClient();
  return useMutation<NotificationSettingsDto, unknown, NotificationSettingsUpdateRequest>({
    mutationFn: async (req) => (await api.put("/profiles/me/notifications", req)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.me }); qc.invalidateQueries({ queryKey: qk.notif }); },
  });
}
