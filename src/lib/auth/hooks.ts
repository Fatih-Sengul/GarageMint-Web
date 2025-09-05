import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "./store";

export function useLogin() {
  const setTokens = useAuthStore((s) => s.setTokens);
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const r = await api.post("/api/v1/auth/login", payload);
      return r.data as { accessToken: string; refreshToken: string; expiresIn?: number };
    },
    onSuccess: (d) => {
      setTokens(d.accessToken, d.refreshToken);
      window.location.href = "/";
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string; displayName: string }) => {
      const r = await api.post("/api/v1/auth/register", payload);
      return r.data;
    },
  });
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear);
  return () => {
    clear();
    window.location.href = "/login";
  };
}
