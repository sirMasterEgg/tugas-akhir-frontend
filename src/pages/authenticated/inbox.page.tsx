import Navbar from "../../components/Navbar.tsx";
import NotVerified from "../../components/NotVerified.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../stores/index.store.ts";
import BottomNavBar from "../../components/BottomNavBar.tsx";
import FixedNavbarWithAds from "../../components/FixedNavbarWithAds.tsx";
import {useEffect, useRef, useState} from "react";
import {PiMagnifyingGlassBold} from "react-icons/pi";
import {IoIosClose} from "react-icons/io";
import useQueryParams from "../../hooks/useQueryParams.ts";
import useDebounce from "../../hooks/useDebounce.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {searchGroupApi} from "../../apis/core/search/search-group.api.ts";
import GroupDetailsModal from "../../components/modals/GroupDetailsModal.tsx";
import useInboxInfiniteScroll from "../../hooks/useInboxInfiniteScroll.tsx";
import ProfilePicture from "../../components/ProfilePicture.tsx";
import {timeAgo} from "../../helpers/calculate-time.ts";
import {MdClose} from "react-icons/md";
import {getSingleInboxApi} from "../../apis/core/inbox/get-single-inbox.api.ts";
import {IoPaperPlane} from "react-icons/io5";
import {BiMessageDetail} from "react-icons/bi";
import AttachmentCard from "../../components/post/AttachmentCard.tsx";
import {createQuestionRepliesApi} from "../../apis/core/replies/create-question-replies.api.ts";
import VoteButton from "../../components/buttons/VoteButton.tsx";
import {modalFindGroupAction} from "../../slices/modal-find-group.slice.ts";
import {toast} from "react-toastify";

enum Menu {
  All = "all",
  Me = "me",
  Group = "group",
}

const InboxPage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const findGroup = useSelector((state: RootState) => state.modalFindGroup);
  const dispatch = useDispatch();
  // const [findGroup, setFindGroup] = useState<boolean>(false);
  const [inputSearchGroupText, setinputSearchGroupText] = useState<string>("");

  const { setQueryParams, getQueryParams } = useQueryParams();
  const inputSearchGroupTextDebounced = useDebounce(inputSearchGroupText, 500);

  const inputSearchGroup = useRef<HTMLInputElement>(null);
  const inputReply = useRef<HTMLInputElement>(null);
  const groupDetailsModal = useRef<HTMLDialogElement>(null);

  const queryClient = useQueryClient();

  const filterGroupsMutation = useMutation({
    mutationFn: searchGroupApi,
  });

  const [groupId, setGroupId] = useState<string>("");

  const [openedIndex, setOpenedIndex] = useState<{
    index: number;
    id: string;
  }>({
    id: "",
    index: -1,
  });

  const [replies, setReplies] = useState<{
    content: string;
    anonymous: boolean;
  }>({
    content: "",
    anonymous: false,
  });

  const { data, lastElement } = useInboxInfiniteScroll({
    filter: getQueryParams("filter") || Menu.All.toString(),
    token: auth.token,
  });

  const detailsInboxQuery = useQuery({
    queryKey: ["detailsInbox", auth.token || "", openedIndex.id],
    queryFn: ({ queryKey }) =>
      getSingleInboxApi([queryKey[1], { id: queryKey[2] }]),
    enabled: (query) => query.queryKey[1] !== "" && query.queryKey[2] !== "",
  });

  /*const detailsInboxMutation = useMutation({
    mutationFn: getSingleInboxApi,
    /!*onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: ["replyMutation"],
      }); // Cancel any outgoing queries

      const previousData = queryClient.getQueryData(["replyMutation"]); // Get current data

      // Optimistically update the cache
      queryClient.setQueryData(
        ["replyMutation"],
        (oldData: CreateQuestionRepliesResponseDto) => ({
          ...oldData,
          ...newData,
        })
      );

      return { previousData }; // Return the context to rollback if needed
    },
    onError: (_err, _newData, context) => {
      queryClient.setQueryData(["replyMutation"], context?.previousData); // Rollback
    },
    // After mutation is successful, invalidate queries to refetch the data
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replyMutation"],
      }); // Refetch the data
    },*!/
  });*/

  const replyMutation = useMutation({
    mutationFn: createQuestionRepliesApi,
  });

  const resetReplyField = () => {
    setReplies({
      anonymous: false,
      content: "",
    });
    if (inputReply.current) {
      inputReply.current.value = "";
    }
  };

  const resetInputField = () => {
    setinputSearchGroupText("");
    if (inputSearchGroup.current) {
      inputSearchGroup.current.value = "";
    }
  };

  useEffect(() => {
    if (inputSearchGroup.current) {
      if (findGroup) {
        inputSearchGroup.current?.focus();
      } else {
        inputSearchGroup.current?.blur();
        resetInputField();
      }
    }
  }, [findGroup]);

  useEffect(() => {
    if (!inputSearchGroupTextDebounced) return;

    filterGroupsMutation.mutate([
      auth.token,
      { q: inputSearchGroupTextDebounced },
    ]);
  }, [inputSearchGroupTextDebounced]);

  const handleFilterClick = (menu: Menu) => {
    setQueryParams({ filter: menu.toString() });
  };

  const handleDetailsGroupClick = (groupId: string) => {
    setGroupId(groupId);
    groupDetailsModal.current?.showModal();
  };

  const handleDetailsQuestion = (id: string, index: number) => {
    setOpenedIndex({ index, id });
    /*detailsInboxMutation.mutate(
      [
        auth.token,
        {
          id,
        },
      ],
      {
        onSuccess: () => {
          setOpenedIndex(index);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );*/
  };

  const handleSubmitReplies = () => {
    if (!replies) return;
    if (!detailsInboxQuery.data?.question.id) return;

    replyMutation.mutate(
      [
        auth.token,
        {
          postId: detailsInboxQuery.data?.question.id,
          content: replies.content,
          anonymous: replies.anonymous,
        },
      ],
      {
        onSuccess: () => {
          resetReplyField();
          queryClient.invalidateQueries({
            queryKey: ["detailsInbox"],
          });
          /*detailsInboxMutation.mutate([
            auth.token,
            {
              id: detailsInboxMutation.data?.question.id,
            },
          ]);*/
        },
        onError: (error) => {
          console.log(error);
          toast.error("Failed to send reply");
          resetReplyField();
          queryClient.invalidateQueries({
            queryKey: ["detailsInbox"],
          });
        },
      }
    );
  };

  useEffect(() => {
    const dialogRef = groupDetailsModal.current;

    const handleClose = () => {
      setGroupId("");
    };

    if (dialogRef) {
      dialogRef.addEventListener("close", handleClose);
    }

    return () => {
      if (dialogRef) {
        dialogRef.removeEventListener("close", handleClose);
      }
    };
  }, []);

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
      <div
        className={`container-with-ads ${auth.user?.vip ? "mt-20" : "mt-48"}`}
      >
        <div
          className={`flex flex-row ${
            auth.user?.vip
              ? "h-mobile-content-without-ads lg:h-content-without-ads"
              : "h-mobile-content-with-ads lg:h-content-with-ads"
          } gap-3`}
        >
          {/*  left panel  */}
          <div
            className={`${
              openedIndex.index !== -1 ? "hidden lg:block" : ""
            } w-full lg:w-1/3 h-full overflow-y-auto`}
          >
            <div className="sticky top-0 left-0 inline-flex justify-between items-center w-[99.8%] bg-base-100 py-3 pr-1.5 -translate-y-0.5">
              <div
                className={`inline-flex flex-row gap-1.5 transition-all duration-500 ease-in-out ${
                  findGroup
                    ? "overflow-hidden w-0 max-w-0"
                    : "w-1/2 max-w-[50%]"
                }`}
              >
                <button
                  className={`badge badge-primary ${
                    getQueryParams("filter") === Menu.All.toString() ||
                    !getQueryParams("filter")
                      ? ""
                      : "badge-outline"
                  }`}
                  onClick={() => handleFilterClick(Menu.All)}
                >
                  All
                </button>
                <button
                  className={`badge badge-primary ${
                    getQueryParams("filter") === Menu.Me.toString()
                      ? ""
                      : "badge-outline"
                  }`}
                  onClick={() => handleFilterClick(Menu.Me)}
                >
                  Me
                </button>
                <button
                  className={`badge badge-primary ${
                    getQueryParams("filter") === Menu.Group.toString()
                      ? ""
                      : "badge-outline"
                  }`}
                  onClick={() => handleFilterClick(Menu.Group)}
                >
                  Group
                </button>
              </div>
              <div
                className={`flex flex-row transition-all duration-500 ease-in-out relative ${
                  findGroup ? "gap-3 w-full" : "gap-0 w-10 lg:w-28"
                }`}
              >
                <button
                  onClick={() =>
                    dispatch(modalFindGroupAction.setModal(!findGroup))
                  }
                  className="badge badge-primary inline-flex gap-2 py-3 w-10 lg:w-28"
                >
                  {findGroup ? (
                    <>
                      <IoIosClose className="w-6 h-6" />
                      <span className="-translate-y-[1px] -translate-x-1.5 hidden lg:block">
                        Close
                      </span>
                    </>
                  ) : (
                    <>
                      <PiMagnifyingGlassBold />
                      <span className="-translate-y-[1px] hidden lg:block">
                        Find Group
                      </span>
                    </>
                  )}
                </button>
                <div
                  className={`h-fit transition-all duration-500 overflow-x-hidden ease-in-out ${
                    findGroup ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    width: findGroup ? "auto" : "0",
                  }}
                >
                  <input
                    ref={inputSearchGroup}
                    type="text"
                    autoCorrect={"off"}
                    onChange={(e) => setinputSearchGroupText(e.target.value)}
                    placeholder="Search for a group..."
                    className="px-2 border rounded-full w-44 lg:w-44 focus-within:ring-0 focus-within:outline-none"
                  />
                  {inputSearchGroupTextDebounced.length === 0 ||
                  inputSearchGroupText.length === 0 ? null : (
                    <>
                      <div
                        className={`absolute top-full bg-base-100 text-base-content max-h-60 rounded-lg translate-y-0.5 shadow-lg overflow-y-auto p-2 transition-all delay-500 ${
                          findGroup ? "w-44 lg:w-44" : "w-0"
                        }`}
                      >
                        {filterGroupsMutation.isPending ? (
                          <div className="w-full h-full flex justify-center items-center">
                            <span className="loading loading-spinner loading-sm"></span>
                          </div>
                        ) : filterGroupsMutation.isSuccess ? (
                          filterGroupsMutation.data.groups.length ? (
                            filterGroupsMutation.data.groups.map((group, i) => (
                              <div
                                onClick={() =>
                                  handleDetailsGroupClick(group.id)
                                }
                                className="rounded-lg p-2 hover:bg-black/5 cursor-pointer flex flex-col"
                                key={group.id + "-" + i}
                              >
                                <span className="font-semibold text-sm">
                                  {group.name}
                                </span>
                                <span className="text-xs">
                                  ({group.identifier})
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              No group data
                            </div>
                          )
                        ) : (
                          <div className="w-full h-full text-sm flex items-center justify-center">
                            Error on getting data!
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {data.map((question, i) => (
                <div
                  key={i}
                  ref={data.length === i + 1 ? lastElement : null}
                  className="flex flex-row items-start gap-2 flex-1 hover:bg-gray-200 p-2 rounded-lg mr-2 cursor-pointer"
                  onClick={() => handleDetailsQuestion(question.id, i)}
                >
                  <div className="w-8 h-8 rounded-full pt-1">
                    {question.anonymous ? (
                      <ProfilePicture fontSize="text-sm" url={""} name={"?"} />
                    ) : (
                      <ProfilePicture
                        url={question.owner.profilePicture}
                        name={question.owner.name}
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 pr-2">
                    <span className="font-semibold text-sm">
                      {question.anonymous ? "Anonymous" : question.owner.name}
                    </span>
                    {question.targetGroup && (
                      <span className="text-xs">
                        On group:{" "}
                        <span className="text-blue-600">
                          {question.targetGroup.name}
                        </span>
                      </span>
                    )}
                    <span className="text-sm h-5 max-w-64 truncate">
                      {question.question}
                    </span>
                    <span className="text-xs text-neutral-content">
                      {timeAgo(new Date(question.createdAt))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/*  right panel  */}
          <div
            className={`${
              openedIndex.index !== -1
                ? `w-full ${
                    auth.user.vip
                      ? "h-[calc(100vh_-_10rem_-_88px)] lg:h-content-without-ads"
                      : "h-[calc(100vh_-_17rem_-_88px)] lg:h-content-with-ads"
                  }`
                : "hidden"
            } lg:w-auto lg:block lg:flex-grow relative`}
          >
            {openedIndex.index !== -1 ? (
              <>
                <div className="flex flex-col h-full lg:h-auto relative">
                  <span className="inline-flex flex-row justify-end items-center gap-2">
                    <button
                      onClick={() => setOpenedIndex({ index: -1, id: "" })}
                      className="btn btn-ghost btn-sm"
                    >
                      <MdClose className="w-5 h-5" />
                    </button>
                  </span>
                  <div
                    className={`flex-1 ${
                      auth.user.vip
                        ? "max-h-[calc(100vh_-_10rem_-_88px)] lg:min-h-[calc(100vh_-_17rem_-_88px)] lg:max-h-[calc(100vh_-_17rem_-_88px)]"
                        : "max-h-[calc(100vh_-_17rem_-_88px)] lg:min-h-[calc(100vh_-_24rem_-_88px)] lg:max-h-[calc(100vh_-_24rem_-_88px)]"
                    }  overflow-y-auto`}
                  >
                    <div className="flex flex-col p-2 gap-2">
                      <div className="flex flex-row items-center gap-2 rounded-lg">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <ProfilePicture
                            url={
                              !detailsInboxQuery.data?.question.anonymous
                                ? detailsInboxQuery.data?.question.owner
                                    .profilePicture
                                : ""
                            }
                            name={
                              (!detailsInboxQuery.data?.question.anonymous
                                ? detailsInboxQuery.data?.question.owner.name
                                : "?") || "?"
                            }
                            fontSize="text-xs"
                          />
                        </div>
                        <span className="font-semibold text-sm">
                          {!detailsInboxQuery.data?.question.anonymous
                            ? detailsInboxQuery.data?.question.owner.name
                            : "Anonymous"}
                        </span>
                        {/*{detailsInbox.data?.question.owner && (*/}
                        {/*  <span className="text-xs text-primary">*/}
                        {/*    VIP Member*/}
                        {/*  </span>*/}
                        {/*)}*/}
                      </div>
                      <div>{detailsInboxQuery.data?.question.question}</div>
                      <div className="flex gap-2 w-full h-20 overflow-x-auto">
                        {detailsInboxQuery.data?.question.files.map(
                          (file, index) => {
                            return (
                              <AttachmentCard url={file.url} key={index} />
                            );
                          }
                        )}
                      </div>
                    </div>

                    <div className="divider"></div>
                    {detailsInboxQuery.data?.question.replies.map(
                      (reply, i) => (
                        <div
                          key={reply.id + "-" + i}
                          className="flex flex-col gap-2 p-2 rounded-lg"
                        >
                          <div className="flex flex-row items-center gap-2">
                            <div className="w-5 h-5 flex items-center justify-center">
                              <ProfilePicture
                                url={
                                  !reply.anonymous
                                    ? reply.owner.profilePicture
                                    : ""
                                }
                                name={!reply.anonymous ? reply.owner.name : "?"}
                                fontSize="text-xs"
                              />
                            </div>
                            <span className="font-semibold text-sm">
                              {!reply.anonymous
                                ? reply.owner.name
                                : "Anonymous"}
                            </span>
                            {/*{reply.owner && (*/}
                            {/*  <span className="text-xs text-primary">*/}
                            {/*    VIP Member*/}
                            {/*  </span>*/}
                            {/*)}*/}
                          </div>
                          <div>{reply.content}</div>
                          <div className="flex flex-row justify-between">
                            <div className="inline-flex gap-3 items-center">
                              <div className="flex flex-row items-center gap-1">
                                <VoteButton voted={reply.voted} id={reply.id} />
                                <span className="text-xs text-neutral-content">
                                  {reply.vote} votes
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="w-full">
                  <label className="inline-flex px-4 my-2 flex-row gap-2 items-center justify-center">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={replies.anonymous}
                      onChange={(e) =>
                        setReplies((prev) => ({
                          ...prev,
                          anonymous: e.target.checked,
                        }))
                      }
                    />
                    Answer Anonymously
                  </label>
                  <div className="relative">
                    <label>
                      <input
                        ref={inputReply}
                        type="text"
                        placeholder="Write your answer..."
                        className="input input-bordered w-full rounded-full pr-16"
                        disabled={
                          auth?.user?.status?.userStatus === "TIMEOUT" &&
                          new Date(auth?.user?.status?.expired).getTime() >=
                            Date.now()
                        }
                        onChange={(e) =>
                          setReplies((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSubmitReplies();
                          }
                        }}
                      />
                    </label>
                    <button
                      onClick={() => handleSubmitReplies()}
                      disabled={
                        auth?.user?.status?.userStatus === "TIMEOUT" &&
                        new Date(auth?.user?.status?.expired).getTime() >=
                          Date.now()
                      }
                      className="absolute top-2 right-2 btn btn-primary btn-sm rounded-full"
                    >
                      <IoPaperPlane className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BiMessageDetail className="w-20 h-20 fill-primary" />
              </div>
            )}
          </div>
        </div>

        <GroupDetailsModal id={groupId} ref={groupDetailsModal} />
      </div>
      {/*<AdSense slot={"5399130281"} />*/}
      <BottomNavBar />
    </>
  );
};
export default InboxPage;
