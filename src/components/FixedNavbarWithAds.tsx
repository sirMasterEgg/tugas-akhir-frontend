import Navbar from "./Navbar.tsx";
import { RootState } from "../stores/index.store.ts";
import { useSelector } from "react-redux";

export default function FixedNavbarWithAds() {
  const auth = useSelector((state: RootState) => state.auth);
  return (
    <div className="fixed z-10 top-0 w-full">
      <Navbar />
      {!auth.user?.vip && (
        <div className="w-full h-28 bg-base-100 max-h-28 flex justify-center items-center border-b border-black">
          {/*<AdSense slot={"5399130281"} />*/}
          <span className="font-bold text-2xl">IKLAN</span>
          {/*<AdSense slot={"2697321964"} />*/}
        </div>
      )}
    </div>
  );
}
