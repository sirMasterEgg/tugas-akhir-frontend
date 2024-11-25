import Navbar from "../../components/Navbar.tsx";
import NotVerified from "../../components/NotVerified.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/index.store.ts";
import BottomNavBar from "../../components/BottomNavBar.tsx";
import FixedNavbarWithAds from "../../components/FixedNavbarWithAds.tsx";
import useAllNotificationsInfiniteScroll from "../../hooks/useAllNotificationsInfiniteScroll.tsx";
import { timeAgo } from "../../helpers/calculate-time.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsReadApi } from "../../apis/core/user/mark-as-read.api.ts";

const NotificationPage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  // const socketInstance = useWebsocket({
  //   events: (socket) => {
  //     // socket.on("connection", (socketInstance: Socket) => {
  //     if (auth.user) {
  //       socket.emit("join", auth.user.id);
  //     }
  //     // });
  //   },
  //   cleanup: (socket) => {
  //     // socket?.off("connection", (socketInstance: Socket) => {
  //     if (auth.user) {
  //       socket?.emit("leave", auth.user.id);
  //     }
  //     // });
  //   },
  // });

  const {
    data,
    lastElement,
    handleReadNotificationWs,
    handleReadAllNotificationsWs,
  } = useAllNotificationsInfiniteScroll({
    token: auth.token,
  });

  const readNotificationMutation = useMutation({
    mutationFn: markAsReadApi,
  });

  const queryClient = useQueryClient();

  const handleReadNotification = (id: string) => {
    readNotificationMutation.mutate([auth.token, { notificationId: id }], {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["getAllNotifications"],
        });
        handleReadNotificationWs(id);
      },
    });
  };

  const handleMarkAllAsRead = () => {
    readNotificationMutation.mutate([auth.token, { notificationId: "all" }], {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["getAllNotifications"],
        });
        handleReadAllNotificationsWs();
      },
    });
  };

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
      <div
        className={`container-with-ads ${auth.user?.vip ? "mt-20" : "mt-48"}`}
      >
        <span className="w-full flex justify-end">
          <button
            className="btn btn-link"
            onClick={() => handleMarkAllAsRead()}
          >
            Mark All as Read
          </button>
        </span>
        <div
          className={`flex flex-col w-full ${
            auth.user.vip
              ? "max-h-[calc(100vh_-_14rem)] lg:max-h-[calc(100vh_-_17rem)]"
              : "max-h-[58vh]"
          } overflow-y-auto`}
        >
          {data.map((item, i) => (
            <div
              key={item.id}
              ref={data.length === i + 1 ? lastElement : null}
              className="w-[89%] lg:w-[96.66%] mx-4 mt-4 text-xs lg:text-base lg:h-20 py-2 px-4 pr-32 flex flex-col rounded relative indicator border cursor-pointer"
              onClick={() => handleReadNotification(item.id)}
            >
              <span className={`${item.read ? "font-normal" : "font-bold"}`}>
                {item.title}
              </span>
              <span
                className={`${item.read ? "font-normal" : "font-semibold"}`}
              >
                {item.message}
              </span>
              <span className="absolute top-1 right-4 text-sm">
                {timeAgo(item.createdAt)}
              </span>
              {!item.read && (
                <span className="indicator-item badge badge-error badge-sm"></span>
              )}
            </div>
          ))}
        </div>
      </div>
      {/*<AdSense slot={"5399130281"} />*/}
      <BottomNavBar />
    </>
  );
};
export default NotificationPage;
