import Navbar from "../components/Navbar.tsx";
import { PiLock } from "react-icons/pi";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  headResetPasswordApi,
  resetPasswordApi,
} from "../apis/core/auth/reset-password.api.ts";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ResetPasswordSchema } from "../validations/reset-password.validation.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { RouteEnum } from "../enums/route.enum.ts";

export type ResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
  });
  const [query] = useSearchParams();
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ResetPasswordForm> = (data) => {
    const token = query.get("token");
    if (token) {
      resetPasswordMutation.mutate([
        token!,
        {
          password: data.password,
        },
      ]);
    }
  };

  const resetPasswordMutation = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success("Password has been reset!");
      navigate(RouteEnum.LOGIN, { replace: true });
    },
    onError: (error) => {
      console.error("[Reset Password]", error);
      toast.error("Failed to reset password!");
    },
  });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await headResetPasswordApi([query.get("token") ?? ""]);
        return true;
      } catch (e) {
        setError(true);
        return false;
      }
    };

    verifyToken();
  }, []);

  if (error) {
    return (
      <>
        <Navbar />
        <main className="h-[90vh] flex items-center justify-center">
          <h1 className="font-bold text-xl">Invalid Token!</h1>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="h-[90vh] flex items-center justify-center">
        <div className="lg:w-1/4 flex flex-col items-center justify-center">
          <h1 className="font-bold text-xl mb-3">Reset Password</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 w-full"
          >
            <div
              className={`tooltip tooltip-right tooltip-error ${
                errors.password && "tooltip-open"
              }`}
              data-tip={errors.password?.message}
            >
              <label className="input rounded-full input-bordered flex items-center gap-2">
                <input
                  type="password"
                  {...register("password")}
                  className="grow"
                  placeholder="Password"
                />
                <PiLock />
              </label>
            </div>
            <div
              className={`tooltip tooltip-right tooltip-error ${
                errors.confirmPassword && "tooltip-open"
              }`}
              data-tip={errors.confirmPassword?.message}
            >
              <label className="input rounded-full input-bordered flex items-center gap-2">
                <input
                  type="password"
                  className="grow"
                  {...register("confirmPassword")}
                  placeholder="Confirm Password"
                />
                <PiLock />
              </label>
            </div>
            <button className="btn rounded-full btn-primary" type="submit">
              {resetPasswordMutation.isPending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};
export default ResetPasswordPage;
