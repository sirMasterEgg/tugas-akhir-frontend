import {
  PiArrowFatUp,
  PiArrowFatUpFill,
  PiChatText,
  PiDotsThreeOutlineFill,
} from "react-icons/pi";
import React, { forwardRef, useState } from "react";
import AttachmentCard from "./AttachmentCard.tsx";
import { FileDto } from "../../apis/dto/shared/file.dto.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upvoteApi } from "../../apis/core/vote/upvote.api.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/index.store.ts";
import { useLocation } from "react-router-dom";
import { blockUserApi } from "../../apis/core/user/block-user.api.ts";
import { toast } from "react-toastify";
import { sendReportApi } from "../../apis/core/report/send-report.api.ts";
import { AxiosError } from "axios";
import { IoDiamondOutline } from "react-icons/io5";
import WarningBadge from "../BadgeWarning.tsx";
import { GlobalUserStatusDto } from "../../apis/dto/shared/user.dto.ts";

type PostCardProps = {
  children: React.ReactNode;
  profileImage?: string;
  name?: string;
  content: string;
  isAnonymous: boolean;
  files?: FileDto[];
  isCurrentUser?: boolean;
  votes: number;
  id: string;
  isVip: boolean;
  voted: boolean;
  status?: GlobalUserStatusDto;
};

const PostCard = forwardRef<HTMLDivElement, PostCardProps>(
  (
    {
      children,
      profileImage,
      name,
      content,
      isAnonymous,
      files,
      isCurrentUser = false,
      votes,
      isVip,
      id,
      voted,
      status,
    },
    ref
  ) => {
    const auth = useSelector((state: RootState) => state.auth);

    const route = useLocation();

    const voteMutation = useMutation({
      mutationFn: upvoteApi,
    });

    const blockMutation = useMutation({
      mutationFn: blockUserApi,
    });

    const reportMutation = useMutation({
      mutationFn: sendReportApi,
    });

    const [upvote, setUpvote] = useState<boolean>(voted);
    const queryClient = useQueryClient();

    const handleUpvote = (id: string) => {
      voteMutation.mutate(
        [
          auth.token,
          {
            questionId: id,
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

    const handleBlockOnPost = (id: string) => {
      blockMutation.mutate(
        [
          auth.token,
          {
            postId: id,
            block: true,
          },
        ],
        {
          onSuccess: () => {
            toast.success("User blocked successfully");
          },
        }
      );
    };

    const handleReportUser = (id: string) => {
      reportMutation.mutate(
        [
          auth.token,
          {
            postId: id,
          },
        ],
        {
          onSuccess: (data) => {
            toast.success(
              "Successfully reported post with report id " + data.id
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
      <div ref={ref} className="my-2">
        <div className="flex flex-row justify-between items-center">
          {isAnonymous ? (
            <span className="text-sm text-neutral-content">Anonymous</span>
          ) : (
            <>
              <span className="text-sm text-neutral-content inline-flex flex-row gap-2">
                <img
                  src={profileImage}
                  className="object-fill w-5 h-5 rounded-full"
                  alt="Profile picture"
                />
                <span className="-translate-y-0.5">{name}</span>
                {isVip && (
                  <span className="h-full flex items-center translate-y-0.5">
                    <IoDiamondOutline className="w-4 h-4" />
                  </span>
                )}
                <WarningBadge status={status} />
              </span>
            </>
          )}
          {isCurrentUser ? (
            <>
              <div className="w-12 h-12"></div>
            </>
          ) : (
            <div className="dropdown dropdown-left">
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
                  <button onClick={() => handleReportUser(id)}>Report</button>
                </li>
                {route.pathname.split("/")[1] === "user" ? null : (
                  <li>
                    <button onClick={() => handleBlockOnPost(id)}>
                      Block User
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        <h1 className="font-bold">{content}</h1>
        <div className="py-3 flex flex-row gap-2">
          {files?.map((file) => (
            <AttachmentCard key={file.id} url={file.url} />
          ))}
        </div>
        <div className="inline-flex flex-row gap-3">
          <button className="btn btn-xs btn-ghost rounded-full">
            <PiChatText className="h-4 w-4" />
          </button>
          <div className="flex flex-row items-center gap-1">
            <button
              onClick={() => handleUpvote(id)}
              className="btn btn-xs btn-ghost rounded-full"
            >
              {upvote ? (
                <PiArrowFatUpFill className="h-4 w-4" />
              ) : (
                <PiArrowFatUp className="h-4 w-4" />
              )}
              {/*<PiArrowFatUpFill className="h-4 w-4" />*/}
              {/*<PiArrowFatUp className="h-4 w-4" />*/}
            </button>
            <span className="text-xs text-neutral-content">{votes} votes</span>
          </div>
        </div>
        {children}
      </div>
    );
  }
);

export default PostCard;
