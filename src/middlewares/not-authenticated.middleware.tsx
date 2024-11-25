import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useCookies } from "react-cookie";
import { RouteEnum } from "../enums/route.enum.ts";

const NotAuthenticatedMiddleware = () => {
  const [cookies, , removeCookie] = useCookies(["refreshToken"]);

  if (!cookies.refreshToken) {
    return <Outlet />;
  }

  const refreshTokenPayload: JwtPayload & { role: string } = jwtDecode(
    cookies.refreshToken
  );

  if ((refreshTokenPayload.exp ?? 0) * 1000 < Date.now()) {
    removeCookie("refreshToken");
    return <Outlet />;
  }

  if (refreshTokenPayload.role === "admin") {
    return <Navigate to={RouteEnum.ADMIN_HOME} replace />;
  }

  return <Navigate to={RouteEnum.HOME} replace />;
};
export default NotAuthenticatedMiddleware;
