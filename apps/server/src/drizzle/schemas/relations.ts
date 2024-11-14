import { relations } from 'drizzle-orm';
import { postsTable, usersTable } from './tables';

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
}));

export const PostsTableRelations = relations(postsTable, ({ one }) => ({
  owner: one(usersTable, {
    fields: [postsTable.ownerId],
    references: [usersTable.id],
  })
}));
