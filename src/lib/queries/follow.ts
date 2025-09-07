import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queries/profile";

export type FollowUser = {
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  isVerified?: boolean | null;
};
export type FollowPage = {
  items: FollowUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export function useFollowers(username: string, page = 0, size = 20) {
  return useQuery<FollowPage>({
    queryKey: ["followers", username, page, size],
    queryFn: async () =>
      (
        await api.get(`/api/v1/profiles/${username}/followers`, {
          params: { page, size },
        })
      ).data,
    enabled: !!username,
  });
}
export function useFollowing(username: string, page = 0, size = 20) {
  return useQuery<FollowPage>({
    queryKey: ["following", username, page, size],
    queryFn: async () =>
      (
        await api.get(`/api/v1/profiles/${username}/following`, {
          params: { page, size },
        })
      ).data,
    enabled: !!username,
  });
}
export function useFollow(username: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (await api.post(`/api/v1/profiles/${username}/follow`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["followers", username] });
      qc.invalidateQueries({ queryKey: ["following"] });
      qc.invalidateQueries({ queryKey: qk.me });
      qc.invalidateQueries({ queryKey: qk.public(username) });
    },
  });
}
export function useUnfollow(username: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (await api.delete(`/api/v1/profiles/${username}/follow`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["followers", username] });
      qc.invalidateQueries({ queryKey: ["following"] });
      qc.invalidateQueries({ queryKey: qk.me });
      qc.invalidateQueries({ queryKey: qk.public(username) });
    },
  });
}
