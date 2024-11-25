import { z, ZodType } from "zod";
import { AddAdminForm } from "../pages/authenticated/admin/manage-admin.page.tsx";

export const AddAdminSchema: ZodType<AddAdminForm> = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  username: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
});

export const EditAdminSchema: ZodType<AddAdminForm> = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  username: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
  id: z.string().min(1),
});
