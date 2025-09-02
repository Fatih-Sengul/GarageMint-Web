"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  AuctionListItemDto,
  AuctionResponseDto,
  BidResponseDto,
  BidCreateRequest,
  AuctionCreateRequest,
} from "@/lib/types/auction";

const AUCTIONS = "auctions";

export function useAuctions() {
  return useQuery({
    queryKey: [AUCTIONS, "list"],
    queryFn: async () => {
      const { data } = await api.get<AuctionListItemDto[]>("/auctions");
      return data;
    },
    staleTime: 10_000,
  });
}

export function useAuction(id: number, refetchMs?: number) {
  return useQuery({
    queryKey: [AUCTIONS, "detail", id],
    queryFn: async () => {
      const { data } = await api.get<AuctionResponseDto>(`/auctions/${id}`);
      return data;
    },
    refetchInterval: refetchMs,
  });
}

export function useAuctionBids(id: number, refetchMs?: number) {
  return useQuery({
    queryKey: [AUCTIONS, "bids", id],
    queryFn: async () => {
      const { data } = await api.get<BidResponseDto[]>(`/auctions/${id}/bids`);
      return data;
    },
    refetchInterval: refetchMs,
  });
}

export function usePlaceBid(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BidCreateRequest) => {
      const { data } = await api.post<BidResponseDto>(`/auctions/${id}/bids`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [AUCTIONS, "detail", id] });
      qc.invalidateQueries({ queryKey: [AUCTIONS, "bids", id] });
      qc.invalidateQueries({ queryKey: [AUCTIONS, "list"] });
    },
  });
}

export function useCreateAuction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AuctionCreateRequest) => {
      const { data } = await api.post<AuctionResponseDto>("/auctions", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [AUCTIONS, "list"] });
    },
  });
}
