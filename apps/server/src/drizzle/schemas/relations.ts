import { relations } from 'drizzle-orm';
import { ExampleTable } from './tables';

export const ExampleTableRelations = relations(ExampleTable, ({ many }) => ({
}));
