import { useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteObserver } from "./useInfiniteObserver.tsx";
import { useMemo, useState } from "react";
import { getInboxApi } from "../apis/core/inbox/get-inbox.api.ts";
import { QuestionInbox } from "../apis/dto/inbox/get-inbox.dto.ts";

export default function useInboxInfiniteScroll({
  token,
  filter,
}: {
  token: string;
  filter: string;
}) {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["getInbox", token, filter],
      queryFn: ({ pageParam = 1, queryKey }) =>
        getInboxApi([
          queryKey[1],
          {
            filter: queryKey[2],
            size: 10,
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [newPostData, _setNewPostData] = useState<QuestionInbox[]>([]);

  // useWebsocket({
  //   events: (socketInstance) => {
  //     socketInstance.on("FETCH_POSTS", (value) => {
  //       setNewPostData((prevData) => [value, ...prevData]);
  //     });
  //   },
  //   cleanup: (socketInstance) => {
  //     socketInstance?.off("FETCH_POSTS");
  //   },
  // });

  const flatData = useMemo(() => {
    const apiData = data ? data?.pages.flatMap((item) => item.questions) : [];
    return [...newPostData, ...apiData];
  }, [data, newPostData]);

  return { data: flatData, error, lastElement, isLoading };
}
