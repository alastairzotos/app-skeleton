import { z } from "zod";
import { AsTable } from "../util";

export const userRoleSchema = z.enum(['user', 'admin']);

export type UserRoles = z.infer<typeof userRoleSchema>;

export const userSchema = z.object({
  email: z.string(),
  name: z.string(),
  role: userRoleSchema,
});

export type UserSchema = z.infer<typeof userSchema>;

export type User = AsTable<UserSchema>;

export const postSchema = z.object({
  ownerId: z.string(),
  title: z.string(),
  content: z.string(),
})

export type PostSchema = z.infer<typeof postSchema>;
