export type ProfileMini = {
  userId: number;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
};

export type AuctionListItemDto = {
  id: number;
  listingId?: number | null;
  startPrice: string;          // decimal string
  highestBidAmount?: string | null;
  currency: string;            // "TRY"
  status: string;              // ACTIVE/...
  endsAt: string;              // ISO
  // opsiyonel görsel
  coverUrl?: string | null;
  sellerUserId?: number;
  sellerUsername?: string | null;
  seller?: ProfileMini | null;
};

export type AuctionResponseDto = {
  id: number;
  sellerUserId: number;
  listingId?: number | null;
  startPrice: string;
  currency: string;
  startsAt: string;
  endsAt: string;
  status: "SCHEDULED" | "ACTIVE" | "ENDED" | "CANCELLED";
  highestBidAmount?: string | null;
  highestBidUserId?: number | null;
  createdAt: string;
  updatedAt: string;
  // detay için
  title?: string | null;
  description?: string | null;
  brand?: string | null;
  model?: string | null;
  location?: string | null;
  images?: { id?: number; url: string; idx: number }[];
  seller?: ProfileMini | null;
};

export type BidResponseDto = {
  id: number;
  auctionId: number;
  bidderUserId: number;
  amount: string;          // decimal string
  createdAt: string;
  bidder?: ProfileMini | null; // avatar & isim için
};

export type AuctionCreateRequest = {
  listingId?: number | null;
  startPrice: string;        // "100.00"
  startsAt?: string | null;  // ISO (opsiyonel)
  endsAt: string;            // ISO
  title?: string;
  description?: string;
  brand?: string;
  model?: string;
  location?: string;
};

export type AuctionUpdateRequest = {
  title?: string;
  description?: string;
  brand?: string;
  model?: string;
  location?: string;
  endsAt?: string; // ISO
  status?: "ACTIVE" | "CANCELLED";
};

export type BidCreateRequest = { amount: string };

export type UploadResult = { id: number; url: string; idx: number };
