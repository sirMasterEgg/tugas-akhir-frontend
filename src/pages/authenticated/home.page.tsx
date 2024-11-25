import Navbar from "../../components/Navbar.tsx";
import NotVerified from "../../components/NotVerified.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/index.store.ts";
import BottomNavBar from "../../components/BottomNavBar.tsx";
import FixedNavbarWithAds from "../../components/FixedNavbarWithAds.tsx";
import useAllPostInfiniteScroll from "../../hooks/useAllPostInfiniteScroll.tsx";
import PostCard from "../../components/post/PostCard.tsx";
import PostReply from "../../components/post/PostReply.tsx";

const HomePage = () => {
  const auth = useSelector((state: RootState) => state.auth);

  const { data, lastElement } = useAllPostInfiniteScroll({ token: auth.token });

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
        className={`mb-16 ${
          auth.user?.vip ? "mt-20" : "mt-48"
        } overflow-y-auto`}
      >
        {/*<div className="w-full bg-blue-100 px-20 py-10">
          <div className="">
            <div className="flex flex-row justify-between items-center">
              <span className="text-sm text-neutral-content">Anonymous</span>
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
                    <a>Item 1</a>
                  </li>
                  <li>
                    <a>Item 2</a>
                  </li>
                </ul>
              </div>
            </div>
            <h1 className="font-bold">
              Lorem ipsum dolor sit amet consectetur. Accumsan feugiat in
              consequat elit eu. Dictumst euismod quam habitasse enim ac et
              fringilla lectus.
            </h1>
            <div className="relative mt-14 border rounded-xl border-gray-500 py-5 px-5">
              <div className="absolute -top-4 left-2 rounded-full bg-primary text-primary-content px-5 h-8 flex flex-row items-center justify-center">
                <span className="h-full">asdasduser</span>
              </div>
              asdasd
            </div>
          </div>
        </div>*/}
        {data.map((item, i) => (
          <div key={item.id + "-" + i} className="w-full px-20 pt-10">
            <PostCard
              ref={data.length === i + 1 ? lastElement : null}
              content={item.question}
              isAnonymous={item.anonymous}
              files={item.files}
              name={item.anonymous ? "Anonymous" : item.owner.name}
              profileImage={item.anonymous ? "" : item.owner.profilePicture}
              votes={item.vote}
              id={item.id}
              voted={item.voted}
              isVip={item.anonymous ? false : item.owner?.vip}
              status={item.anonymous ? undefined : item.owner?.status}
            >
              {item.replies.map((reply) => (
                <PostReply
                  key={reply.id}
                  name={reply.anonymous ? "Anonymous" : reply.owner.name}
                  profileImage={
                    reply.anonymous ? "?" : reply.owner.profilePicture
                  }
                  content={reply.content}
                  anonymous={reply.anonymous}
                  isVip={!reply.anonymous ? reply.owner?.vip : false}
                  voted={reply.voted}
                  vote={reply.vote}
                  id={reply.id}
                  status={reply.anonymous ? undefined : reply.owner?.status}
                />
              ))}
            </PostCard>
          </div>
        ))}
      </div>
      <BottomNavBar />
    </>
  );
};
export default HomePage;
