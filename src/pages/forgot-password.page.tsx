import Navbar from "../components/Navbar.tsx";
import { PiEnvelope } from "react-icons/pi";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "../apis/core/auth/forgot-password.api.ts";
import { toast } from "react-toastify";

type ForgotPasswordForm = {
  email: string;
};
const ForgotPasswordPage = () => {
  const { register, handleSubmit, reset } = useForm<ForgotPasswordForm>();
  const onSubmit: SubmitHandler<ForgotPasswordForm> = (data) => {
    forgotPasswordMutation.mutate([
      {
        email: data.email,
      },
    ]);
  };

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: (result) => {
      toast.success(result.message);
      reset();
    },
    onError: () => {
      toast.error("Failed to reset password!");
      reset();
    },
  });

  return (
    <>
      <Navbar />
      <main className="h-[90vh] flex items-center justify-center">
        <div className="lg:w-1/4 flex flex-col items-center justify-center">
          <h1 className="font-bold text-xl mb-3">Forgot Password</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 w-full"
          >
            <label className="input rounded-full input-bordered flex items-center gap-2">
              <input
                type="text"
                {...register("email")}
                className="grow"
                placeholder="Email"
              />
              <PiEnvelope />
            </label>
            <button className="btn rounded-full btn-primary" type="submit">
              {forgotPasswordMutation.isPending ? (
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
export default ForgotPasswordPage;
