import { forwardRef, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RootState } from "../../stores/index.store.ts";
import { useDispatch, useSelector } from "react-redux";
import { getSingleGroupApi } from "../../apis/core/group/get-single-group.api.ts";
import { IoIosClose } from "react-icons/io";
import ProfilePicture from "../ProfilePicture.tsx";
import { PiCrown } from "react-icons/pi";
import { leaveGroupApi } from "../../apis/core/group/leave-group.api.ts";
import { toast } from "react-toastify";
import { followGroupApi } from "../../apis/core/group/follow-group.api.ts";
import { checkFollowGroupApi } from "../../apis/core/group/check-following-group.api.ts";
import { deleteGroupApi } from "../../apis/core/group/delete-group.api.ts";
import useMembersInfiniteScroll from "../../hooks/useMembersInfiniteScroll.tsx";
import useDebounce from "../../hooks/useDebounce.tsx";
import { editGroupApi } from "../../apis/core/group/edit-group.api.ts";
import { modalFindGroupAction } from "../../slices/modal-find-group.slice.ts";

interface GroupDetailsModalProps {
  id: string;
}

const EditGroupMember = ({
  username,
  currentMembers,
  membersCallback,
}: {
  username: string;
  currentMembers: string[];
  membersCallback: (addedMembers: string[], removedMembers: string[]) => void;
}) => {
  const auth = useSelector((state: RootState) => state.auth);
  const { data, lastElement } = useMembersInfiniteScroll({
    token: auth.token,
    username: username,
  });

  const [members, setMembers] = useState<{
    currentMembers: string[];
    addedMembers: string[];
    removedMembers: string[];
  }>({
    currentMembers: currentMembers,
    addedMembers: [],
    removedMembers: [],
  });

  useEffect(() => {
    membersCallback(members.addedMembers, members.removedMembers);

    return () => {};
  }, [members.addedMembers, members.removedMembers]);

  const handleAddMember = (id: string, checked: boolean) => {
    setMembers((prevState) => {
      let state;
      if (!checked) {
        if (currentMembers.includes(id)) {
          state = {
            ...prevState,
            removedMembers: [...new Set([...prevState.removedMembers, id])],
            currentMembers: prevState.currentMembers.filter(
              (memberId) => memberId !== id
            ),
          };
        } else {
          state = {
            ...prevState,
            addedMembers: prevState.addedMembers.filter(
              (memberId) => memberId !== id
            ),
          };
        }
      } else {
        if (currentMembers.includes(id)) {
          state = {
            ...prevState,
            currentMembers: [...new Set([...prevState.currentMembers, id])],
            removedMembers: prevState.removedMembers.filter(
              (memberId) => memberId !== id
            ),
          };
        } else {
          state = {
            ...prevState,
            addedMembers: [...new Set([...prevState.addedMembers, id])],
          };
        }
      }

      return state;
    });
  };

  return (
    <>
      {data.map((user, i) => (
        <div
          key={user.id + "-" + i}
          ref={data.length === i + 1 ? lastElement : null}
        >
          <label className="w-full flex flex-row justify-between items-center hover:bg-gray-200 hover:rounded-lg px-2 py-1">
            <div className="flex flex-row items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <ProfilePicture
                  url={user.profilePicture}
                  name={user.name}
                  fontSize="text-sm"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{user.name}</span>
                <span className="text-xs">{user.username}</span>
              </div>
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
              <input
                type="checkbox"
                checked={
                  members.addedMembers.includes(user.id) ||
                  members.currentMembers.includes(user.id)
                }
                onChange={(e) => handleAddMember(user.id, e.target.checked)}
                className="checkbox checkbox-sm rounded-full checkbox-primary"
              />
            </div>
          </label>
        </div>
      ))}
    </>
  );
};

const GroupDetailsModal = forwardRef<HTMLDialogElement, GroupDetailsModalProps>(
  (props, ref) => {
    const auth = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const { data, isLoading } = useQuery({
      queryFn: ({ queryKey }) =>
        getSingleGroupApi([auth.token, { id: queryKey[1] }]),
      queryKey: ["getSingleGroup", props.id],
      enabled: !!props.id,
    });

    const [searchMemberUsername, setSearchMemberUsername] =
      useState<string>("");
    const searchMemberUsernameRef = useRef<HTMLInputElement>(null);
    const searchMemberUsernameDebounced = useDebounce(
      searchMemberUsername,
      500
    );

    const handleEditGroupNameRef = useRef<HTMLInputElement>(null);

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editGroupForm, setEditGroupForm] = useState<{
      groupName: string;
      memberId: string[];
      removeMemberId: string[];
      ownerId: string;
    }>({
      groupName: "",
      ownerId: "",
      memberId: [],
      removeMemberId: [],
    });

    const leaveGroupMutation = useMutation({
      mutationFn: leaveGroupApi,
    });

    const followGroupMutation = useMutation({
      mutationFn: followGroupApi,
    });

    const deleteGroupMutation = useMutation({
      mutationFn: deleteGroupApi,
    });

    const editGroupMutation = useMutation({
      mutationFn: editGroupApi,
    });

    const queryClient = useQueryClient();

    const checkFollow = useQuery({
      queryKey: ["checkUserFollowGroup", auth.token, props.id],
      queryFn: ({ queryKey }) =>
        checkFollowGroupApi([queryKey[1], { groupId: queryKey[2] }]),
      enabled: !!props.id,
      initialData: {
        followed: false,
      },
    });

    const resetSearchMemberUsername = () => {
      setSearchMemberUsername("");
      if (searchMemberUsernameRef.current) {
        searchMemberUsernameRef.current.value = "";
      }
    };

    const resetEditGroupName = () => {
      setEditGroupForm({
        groupName: "",
        memberId: [],
        removeMemberId: [],
        ownerId: "",
      });
      if (handleEditGroupNameRef.current) {
        handleEditGroupNameRef.current.value = data?.group.name || "";
      }
    };

    useEffect(() => {
      if (!isEditMode) {
        resetEditGroupName();
      }
      resetSearchMemberUsername();
    }, [isEditMode]);

    useEffect(() => {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.addEventListener("close", () => setIsEditMode(false));
      }
      return () => {
        if (ref && typeof ref !== "function" && ref.current) {
          ref?.current?.removeEventListener("close", () =>
            setIsEditMode(false)
          );
        }
      };
    }, [ref]);

    if (isLoading) {
      return (
        <>
          <dialog ref={ref} className="modal">
            <div className="modal-box">
              <div className="w-full h-full items-center justify-center flex">
                <span className="loading loading-spinner loading-md"></span>
              </div>

              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  <IoIosClose className="w-full h-full" />
                </button>
              </form>
            </div>
          </dialog>
        </>
      );
    }

    const closeModal = () => {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.close();
        setIsEditMode(false);
        dispatch(modalFindGroupAction.setModal(false));
      }
    };

    const handleLeaveGroup = () => {
      leaveGroupMutation.mutate(
        [
          auth.token,
          {
            groupId: props.id,
          },
        ],
        {
          onSuccess: () => {
            toast.success("You have left the group successfully");
            closeModal();
          },
          onError: () => {
            toast.error("Failed to leave the group");
          },
        }
      );
    };

    const handleFollowGroup = () => {
      followGroupMutation.mutate(
        [
          auth.token,
          {
            groupId: props.id,
            follow: !checkFollow.data?.followed,
          },
        ],
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["checkUserFollowGroup"],
            });
            queryClient.invalidateQueries({
              queryKey: ["getInbox"],
            });
          },
          onError: () => {
            toast.error("Failed to follow the group");
          },
        }
      );
    };

    const handleDeleteGroup = () => {
      deleteGroupMutation.mutate(
        [
          auth.token,
          {
            groupId: props.id,
          },
        ],
        {
          onSuccess: () => {
            toast.success("Group deleted successfully");
            closeModal();
          },
          onError: () => {
            toast.error("Failed to delete group");
          },
        }
      );
    };

    const handleEditGroup = () => {
      setIsEditMode(true);
    };

    const handleGroupChanges = () => {
      const data: Partial<{
        groupName: string;
        memberId: string[];
        removeMemberId: string[];
        ownerId: string;
      }> = {
        ...editGroupForm,
      };

      delete data.ownerId;

      editGroupMutation.mutate(
        [
          auth.token,
          {
            groupId: props.id,
            ...data,
          },
        ],
        {
          onSuccess: () => {
            toast.success("Group has been updated");
            closeModal();
          },
          onError: () => {
            toast.error("Failed to update group");
          },
        }
      );
    };

    const isOwner = auth?.user?.id === data?.group.owner.id;
    const isMember =
      data?.group.members.some((e) => e.id === auth?.user?.id) || false;

    return (
      <>
        <dialog ref={ref} className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                <IoIosClose className="w-full h-full" />
              </button>
            </form>
            <h3 className="font-bold text-lg">Group Details</h3>
            <div className="pt-4">
              <div className="flex flex-col gap-1">
                {isEditMode ? (
                  <input
                    type="text"
                    placeholder="Group Name"
                    className="input input-bordered input-xs"
                    value={editGroupForm.groupName || data?.group.name}
                    ref={handleEditGroupNameRef}
                    onChange={(e) =>
                      setEditGroupForm({
                        ...editGroupForm,
                        groupName: e.target.value,
                      })
                    }
                  />
                ) : (
                  <>
                    {/*<a
                      href={`/group/${data?.group.identifier}`}
                      className="w-fit"
                    >
                      <h2 className="font-semibold w-fit transition hover:scale-110 hover:border-b hover:border-b-black origin-center">
                        {data?.group.name}{" "}
                        <BsBoxArrowUpRight className="w-2.5 h-2.5 inline -translate-y-0.5" />
                      </h2>
                    </a>*/}
                    <h2 className="font-semibold w-fit ">{data?.group.name}</h2>
                  </>
                )}
                <span className="text-xs text-gray-400">
                  {isEditMode
                    ? "Identifier will be set after save the group name"
                    : `Identifier: ${data?.group.identifier}`}
                </span>
                <div className="flex flex-col mt-5">
                  <span className="text-sm inline-flex justify-between">
                    Members:
                    {isEditMode && (
                      <input
                        type="text"
                        className="input-xs input input-bordered"
                        placeholder="Find Username"
                        ref={searchMemberUsernameRef}
                        onChange={(e) =>
                          setSearchMemberUsername(e.target.value)
                        }
                      />
                    )}
                  </span>
                  <div className="my-2 p-1 pl-2 border rounded-lg">
                    <div className="flex flex-col gap-1 h-72 overflow-y-auto">
                      {isEditMode ? (
                        <>
                          <EditGroupMember
                            username={searchMemberUsernameDebounced}
                            currentMembers={
                              data?.group.members.map((member) => member.id) ||
                              []
                            }
                            membersCallback={(addedMembers, removedMembers) => {
                              setEditGroupForm((prev) => ({
                                ...prev,
                                removeMemberId: removedMembers,
                                memberId: addedMembers,
                              }));
                            }}
                          />
                        </>
                      ) : (
                        <>
                          {data?.group.members.map((member) => {
                            const isOwner = member.id === data?.group.owner.id;
                            const isMe = member.current;

                            return (
                              <div
                                key={member.id}
                                className="flex items-center justify-between gap-2"
                              >
                                <div className="flex flex-row items-center gap-2">
                                  <div className="w-8 h-8 rounded-full mt-2">
                                    <ProfilePicture
                                      url={member.profilePicture}
                                      name={member.name}
                                      fontSize={"text-sm"}
                                    />
                                  </div>
                                  <span className="font-semibold text-sm">
                                    {member.name}
                                    <span className="text-xs text-gray-400">
                                      {" "}
                                      ({member.username})
                                    </span>
                                  </span>
                                </div>
                                <div className="mr-3 flex flex-row gap-1">
                                  {isOwner && (
                                    <div className="badge badge-primary gap-2">
                                      <PiCrown />
                                    </div>
                                  )}
                                  {isMe && (
                                    <div className="badge badge-primary badge-outline gap-2">
                                      You
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {isEditMode ? (
                  <>
                    <button
                      onClick={() => handleGroupChanges()}
                      className="btn btn-primary"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="btn btn-error"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {!isOwner && !isMember && (
                      <>
                        {!checkFollow.data?.followed ? (
                          <button
                            onClick={() => handleFollowGroup()}
                            className="btn btn-primary"
                          >
                            Follow
                          </button>
                        ) : (
                          <button
                            onClick={() => handleFollowGroup()}
                            className="btn btn-primary btn-outline"
                          >
                            Unfollow
                          </button>
                        )}
                      </>
                    )}

                    {isMember && !isOwner && (
                      <button
                        onClick={() => handleLeaveGroup()}
                        className="btn btn-error btn-outline"
                      >
                        Leave Group
                      </button>
                    )}

                    {isOwner && (
                      <>
                        <button
                          onClick={() => handleEditGroup()}
                          className="btn btn-primary"
                        >
                          Edit Group
                        </button>
                        <button
                          onClick={() => handleDeleteGroup()}
                          className="btn btn-error"
                        >
                          Delete Group
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </dialog>
      </>
    );
  }
);

export default GroupDetailsModal;
