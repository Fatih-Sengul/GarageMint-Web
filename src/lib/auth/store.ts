import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;
  setTokens: (a: string, r: string | null) => void;
  clear: () => void;
  isAuthed: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null,
  refreshToken: typeof window !== "undefined" ? sessionStorage.getItem("refreshToken") : null,
  userId: typeof window !== "undefined" ? Number(sessionStorage.getItem("userId")) || null : null,
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
      sessionStorage.setItem("accessToken", a);
      if (r) sessionStorage.setItem("refreshToken", r);
      if (uid != null) sessionStorage.setItem("userId", String(uid));
    }

    set({ accessToken: a, refreshToken: r ?? get().refreshToken, userId: uid });
  },
  clear: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("userId");
    }
    set({ accessToken: null, refreshToken: null, userId: null });
  },
  isAuthed: () => {
    if (typeof window === "undefined") return false;
    return !!sessionStorage.getItem("accessToken");
  },
}));
