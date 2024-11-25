import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import IndexPage from "./pages";
import { RouteEnum } from "./enums/route.enum.ts";
import ErrorNotFound from "./pages/error/404.page.tsx";
import LoginPage from "./pages/login.page.tsx";
import RegisterPage from "./pages/register.page.tsx";
import HomePage from "./pages/authenticated/home.page.tsx";
import VerifyRedirect from "./pages/redirections/verification.redirect.tsx";
import RefreshTokenMiddleware from "./middlewares/refresh-token.middleware.tsx";
import AuthenticatedMiddleware from "./middlewares/authenticated.middleware.tsx";
import NotAuthenticatedMiddleware from "./middlewares/not-authenticated.middleware.tsx";
import ForgotPasswordPage from "./pages/forgot-password.page.tsx";
import ResetPasswordPage from "./pages/reset-password.page.tsx";
import InboxPage from "./pages/authenticated/inbox.page.tsx";
import NotificationPage from "./pages/authenticated/notification.page.tsx";
import ProfilePage from "./pages/authenticated/profile.page.tsx";
import OtherUserProfilePage from "./pages/authenticated/other-user-profile.page.tsx";
import SettingsPage from "./pages/authenticated/settings.page.tsx";
import DetailsGroupPage from "./pages/authenticated/details-group.page.tsx";
import HomePageAdmin from "./pages/authenticated/admin/home.page.tsx";
import Layout from "./pages/authenticated/admin/layout.tsx";
import ReportPageAdmin from "./pages/authenticated/admin/report.page.tsx";
import { useEffect } from "react";
import ManageAdminPage from "./pages/authenticated/admin/manage-admin.page.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorNotFound />}>
      <Route path={RouteEnum.VERIFICATION} element={<VerifyRedirect />} />
      <Route element={<NotAuthenticatedMiddleware />}>
        <Route path={RouteEnum.INDEX} element={<IndexPage />} />
        <Route path={RouteEnum.LOGIN} element={<LoginPage />} />
        <Route path={RouteEnum.REGISTER} element={<RegisterPage />} />
        <Route
          path={RouteEnum.FORGOT_PASSWORD}
          element={<ForgotPasswordPage />}
        />
        <Route
          path={RouteEnum.RESET_PASSWORD}
          element={<ResetPasswordPage />}
        />
      </Route>
      <Route element={<RefreshTokenMiddleware />}>
        <Route element={<AuthenticatedMiddleware role={"user"} />}>
          <Route path={RouteEnum.HOME} element={<HomePage />} />
          <Route path={RouteEnum.INBOX} element={<InboxPage />} />
          <Route path={RouteEnum.NOTIFICATION} element={<NotificationPage />} />
          <Route path={RouteEnum.PROFILE} element={<ProfilePage />} />
          <Route
            path={RouteEnum.OTHER_USER_PROFILE}
            element={<OtherUserProfilePage />}
          />
          <Route path={RouteEnum.SETTINGS} element={<SettingsPage />} />
          <Route
            path={RouteEnum.GROUP_DETAILS}
            element={<DetailsGroupPage />}
          />
        </Route>
        <Route element={<AuthenticatedMiddleware role={"admin"} />}>
          <Route element={<Layout />}>
            <Route path={RouteEnum.ADMIN_HOME} element={<HomePageAdmin />} />
            <Route
              path={RouteEnum.REPORT_MANAGEMENT}
              element={<ReportPageAdmin />}
            />
            <Route
              path={RouteEnum.MANAGE_ADMIN}
              element={<ManageAdminPage />}
            />
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

declare global {
  interface Window {
    snap: {
      pay: (
        snapToken: string,
        options?: {
          onSuccess: (result: unknown) => void;
          onPending: (result: unknown) => void;
          onError: (result: unknown) => void;
          onClose: () => void;
        }
      ) => void;
      show: () => void;
    };
  }
}

function App() {
  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    const scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;

    const myMidtransClientKey = import.meta.env
      .VITE_MIDTRANS_CLIENT_KEY as string;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
