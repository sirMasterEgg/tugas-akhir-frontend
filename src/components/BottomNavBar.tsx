import {
  PiBell,
  PiEnvelopeOpen,
  PiHouse,
  PiPlus,
  PiQuestion,
  PiUser,
  PiUsers,
} from "react-icons/pi";
import { useLocation } from "react-router-dom";
import { RouteEnum } from "../enums/route.enum.ts";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { RootState } from "../stores/index.store.ts";
import { useDispatch, useSelector } from "react-redux";
import { modalAction } from "../slices/modal.slice.ts";
import AddQuestionModal from "./modals/AddQuestionModal.tsx";
import CreateGroupModal from "./modals/CreateGroupModal.tsx";
import useWebsocket from "../hooks/useWebsocket.ts";

const BottomNavBar = () => {
  useWebsocket({
    isInitial: true,
  });
  const location = useLocation();
  const [createPopup, setCreatePopup] = useState<boolean>(false);
  const modalAddQuestion = useRef<HTMLDialogElement>(null);
  const modalCreateGroup = useRef<HTMLDialogElement>(null);

  const modal = useSelector((state: RootState) => state.modal);

  const dispatch = useDispatch();

  const handleModalAddQuestion = () => {
    dispatch(modalAction.setModal(1));
  };

  const handleModalCreateGroup = () => {
    dispatch(modalAction.setModal(2));
  };

  useEffect(() => {
    if (modal === 1) {
      modalAddQuestion.current?.showModal();
      setCreatePopup(false);
    } else if (modal === 2) {
      modalCreateGroup.current?.showModal();
      setCreatePopup(false);
    } else {
      modalAddQuestion.current?.close();
      modalCreateGroup.current?.close();
    }
  }, [modal]);

  return (
    <>
      <div className="btm-nav">
        <a
          href={RouteEnum.HOME}
          className={
            location.pathname === RouteEnum.HOME.toString() ? "active" : ""
          }
        >
          <PiHouse className="w-7 h-7" />
          <span className="hidden md:block">Home</span>
        </a>
        <a
          href={RouteEnum.INBOX}
          className={
            location.pathname === RouteEnum.INBOX.toString() ? "active" : ""
          }
        >
          <PiEnvelopeOpen className="w-7 h-7" />
          <span className="hidden md:block">Inbox</span>
        </a>
        <span className="relative">
          <button
            onClick={() => setCreatePopup(!createPopup)}
            className="btn btn-primary w-3/4 flex-col flex-nowrap py-3 h-auto md:absolute md:bottom-2"
          >
            {!createPopup ? (
              <PiPlus className="w-7 h-7" />
            ) : (
              <IoClose className="w-7 h-7" />
            )}
            <span className="hidden md:block">
              {!createPopup ? "Create" : "Close"}
            </span>
          </button>
          <div
            className={`bg-white shadow h-fit w-fit absolute rounded-xl transition  ${
              !createPopup
                ? "opacity-0 translate-y-20"
                : "opacity-100 -translate-y-28"
            } duration-1000 p-3`}
          >
            <button
              onClick={() => handleModalCreateGroup()}
              className="w-full inline-flex gap-2 items-center px-3 py-1 rounded-lg hover:bg-black/5"
            >
              <PiUsers />
              Create Group
            </button>
            <button
              onClick={() => handleModalAddQuestion()}
              className="w-full inline-flex gap-2 items-center px-3 py-1 rounded-lg hover:bg-black/5"
            >
              <PiQuestion />
              Create Question
            </button>
          </div>
        </span>
        <a
          href={RouteEnum.NOTIFICATION}
          className={
            location.pathname === RouteEnum.NOTIFICATION.toString()
              ? "active"
              : ""
          }
        >
          <div className="indicator">
            {/*<span className="indicator-item badge badge-xs badge-error -translate-y-[0.1px] -translate-x-0.5"></span>*/}
            <PiBell className="w-7 h-7" />
          </div>
          <span className="hidden md:block">Notification</span>
        </a>
        <a
          href={RouteEnum.PROFILE}
          className={
            location.pathname === RouteEnum.PROFILE.toString() ? "active" : ""
          }
        >
          <PiUser className="w-7 h-7" />
          <span className="hidden md:block">User</span>
        </a>
      </div>
      <AddQuestionModal ref={modalAddQuestion} />
      <CreateGroupModal ref={modalCreateGroup} />
    </>
  );
};
export default BottomNavBar;
