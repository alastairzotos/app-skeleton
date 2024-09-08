import { InferSelectModel } from "drizzle-orm";
import { index, pgTable, varchar } from "drizzle-orm/pg-core";
import { commonColumns, DoesExtend } from "drizzle/schemas/tables/common";

import { ExampleSchema } from "@repo/models";

export const ExampleTable = pgTable('example_table', {
  ...commonColumns,

  value: varchar('value', { length: 255 })
}, ({ value }) => ({
  value_idx: index('value_idx').on(value),
}));

export type ExampleType = DoesExtend<ExampleSchema, InferSelectModel<typeof ExampleTable>>;
