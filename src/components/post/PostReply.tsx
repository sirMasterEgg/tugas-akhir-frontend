import { IoDiamondOutline } from "react-icons/io5";
import { PiArrowFatUp, PiArrowFatUpFill } from "react-icons/pi";
import { MdOutlineReport } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/index.store.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upvoteApi } from "../../apis/core/vote/upvote.api.ts";
import { useState } from "react";
import { sendReportApi } from "../../apis/core/report/send-report.api.ts";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import WarningBadge from "../BadgeWarning.tsx";
import { GlobalUserStatusDto } from "../../apis/dto/shared/user.dto.ts";

type PostReplyProps = {
  name: string;
  profileImage: string;
  content: string;
  anonymous: boolean;
  isVip: boolean;
  vote: number;
  voted: boolean;
  id: string;
  status?: GlobalUserStatusDto;
};

export default function PostReply({
  name,
  profileImage,
  content,
  isVip,
  anonymous,
  vote,
  voted,
  id,
  status,
}: PostReplyProps) {
  const auth = useSelector((state: RootState) => state.auth);
  const [upvote, setUpvote] = useState<boolean>(voted);

  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: upvoteApi,
  });

  const reportMutation = useMutation({
    mutationFn: sendReportApi,
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
        },
      }
    );
  };

  const handleReportUser = (id: string) => {
    reportMutation.mutate(
      [
        auth.token,
        {
          replyId: id,
        },
      ],
      {
        onSuccess: (data) => {
          toast.success(
            "Successfully reported reply with report id " + data.id
          );
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
    <div className="relative mt-10 border rounded-xl border-gray-500 pt-5 pb-2 px-5">
      <div className="absolute -top-4 left-2 rounded-full bg-primary text-primary-content pl-2 pr-4 h-[33px] flex flex-row items-center justify-center gap-2">
        {!anonymous ? (
          <span className="h-full flex items-center">
            <img
              src={profileImage}
              alt="Profile picture"
              className="object-fill w-5 h-5 rounded-full"
            />
          </span>
        ) : null}
        <span
          className={`h-full flex items-center -translate-y-0.5 ${
            anonymous ? "pl-5" : ""
          }`}
        >
          {!anonymous ? name : "Anonymous"}
        </span>
        {isVip && (
          <span className="h-full flex items-center">
            <IoDiamondOutline />
          </span>
        )}
        <WarningBadge status={status} />
      </div>
      {content}
      <div className="mt-3 flex flex-row justify-between">
        <div className="inline-flex gap-3 items-center">
          {/*<button className="btn btn-xs btn-ghost rounded-full px-1">*/}
          {/*  <PiChatText className="h-4 w-4" />*/}
          {/*</button>*/}
          <div className="flex flex-row items-center gap-1">
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
            <span className="text-xs text-neutral-content">{vote} votes</span>
          </div>
          {/*<button className="btn btn-xs btn-ghost rounded-full px-1">*/}
          {/*  <PiArrowFatDown className="h-4 w-4" />*/}
          {/*</button>*/}
        </div>
        <button
          onClick={() => handleReportUser(id)}
          className="btn btn-xs btn-ghost rounded-full px-1"
        >
          <MdOutlineReport className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
