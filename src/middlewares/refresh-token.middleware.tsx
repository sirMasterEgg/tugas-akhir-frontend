import { Outlet, useNavigate } from "react-router-dom";
import { RouteEnum } from "../enums/route.enum.ts";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores/index.store.ts";
import { refreshTokenApi } from "../apis/core/auth/refresh-token.api.ts";
import { useCookies } from "react-cookie";
import { authAction } from "../slices/auth.slice.ts";
import { GlobalUserDtoImpl } from "../apis/dto/shared/user.dto.ts";
import { jwtDecode } from "jwt-decode";
import { axiosInstance } from "../apis/core/index.api.ts";

const RefreshTokenMiddleware = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["refreshToken"]);

  const isTokenExpired = (token: string) => {
    return token && (jwtDecode(token).exp ?? 0) * 1000 < new Date().getTime();
  };

  useEffect(() => {
    const doRefreshToken = () => {
      refreshTokenApi([
        {
          token: cookies.refreshToken,
        },
      ])
        .then((result) => {
          dispatch(
            authAction.setUser({
              user: GlobalUserDtoImpl.fromUser(result.user),
              token: result.accessToken,
            })
          );
        })
        .catch((err) => {
          console.error(err);
          if (err instanceof AxiosError) {
            switch (err.response?.status) {
              case 401:
                removeCookie("refreshToken");
                setIsLoading(false);
                navigate(RouteEnum.LOGIN, { replace: true });
                break;
              default:
                break;
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    axiosInstance.interceptors.request.use((config) => {
      let token = config.headers["Authorization"];
      if (token) {
        token = (token as string).split(" ")[1];
        if (isTokenExpired(token)) {
          doRefreshToken();
        }
      }
      return config;
    });

    if (!auth?.token) {
      doRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (!isLoading) {
    return <Outlet />;
  }

  return <></>;
};
export default RefreshTokenMiddleware;
