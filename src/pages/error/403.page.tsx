import { RouteEnum } from "../../enums/route.enum.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/index.store.ts";

const ErrorForbidden = () => {
  const auth = useSelector((state: RootState) => state.auth);

  const getRoute = () => {
    if (auth?.user?.role === "user") {
      return RouteEnum.INDEX;
    } else if (auth?.user?.role === "admin") {
      return RouteEnum.ADMIN_HOME;
    }
    return RouteEnum.INDEX;
  };

  return (
    <div className="min-h-screen flex flex-grow items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold">403</h1>
        <p className="text-gray-600">
          Forbidden! You do not have permission to access this page.
        </p>
        <a
          href={getRoute()}
          className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          {" "}
          Go back to Home{" "}
        </a>
      </div>
    </div>
  );
};
export default ErrorForbidden;
