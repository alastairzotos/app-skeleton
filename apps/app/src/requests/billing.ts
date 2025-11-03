import type { PriceTier } from "@repo/common";
import { httpClient } from "./client";

export const createCheckoutSessionRequest = async (tier: PriceTier) => (
  (await httpClient.post<string>(`/billing/create-checkout-session/${tier}`)).data
);

export const cancelSubscriptionRequest = async () => (
  await httpClient.delete('/billing/cancel-subscription')
);

export const createPortalSessionRequest = async () => (
  (await httpClient.post<string>('/billing/portal')).data
);
