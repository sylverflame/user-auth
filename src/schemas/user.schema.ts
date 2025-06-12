import { z } from "zod/v4";

export const UserSchema = z.object({
  username: z.string().min(5).max(15).optional(),
  password: z.string().min(5).max(15).optional(),
  firstName: z.string().min(5).max(10),
  lastName: z.string().min(5).max(10),
  role: z.literal(["Admin", "Employee"]),
});

export type User = z.infer<typeof UserSchema>;
