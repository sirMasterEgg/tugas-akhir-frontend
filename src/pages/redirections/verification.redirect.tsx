import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyApi } from "../../apis/core/auth/verify.api.ts";
import { authAction } from "../../slices/auth.slice.ts";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { RouteEnum } from "../../enums/route.enum.ts";

const VerifyRedirect = () => {
  const navigate = useNavigate();
  const [, setCookie] = useCookies(["refreshToken"]);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token") || "";

    const verifyUser = async () => {
      try {
        const result = await verifyApi([
          {
            token: token,
          },
        ]);

        dispatch(
          authAction.setUser({
            user: result.user,
            token: result.accessToken,
          })
        );
        setCookie("refreshToken", result.refreshToken, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          secure: true,
        });
        navigate(RouteEnum.HOME, {
          replace: true,
        });
      } catch (e) {
        console.error(e);
        navigate(RouteEnum.LOGIN, { replace: true });
      }
    };

    if (token) {
      verifyUser();
    } else {
      navigate(RouteEnum.LOGIN, { replace: true });
    }
  }, [navigate, location.search]);

  return (
    <>
      <h1>Redirecting...</h1>
    </>
  );
};
export default VerifyRedirect;
