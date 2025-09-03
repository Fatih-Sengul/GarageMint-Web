"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  AuctionListItemDto, AuctionResponseDto,
  BidResponseDto, AuctionCreateRequest, BidCreateRequest, UploadResult, AuctionUpdateRequest
} from "@/lib/types/auction";

export const useAuctions = () =>
  useQuery<AuctionListItemDto[]>({
    queryKey: ["auctions"],
    queryFn: async () => (await api.get("/auctions")).data,
  });

export const useAuction = (id: number) =>
  useQuery<AuctionResponseDto>({
    queryKey: ["auction", id],
    queryFn: async () => (await api.get(`/auctions/${id}`)).data,
    enabled: !!id,
  });

export const useBids = (id: number) =>
  useQuery<BidResponseDto[]>({
    queryKey: ["auction-bids", id],
    queryFn: async () => (await api.get(`/auctions/${id}/bids`)).data,
    enabled: !!id,
  });

export const useCreateAuction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: AuctionCreateRequest) =>
      (await api.post("/auctions", body)).data as AuctionResponseDto,
    onSuccess: () => qc.invalidateQueries({ queryKey:["auctions"] }),
  });
};

export const useUploadAuctionImages = () => {
  const qc = useQueryClient();
  return useMutation<UploadResult[], unknown, { id: number; files: File[] }>({
    mutationFn: async ({ id, files }) => {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      return (
        await api.post(`/auctions/${id}/images`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data as UploadResult[];
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["auction", id] });
    },
  });
};

export const usePlaceBid = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: BidCreateRequest) =>
      (await api.post(`/auctions/${id}/bids`, body)).data as BidResponseDto,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey:["auction", id] });
      qc.invalidateQueries({ queryKey:["auction-bids", id] });
    }
  });
};

async function call<T = unknown>(method: "PUT" | "DELETE", url: string, body?: unknown): Promise<T> {
  const r = await fetch(url, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error(await r.text());
  try {
    return (await r.json()) as T;
  } catch {
    return null as unknown as T;
  }
}

export const useUpdateAuction = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: AuctionUpdateRequest) => call("PUT", `/api/v1/auctions/${id}`, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auction", id] });
      qc.invalidateQueries({ queryKey: ["auctions"] });
    },
  });
};

export const useDeleteAuction = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => call("DELETE", `/api/v1/auctions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auctions"] });
    },
  });
};
