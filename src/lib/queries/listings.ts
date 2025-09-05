"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ListingResponseDto, Page, ListingUpdateRequest } from "@/lib/types/listing";

// Backend: GET /api/v1/listings/me -> ListingResponseDto[]
export interface MyListingMini {
    id: number;
    title: string;
    images?: { url: string }[];
    status?: "ACTIVE" | "SOLD" | "INACTIVE";
    isActive?: boolean;
}

export type PublicListingDto = {
    id: number;
    title: string;
    description?: string | null;
    images?: { url: string }[];
    price?: number | null;
    currency?: string | null;
    type?: "SALE" | "TRADE";
    brandName?: string | null;
    modelName?: string | null;
    location?: string | null;
    seller?: { username: string; displayName?: string | null; avatarUrl?: string | null } | null;
};

export const qkListings = {
    search: (key: string) => ["listings","search",key] as const,
    byId: (id: number) => ["listings","byId",id] as const,
};

export type ListingsSearchParams = {
    q?: string;               // free text: backend’de yoksa şimdilik pas
    brandIds?: number[];
    seriesIds?: number[];
    tagIds?: number[];
    theme?: string;
    scale?: string;
    condition?: string;
    limitedEdition?: boolean;
    type?: "SALE" | "TRADE";
    status?: "ACTIVE" | "SOLD" | "INACTIVE";
    location?: string;
    modelYearFrom?: number;
    modelYearTo?: number;
    priceMin?: number;
    priceMax?: number;
    page?: number;   // 0-based
    size?: number;   // default 20
    sortBy?: string; // createdAt | price | modelYear
    sortDir?: "ASC" | "DESC";
};

const toQuery = (p: ListingsSearchParams = {}) => {
    const u = new URLSearchParams();
    const arr = (k: string, v?: number[]) => v?.forEach(x => u.append(k, String(x)));
    const str = (k: string, v?: string | number | boolean) => (v !== undefined && v !== null && v !== "" ? u.set(k, String(v)) : null);

    arr("brandIds", p.brandIds);
    arr("seriesIds", p.seriesIds);
    arr("tagIds", p.tagIds);

    str("theme", p.theme);
    str("scale", p.scale);
    str("condition", p.condition);
    str("limitedEdition", p.limitedEdition);
    str("type", p.type);
    str("status", p.status);
    str("location", p.location);
    str("modelYearFrom", p.modelYearFrom);
    str("modelYearTo", p.modelYearTo);
    str("priceMin", p.priceMin);
    str("priceMax", p.priceMax);
    str("page", p.page ?? 0);
    str("size", p.size ?? 24);
    str("sortBy", p.sortBy ?? "createdAt");
    str("sortDir", p.sortDir ?? "DESC");

    return u.toString();
};

export function useListingsSearch(p: ListingsSearchParams) {
    const qs = toQuery(p);
    return useQuery({
        queryKey: qkListings.search(qs),
        queryFn: (): Promise<Page<ListingResponseDto>> => getJSON(`/listings?${qs}`),
        staleTime: 30_000,
    });
}

export function useListingById(id: number) {
    return useQuery({
        queryKey: qkListings.byId(id),
        queryFn: (): Promise<ListingResponseDto> => getJSON(`/listings/${id}`),
        enabled: Number.isFinite(id),
        staleTime: 30_000,
    });
}

export function usePublicListing(id: number) {
    return useQuery<PublicListingDto>({
        queryKey: ["listing", id],
        queryFn: () => getJSON(`/listings/${id}`),
        enabled: !!id,
    });
}

export function useMyActiveListings() {
    return useQuery({
        queryKey: ["myListings", "active"],
        queryFn: async () => {
            const data = await getJSON<MyListingMini[]>("/listings/me");
            // endpoint zaten aktifleri döndürüyor; yine de filtre kalsın:
            return (data ?? []).filter((x) => x.status === "ACTIVE" && (x.isActive ?? true));
        },
        staleTime: 10_000,
    });
}

async function getJSON<T>(path: string): Promise<T> {
    const res = await api.get<T>(path);
    return res.data;
}

async function call<T = unknown>(method: "PUT" | "DELETE", path: string, body?: unknown): Promise<T> {
    const res = await api.request<T>({ url: path, method, data: body });
    return res.status === 204 ? (null as unknown as T) : res.data;
}

/** Owner detayını çekmek için (mevcut backend endpoint) */
export function useMyListing(id: number) {
    return useQuery<ListingResponseDto>({
        queryKey: ["myListing", id],
        queryFn: () => getJSON(`/listings/me/${id}`),
        enabled: !!id,
    });
}

export function useUpdateListing(id: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (req: ListingUpdateRequest) => call("PUT", `/listings/${id}`, req),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["myListing", id] });
            qc.invalidateQueries({ queryKey: ["myListings"] });
            qc.invalidateQueries({ queryKey: ["listings"] });
        },
    });
}

export function useDeleteListing(id: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => call("DELETE", `/listings/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["myListings"] });
            qc.invalidateQueries({ queryKey: ["listings"] });
        },
    });
}
