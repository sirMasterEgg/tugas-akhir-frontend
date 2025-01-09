import Navbar from "../components/Navbar.tsx";
import {PiCalendar, PiEnvelope, PiLock, PiPencil, PiUser,} from "react-icons/pi";
import {RouteEnum} from "../enums/route.enum.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterSchema} from "../validations/register.validation.ts";
import "react-toastify/dist/ReactToastify.min.css";
import {useMutation} from "@tanstack/react-query";
import {registerApi} from "../apis/core/auth/register.api.ts";
import {toast} from "react-toastify";
import {AxiosError} from "axios";
import Tooltip from "../components/Tooltip.tsx";
import InputWithIcon from "../components/InputWithIcon.tsx";

export type RegisterForm = {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  birthday: string;
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
  });
  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      toast.success(
        "Register success! Please check your email to verify your account."
      );
      reset();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorMessage: string = error.response?.data.message;
        toast.error(errorMessage);
        return
      }
      toast.error("An error occurred. Please try again later.");
    },
  });
  const onSubmit: SubmitHandler<RegisterForm> = (data) => {
    registerMutation.mutate([
      {
        name: data.name,
        username: data.username,
        password: data.password,
        email: data.email,
        birthday: data.birthday,
      },
    ]);
  };
  return (
    <>
      <Navbar />
      <main className="h-[90vh] flex items-center justify-center">
        <div className="lg:w-1/4 flex flex-col items-center justify-center">
          <h1 className="font-bold text-xl mb-3">Register</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 w-full"
          >
            {errors.name ? (
              <Tooltip
                displayTooltip={errors.name && true}
                tooltipMessage={errors.name?.message}
              >
                <InputWithIcon
                  icon={<PiPencil />}
                  type="text"
                  {...register("name")}
                  className="grow"
                  placeholder="Name"
                />
              </Tooltip>
            ) : (
              <InputWithIcon
                icon={<PiPencil />}
                type="text"
                {...register("name")}
                className="grow"
                placeholder="Name"
              />
            )}
            {errors.username ? (
              <Tooltip
                displayTooltip={errors.username && true}
                tooltipMessage={errors.username?.message}
              >
                <InputWithIcon
                  icon={<PiUser />}
                  type="text"
                  {...register("username")}
                  className="grow"
                  placeholder="Username"
                />
              </Tooltip>
            ) : (
              <InputWithIcon
                icon={<PiUser />}
                type="text"
                {...register("username")}
                className="grow"
                placeholder="Username"
              />
            )}
            {errors.password ? (
              <Tooltip
                displayTooltip={errors.password && true}
                tooltipMessage={errors.password?.message}
              >
                <InputWithIcon
                  icon={<PiLock />}
                  type="password"
                  {...register("password")}
                  className="grow"
                  placeholder="Password"
                />
              </Tooltip>
            ) : (
              <InputWithIcon
                icon={<PiLock />}
                type="password"
                {...register("password")}
                className="grow"
                placeholder="Password"
              />
            )}
            {errors.confirmPassword ? (
              <Tooltip
                displayTooltip={errors.confirmPassword && true}
                tooltipMessage={errors.confirmPassword?.message}
              >
                <InputWithIcon
                  icon={<PiLock />}
                  type="password"
                  className="grow"
                  {...register("confirmPassword")}
                  placeholder="Confirm Password"
                />
              </Tooltip>
            ) : (
              <InputWithIcon
                icon={<PiLock />}
                type="password"
                className="grow"
                {...register("confirmPassword")}
                placeholder="Confirm Password"
              />
            )}
            {errors.email ? (
              <Tooltip
                displayTooltip={errors.email && true}
                tooltipMessage={errors.email?.message}
              >
                <InputWithIcon
                  icon={<PiEnvelope />}
                  type="text"
                  {...register("email")}
                  className="grow"
                  placeholder="Email"
                />
              </Tooltip>
            ) : (
              <InputWithIcon
                icon={<PiEnvelope />}
                type="text"
                {...register("email")}
                className="grow"
                placeholder="Email"
              />
            )}
            {errors.birthday ? (
              <Tooltip
                displayTooltip={errors.birthday && true}
                tooltipMessage={errors.birthday?.message}
              >
                <InputWithIcon
                  icon={<PiCalendar />}
                  type="text"
                  className="grow"
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
                  placeholder="Date of Birth (DD-MM-YYYY)"
                />
              </Tooltip>
            ) : (
              <InputWithIcon
                icon={<PiCalendar />}
                type="text"
                className="grow"
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
                placeholder="Date of Birth (DD-MM-YYYY)"
              />
            )}
            <button className="btn rounded-full btn-primary" type="submit">
              {registerMutation.isPending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Sign Up"
              )}
            </button>
            <a href={RouteEnum.LOGIN} className="btn btn-link">
              Already have account?
            </a>
          </form>
        </div>
      </main>
    </>
  );
};
export default RegisterPage;
