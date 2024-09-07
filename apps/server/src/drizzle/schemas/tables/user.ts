import { InferSelectModel } from 'drizzle-orm';
import { pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { UserSchema } from '@repo/models';
import { DoesExtend, commonColumns } from 'drizzle/schemas/tables/common';

export const UserTable = pgTable('user', {
  ...commonColumns,

  email: varchar('email', { length: 255 }).unique().notNull(),
  hashedPassword: varchar('hashedPassword', { length: 255 })
    .notNull()

}, (table) => ({
  emailIdx: uniqueIndex('user_email_idx').on(table.email),
}));

export type User = DoesExtend<UserSchema, InferSelectModel<typeof UserTable>>;
