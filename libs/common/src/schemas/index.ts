import { z } from "zod";
import { AsTable } from "../util";
import { priceTiers } from "../price-tiers";

export const profileRoles = ['admin', 'user'] as const;
export const profileRolesSchema = z.enum(profileRoles);
export type ProfileRole = z.infer<typeof profileRolesSchema>;

export const subscriptionStatus = z.enum([
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'paused',
  'trialing',
  'unpaid',
]);
export type SubscriptionStatus = z.infer<typeof subscriptionStatus>;

export const profileSchema = z.object({
  id: z.string(),
  userId: z.string(), // Same value as 'id' but makes access-control checks easier
  tier: z.enum(priceTiers),
  role: profileRolesSchema,

  stripeCustomerId: z.string(),
  stripeSubscriptionId: z.string(),
  stripeSubscriptionStatus: subscriptionStatus,
  nextBillingDate: z.date(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
export type Profile = AsTable<ProfileSchema>;

export const postSchema = z.object({
  userId: z.string(),
  title: z.string(),
  content: z.string(),
})

export type PostSchema = z.infer<typeof postSchema>;
