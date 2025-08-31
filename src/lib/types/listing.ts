export type TagDto = {
    id: number;
    name: string;
    slug: string;
};

export type ListingImageDto = {
    id: number;
    url: string;
    idx: number;
};

export type ListingSellerDto = {
    userId: number;
    username?: string | null;
    displayName?: string | null;
    avatarUrl?: string | null;
    location?: string | null;
};

export type ListingResponseDto = {
    id: number;
    seller?: ListingSellerDto | null;

    title: string;
    description?: string | null;

    brandId?: number | null;
    seriesId?: number | null;
    brandName?: string | null;
    seriesName?: string | null;
    modelName?: string | null;
    scale?: string | null;
    modelYear?: number | null;
    condition?: string | null;
    limitedEdition?: boolean | null;
    theme?: string | null;
    countryOfOrigin?: string | null;

    type: "SALE" | "TRADE";
    price?: string | number | null;
    currency?: string | null;
    location?: string | null;

    status: "ACTIVE" | "SOLD" | "WITHDRAWN";
    isActive?: boolean | null;

    createdAt?: string | null;
    updatedAt?: string | null;

    images?: ListingImageDto[];
    tags?: TagDto[];
};

export type Page<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // current page (0-based)
};
