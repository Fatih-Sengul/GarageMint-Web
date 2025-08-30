// Keep enums open-ended until backend constants are frozen.
export type DigestFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "NEVER" | string;
export type ProfileLinkType = string; // TODO: restrict when backend enum is known

export interface NotificationSettingsDto {
  emailGeneral?: boolean;
  emailMessage?: boolean;
  emailFavorite?: boolean;
  emailListingActivity?: boolean;
  pushGeneral?: boolean;
  digestFrequency?: DigestFrequency;
}

export type NotificationSettingsUpdateRequest = NotificationSettingsDto;

export interface ProfileLinkDto {
  id?: number;
  type?: ProfileLinkType;
  label?: string;
  url?: string;
  idx?: number;
  isPublic?: boolean;
}

export interface ProfileLinksUpsertRequest {
  links: ProfileLinkDto[];
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
export type ProfilePrefsUpdateRequest = ProfilePrefsDto;

export interface ProfileStatsDto {
  listingsActiveCount?: number;
  listingsTotalCount?: number;
  followersCount?: number;
  followingCount?: number;
  responseRate?: number; // 0-100 short
  lastActiveAt?: string; // ISO
}

// Minimal listing shape for Profile pages. Expand later from cars service.
export interface ListingResponseDto {
  id: number;
  title: string;
  price?: number;
  currency?: string;
  images?: string[];
  sellerUsername?: string;
  createdAt?: string;
  isPublic?: boolean;
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
  isVerified?: boolean;
  isPublic?: boolean;
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
  username?: string;        // ^[a-z0-9_]{3,32}$
  displayName?: string;     // <=80
  bio?: string;             // <=500
  location?: string;        // <=120
  websiteUrl?: string;      // <=250
  language?: string;        // <=8
  isPublic?: boolean;
}

export interface UsernameAvailabilityDto { available: boolean; }
export interface UsernameSuggestionsDto { candidates: string[]; }
