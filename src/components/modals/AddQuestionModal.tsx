import { forwardRef, Fragment, useEffect, useRef, useState } from "react";
import { SearchGroup, SearchUser } from "../../apis/dto/search/search.dto.ts";
import { IoIosClose } from "react-icons/io";
import ProfilePicture from "../ProfilePicture.tsx";
import AttachmentCardQuestion from "../post/AttachmentCardQuestion.tsx";
import { PiFile, PiImage } from "react-icons/pi";
import { toast, ToastContainer } from "react-toastify";
import { fileToBase64Display } from "../../helpers/file-to-base64.ts";
import useDebounce from "../../hooks/useDebounce.tsx";
import { useMutation } from "@tanstack/react-query";
import { searchApi } from "../../apis/core/search/search.api.ts";
import useWebsocket from "../../hooks/useWebsocket.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores/index.store.ts";
import { modalAction } from "../../slices/modal.slice.ts";

interface AskForm {
  userId?: string;
  groupId?: string;
  anonymous: boolean;
  content: string;
  files?: string[];
}

const AddQuestionModal = forwardRef<HTMLDialogElement>((_props, ref) => {
  const socketInstance = useWebsocket();
  const auth = useSelector((state: RootState) => state.auth);
  const modal = useSelector((state: RootState) => state.modal);

  const dispatch = useDispatch();

  const imageInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const recipientSearchRef = useRef<HTMLInputElement>(null);

  const [filesEncode, setFilesEncode] = useState<string[]>([]);
  const [recipient, setRecipient] = useState<string>("");
  const [recipientObject, setRecipientObject] = useState<
    (SearchGroup | SearchUser)[]
  >([]);
  const [askForm, setAskForm] = useState<AskForm>({
    anonymous: false,
    content: "",
  });

  const recipientDebouncedValue = useDebounce(recipient, 500);

  const searchRecipientMutation = useMutation({
    mutationFn: searchApi,
  });

  const reset = () => {
    setFilesEncode([]);
    setAskForm({
      content: "",
      anonymous: false,
    });
    setRecipient("");
    setRecipientObject([]);
    if (recipientSearchRef.current) recipientSearchRef.current.value = "";
    if (imageInput.current) imageInput.current.value = "";
    if (fileInput.current) fileInput.current.value = "";
  };

  const handleFileInput = async (file: FileList | null) => {
    if (!file) return;

    const encodedFiles = await Promise.all(
      Array.from(file).map(fileToBase64Display)
    );

    setFilesEncode((prevEncodes) => [...prevEncodes, ...encodedFiles]);
  };

  const handleFriendOnlyButton = () => {
    const payload: AskForm = {
      anonymous: askForm.anonymous,
      content: askForm.content,
    };

    if (recipientObject.length === 0) {
      toast.error("Please select at least one recipient", {
        containerId: "local",
      });
      return;
    }

    if (recipientObject.length === 1) {
      if (recipientObject[0].type === "user") {
        payload.userId = (recipientObject[0] as SearchUser).id;
      } else {
        payload.groupId = (recipientObject[0] as SearchGroup).id;
      }
    }

    if (filesEncode.length > 0) {
      payload.files = filesEncode.map((file) => file.split(",")[1]);
    }

    socketInstance.current?.emit("FETCH_POSTS", payload);

    toast.success("Question has been sent to selected user/group");
    reset();
    // setModal(-1);
    dispatch(modalAction.setModal(-1));
  };

  const handleEveryoneButton = () => {
    const payload: AskForm = {
      anonymous: askForm.anonymous,
      content: askForm.content,
    };

    if (askForm.content.length === 0) {
      toast.error("Please enter your question", {
        containerId: "local",
      });
      return;
    }

    if (filesEncode.length > 0) {
      payload.files = filesEncode.map((file) => file.split(",")[1]);
    }

    socketInstance.current?.emit("FETCH_POSTS", payload);

    toast.success("Question has been sent");
    reset();
    // setModal(-1);
    dispatch(modalAction.setModal(-1));
  };

  const handleRecipient = (data: SearchGroup | SearchUser) => {
    if (recipientObject.length >= 1) return;
    setRecipientObject((prev) => [...prev, data]);
    setRecipient("");
    if (recipientSearchRef.current) {
      recipientSearchRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!recipientDebouncedValue) return;

    searchRecipientMutation.mutate([
      auth.token,
      {
        q: recipientDebouncedValue,
      },
    ]);
  }, [recipientDebouncedValue]);

  useEffect(() => {
    if (modal !== 1 && modal !== 2) {
      reset();
    }
  }, [modal]);

  return (
    <>
      <dialog
        ref={ref}
        className={`modal transition duration-1000 ${
          modal === 1 ? "translate-y-0" : "translate-y-full"
        }`}
        onClose={() => dispatch(modalAction.setModal(-1))}
      >
        <div className="modal-box w-screen h-screen lg:w-screen max-w-4xl xl:max-w-7xl">
          <div className="flex flex-col-reverse lg:flex-col gap-3 h-full overflow-y-auto">
            <div className="flex flex-col lg:flex-row gap-3 justify-between">
              <form method="dialog">
                <button className="w-full lg:w-auto btn btn-error btn-outline">
                  Cancel
                </button>
              </form>

              <div className="flex flex-col lg:flex-row gap-3">
                <button
                  onClick={() => handleFriendOnlyButton()}
                  type="button"
                  className="btn btn-primary btn-outline"
                  disabled={
                    auth?.user?.status?.userStatus === "TIMEOUT" &&
                    new Date(auth?.user?.status?.expired).getTime() >=
                      Date.now()
                  }
                >
                  Selected User/Group
                </button>
                <button
                  onClick={() => handleEveryoneButton()}
                  type="button"
                  className="btn btn-primary"
                  disabled={
                    auth?.user?.status?.userStatus === "TIMEOUT" &&
                    new Date(auth?.user?.status?.expired).getTime() >=
                      Date.now()
                  }
                >
                  Ask Everyone
                </button>
              </div>
            </div>
            <div className="w-full h-full flex flex-col gap-3 p-1">
              <div className="flex items-center w-full h-12">
                <div className="dropdown w-full ml-9">
                  <div className="input input-bordered flex items-center gap-2 w-full focus-within:ring-0 focus-within:outline-none">
                    {recipientObject.map((data, index) => {
                      if (data.type === "user") {
                        data = data as SearchUser;
                        return (
                          <Fragment key={data.id}>
                            <span className="badge badge-lg badge-primary h-auto inline-flex gap-1">
                              {data.name}
                              <button
                                onClick={() => {
                                  setRecipientObject((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  );
                                }}
                                className="bg-red-400 rounded-full text-error-content translate-x-1/3"
                              >
                                <IoIosClose className="w-4 h-4" />
                              </button>
                            </span>
                          </Fragment>
                        );
                      }

                      data = data as SearchGroup;
                      return (
                        <Fragment key={data.id}>
                          <span
                            key={data.id}
                            className="badge badge-lg badge-primary h-auto inline-flex gap-1"
                          >
                            {data.name}
                            <button
                              onClick={() => {
                                setRecipientObject((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                              }}
                              className="bg-red-400 rounded-full text-error-content translate-x-1/3"
                            >
                              <IoIosClose className="w-4 h-4" />
                            </button>
                          </span>
                        </Fragment>
                      );
                    })}

                    <input
                      type="text"
                      className="flex-1 w-0"
                      ref={recipientSearchRef}
                      placeholder="Username/Group"
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                  {recipientDebouncedValue.length === 0 ||
                  recipient.length === 0 ? null : (
                    <>
                      {searchRecipientMutation.isPending ? (
                        <>
                          <ul
                            tabIndex={0}
                            className="dropdown-content dropdown-open menu p-2 shadow bg-base-100 rounded-box w-full"
                          >
                            <li className="inline-flex w-full justify-center items-center">
                              <span className="loading loading-spinner loading-xs"></span>
                            </li>
                          </ul>
                        </>
                      ) : searchRecipientMutation.isSuccess ? (
                        <>
                          {searchRecipientMutation.data?.results.length ===
                          0 ? null : (
                            <>
                              <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
                                {searchRecipientMutation.data?.results.map(
                                  (result) => {
                                    if (result.type === "user") {
                                      result = result as SearchUser;
                                      return (
                                        <li
                                          key={result.id}
                                          className="flex justify-between gap-2"
                                        >
                                          <button
                                            onClick={() =>
                                              handleRecipient(result)
                                            }
                                            className="flex flex-col items-start"
                                          >
                                            <span>User</span>
                                            <span>
                                              {result.name}
                                              <span className="text-xs">
                                                {" "}
                                                ({result.username})
                                              </span>
                                            </span>
                                          </button>
                                        </li>
                                      );
                                    }

                                    result = result as SearchGroup;
                                    return (
                                      <li
                                        key={result.id}
                                        className="flex justify-between gap-2"
                                      >
                                        <button
                                          onClick={() =>
                                            handleRecipient(result)
                                          }
                                          className="flex flex-col items-start"
                                        >
                                          <span>Group</span>
                                          <span>
                                            {result.name}
                                            <span className="text-xs">
                                              {" "}
                                              ({result.identifier})
                                            </span>
                                          </span>
                                        </button>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </>
                          )}
                        </>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-row items-start gap-1 h-full">
                <div className="w-8 h-8 rounded-full mt-2">
                  <ProfilePicture
                    name={auth?.user?.name ?? ""}
                    url={auth?.user?.profilePicture ?? ""}
                  />
                </div>
                <div className="flex flex-col w-full h-full border border-gray-300 rounded-lg p-3 flex-1">
                  <textarea
                    className="w-full h-full mb-3 outline-0 ring-0 resize-none"
                    placeholder="What do you want to ask?"
                    value={askForm.content}
                    onChange={(e) =>
                      setAskForm((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                  ></textarea>
                  {filesEncode.length > 0 && (
                    <div className="flex gap-2 w-full h-28 overflow-x-auto">
                      {filesEncode.map((encodedFile, index) => {
                        return (
                          <AttachmentCardQuestion
                            url={encodedFile}
                            key={index}
                            deleteFile={() => {
                              setFilesEncode((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                  <div className="inline-flex flex-row justify-between">
                    <div className="inline-flex flex-row">
                      <label className="rounded-full w-10 h-10 hover:bg-gray-200 p-2">
                        <PiImage className="w-full h-full" />
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*"
                          ref={imageInput}
                          onChange={(e) => handleFileInput(e.target.files)}
                        />
                      </label>
                      <label className="rounded-full w-10 h-10 hover:bg-gray-200 p-2">
                        <PiFile className="w-full h-full" />
                        <input
                          type="file"
                          className="hidden"
                          accept="audio/*,video/*,application/*"
                          multiple
                          ref={fileInput}
                          onChange={(e) => handleFileInput(e.target.files)}
                        />
                      </label>
                    </div>
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={askForm.anonymous}
                        onChange={() =>
                          setAskForm((prev) => ({
                            ...prev,
                            anonymous: !askForm.anonymous,
                          }))
                        }
                      />
                      <span className="label-text">Anonymous</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {modal === 1 && (
          <ToastContainer position="bottom-right" containerId="local" />
        )}
      </dialog>
    </>
  );
});
export default AddQuestionModal;
