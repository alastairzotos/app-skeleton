import { priceTiers, profileRoles, ProfileSchema, SubscriptionStatus } from "@repo/common";
import { InferSelectModel } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { commonColumns, DoesExtend } from "./common";

export const profileRoleEnum = pgEnum('profile_role', profileRoles);
export const priceTierEnum = pgEnum('price_tier', priceTiers);

export const profileTable = pgTable('profiles', {
  ...commonColumns,

  id: uuid('id').primaryKey(),
  userId: uuid('user_id'), // Same value as 'id' but makes access-control checks easier
  role: profileRoleEnum('role').default('user'),
  tier: priceTierEnum('tier'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  stripeSubscriptionStatus: varchar('stripe_subscription_status', { length: 255 }).$type<SubscriptionStatus>(),
  nextBillingDate: timestamp('next_billing_date'),
});

export type ProfileTable = DoesExtend<ProfileSchema, InferSelectModel<typeof profileTable>>;
