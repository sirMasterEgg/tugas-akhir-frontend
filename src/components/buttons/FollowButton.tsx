import { PiUserCircleMinus, PiUserMinus, PiUserPlus } from "react-icons/pi";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { followApi } from "../../apis/core/user/follow.api.ts";
import { RootState } from "../../stores/index.store.ts";
import { useSelector } from "react-redux";
import { getFollowStatusApi } from "../../apis/core/user/get-follow-status.api.ts";
import { toast } from "react-toastify";
import {
  BlockUserDto,
  BlockUserResponseDto,
} from "../../apis/dto/user/block-user.dto.ts";

export default function FollowButton({
  userId,
  isBlocked,
  blockMutation,
}: {
  userId: string;
  isBlocked: boolean;
  blockMutation: UseMutationResult<
    BlockUserResponseDto,
    Error,
    [string, BlockUserDto],
    unknown
  >;
}) {
  const auth = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: followApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getFollowStatus", userId],
      });
    },
    onError: () => {
      toast.error("Failed to do follow or unfollow user");
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["getFollowStatus", userId],
    queryFn: ({ queryKey }) =>
      getFollowStatusApi([auth.token, { userId: queryKey[1] }]),
  });

  const handleFollowButtonClick = () => {
    if (isBlocked) {
      blockMutation.mutate([
        auth.token,
        {
          userId: userId,
          block: false,
        },
      ]);
      followMutation.mutate([
        auth.token,
        {
          userId: userId,
          follow: false,
        },
      ]);
    } else {
      followMutation.mutate([
        auth.token,
        {
          userId: userId,
          follow: !data?.following,
        },
      ]);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      {isBlocked ? (
        <button
          onClick={handleFollowButtonClick}
          className="btn btn-primary btn-outline px-6"
        >
          <>
            <PiUserCircleMinus className="w-5 h-5" />
            Unblock
          </>
        </button>
      ) : (
        <button
          onClick={handleFollowButtonClick}
          className={`btn ${
            data?.following ? "btn-primary btn-outline" : "btn-primary"
          }  px-6`}
        >
          {data?.following ? (
            <>
              <PiUserMinus className="w-5 h-5" />
              Unfollow
            </>
          ) : (
            <>
              <PiUserPlus className="w-5 h-5" />
              Follow
            </>
          )}
        </button>
      )}
    </>
  );
}
