import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (a: string, r: string | null) => void;
  clear: () => void;
  isAuthed: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  setTokens: (a, r) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("accessToken", a);
      if (r) sessionStorage.setItem("refreshToken", r);
    }
    set({ accessToken: a, refreshToken: r ?? get().refreshToken });
  },
  clear: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
    }
    set({ accessToken: null, refreshToken: null });
  },
  isAuthed: () => {
    if (typeof window === "undefined") return false;
    return !!sessionStorage.getItem("accessToken");
  },
}));
