import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getBlockedUserApi } from "../apis/core/user/get-blocked-user.api.ts";
import { useInfiniteObserver } from "./useInfiniteObserver.tsx";

export default function useBlockedUsersInfiniteScroll({
  token,
}: {
  token: string;
}) {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["getBlockedUsers", token],
      queryFn: ({ pageParam = 1, queryKey }) =>
        getBlockedUserApi([
          queryKey[1],
          {
            page: pageParam,
          },
        ]),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        return lastPage.meta.nextPage;
      },
    });

  const lastElement = useInfiniteObserver({
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetching,
  });

  const flatData = useMemo(
    () => (data ? data?.pages.flatMap((item) => item.blockedUsers) : []),
    [data]
  );

  return { data: flatData, error, lastElement, isLoading };
}
