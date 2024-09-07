import { AsTable } from "../util";
import { z } from "zod";

export const userSchema = z.object({
  email: z.string(),
  hashedPassword: z.string(),
})

export type UserSchema = z.infer<typeof userSchema>;
export type PublicUser = AsTable<Omit<UserSchema, 'hashedPassword'>>;

export const registerSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
