import type { Profile } from "@repo/common";
import type { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthValues {
  user: User | null;
  accessToken: string | null;
  profile: Profile | null;
}

interface AuthActions {
  setAuth: (user: User | null, accessToken: string | null) => void;
  setProfile: (profile: Profile | null) => void;
}

export const useAuthState = create<AuthValues & AuthActions>(set => ({
  user: null,
  accessToken: null,
  profile: null,

  setAuth: (user, accessToken) => set({ user, accessToken }),
  setProfile: (profile) => set({ profile }),
}));
