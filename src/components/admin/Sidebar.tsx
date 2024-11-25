import { RouteEnum } from "../../enums/route.enum.ts";
import { PiUsersThree } from "react-icons/pi";
import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { TbReport } from "react-icons/tb";
import { RiAdminLine } from "react-icons/ri";

const Sidebar = () => {
  const { handleLogout } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="w-60 overflow-hidden bg-primary h-screen p-5 flex flex-col gap-3">
      <div className="inline-flex justify-center items-center">
        <a
          href={RouteEnum.ADMIN_HOME}
          className="btn btn-ghost text-neutral-100 font-bold text-xl"
        >
          Tanya! Admin
        </a>
      </div>
      <div className="flex flex-col justify-between h-full text-neutral-100">
        <ul className="flex flex-col gap-1">
          <li>
            <button
              onClick={() => navigate(RouteEnum.ADMIN_HOME)}
              className={`btn w-full justify-start ${
                location.pathname === RouteEnum.ADMIN_HOME
                  ? "font-bold"
                  : "font-normal"
              }`}
            >
              <PiUsersThree /> User Management
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate(RouteEnum.REPORT_MANAGEMENT)}
              className={`btn w-full justify-start ${
                location.pathname === RouteEnum.REPORT_MANAGEMENT
                  ? "font-bold"
                  : "font-normal"
              }`}
            >
              <TbReport /> Report Management
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate(RouteEnum.MANAGE_ADMIN)}
              className={`btn w-full justify-start ${
                location.pathname === RouteEnum.MANAGE_ADMIN
                  ? "font-bold"
                  : "font-normal"
              }`}
            >
              <RiAdminLine /> Admin Management
            </button>
          </li>
        </ul>
        <button
          className="btn w-full justify-start text-red-500"
          onClick={() => handleLogout()}
        >
          <BiLogOut /> Log Out
        </button>
      </div>
    </nav>
  );
};
export default Sidebar;
