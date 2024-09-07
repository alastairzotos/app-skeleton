import { relations } from 'drizzle-orm';
import { UserTable } from './tables';

export const UserTableRelations = relations(UserTable, ({ many }) => ({
}));
