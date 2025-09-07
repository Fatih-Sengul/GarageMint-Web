"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  AuctionListItemDto,
  AuctionResponseDto,
  BidResponseDto,
  AuctionCreateRequest,
  BidCreateRequest,
  UploadResult,
  AuctionUpdateRequest,
} from "@/lib/types/auction";

export const useAuctions = (params?: Record<string, unknown>) =>
  useQuery<AuctionListItemDto[]>({
    queryKey: ["auctions", params],
    queryFn: async () => (await api.get("/api/v1/auctions", { params })).data,
  });

export const useAuctionsBySeller = (userId?: number) =>
  useQuery<AuctionListItemDto[]>({
    queryKey: ["auctions", "seller", userId ?? "me"],
    queryFn: async () =>
      (await api.get("/api/v1/auctions/seller", { params: userId ? { userId } : undefined })).data,
  });

export const useAuction = (id: number) =>
  useQuery<AuctionResponseDto>({
    queryKey: ["auction", id],
    queryFn: async () => (await api.get(`/api/v1/auctions/${id}`)).data,
    enabled: !!id,
  });

export const useBids = (id: number) =>
  useQuery<BidResponseDto[]>({
    queryKey: ["auction-bids", id],
    queryFn: async () => (await api.get(`/api/v1/auctions/${id}/bids`)).data,
    enabled: !!id,
  });

export const useCreateAuction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: AuctionCreateRequest) =>
      (await api.post("/api/v1/auctions", body)).data as AuctionResponseDto,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auctions"] }),
  });
};

export const useUploadAuctionImages = () => {
  const qc = useQueryClient();
  return useMutation<UploadResult[], unknown, { id: number; files: File[] }>({
    mutationFn: async ({ id, files }) => {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      return (
        await api.post(`/api/v1/auctions/${id}/images`, fd, {
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
      (await api.post(`/api/v1/auctions/${id}/bids`, body)).data as BidResponseDto,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auction", id] });
      qc.invalidateQueries({ queryKey: ["auction-bids", id] });
    },
  });
};

async function call<T = unknown>(method: "PUT" | "DELETE", url: string, body?: unknown): Promise<T> {
  const r = await api.request<T>({ url, method, data: body });
  return r.status === 204 ? (null as unknown as T) : r.data;
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
