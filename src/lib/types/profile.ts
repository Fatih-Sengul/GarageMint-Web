export type DigestFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "NEVER" | string;
export type ProfileLinkType = "INSTAGRAM" | "TWITTER" | "WEBSITE" | string;

export interface ProfileLinkDto {
    id?: number;
    type?: ProfileLinkType;
    label?: string;
    url?: string;
    idx?: number;
    isPublic?: boolean | null;
}

export interface ProfilePrefsDto {
    showEmail?: boolean;
    showLocation?: boolean;
    showLinks?: boolean;
    searchable?: boolean;
    allowDm?: boolean;
    showCollection?: boolean;
    showListings?: boolean;
}

export interface NotificationSettingsDto {
    emailGeneral?: boolean;
    emailMessage?: boolean;
    emailFavorite?: boolean;
    emailListingActivity?: boolean;
    pushGeneral?: boolean;
    digestFrequency?: DigestFrequency;
}

export interface ProfileStatsDto {
    listingsActiveCount?: number;
    listingsTotalCount?: number;
    followersCount?: number;
    followingCount?: number;
    responseRate?: number;
    lastActiveAt?: string;
}

export interface ListingImageDto { id: number; url: string; idx?: number; }
export interface ListingTagDto { id: number; name: string; slug: string; }

export interface ListingResponseDto {
    id: number;
    title: string;
    description?: string;
    brandId?: number;
    seriesId?: number;
    brandName?: string;
    seriesName?: string;
    modelName?: string;
    scale?: string;
    modelYear?: number;
    condition?: string;
    limitedEdition?: boolean;
    theme?: string;
    countryOfOrigin?: string;
    type?: string;
    price?: number;
    currency?: string;
    location?: string;
    status?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    images?: ListingImageDto[];
    tags?: ListingTagDto[];
}

export interface ProfilePublicDto {
    id: number;
    userId: number;
    username: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    location?: string;
    websiteUrl?: string;
    language?: string;
    isVerified?: boolean | null;
    isPublic?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
    links?: ProfileLinkDto[];
    stats?: ProfileStatsDto;
    listings?: ListingResponseDto[];
}

export interface ProfileOwnerDto extends ProfilePublicDto {
    prefs?: ProfilePrefsDto;
    notificationSettings?: NotificationSettingsDto;
}

export interface ProfileUpdateRequest {
    username?: string;
    displayName?: string;
    bio?: string;
    location?: string;
    websiteUrl?: string;
    language?: string;
    isPublic?: boolean | null;
}

export interface ProfilePrefsUpdateRequest extends ProfilePrefsDto {}
export interface NotificationSettingsUpdateRequest extends NotificationSettingsDto {}

export interface UsernameAvailabilityDto { available: boolean; }
export interface UsernameSuggestionsDto { candidates: string[]; }
