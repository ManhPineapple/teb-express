import { z } from "zod";

import type { Response } from "./baseTemplate";
import { Status } from "./status";
import { RoleZodSchema } from "./role";

export const UserZodSchema = z.object({
  id: z.coerce.number(),
  fullName: z.string(),
  userCode: z.string(),
  email: z.string(),
  password: z.string(),
  phone: z.string(),
  gender: z.string(),
  address: z.string(),
  otherPermissions: z.array(z.string()),
  status: z.nativeEnum(Status),
  permissions: z.array(z.string()),
  role: RoleZodSchema,
  twoFactorEnabled: z.boolean().optional(),
  balance: z.coerce.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type User = z.infer<typeof UserZodSchema>;

export const NewUserZodSchema = UserZodSchema.pick({
  fullName: true,
  email: true,
  phone: true,
  gender: true,
  address: true,
  password: true,
  status: true,
})
  .partial({
    password: true,
    status: true,
  })
  .extend({
    roleId: z.coerce.number(),
  });

export type NewUserDto = z.infer<typeof NewUserZodSchema>;

export type UserResponse = {
  data: User | null;
} & Response;

export type UsersResponse = {
  data: User[] | null;
} & Response;
