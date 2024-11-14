import { pgEnum, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { DoesExtend, commonColumns } from "./common";
import { UserSchema } from "@repo/models";
import { InferSelectModel } from "drizzle-orm";

export const userRoleEnum = pgEnum('user_roles', ['user', 'admin']);

export const usersTable = pgTable('users', {
  ...commonColumns,

  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('user'),
}, (table) => ({
  unique_email_idx: uniqueIndex(table.email.name),
}));

export type UserType = DoesExtend<UserSchema, InferSelectModel<typeof usersTable>>;
