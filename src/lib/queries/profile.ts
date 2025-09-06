"use client";

import React from "react";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    ProfileOwnerDto, ProfilePublicDto, ProfileUpdateRequest,
    ProfilePrefsDto, ProfilePrefsUpdateRequest,
    NotificationSettingsDto, NotificationSettingsUpdateRequest,
    ProfileLinkDto, UsernameAvailabilityDto, UsernameSuggestionsDto,
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

export const qk = {
    me: ["myProfile"] as const,
    public: (u: string) => ["publicProfile", u] as const,
    prefs: ["profile", "me", "prefs"] as const,
    notif: ["profile", "me", "notif"] as const,
    links: ["profile", "me", "links"] as const,
    usernameCheck: (u: string) => ["profile", "usernameCheck", u] as const,
    usernameSuggest: (b?: string) => ["profile", "usernameSuggest", b ?? ""] as const,
};

function useAccessToken() {
    const [t, setT] = React.useState<string | null>(null);
    React.useEffect(() => setT(sessionStorage.getItem("accessToken")), []);
    return t;
}

export function useMyProfile() {
    const token = useAccessToken();
    return useQuery<ProfileOwnerDto>({
        queryKey: qk.me,
        enabled: !!token,
        queryFn: async () => (await api.get("/api/v1/profiles/me")).data,
        retry: (count, err: any) => {
            const s = err?.response?.status;
            if (s === 401 || s === 403) return false;
            return count < 1;
        },
    });
}
export function useCheckUsername(u: string) {
    return useQuery<UsernameAvailabilityDto>({
        queryKey: qk.usernameCheck(u),
        queryFn: async () => (await api.get("/api/v1/profiles/check-username", { params: { username: u } })).data,
        enabled: !!u && u.length >= 3,
        staleTime: 30_000,
    });
}
export function useSuggestUsername(base?: string) {
    return useQuery<UsernameSuggestionsDto>({
        queryKey: qk.usernameSuggest(base),
        queryFn: async () => (await api.get("/api/v1/profiles/suggest-username", { params: { base } })).data,
    });
}

export function useInitMyProfile() {
    const qc = useQueryClient();
    return useMutation<ProfileOwnerDto, unknown, void>({
        mutationFn: async () => (await api.post("/api/v1/profiles/me/init")).data,
        onSuccess: () => { qc.invalidateQueries({ queryKey: qk.me }); },
    });
}
export function useUpdateMyProfile() {
    const qc = useQueryClient();
    return useMutation<ProfileOwnerDto, unknown, ProfileUpdateRequest>({
        mutationFn: async (req) => (await api.put("/api/v1/profiles/me", req)).data,
        onSuccess: (data) => { qc.setQueryData(qk.me, data); },
    });
}
export function useUpdateMyAvatar() {
    const qc = useQueryClient();
    return useMutation<ProfileOwnerDto, unknown, { avatarUrl: string }>({
        mutationFn: async ({ avatarUrl }) =>
            (await api.put("/api/v1/profiles/me/avatar", null, { params: { avatarUrl } })).data,
        onSuccess: () => { qc.invalidateQueries({ queryKey: qk.me }); },
    });
}
export function useUpdateMyBanner() {
    const qc = useQueryClient();
    return useMutation<ProfileOwnerDto, unknown, { bannerUrl: string }>({
        mutationFn: async ({ bannerUrl }) =>
            (await api.put("/api/v1/profiles/me/banner", null, { params: { bannerUrl } })).data,
        onSuccess: () => { qc.invalidateQueries({ queryKey: qk.me }); },
    });
}
export function useUpdateMyPrefs() {
    const qc = useQueryClient();
    return useMutation<ProfilePrefsDto, unknown, ProfilePrefsUpdateRequest>({
        mutationFn: async (req) => (await api.put("/api/v1/profiles/me/prefs", req)).data,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: qk.me });
            qc.invalidateQueries({ queryKey: qk.prefs });
        },
    });
}
export function useUpdateMyNotifications() {
    const qc = useQueryClient();
    return useMutation<NotificationSettingsDto, unknown, NotificationSettingsUpdateRequest>({
        mutationFn: async (req) => (await api.put("/api/v1/profiles/me/notifications", req)).data,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: qk.me });
            qc.invalidateQueries({ queryKey: qk.notif });
        },
    });
}
export function useUpdateMyLinks() {
    const qc = useQueryClient();
    return useMutation<ProfileLinkDto[], unknown, ProfileLinkDto[]>({
        mutationFn: async (links) => (await api.put("/api/v1/profiles/me/links", links)).data,
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
            const res = await api.post("/api/v1/profiles/me/avatar/upload", fd, {
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
            const res = await api.post("/api/v1/profiles/me/banner/upload", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: qk.me });
        },
    });
}

// ---- PUBLIC PROFİL (viewer destekli) ----
export function usePublicProfile(username: string, viewerUserId?: number) {
    const q = new URLSearchParams();
    if (viewerUserId != null) q.set("viewerUserId", String(viewerUserId));
    const qs = q.toString();
    const url = `/api/v1/profiles/${encodeURIComponent(username)}${qs ? `?${qs}` : ""}`;
    return useQuery<ProfilePublicDto>({
        queryKey: ["publicProfile", username, viewerUserId ?? null],
        queryFn: () => getJSON(url),
        enabled: !!username,
    });
}

