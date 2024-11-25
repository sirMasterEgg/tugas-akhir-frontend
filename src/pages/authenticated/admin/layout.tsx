import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/admin/Sidebar.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/index.store.ts";

const Layout = () => {
  const auth = useSelector((state: RootState) => state.auth);
  return (
    <div className="w-screen h-screen flex flex-row">
      <Sidebar />

      <div className="max-h-screen overflow-y-auto flex-1 p-5">
        <h1 className="text-xl font-bold mb-5">Hello, {auth?.user?.name}</h1>
        <Outlet />
      </div>
    </div>
  );
};
export default Layout;
