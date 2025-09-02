export type AuctionStatus = "SCHEDULED" | "ACTIVE" | "ENDED" | "CANCELLED";

export interface AuctionListItemDto {
  id: number;
  listingId?: number | null;
  startPrice: string | number;        // API BigDecimal string gelebilir
  highestBidAmount?: string | number | null;
  currency: string;                   // "TRY"
  status: AuctionStatus;
  endsAt: string;                     // ISO-8601
}

export interface AuctionResponseDto {
  id: number;
  sellerUserId: number;
  listingId?: number | null;
  startPrice: string | number;
  currency: string;
  startsAt: string;
  endsAt: string;
  status: AuctionStatus;
  highestBidAmount?: string | number | null;
  highestBidUserId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BidResponseDto {
  id: number;
  auctionId: number;
  bidderUserId: number;
  amount: string | number;
  createdAt: string;
}

export interface AuctionCreateRequest {
  listingId?: number | null;
  startPrice: string | number;
  startsAt?: string | null;
  endsAt: string; // ISO
}

export interface BidCreateRequest {
  amount: string | number;
}
