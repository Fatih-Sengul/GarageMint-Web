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

// Fetch helpers for public profile and follow APIs
// These use the axios `api` instance so that requests are sent to the backend
// base URL instead of the Next.js dev server. Previously `fetch` was called
// with relative paths which resulted in 404 responses from the UI when the
// backend actually had the data.
async function getJSON<T>(url: string): Promise<T> {
    const r = await api.get<T>(url);
    return r.data;
}

async function call(method: "POST" | "DELETE", url: string, body?: unknown) {
    const r = await api.request({
        url,
        method,
        data: body,
    });
    return r.status === 204 ? null : r.data;
}

export const qk = {
    me: ["myProfile"] as const,
    public: (u: string) => ["publicProfile", u] as const,
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
        mutationFn: () => call("POST", `/profiles/${encodeURIComponent(username)}/follow`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["publicProfile", username] });
            qc.invalidateQueries({ queryKey: ["followers", username] });
            qc.invalidateQueries({ queryKey: ["following", username] });
            qc.invalidateQueries({ queryKey: qk.me });
        },
    });
}

export function useUnfollow(username: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => call("DELETE", `/profiles/${encodeURIComponent(username)}/follow`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["publicProfile", username] });
            qc.invalidateQueries({ queryKey: ["followers", username] });
            qc.invalidateQueries({ queryKey: ["following", username] });
            qc.invalidateQueries({ queryKey: qk.me });
        },
    });
}

// ---- LİSTELER ----
export function useFollowers(username: string, page = 0, size = 20) {
    const url = `/profiles/${encodeURIComponent(username)}/followers?page=${page}&size=${size}`;
    return useQuery<FollowListResponse>({
        queryKey: ["followers", username, page, size],
        queryFn: () => getJSON(url),
        enabled: !!username,
    });
}

export function useFollowing(username: string, page = 0, size = 20) {
    const url = `/profiles/${encodeURIComponent(username)}/following?page=${page}&size=${size}`;
    return useQuery<FollowListResponse>({
        queryKey: ["following", username, page, size],
        queryFn: () => getJSON(url),
        enabled: !!username,
    });
}

// ---- PUBLIC PROFİL (viewer destekli) ----
export function usePublicProfile(username: string, viewerUserId?: number) {
    const q = new URLSearchParams();
    if (viewerUserId != null) q.set("viewerUserId", String(viewerUserId));
    const qs = q.toString();
    const url = `/profiles/${encodeURIComponent(username)}${qs ? `?${qs}` : ""}`;
    return useQuery<ProfilePublicDto>({
        queryKey: ["publicProfile", username, viewerUserId ?? null],
        queryFn: () => getJSON(url),
        enabled: !!username,
    });
}

