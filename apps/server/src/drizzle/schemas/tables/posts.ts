import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { commonColumns, DoesExtend } from "drizzle/schemas/tables/common";

import { PostSchema } from "@repo/models";
import { usersTable } from "./user";

export const postsTable = pgTable('posts_table', {
  ...commonColumns,

  ownerId: uuid('owner_id').references(() => usersTable.id),
  title: varchar('title', { length: 255 }),
  content: text('content'),
});

export type PostType = DoesExtend<PostSchema, InferSelectModel<typeof postsTable>>;
