import { relations } from 'drizzle-orm';
import { postsTable, profileTable } from './tables';

export const profileTableRelations = relations(profileTable, ({ many }) => ({
  posts: many(postsTable),
}));

export const PostsTableRelations = relations(postsTable, ({ one }) => ({
  owner: one(profileTable, {
    fields: [postsTable.userId],
    references: [profileTable.id],
  })
}));
