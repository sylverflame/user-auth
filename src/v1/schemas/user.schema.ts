import { z } from "zod/v4";
import { ROLES } from "../configs/constants";

export const CreateUserSchema = z.object({
  username: z.string().min(5).max(15),
  password: z.string().min(5).max(15),
  firstName: z.string().min(5).max(10),
  lastName: z.string().min(5).max(10),
  role: z.literal(Object.values(ROLES)),
});

export const RegisterUserSchema = z.object({
  username: z.string().min(5).max(15),
  password: z.string().min(5).max(15),
  firstName: z.string().min(5).max(10),
  lastName: z.string().min(5).max(10),
});

export const UserResponseSchema = z.object({
  id: z.uuidv4(),
  firstName: z.string().min(5).max(10),
  lastName: z.string().min(5).max(10),
  role: z.literal(Object.values(ROLES)),
});

export const AuthenticateUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const TokenUserDataSchema = z.object({
  username: z.string(),
  role: z.literal(Object.values(ROLES)),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type TokenUserData = z.infer<typeof TokenUserDataSchema>;
