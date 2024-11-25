import { useSelector } from "react-redux";
import { RootState } from "../stores/index.store.ts";
import { Navigate, Outlet } from "react-router-dom";
import { RouteEnum } from "../enums/route.enum.ts";
import ErrorForbidden from "../pages/error/403.page.tsx";

const AuthenticatedMiddleware = ({ role }: { role?: string }) => {
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth.user) {
    return <Navigate to={RouteEnum.LOGIN} replace />;
  }

  if (!role || auth.user.role === role) {
    return <Outlet />;
  }

  if (role && auth.user.role !== role) {
    return <ErrorForbidden />;
  }

  return <Navigate to={RouteEnum.LOGIN} replace />;
};
export default AuthenticatedMiddleware;
