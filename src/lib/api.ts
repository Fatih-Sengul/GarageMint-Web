import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
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
        const rt = sessionStorage.getItem("refreshToken");
        if (!rt) throw new Error("No refresh token");
        const r = await axios.post(`${API_BASE}/api/v1/auth/refresh`, { refreshToken: rt });
        sessionStorage.setItem("accessToken", r.data.accessToken);
        if (r.data.refreshToken) sessionStorage.setItem("refreshToken", r.data.refreshToken);
        refreshing = false;
        queue.forEach((resume) => resume());
        queue = [];
        return api(original);
      } catch (e) {
        refreshing = false;
        queue = [];
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
          location.href = "/login";
        }
        throw e;
      }
    }

    throw err;
  }
);

export default api;
