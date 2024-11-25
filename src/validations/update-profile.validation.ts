import { z, ZodType } from "zod";
import { UpdateProfileForm } from "../components/user/UpdateProfileFormComponent.tsx";

export const UpdateProfileSchema: ZodType<UpdateProfileForm> = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  birthday: z.string().refine((dateString) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
    return regex.test(dateString);
  }, "Invalid date format. Please use dd-mm-yyyy format."),
});

export const createUpdateProfileSchema = (
  defaultValues: UpdateProfileForm
): ZodType<UpdateProfileForm> => {
  return z
    .object({
      name: z.string().min(1, "Name is required"),
      username: z.string().min(1, "Username is required"),
      password: z.string(),
      birthday: z.string().refine((dateString) => {
        const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
        return regex.test(dateString);
      }, "Invalid date format. Please use dd-mm-yyyy format."),
    })
    .refine(
      (data) => {
        const { name, username, password, birthday } = data;

        const isNameSame = name === defaultValues.name;
        const isUsernameSame = username === defaultValues.username;
        const isBirthdaySame = birthday === defaultValues.birthday;
        const isPasswordNull = password === undefined || password === "";

        // If any of name, username, or birthday are different from default, password can be null
        if (!isNameSame || !isUsernameSame || !isBirthdaySame) {
          return isPasswordNull || password.length > 0;
        }

        // If password is not null, name, username, and birthday can be same as default
        if (!isPasswordNull) {
          return isNameSame && isUsernameSame && isBirthdaySame;
        }

        // If all fields are the same as default and password is null, it's valid
        return true;
      },
      {
        message:
          "If any of the fields (name, username, birthday) are different from default values, password can be null. If password is provided, all fields must be same as default values.",
        path: ["password"],
      }
    );
};
