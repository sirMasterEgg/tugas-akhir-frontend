import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores/index.store.ts";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "../apis/core/auth/logout.api.ts";
import { authAction } from "../slices/auth.slice.ts";
import { RouteEnum } from "../enums/route.enum.ts";

const useLogout = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [cookies, , removeCookie] = useCookies(["refreshToken"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      dispatch(authAction.unsetUser());
      removeCookie("refreshToken", {
        path: "/",
      });
      navigate(RouteEnum.LOGIN, { replace: true });
    },
    onError: () => {
      dispatch(authAction.unsetUser());
      removeCookie("refreshToken", {
        path: "/",
      });
      navigate(RouteEnum.LOGIN, { replace: true });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate([
      auth.token,
      {
        refreshToken: cookies.refreshToken,
      },
    ]);
  };

  return { handleLogout };
};
export default useLogout;
