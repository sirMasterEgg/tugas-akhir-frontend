import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upvoteApi } from "../../apis/core/vote/upvote.api.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/index.store.ts";
import { PiArrowFatUp, PiArrowFatUpFill } from "react-icons/pi";

export default function VoteButton({
  voted,
  id,
}: {
  voted: boolean;
  id: string;
}) {
  const auth = useSelector((state: RootState) => state.auth);
  const [upvote, setUpvote] = useState<boolean>(voted);

  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: upvoteApi,
  });

  const handleUpvote = (id: string) => {
    voteMutation.mutate(
      [
        auth.token,
        {
          replyId: id,
          isUpvote: !upvote,
        },
      ],
      {
        onSuccess: async () => {
          setUpvote((prev) => !prev);
          await queryClient.invalidateQueries({
            queryKey: ["getAllUserPosts"],
          });
          await queryClient.invalidateQueries({
            queryKey: ["getUserPosts"],
          });
          await queryClient.invalidateQueries({
            queryKey: ["detailsInbox"],
          });
        },
      }
    );
  };

  return (
    <button
      onClick={() => handleUpvote(id)}
      className="btn btn-xs btn-ghost rounded-full px-1"
    >
      {voted ? (
        <PiArrowFatUpFill className="h-4 w-4" />
      ) : (
        <PiArrowFatUp className="h-4 w-4" />
      )}
    </button>
  );
}
