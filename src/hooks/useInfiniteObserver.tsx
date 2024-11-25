import { useCallback, useRef } from "react";
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";

export function useInfiniteObserver<TData, TError>({
  isLoading,
  hasNextPage,
  isFetching,
  fetchNextPage,
}: {
  isLoading: boolean;
  hasNextPage: boolean;
  isFetching: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<TData, TError>>;
}) {
  const handleObserver = useRef<IntersectionObserver>();

  return useCallback(
    (element: HTMLDivElement | null) => {
      if (isLoading) return;
      if (handleObserver.current) handleObserver.current.disconnect();
      handleObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });
      if (element) handleObserver.current.observe(element);
    },
    [isLoading, hasNextPage]
  );
}
