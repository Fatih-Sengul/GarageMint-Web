import { create } from "zustand";

function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string) {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}

function delCookie(name: string) {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;
  setTokens: (a: string, r: string | null) => void;
  clear: () => void;
  isAuthed: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: typeof window !== "undefined" ? getCookie("accessToken") : null,
  refreshToken: typeof window !== "undefined" ? getCookie("refreshToken") : null,
  userId: typeof window !== "undefined" ? Number(getCookie("userId")) || null : null,
  setTokens: (a, r) => {
    let uid: number | null = null;
    try {
      const payload = JSON.parse(atob(a.split(".")[1] || ""));
      uid = payload?.uid ?? payload?.userId ?? null;
      if (typeof uid === "string") uid = Number(uid);
    } catch {
      uid = null;
    }

    if (typeof window !== "undefined") {
      setCookie("accessToken", a);
      if (r) setCookie("refreshToken", r);
      if (uid != null) setCookie("userId", String(uid));
    }

    set({ accessToken: a, refreshToken: r ?? get().refreshToken, userId: uid });
  },
  clear: () => {
    if (typeof window !== "undefined") {
      delCookie("accessToken");
      delCookie("refreshToken");
      delCookie("userId");
    }
    set({ accessToken: null, refreshToken: null, userId: null });
  },
  isAuthed: () => {
    if (typeof window === "undefined") return false;
    return !!get().accessToken;
  },
}));
