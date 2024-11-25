import { forwardRef, useEffect, useRef, useState } from "react";
import { modalAction } from "../../slices/modal.slice.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores/index.store.ts";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import ProfilePicture from "../ProfilePicture.tsx";
import useMembersInfiniteScroll from "../../hooks/useMembersInfiniteScroll.tsx";
import useDebounce from "../../hooks/useDebounce.tsx";
import { toast, ToastContainer } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { createGroupApi } from "../../apis/core/group/create-group.api.ts";

type CreateGroupForm = {
  groupName: string;
  memberId: string[];
};

const CreateGroupModal = forwardRef<HTMLDialogElement>((_props, ref) => {
  const auth = useSelector((state: RootState) => state.auth);
  const modal = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();
  const [memberFilter, setMemberFilter] = useState<string>("");
  const debouncedMemberFilter = useDebounce(memberFilter, 500);

  const [createGroupForm, setCreateGroupForm] = useState<CreateGroupForm>({
    memberId: [],
    groupName: "",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const groupNameRef = useRef<HTMLInputElement>(null);

  const { data, lastElement } = useMembersInfiniteScroll({
    token: auth.token,
    username: debouncedMemberFilter,
  });

  /*useEffect(() => {
    if (
      containerRef.current &&
      modal === 2 &&
      containerRef.current.scrollTop < containerRef.current.scrollHeight
    ) {
      containerRef.current.scrollTop = -containerRef.current.scrollHeight;
    }
  }, [
    modal,
    containerRef.current?.scrollTop,
    containerRef.current?.scrollHeight,
  ]);*/

  const createGroupMutation = useMutation({
    mutationFn: createGroupApi,
    onSuccess: () => {
      toast.success("Group has been created");
      reset();
      dispatch(modalAction.setModal(-1));
    },
    onError: () => {
      toast.error("Failed to create group", {
        containerId: "local",
      });
    },
  });

  useEffect(() => {
    if (modal !== 1 && modal !== 2) {
      reset();
    }
  }, [modal]);

  const reset = () => {
    setCreateGroupForm({
      memberId: [],
      groupName: "",
    });
    setMemberFilter("");
    if (groupNameRef.current) {
      groupNameRef.current.value = "";
    }
  };

  const handleCreateGroup = () => {
    if (!createGroupForm.groupName || createGroupForm.groupName === "") {
      toast.error("Please enter group name", {
        containerId: "local",
      });
      return;
    }
    if (createGroupForm.memberId.length === 0) {
      toast.error("Please select at least one member", {
        containerId: "local",
      });
      return;
    }
    createGroupMutation.mutate([
      auth.token,
      {
        groupName: createGroupForm.groupName,
        memberId: createGroupForm.memberId,
      },
    ]);
  };

  return (
    <>
      <dialog
        ref={ref}
        className={`modal transition duration-1000 ${
          modal === 2 ? "translate-y-0" : "translate-y-full"
        }`}
        onClose={() => dispatch(modalAction.setModal(-1))}
      >
        <div className="modal-box w-screen h-screen lg:w-screen max-w-4xl xl:max-w-7xl">
          <div
            ref={containerRef}
            className="flex flex-col lg:flex-col-reverse gap-3 h-full overflow-y-auto"
          >
            <h1 className="font-bold text-lg block lg:hidden">Create Group</h1>

            <div className="w-full h-full flex flex-col gap-3 p-1">
              <input
                type="text"
                placeholder="Group Name"
                ref={groupNameRef}
                onChange={(e) =>
                  setCreateGroupForm({
                    ...createGroupForm,
                    groupName: e.target.value,
                  })
                }
                className="input input-bordered w-full"
              />
              <div className="flex flex-col gap-3 border rounded-lg p-3 h-[60vh] md:h-[67vh] flex-grow">
                <div className="w-full flex flex-col gap-3">
                  <span className="font-semibold text-sm">Members</span>
                  <span className="relative w-full lg:w-1/4">
                    <input
                      type="text"
                      placeholder="Find Username"
                      onChange={(e) => setMemberFilter(e.target.value)}
                      className="input input-sm input-bordered w-full"
                    />
                    <PiMagnifyingGlassBold className="absolute top-0 right-0 translate-y-1/2 -translate-x-1/2" />
                  </span>
                </div>
                <div className="flex-1 w-full max-h-full rounded-lg border overflow-y-auto">
                  <div className="flex flex-col px-1 py-1 gap-2">
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
                              checked={createGroupForm.memberId.includes(
                                user.id
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCreateGroupForm((prev) => {
                                    return {
                                      ...prev,
                                      memberId: [...prev.memberId, user.id],
                                    };
                                  });
                                } else {
                                  setCreateGroupForm((prev) => {
                                    return {
                                      ...prev,
                                      memberId: prev.memberId.filter(
                                        (id) => id !== user.id
                                      ),
                                    };
                                  });
                                }
                              }}
                              className="checkbox checkbox-sm rounded-full checkbox-primary"
                            />
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
              <form className="w-full lg:w-auto" method="dialog">
                <button className="w-full lg:w-auto btn btn-error btn-outline">
                  Cancel
                </button>
              </form>

              <h1 className="font-bold text-lg hidden lg:block">
                Create Group
              </h1>

              <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={() => handleCreateGroup()}
                  type="button"
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        {modal === 2 && (
          <ToastContainer position="bottom-right" containerId="local" />
        )}
      </dialog>
    </>
  );
});
export default CreateGroupModal;
