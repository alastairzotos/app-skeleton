import { uuid, timestamp } from 'drizzle-orm/pg-core';
import { profileTable } from './profile';

export type DoesExtend<T, U extends T> = U;

export const commonColumns = {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
};

export const userResource = {
  userId: uuid('user_id').references(() => profileTable.id, { onDelete: 'cascade' }),
};
