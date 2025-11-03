import type { Profile, ProfileAction } from "@repo/common";
import { httpClient } from "./client";

export const getProfileRequest = async (id: string) => (
  (await httpClient.get<Profile>(`profiles/${id}`)).data
);

export const getOrCreateProfileRequest = async () => (
  (await httpClient.post<Profile>('profiles/get-or-create')).data
);

export const deleteProfileRequest = async (id: string) => (
  await httpClient.delete(`profiles/${id}`)
);

export const canProfilePerformActionRequest = async (action: ProfileAction, resourceId?: string) => {
  let url = `profiles/can/${action}`;
  
  if (resourceId) {
    url += `?resourceId=${resourceId}`;
  }

  return await httpClient.get(url);
};
