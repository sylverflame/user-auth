import { z } from "zod/v4";

export const UserSchema = z.object({
  username: z.string().min(5).max(15),
  password: z.string().min(5).max(15),
  firstName: z.string().min(5).max(10),
  lastName: z.string().min(5).max(10),
  role: z.literal(["Admin", "Employee"]),
});

export const UserResponseSchema = z.object({
  id: z.number(),
  firstName: z.string().min(5).max(10),
  lastName: z.string().min(5).max(10),
  role: z.literal(["Admin", "Employee"]),
});

export type User = z.infer<typeof UserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
