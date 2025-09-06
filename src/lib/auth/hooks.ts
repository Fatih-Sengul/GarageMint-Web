import api from "@/lib/api";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "./store";

export function useLogin() {
  const setTokens = useAuthStore((s) => s.setTokens);
  return useMutation({
      mutationFn: async (payload: { emailOrUsername: string; password: string }) => {
        const r = await axios.post("/api/auth/login", payload);
        return r.data as { accessToken: string; refreshToken: string; expiresIn?: number };
      },
    onSuccess: (d) => {
      setTokens(d.accessToken, d.refreshToken);
      api.defaults.headers.common.Authorization = `Bearer ${d.accessToken}`;
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string; username: string }) => {
      const r = await api.post("/api/v1/auth/register", payload);
      return r.data;
    },
  });
}

export function useLogout() {
    const clear = useAuthStore((s) => s.clear);
    return async () => {
      await axios.post("/api/auth/logout");
      clear();
      window.location.href = "/login";
    };
  }
