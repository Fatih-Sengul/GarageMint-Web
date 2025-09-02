"use client";

import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    ProfileOwnerDto, ProfilePublicDto, ProfileUpdateRequest,
    ProfilePrefsDto, ProfilePrefsUpdateRequest,
    NotificationSettingsDto, NotificationSettingsUpdateRequest,
    ProfileLinkDto, UsernameAvailabilityDto, UsernameSuggestionsDto,
    FollowListResponse,
} from "@/lib/types/profile";

export const qk = {
    me: ["profile", "me"] as const,
    public: (u: string) => ["profile", "public", u] as const,
    prefs: ["profile", "me", "prefs"] as const,
    notif: ["profile", "me", "notif"] as const,
    links: ["profile", "me", "links"] as const,
    usernameCheck: (u: string) => ["profile", "usernameCheck", u] as const,
    usernameSuggest: (b?: string) => ["profile", "usernameSuggest", b ?? ""] as const,
};

export function useMyProfile() {
    return useQuery<ProfileOwnerDto>({
        queryKey: qk.me,
        queryFn: async () => (await api.get("/profiles/me")).data,
    });
}
export function useCheckUsername(u: string) {
    return useQuery<UsernameAvailabilityDto>({
        queryKey: qk.usernameCheck(u),
        queryFn: async () => (await api.get("/profiles/check-username", { params: { username: u } })).data,
        enabled: !!u && u.length >= 3,
        staleTime: 30_000,
    });
}
export function useSuggestUsername(base?: string) {
    return useQuery<UsernameSuggestionsDto>({
        queryKey: qk.usernameSuggest(base),
        queryFn: async () => (await api.get("/profiles/suggest-username", { params: { base } })).data,
    });
}

export function useInitMyProfile() {
    const qc = useQueryClient();
    return useMutation<ProfileOwnerDto, unknown, void>({
        mutationFn: async () => (await api.post("/profiles/me/init")).data,
        onSuccess: () => { qc.invalidateQueries({ queryKey: qk.me }); },
    });
}
export function useUpdateMyProfile() {
    const qc = useQueryClient();
    return useMutation<ProfileOwnerDto, unknown, ProfileUpdateRequest>({
        mutationFn: async (req) => (await api.put("/profiles/me", req)).data,
        onSuccess: (data) => { qc.setQueryData(qk.me, data); },
    });
}
export function useUpdateMyAvatar() {
    const qc = useQueryClient();
    return useMutation<ProfileOwnerDto, unknown, { avatarUrl: string }>({
        mutationFn: async ({ avatarUrl }) =>
            (await api.put("/profiles/me/avatar", null, { params: { avatarUrl } })).data,
        onSuccess: () => { qc.invalidateQueries({ queryKey: qk.me }); },
    });
}
export function useUpdateMyBanner() {
    const qc = useQueryClient();
    return useMutation<ProfileOwnerDto, unknown, { bannerUrl: string }>({
        mutationFn: async ({ bannerUrl }) =>
            (await api.put("/profiles/me/banner", null, { params: { bannerUrl } })).data,
        onSuccess: () => { qc.invalidateQueries({ queryKey: qk.me }); },
    });
}
export function useUpdateMyPrefs() {
    const qc = useQueryClient();
    return useMutation<ProfilePrefsDto, unknown, ProfilePrefsUpdateRequest>({
        mutationFn: async (req) => (await api.put("/profiles/me/prefs", req)).data,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: qk.me });
            qc.invalidateQueries({ queryKey: qk.prefs });
        },
    });
}
export function useUpdateMyNotifications() {
    const qc = useQueryClient();
    return useMutation<NotificationSettingsDto, unknown, NotificationSettingsUpdateRequest>({
        mutationFn: async (req) => (await api.put("/profiles/me/notifications", req)).data,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: qk.me });
            qc.invalidateQueries({ queryKey: qk.notif });
        },
    });
}
export function useUpdateMyLinks() {
    const qc = useQueryClient();
    return useMutation<ProfileLinkDto[], unknown, ProfileLinkDto[]>({
        mutationFn: async (links) => (await api.put("/profiles/me/links", links)).data,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: qk.me });
            qc.invalidateQueries({ queryKey: qk.links });
        },
    });
}

export function useUploadMyAvatar() {
    const qc = useQueryClient();
    return useMutation<ProfileOwnerDto, Error, File>({
        mutationFn: async (file) => {
            const fd = new FormData();
            fd.append("file", file);
            const res = await api.post("/profiles/me/avatar/upload", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: qk.me });
        },
    });
}

export function useUploadMyBanner() {
    const qc = useQueryClient();
    return useMutation<ProfileOwnerDto, Error, File>({
        mutationFn: async (file) => {
            const fd = new FormData();
            fd.append("file", file);
            const res = await api.post("/profiles/me/banner/upload", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: qk.me });
        },
    });
}

// ---- FOLLOW / UNFOLLOW ----
export function useFollow(username: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await api.post(`/profiles/${encodeURIComponent(username)}/follow`);
        },
        onSuccess: () => {
            // public profil ve followers/following listelerini tazele
            qc.invalidateQueries({ queryKey: ["profile-public", username] });
            qc.invalidateQueries({ queryKey: ["followers", username] });
            qc.invalidateQueries({ queryKey: ["following", username] });
            qc.invalidateQueries({ queryKey: qk.me });
        },
    });
}

export function useUnfollow(username: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await api.delete(`/profiles/${encodeURIComponent(username)}/follow`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["profile-public", username] });
            qc.invalidateQueries({ queryKey: ["followers", username] });
            qc.invalidateQueries({ queryKey: ["following", username] });
            qc.invalidateQueries({ queryKey: qk.me });
        },
    });
}

// ---- LİSTELER ----
export function useFollowers(username: string, page = 0, size = 20) {
    return useQuery({
        queryKey: ["followers", username, page, size],
        queryFn: async () => {
            const { data } = await api.get<FollowListResponse>(
                `/profiles/${encodeURIComponent(username)}/followers`,
                { params: { page, size } }
            );
            return data;
        },
        enabled: !!username,
    });
}

export function useFollowing(username: string, page = 0, size = 20) {
    return useQuery({
        queryKey: ["following", username, page, size],
        queryFn: async () => {
            const { data } = await api.get<FollowListResponse>(
                `/profiles/${encodeURIComponent(username)}/following`,
                { params: { page, size } }
            );
            return data;
        },
        enabled: !!username,
    });
}

// ---- PUBLIC PROFİL (viewer destekli) ----
export function usePublicProfile(username: string, viewerUserId?: number) {
    return useQuery({
        queryKey: ["profile-public", username, viewerUserId ?? null],
        queryFn: async () => {
            const { data } = await api.get<ProfilePublicDto>(
                `/profiles/${encodeURIComponent(username)}`,
                { params: viewerUserId ? { viewerUserId } : {} }
            );
            return data;
        },
        enabled: !!username,
    });
}

