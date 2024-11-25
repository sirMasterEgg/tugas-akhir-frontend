import Navbar from "../../components/Navbar.tsx";
import NotVerified from "../../components/NotVerified.tsx";
import { RootState } from "../../stores/index.store.ts";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FixedNavbarWithAds from "../../components/FixedNavbarWithAds.tsx";
import BottomNavBar from "../../components/BottomNavBar.tsx";

const DetailsGroupPage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const params = useParams();

  if (!auth.user?.verifiedAt) {
    return (
      <>
        <Navbar />
        <NotVerified />
      </>
    );
  }

  return (
    <>
      <FixedNavbarWithAds />
      <div className="container-with-ads">{params.identifier}</div>
      <BottomNavBar />
    </>
  );
};
export default DetailsGroupPage;
