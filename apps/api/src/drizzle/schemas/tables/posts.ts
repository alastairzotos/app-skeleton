import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { commonColumns, DoesExtend, userResource } from "drizzle/schemas/tables/common";

import { PostSchema } from "@repo/common";

export const postsTable = pgTable('posts_table', {
  ...commonColumns,
  ...userResource,
  
  title: varchar('title', { length: 255 }),
  content: text('content'),
});

export type PostType = DoesExtend<PostSchema, InferSelectModel<typeof postsTable>>;
