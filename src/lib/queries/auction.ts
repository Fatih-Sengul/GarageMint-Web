"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  AuctionListItemDto, AuctionResponseDto,
  BidResponseDto, AuctionCreateRequest, BidCreateRequest, UploadResult
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

export const useUploadAuctionImages = (id: number) =>
  useMutation({
    mutationFn: async (files: File[]) => {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      return (await api.post(`/auctions/${id}/images`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })).data as UploadResult[];
    },
  });

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
