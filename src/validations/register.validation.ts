import { z, ZodType } from "zod";
import { RegisterForm } from "../pages/register.page.tsx";

export const RegisterSchema: ZodType<RegisterForm> = z
  .object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    birthday: z.string().refine((dateString) => {
      const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
      return regex.test(dateString);
    }, "Invalid date format. Please use dd-mm-yyyy format."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
