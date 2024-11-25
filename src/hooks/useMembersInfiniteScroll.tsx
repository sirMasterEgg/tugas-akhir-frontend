import { useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteObserver } from "./useInfiniteObserver.tsx";
import { useMemo } from "react";
import { searchUserApi } from "../apis/core/search/search-user.api.ts";

export default function useMembersInfiniteScroll({
  token,
  username,
}: {
  token: string;
  username: string;
}) {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["getAllMembers", token, username],
      queryFn: ({ pageParam = 1, queryKey }) =>
        searchUserApi([
          queryKey[1],
          {
            page: pageParam,
            username: queryKey[2],
            size: 10,
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

  const flatData = useMemo(() => {
    return data ? data?.pages.flatMap((item) => item.users) : [];
  }, [data]);

  return { data: flatData, error, lastElement, isLoading };
}
