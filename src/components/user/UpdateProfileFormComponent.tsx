import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUpdateProfileSchema } from "../../validations/update-profile.validation.ts";
import { GlobalUserDto } from "../../apis/dto/shared/user.dto.ts";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileApi } from "../../apis/core/user/update-profile.api.ts";
import { AxiosError } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/index.store.ts";
import { toast } from "react-toastify";

export type UpdateProfileForm = {
  name: string;
  username: string;
  password: string;
  birthday: string;
};

const convertDateToString = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
const toSentenceCase = (str: string) => {
  if (!str) return str;

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function UpdateProfileFormComponent({
  formData,
}: {
  formData: GlobalUserDto;
}) {
  const [buttonSaveChanges, setButtonSaveChanges] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UpdateProfileForm>({
    resolver: zodResolver(
      createUpdateProfileSchema({
        name: formData.name,
        username: formData.username,
        password: "",
        birthday: convertDateToString(new Date(formData.birthday)),
      })
    ),
    defaultValues: {
      name: formData.name,
      username: formData.username,
      password: "",
      birthday: convertDateToString(new Date(formData.birthday)),
    },
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change" && name !== "password") {
        setButtonSaveChanges(true);
      }

      if (
        value.name === formData.name &&
        value.username === formData.username &&
        value.birthday === convertDateToString(new Date(formData.birthday))
      ) {
        setButtonSaveChanges(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);
  const auth = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const updateProfileDataMutation = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getUserProfile", auth.token, "current"],
      });
      setButtonSaveChanges(false);
      toast.success("Profile updated successfully.");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          toSentenceCase(error.response?.data.message.toString()) as string
        );
      }
    },
  });
  const userDataFormSubmit: SubmitHandler<UpdateProfileForm> = (data) => {
    const formDataObj = new FormData();
    if (data.name && data.name !== formData.name) {
      formDataObj.append("name", data.name);
    }
    if (data.username && data.username !== formData.username) {
      formDataObj.append("username", data.username);
    }
    if (
      data.birthday &&
      data.birthday !== convertDateToString(new Date(formData.birthday))
    ) {
      formDataObj.append("birthday", data.birthday);
    }

    updateProfileDataMutation.mutate([auth.token, formDataObj]);
  };

  const userPasswordFormSubmit: SubmitHandler<UpdateProfileForm> = (data) => {
    const formDataObj = new FormData();
    formDataObj.append("password", data.password);
    updateProfileDataMutation.mutate([auth.token, formDataObj]);
    setValue("password", "");
  };

  return (
    <>
      <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-5 px-4 md:px-0">
        <div className="flex flex-col">
          <span className="font-bold text-xl mb-5">Personal Information</span>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Name</span>
            </div>
            <input
              type="text"
              {...register("name")}
              placeholder="Name"
              className="input input-bordered w-full"
            />
            {errors.name && (
              <div className="label">
                <span className="label-text-alt text-error">
                  {errors.name.message}
                </span>
              </div>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Username</span>
            </div>
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className="input input-bordered w-full"
            />
            {errors.username && (
              <div className="label">
                <span className="label-text-alt text-error">
                  {errors.username.message}
                </span>
              </div>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Birthday</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Date of Birth (DD-MM-YYYY)"
              inputMode="numeric"
              maxLength={10}
              {...register("birthday")}
              onInput={(e) => {
                const inputValue = e.currentTarget.value;

                e.currentTarget.value = inputValue
                  .replace(/\D/g, "")
                  .replace(/(\d{2})(\d{2})(\d{4})/, "$1-$2-$3")
                  .replace(/-$/, "");
              }}
            />
            {errors.birthday && (
              <div className="label">
                <span className="label-text-alt text-error">
                  {errors.birthday.message}
                </span>
              </div>
            )}
          </label>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl mb-5">Security Information</span>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Email</span>
            </div>
            <input
              type="email"
              disabled
              value={formData?.email || ""}
              className="input input-bordered w-full"
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Password</span>
            </div>
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="input input-bordered w-full"
            />
            {errors.password && (
              <div className="label">
                <span className="label-text-alt text-error">
                  {errors.password.message}
                </span>
              </div>
            )}
          </label>
          <div className="mt-5 mb-5 md:mb-0 inline-flex flex-row gap-3">
            <button
              className="btn btn-primary"
              onClick={handleSubmit(userDataFormSubmit)}
              disabled={!buttonSaveChanges}
            >
              Save Changes
            </button>
            <button
              onClick={handleSubmit(userPasswordFormSubmit)}
              className="btn btn-primary btn-outline"
            >
              Change Password
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
