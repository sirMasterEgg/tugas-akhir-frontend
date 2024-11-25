import FixedNavbarWithAds from "../../components/FixedNavbarWithAds.tsx";
import UserStatisticCard from "../../components/user/UserStatisticCard.tsx";
import PostCard from "../../components/post/PostCard.tsx";
import PostReply from "../../components/post/PostReply.tsx";
import BottomNavBar from "../../components/BottomNavBar.tsx";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileApi } from "../../apis/core/user/get-user-profile.api.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/index.store.ts";
import { useNavigate, useParams } from "react-router-dom";
import { getInitialProfileImageSrc } from "../../helpers/initial-profile-image.ts";
import ErrorNotFound from "../error/404.page.tsx";
import { RouteEnum } from "../../enums/route.enum.ts";
import { useEffect } from "react";
import OtherUserProfileNavigationButton from "../../components/buttons/OtherUserProfileNavigationButton.tsx";
import usePostInfiniteScroll from "../../hooks/usePostInfiniteScroll.tsx";
import WarningBadge from "../../components/BadgeWarning.tsx";

function PostCardFromApi({ token, userId }: { token: string; userId: string }) {
  const postInfiniteScoll = usePostInfiniteScroll({
    token: token,
    userId: userId,
  });
  return (
    <>
      {postInfiniteScoll.data.map((question, i) => (
        <PostCard
          ref={
            postInfiniteScoll.data.length === i + 1
              ? postInfiniteScoll.lastElement
              : null
          }
          key={question.id}
          isAnonymous={question.anonymous}
          profileImage={question.anonymous ? "" : question.owner.profilePicture}
          name={question.anonymous ? "" : question.owner.name}
          content={question.question}
          files={question.files}
          votes={question.vote}
          id={question.id}
          voted={question.voted}
          isVip={question.anonymous ? false : question.owner?.vip}
          status={question.anonymous ? undefined : question.owner?.status}
        >
          {question.replies.map((reply) => (
            <PostReply
              anonymous={reply.anonymous}
              profileImage={
                !reply.anonymous ? reply?.owner?.profilePicture : ""
              }
              content={reply.content}
              name={!reply.anonymous ? reply?.owner?.name : ""}
              isVip={!reply.anonymous ? reply.owner?.vip : false}
              key={reply.id}
              id={reply.id}
              voted={reply.voted}
              vote={reply.vote}
              status={reply.anonymous ? undefined : reply.owner?.status}
            />
          ))}
        </PostCard>
      ))}
    </>
  );
}

export default function OtherUserProfilePage() {
  const auth = useSelector((state: RootState) => state.auth);
  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["getUserProfile", auth.token, params.username!],
    queryFn: ({ queryKey }) =>
      getUserProfileApi([
        queryKey[1],
        {
          username: queryKey[2],
        },
      ]),
    retry: false,
  });

  useEffect(() => {
    if (params.username === auth.user?.name) {
      navigate(RouteEnum.PROFILE);
    }
  }, []);

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <ErrorNotFound />;
  }

  return (
    <>
      <FixedNavbarWithAds />
      <div className={`mb-16 ${auth.user?.vip ? "mt-20" : "mt-48"} md:px-20`}>
        <div className="relative">
          <div className="w-full h-32 bg-primary brightness-90 rounded-b-3xl"></div>
          <div className="absolute w-32 h-32 -bottom-16 profile-left-to-center md:left-12 p-2 bg-base-100 rounded-full">
            {data?.user.profilePicture ? (
              <img
                src={data?.user.profilePicture}
                className="w-full h-full object-contain rounded-full"
                alt="Profile picture"
              />
            ) : (
              <div className="avatar placeholder w-full h-full">
                <div className="bg-blue-600 text-white rounded-full">
                  <span className="text-4xl">
                    {getInitialProfileImageSrc(
                      data && data.user?.name ? data.user.name : ""
                    )?.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="md:pl-48 mt-20 mb-5 md:my-5 lg:pr-20">
          <div className="flex flex-col items-center md:items-start md:flex-row gap-3 md:gap-0 justify-between">
            <div className="flex flex-col justify-center md:justify-start">
              <span className="font-bold text-xl text-center md:text-left">
                {data?.user.name ?? "User"}{" "}
                <WarningBadge status={data?.user?.status} />
              </span>
              <span className="text-sm text-neutral-content text-center md:text-left">
                {data?.user.username ?? "Username"}
              </span>
              <div className="form-control mt-7">
                <label className="label cursor-pointer justify-center md:justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={data?.user.acceptQuestion || false}
                    disabled
                  />
                  <span className="label-text">Accept Question</span>
                </label>
              </div>
              <div className="flex flex-row gap-2 md:gap-5">
                {isSuccess ? (
                  <OtherUserProfileNavigationButton
                    userId={data?.user.id ?? ""}
                  />
                ) : null}
              </div>
            </div>
            <div className="flex flex-row gap-1 -translate-x-2 lg:translate-x-0 lg:gap-3 h-fit w-fit">
              <UserStatisticCard
                label={"Followers"}
                amount={data?.user.totalFollowers || 0}
              />
              <UserStatisticCard
                label={"Questions"}
                amount={data?.user.totalQuestions || 0}
              />
              <UserStatisticCard
                label={"Upvotes"}
                amount={data?.user.totalUpVotes || 0}
              />
            </div>
          </div>
        </div>
        <div className="flex px-10 flex-col pb-5">
          <span className="uppercase">Latest Post</span>
          <PostCardFromApi token={auth.token} userId={data?.user.id ?? ""} />
        </div>
      </div>
      <BottomNavBar />
    </>
  );
}
