import { useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteObserver } from "./useInfiniteObserver.tsx";
import { useMemo, useState } from "react";
import { getAllPostApi } from "../apis/core/user/get-all-post.api.ts";
import { Question } from "../apis/dto/shared/question.dto.ts";
import useWebsocket from "./useWebsocket.ts";

export default function useAllPostInfiniteScroll({ token }: { token: string }) {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["getAllUserPosts", token],
      queryFn: ({ pageParam = 1, queryKey }) =>
        getAllPostApi([
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

  const [newPostData, setNewPostData] = useState<Question[]>([]);

  useWebsocket({
    events: (socketInstance) => {
      socketInstance.on("FETCH_POSTS", (value) => {
        setNewPostData((prevData) => [value, ...prevData]);
      });
    },
    cleanup: (socketInstance) => {
      socketInstance?.off("FETCH_POSTS");
    },
  });

  const flatData = useMemo(() => {
    const apiData = data ? data?.pages.flatMap((item) => item.questions) : [];
    return [...newPostData, ...apiData];
  }, [data, newPostData]);

  return { data: flatData, error, lastElement, isLoading };
}
