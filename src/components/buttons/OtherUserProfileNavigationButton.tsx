import FollowButton from "./FollowButton.tsx";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blockUserApi } from "../../apis/core/user/block-user.api.ts";
import { toast } from "react-toastify";
import { getBlockStatusApi } from "../../apis/core/user/get-block-status.api.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/index.store.ts";
import { AxiosError } from "axios";
import { sendReportApi } from "../../apis/core/report/send-report.api.ts";

export default function OtherUserProfileNavigationButton({
  userId,
}: {
  userId: string;
}) {
  const queryClient = useQueryClient();
  const auth = useSelector((state: RootState) => state.auth);
  const blockUserMutation = useMutation({
    mutationFn: blockUserApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getBlockStatus", auth.token, userId],
      });
    },
    onError: () => {
      toast.error("Failed to block user");
    },
  });

  const getBlockStatusQuery = useQuery({
    queryKey: ["getBlockStatus", auth.token, userId],
    queryFn: ({ queryKey }) =>
      getBlockStatusApi([
        queryKey[1],
        {
          userId: queryKey[2],
        },
      ]),
  });

  const reportMutation = useMutation({
    mutationFn: sendReportApi,
  });

  const handleBlockUserClick = () => {
    blockUserMutation.mutate([auth.token, { userId: userId, block: true }]);
  };

  const handleReportUser = () => {
    reportMutation.mutate(
      [
        auth.token,
        {
          userId: userId,
        },
      ],
      {
        onSuccess: (data) => {
          toast.success("Successfully reported user with report id " + data.id);
        },
        onError: (error) => {
          const axiosError = error as AxiosError;
          const data = axiosError.response?.data as {
            error: string;
            message: string;
            statusCode: number;
          };
          toast.error("Error: " + data.message);
        },
      }
    );
  };

  return (
    <>
      <FollowButton
        userId={userId ?? ""}
        isBlocked={getBlockStatusQuery.data?.blocked ?? false}
        blockMutation={blockUserMutation}
      />
      {getBlockStatusQuery.data?.blocked ? null : (
        <div className="dropdown dropdown-right">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost rounded-full"
          >
            <PiDotsThreeOutlineFill />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <button onClick={() => handleReportUser()}>Report User</button>
            </li>
            <li>
              <button onClick={() => handleBlockUserClick()}>Block User</button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
