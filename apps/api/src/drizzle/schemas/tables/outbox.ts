import { pgTable } from "drizzle-orm/pg-core";
import { commonColumns } from "./common";
import { varchar } from "drizzle-orm/pg-core";
import { jsonb } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";
import { boolean } from "drizzle-orm/pg-core";

export const outboxTable = pgTable('outbox', {
  ...commonColumns,
  queue: varchar('queue', { length: 255 }).notNull(),
  type: varchar('type', { length: 255 }).notNull(),
  payload: jsonb('payload').$type<any>(),
  claimed: boolean('claimed').default(false),
});

export type Outbox = InferSelectModel<typeof outboxTable>;
