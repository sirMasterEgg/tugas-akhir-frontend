import { useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteObserver } from "./useInfiniteObserver.tsx";
import { useMemo, useState } from "react";
import useWebsocket from "./useWebsocket.ts";
import { GlobalNotificationDto } from "../apis/dto/shared/notification.dto.ts";
import { getNotificationsApi } from "../apis/core/user/get-notifications.ts";

export default function useAllNotificationsInfiniteScroll({
  token,
}: {
  token: string;
}) {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["getAllNotifications", token],
      queryFn: ({ pageParam = 1, queryKey }) =>
        getNotificationsApi([
          queryKey[1],
          {
            page: pageParam,
          },
        ]),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        return lastPage.meta.nextPage;
      },
      staleTime: Infinity,
    });

  const lastElement = useInfiniteObserver({
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetching,
  });

  const [notifications, setNotifications] = useState<GlobalNotificationDto[]>(
    []
  );
  const [notificationIds, setNotificationIds] = useState<Set<string>>(
    new Set()
  );

  useWebsocket({
    events: (socketInstance) => {
      socketInstance.on("NOTIFICATION", (value) => {
        if (!notificationIds.has(value.id)) {
          setNotifications((prevData) => [value, ...prevData]);
          setNotificationIds((prevIds) => new Set(prevIds.add(value.id)));
        }
      });
    },
    cleanup: (socketInstance) => {
      socketInstance?.off("NOTIFICATION");
    },
  });

  const flatData = useMemo(() => {
    const apiData = data
      ? data?.pages.flatMap((item) => item.notifications)
      : [];

    const filteredApiData = apiData.filter(
      (notification) => !notificationIds.has(notification.id)
    );

    return [...notifications, ...filteredApiData];
  }, [data, notifications]);

  const handleReadNotificationWs = (id: string) => {
    setNotifications((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const handleReadAllNotificationsWs = () => {
    setNotifications((prevData) =>
      prevData.map((item) => ({ ...item, read: true }))
    );
  };

  return {
    data: flatData,
    error,
    lastElement,
    isLoading,
    handleReadNotificationWs,
    handleReadAllNotificationsWs,
  };
}
