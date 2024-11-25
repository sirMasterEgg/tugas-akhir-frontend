import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserPostsApi } from "../apis/core/user/get-user-posts.api.ts";
import { useInfiniteObserver } from "./useInfiniteObserver.tsx";

export default function usePostInfiniteScroll({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["getUserPosts", token, userId],
      queryFn: ({ pageParam = 1, queryKey }) =>
        getUserPostsApi([
          queryKey[1],
          {
            userId: queryKey[2],
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
    () => (data ? data?.pages.flatMap((item) => item.questions) : []),
    [data]
  );

  return { data: flatData, error, lastElement, isLoading };
}
