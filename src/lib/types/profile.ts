import type { ListingResponseDto } from "./listing";

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


export interface ProfilePublicDto {
    id: number;
    userId: number;
    username: string;
    displayName?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    location?: string | null;
    websiteUrl?: string | null;
    language?: string | null;
    isVerified?: boolean | null;
    isPublic?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
    links?: ProfileLinkDto[];
    stats?: ProfileStatsDto | null;
    listings?: ListingResponseDto[];

    /** Viewer context */
    isFollowing?: boolean | null;
    isFollowedByMe?: boolean | null;
}

export interface ProfileOwnerDto extends ProfilePublicDto {
    prefs?: ProfilePrefsDto;
    notificationSettings?: NotificationSettingsDto;

    /** Duplicated for easier access */
    followersCount?: number;
    followingCount?: number;
    listings?: ListingResponseDto[];
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

export type ProfilePrefsUpdateRequest = ProfilePrefsDto;
export type NotificationSettingsUpdateRequest = NotificationSettingsDto;

export interface UsernameAvailabilityDto { available: boolean; }
export interface UsernameSuggestionsDto { candidates: string[]; }

export type FollowUserDto = {
    id: number;            // profileId
    username: string;
    displayName: string | null;
    avatarUrl?: string | null;
    isVerified?: boolean | null;
};

export type FollowListResponse = {
    items: FollowUserDto[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
};
