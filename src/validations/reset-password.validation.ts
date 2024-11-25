import { z, ZodType } from "zod";
import { ResetPasswordForm } from "../pages/reset-password.page.tsx";

export const ResetPasswordSchema: ZodType<ResetPasswordForm> = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
