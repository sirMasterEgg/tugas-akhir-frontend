import FixedNavbarWithAds from "../../components/FixedNavbarWithAds.tsx";
import { MdArrowBack } from "react-icons/md";
import BottomNavBar from "../../components/BottomNavBar.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RouteEnum } from "../../enums/route.enum.ts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../stores/index.store.ts";
import { useEffect, useRef, useState } from "react";
import useQueryParams from "../../hooks/useQueryParams.ts";
import useBlockedUsersInfiniteScroll from "../../hooks/useBlockedUsersInfiniteScroll.tsx";
import { GlobalUserDto } from "../../apis/dto/shared/user.dto.ts";
import { blockUserApi } from "../../apis/core/user/block-user.api.ts";
import { toast } from "react-toastify";
import useLogout from "../../hooks/useLogout.tsx";
import { payApi } from "../../apis/core/vip/pay.api.ts";

export default function SettingsPage() {
  const { getQueryParams } = useQueryParams();

  const render = () => {
    const page = getQueryParams<string>("page");

    switch (page) {
      case "blocked-user":
        return <SettingsBlockedUser />;
      default:
        return <SettingsDefault />;
    }
  };

  return (
    <>
      <FixedNavbarWithAds />
      {render()}
      <BottomNavBar />
    </>
  );
}

function SettingsDefault() {
  const navigate = useNavigate();
  const { setQueryParams } = useQueryParams();
  const { handleLogout } = useLogout();
  const auth = useSelector((state: RootState) => state.auth);

  /*const authenticated = useSelector((state: RootState) => state.auth);
  const [cookies, , removeCookie] = useCookies(["refreshToken"]);
  const dispatch = useDispatch();
  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      dispatch(authAction.unsetUser());
      removeCookie("refreshToken", {
        path: "/",
      });
      navigate(RouteEnum.LOGIN, { replace: true });
    },
    onError: () => {
      dispatch(authAction.unsetUser());
      removeCookie("refreshToken", {
        path: "/",
      });
      navigate(RouteEnum.LOGIN, { replace: true });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate([
      authenticated.token,
      {
        refreshToken: cookies.refreshToken,
      },
    ]);
  };*/

  const handleBackButton = () => {
    navigate(RouteEnum.PROFILE);
  };

  const handleBlockedUser = () => {
    setQueryParams({ page: "blocked-user" });
  };

  const payMutation = useMutation({
    mutationFn: payApi,
  });

  const handleVip = () => {
    payMutation.mutate([auth.token], {
      onSuccess: (data) => {
        window.snap.pay(data.token);
      },
    });
  };

  return (
    <>
      <div className={`${auth.user?.vip ? "mt-20" : "mt-48"}`}>
        <div className="flex items-center justify-start gap-2 md:gap-5 md:px-2">
          <button onClick={handleBackButton} className="btn btn-ghost">
            <MdArrowBack className="w-5 h-5" />
          </button>
          <span className="font-bold">Settings</span>
        </div>
      </div>
      <div className="mb-16">
        {!auth.user?.vip && (
          <div
            onClick={() => handleVip()}
            className="px-3 md:px-8 py-5 cursor-pointer hover:bg-base-200"
          >
            <span className="font-semibold">Upgrade to VIP</span>
          </div>
        )}
        <div
          onClick={handleBlockedUser}
          className="px-3 md:px-8 py-5 cursor-pointer hover:bg-base-200"
        >
          <span className="font-semibold">Blocked User</span>
        </div>
        {/*<div className="px-3 md:px-8 py-5 cursor-pointer hover:bg-base-200">
          <span className="font-semibold">Report a Content</span>
        </div>*/}
        <div
          onClick={handleLogout}
          className="px-3 md:px-8 py-5 cursor-pointer hover:bg-error/10"
        >
          <span className="font-semibold text-error">Logout</span>
        </div>
      </div>
    </>
  );
}

function SettingsBlockedUser() {
  const authenticated = useSelector((state: RootState) => state.auth);
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const { removeQueryParams } = useQueryParams();

  const handleBackButton = () => {
    removeQueryParams(["page"]);
  };

  const queryClient = useQueryClient();
  const unblockMutation = useMutation({
    mutationFn: blockUserApi,
    onSuccess: async () => {
      toast.success("User unblocked successfully");
      await queryClient.invalidateQueries({
        queryKey: ["getBlockedUsers", authenticated.token],
      });
    },
    onError: () => {
      // unblock
    },
  });

  const handleOpenModal = (data: GlobalUserDto) => {
    setModalData(data);
    modalRef.current?.showModal();
  };

  const handleCloseModal = () => {
    modalRef.current?.close();
    setModalData(null);
  };

  const handleUnblock = (id?: string) => {
    if (!id) return;
    unblockMutation.mutate([authenticated.token, { userId: id, block: false }]);
    handleCloseModal();
  };

  const { data, lastElement } = useBlockedUsersInfiniteScroll({
    token: authenticated.token,
  });
  const [modalData, setModalData] = useState<GlobalUserDto | null>(null);

  useEffect(() => {
    if (!modalRef.current?.open) {
      setModalData(null);
    }
  }, [modalRef.current?.open]);

  return (
    <>
      <div className="mt-48">
        <div className="flex items-center justify-start gap-2 md:gap-5 md:px-2">
          <button onClick={handleBackButton} className="btn btn-ghost">
            <MdArrowBack className="w-5 h-5" />
          </button>
          <span className="font-bold">Blocked Users</span>
        </div>
      </div>
      <div className="mb-16">
        {data.length > 0 ? (
          data.map((item, i) => (
            <div
              key={item.id}
              ref={data.length === i + 1 ? lastElement : null}
              onClick={() => handleOpenModal(item)}
              className="px-3 md:px-8 py-5 cursor-pointer hover:bg-base-200"
            >
              <span className="font-semibold">{item.username}</span>
            </div>
          ))
        ) : (
          <span className="w-full flex justify-center font-bold text-lg">
            No Data
          </span>
        )}
        <dialog ref={modalRef} className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Unblock Confirmation</h3>
            <p className="py-4">
              Do you want unblock {modalData?.name}{" "}
              <span className="text-gray-400 text-sm">
                ({modalData?.username})
              </span>{" "}
              ?
            </p>
            <div className="inline-flex flex-row gap-2">
              <button
                onClick={() => handleUnblock(modalData?.id)}
                className="btn btn-primary"
              >
                Ok
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleCloseModal()}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
}
