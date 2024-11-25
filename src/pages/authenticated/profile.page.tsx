import { useSelector } from "react-redux";
import { RootState } from "../../stores/index.store.ts";
import BottomNavBar from "../../components/BottomNavBar.tsx";
import { PiGear, PiNotePencil } from "react-icons/pi";
import FixedNavbarWithAds from "../../components/FixedNavbarWithAds.tsx";
import UserStatisticCard from "../../components/user/UserStatisticCard.tsx";
import useQueryParams from "../../hooks/useQueryParams.ts";
import { MdArrowBack } from "react-icons/md";
import { RouteEnum } from "../../enums/route.enum.ts";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleQuestionApi } from "../../apis/core/user/toggle-question.api.ts";
import { getUserProfileApi } from "../../apis/core/user/get-user-profile.api.ts";
import Navbar from "../../components/Navbar.tsx";
import NotVerified from "../../components/NotVerified.tsx";
import UpdateProfileFormComponent from "../../components/user/UpdateProfileFormComponent.tsx";
import { GlobalUserDtoImpl } from "../../apis/dto/shared/user.dto.ts";
import { updateProfileApi } from "../../apis/core/user/update-profile.api.ts";
import React, { useState } from "react";
import { AxiosError } from "axios";
import { getInitialProfileImageSrc } from "../../helpers/initial-profile-image.ts";
import usePostInfiniteScroll from "../../hooks/usePostInfiniteScroll.tsx";
import PostCard from "../../components/post/PostCard.tsx";
import PostReply from "../../components/post/PostReply.tsx";
import WarningBadge from "../../components/BadgeWarning.tsx";

const ProfilePage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [profileImageError, setProfileImageError] = useState<boolean>(false);

  const toggleQuestionMutation = useMutation({
    mutationFn: toggleQuestionApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getUserProfile", auth.token, "current"],
      });
    },
    onError: () => {
      // todo
    },
  });
  const { data } = useQuery({
    queryKey: ["getUserProfile", auth.token, "current"],
    queryFn: ({ queryKey }) =>
      getUserProfileApi([
        queryKey[1],
        {
          username: queryKey[2],
        },
      ]),
  });
  const updateProfilePictureMutation = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getUserProfile"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["getUserPosts"],
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 422) {
        setProfileImageError(true);
      }
    },
  });

  const postInfiniteScoll = usePostInfiniteScroll({
    token: auth.token,
    userId: auth?.user?.id || "",
  });

  const handleChangeProfilePicture = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target?.files?.length === 1) {
      const formData = new FormData();
      formData.append("profilePicture", event.target.files[0]);
      updateProfilePictureMutation.mutate([auth.token, formData]);
    }
  };

  const { setQueryParams, getQueryParams, removeQueryParams } =
    useQueryParams();

  const handleEditProfile = () => {
    setQueryParams({ edit: true });
  };

  const handleCloseEditProfile = () => {
    removeQueryParams(["edit"]);
  };

  const handleSettingsPage = () => {
    navigate(RouteEnum.SETTINGS);
  };

  const handleAcceptQuestionOnChange = () => {
    toggleQuestionMutation.mutate([
      auth.token,
      {
        accept: !data?.user.acceptQuestion,
      },
    ]);
  };

  if (!auth.user?.verifiedAt) {
    return (
      <>
        <Navbar />
        <NotVerified />
      </>
    );
  }

  return (
    <>
      <FixedNavbarWithAds />
      {!getQueryParams<boolean>("edit") ? null : (
        <>
          <div className={`${auth.user.vip ? "mt-20" : "mt-48"}`}>
            <div className="flex items-center justify-start gap-2 md:gap-5 md:px-2">
              <button
                onClick={handleCloseEditProfile}
                className="btn btn-ghost"
              >
                <MdArrowBack className="w-5 h-5" />
              </button>
              <span className="font-bold">Edit Profile</span>
            </div>
          </div>
        </>
      )}
      <div
        className={`${
          !getQueryParams<boolean>("edit")
            ? auth.user.vip
              ? "mt-20"
              : "mt-48"
            : "mt-0"
        } mb-16 md:px-20`}
      >
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
            {!getQueryParams<boolean>("edit") ? null : (
              <>
                <label className="absolute bottom-0 right-0 btn btn-sm btn-primary border border-white">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleChangeProfilePicture}
                  />
                  <PiNotePencil className="w-3 h-3" />
                </label>
                {profileImageError && (
                  <span className="text-error absolute -bottom-5 right-0 text-xs">
                    Image ratio must be 1:1
                  </span>
                )}
              </>
            )}
          </div>
        </div>
        {!getQueryParams<boolean>("edit") ? (
          <>
            <div className="md:pl-48 mt-20 mb-5 md:my-5 lg:pr-20">
              <div className="flex flex-col items-center md:items-start md:flex-row gap-3 md:gap-0 justify-between">
                <div className="flex flex-col justify-center md:justify-start">
                  <span className="font-bold text-xl text-center md:text-left">
                    {data?.user.name}{" "}
                    <WarningBadge status={data?.user?.status} />
                  </span>
                  <span className="text-sm text-neutral-content text-center md:text-left">
                    {data?.user.username}
                  </span>
                  <div className="flex flex-row gap-2 md:gap-5 mt-7">
                    <button
                      onClick={handleEditProfile}
                      className="btn btn-outline btn-primary px-6"
                    >
                      <PiNotePencil className="w-5 h-5" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleSettingsPage}
                      className="btn btn-ghost rounded-full px-3.5"
                    >
                      <PiGear className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer justify-center md:justify-start gap-2">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary toggle-xs"
                        checked={data?.user.acceptQuestion || false}
                        onChange={handleAcceptQuestionOnChange}
                        disabled={toggleQuestionMutation.isPending}
                      />
                      <span className="label-text">Accept Question</span>
                    </label>
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
              {postInfiniteScoll.data.map((question, i) => (
                <PostCard
                  ref={
                    postInfiniteScoll.data.length === i + 1
                      ? postInfiniteScoll.lastElement
                      : null
                  }
                  key={question.id}
                  isAnonymous={question.anonymous}
                  profileImage={
                    question.anonymous ? "" : question.owner.profilePicture
                  }
                  name={question.anonymous ? "" : question.owner.name}
                  content={question.question}
                  files={question.files}
                  isCurrentUser={true}
                  votes={question.vote}
                  voted={question.voted}
                  id={question.id}
                  isVip={question.anonymous ? false : question.owner?.vip}
                  status={
                    question.anonymous ? undefined : question.owner?.status
                  }
                >
                  {question.replies.map((reply) => (
                    <PostReply
                      anonymous={reply.anonymous}
                      profileImage={
                        !reply.anonymous ? reply.owner.profilePicture : ""
                      }
                      content={reply.content}
                      name={!reply.anonymous ? reply.owner.name : ""}
                      isVip={!reply.anonymous ? reply.owner?.vip : false}
                      key={reply.id}
                      id={reply.id}
                      vote={reply.vote}
                      voted={reply.voted}
                      status={reply.anonymous ? undefined : reply.owner?.status}
                    />
                  ))}
                </PostCard>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mt-24">
              {data ? (
                <UpdateProfileFormComponent
                  /*formData={{
                    id: data?.user.id || "",
                    name: data?.user.name || "",
                    username: data?.user.username || "",
                    acceptQuestion: data?.user.acceptQuestion || false,
                    birthday: data?.user.birthday || new Date(),
                    email: data?.user.email || "",
                    role: data?.user.role || "",
                    verifiedAt: data?.user.verifiedAt || new Date(),
                    profilePicture: data?.user.profilePicture || "",
                  }}*/
                  formData={GlobalUserDtoImpl.fromUser(data.user)}
                />
              ) : null}
            </div>
          </>
        )}
      </div>
      <BottomNavBar />
    </>
  );
};
export default ProfilePage;
