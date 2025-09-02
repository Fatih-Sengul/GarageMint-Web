"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ListingResponseDto, Page } from "@/lib/types/listing";

// Backend: GET /api/v1/cars/listings/me -> ListingResponseDto[]
export interface MyListingMini {
    id: number;
    title: string;
    images?: { url: string }[];
    status?: "ACTIVE" | "SOLD" | "WITHDRAWN";
    isActive?: boolean;
}

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
    status?: "ACTIVE" | "SOLD" | "WITHDRAWN";
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
        queryFn: async (): Promise<Page<ListingResponseDto>> => {
            const res = await api.get(`/cars/listings?${qs}`);
            return res.data;
        },
        staleTime: 30_000,
    });
}

export function useListingById(id: number) {
    return useQuery({
        queryKey: qkListings.byId(id),
        queryFn: async (): Promise<ListingResponseDto> => {
            const res = await api.get(`/cars/listings/${id}`);
            return res.data;
        },
        enabled: Number.isFinite(id),
        staleTime: 30_000,
    });
}

export function useMyActiveListings() {
    return useQuery({
        queryKey: ["myListings", "active"],
        queryFn: async () => {
            const { data } = await api.get<MyListingMini[]>("/cars/listings/me");
            // endpoint zaten aktifleri döndürüyor; yine de filtre kalsın:
            return (data ?? []).filter((x) => x.status === "ACTIVE" && (x.isActive ?? true));
        },
        staleTime: 10_000,
    });
}
