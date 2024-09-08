import { z } from "zod";

export const exampleSchema = z.object({
  value: z.string(),
})

export type ExampleSchema = z.infer<typeof exampleSchema>;
