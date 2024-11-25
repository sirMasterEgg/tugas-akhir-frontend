import Navbar from "../components/Navbar.tsx";
import { PiLock, PiUser } from "react-icons/pi";
import { RouteEnum } from "../enums/route.enum.ts";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../apis/core/auth/login.api.ts";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { authAction } from "../slices/auth.slice.ts";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

type LoginForm = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const { register, handleSubmit, reset } = useForm<LoginForm>();
  const dispatch = useDispatch();
  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    loginMutation.mutate([
      {
        username: data.username,
        password: data.password,
      },
    ]);
  };
  const [, setCookie] = useCookies(["refreshToken"]);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (result) => {
      dispatch(
        authAction.setUser({
          user: result.user,
          token: result.accessToken,
        })
      );
      setCookie("refreshToken", result.refreshToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      if (result.user.role === "admin") {
        navigate(RouteEnum.ADMIN_HOME, {
          replace: true,
        });
        return;
      }

      navigate(RouteEnum.HOME, {
        replace: true,
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Login Failed.");
      }
      reset({
        password: "",
      });
    },
  });

  return (
    <>
      <Navbar />
      <main className="h-[90vh] flex items-center justify-center">
        <div className="lg:w-1/4 flex flex-col items-center justify-center">
          <h1 className="font-bold text-xl mb-3">Login</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 w-full"
          >
            <label className="input rounded-full input-bordered flex items-center gap-2">
              <input
                type="text"
                {...register("username")}
                className="grow"
                placeholder="Username"
              />
              <PiUser />
            </label>
            <label className="input rounded-full input-bordered flex items-center gap-2">
              <input
                type="password"
                {...register("password")}
                className="grow"
                placeholder="Password"
              />
              <PiLock />
            </label>
            <button className="btn btn-primary rounded-full" type="submit">
              {loginMutation.isPending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Sign In"
              )}
            </button>
            <a href={RouteEnum.FORGOT_PASSWORD} className="btn btn-link">
              Forgot with your password?
            </a>
          </form>
        </div>
      </main>
    </>
  );
};
export default LoginPage;
