import { uuid, timestamp } from 'drizzle-orm/pg-core';

export type DoesExtend<T, U extends T> = U;

export const commonColumns = {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
}
