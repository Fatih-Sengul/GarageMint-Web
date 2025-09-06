import axios, { AxiosError, AxiosRequestConfig } from "axios";

function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function delCookie(name: string) {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getCookie("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
      const original = err.config as AxiosRequestConfig & { _retry?: boolean };
      const status = err?.response?.status;

    if (status === 401 && !original?._retry) {
      if (refreshing) {
        await new Promise<void>((ok) => queue.push(ok));
        return api(original);
      }
      refreshing = true;
      original._retry = true;

        try {
          const r = await axios.post("/api/auth/refresh");
          api.defaults.headers.common.Authorization = `Bearer ${r.data.accessToken}`;
          refreshing = false;
          queue.forEach((resume) => resume());
          queue = [];
          return api(original);
        } catch (e) {
          refreshing = false;
          queue = [];
          delCookie("accessToken");
          delCookie("refreshToken");
          if (typeof window !== "undefined") location.href = "/login";
          throw e;
        }
      }

    throw err;
  }
);

export default api;
