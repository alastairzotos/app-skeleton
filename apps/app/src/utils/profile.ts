import { FREE_TRIAL_DURATION, type Profile, SECONDS_IN_DAY } from "@repo/common";
import dayjs from "dayjs";
import { useAuthState } from "../state/auth";

interface SubscriptionInfo {
  active: boolean;
  daysLeftOfTrial?: number;
  trialEnded?: boolean;
}

export const getSubscriptionInfoFromProfile = (profile: Profile | null): SubscriptionInfo | null => {
  if (!profile) {
    return null;
  }

  if (profile.stripeSubscriptionStatus !== 'active') {
    const daysLeftOfTrial = Math.ceil((FREE_TRIAL_DURATION - dayjs().diff(new Date(profile.createdAt).getTime(), 'seconds')) / SECONDS_IN_DAY);
    return {
      active: false,
      daysLeftOfTrial,
      trialEnded: daysLeftOfTrial <= 0,
    };
  }

  return {
    active: true,
  };
}

export const useSubscriptionInfo = (): SubscriptionInfo | null => {
  const { profile } = useAuthState();

  return getSubscriptionInfoFromProfile(profile);
}
