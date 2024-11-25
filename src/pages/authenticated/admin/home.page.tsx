import { FaMagnifyingGlass } from "react-icons/fa6";
import { PiClockBold, PiWarningBold } from "react-icons/pi";
import { MdOutlineBlock } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/index.store.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsersApi } from "../../../apis/core/admin/get-all-users.api.ts";
import useQueryParams from "../../../hooks/useQueryParams.ts";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce.tsx";
import { doActionOnUserApi } from "../../../apis/core/admin/do-action-on-user.api.ts";

const actionMap: { [key: string]: number } = {
  BANNED: 4,
  WARNED: 3,
  TIMEOUT: 2,
  ACTIVE: 1,
};

const HomePageAdmin = () => {
  const auth = useSelector((state: RootState) => state.auth);

  const { setQueryParams, getQueryParams } = useQueryParams();

  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<{
    filter: string;
    page: number;
  }>({
    filter: "all",
    page: 1,
  });

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setQueryParams({
      q: debouncedSearch,
      filter: filter.filter,
      page: filter.page.toString(),
    });
  }, [filter, debouncedSearch]);

  const { data } = useQuery({
    queryKey: [
      "admin/users",
      auth.token,
      getQueryParams<string>("filter"),
      getQueryParams<string>("q"),
      getQueryParams<string>("page"),
    ],
    queryFn: ({ queryKey }) =>
      getAllUsersApi([
        queryKey[1] || "",
        {
          page: queryKey[4] ? parseInt(queryKey[4]) : 1,
          size: 10,
          filter: queryKey[2] ?? "",
          search: queryKey[3] ?? "",
        },
      ]),
    enabled: !!auth.token,
  });
  const queryClient = useQueryClient();

  const userActionMutation = useMutation({
    mutationFn: doActionOnUserApi,
  });

  const handleAction = (
    userId: string,
    action: "ban" | "warn" | "timeout" | "unban"
  ) => {
    userActionMutation.mutate(
      [
        auth.token,
        {
          userId,
          action,
        },
      ],
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["admin/users"],
          });
        },
      }
    );
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="inline-flex flex-row justify-between">
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Search Username"
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaMagnifyingGlass />
          </label>
          <select
            defaultValue="all"
            onChange={(e) => {
              setFilter((prev) => ({ ...prev, filter: e.target.value }));
            }}
            className="select select-bordered max-w-48 w-full"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="warned">Warned</option>
            <option value="banned">Banned</option>
            <option value="timeout">Timeout</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-primary text-primary-content">
              <tr>
                <th></th>
                <th>Name</th>
                <th>Username</th>
                <th>Account Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((user, index) => (
                <tr key={user.id}>
                  <th>{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>
                    {user.status?.userStatus === "BANNED" && (
                      <div className="badge badge-error">Banned</div>
                    )}
                    {user.status?.userStatus === "TIMEOUT" && (
                      <div className="badge badge-neutral">Timeout</div>
                    )}
                    {user.status?.userStatus === "WARNED" && (
                      <div className="badge badge-warning">Warned</div>
                    )}
                    {!user.status && (
                      <div className="badge badge-success">Active</div>
                    )}
                  </td>
                  <td className="inline-flex flex-col gap-1 w-full">
                    <button
                      onClick={() => handleAction(user.id, "timeout")}
                      className="btn btn-xs btn-neutral"
                      disabled={
                        actionMap[user.status?.userStatus || "ACTIVE"] >=
                        actionMap["TIMEOUT"]
                      }
                    >
                      <PiClockBold />
                      Timeout
                    </button>
                    <button
                      onClick={() => handleAction(user.id, "warn")}
                      className="btn btn-xs btn-warning"
                      disabled={
                        actionMap[user.status?.userStatus || "ACTIVE"] >=
                        actionMap["WARNED"]
                      }
                    >
                      <PiWarningBold />
                      Warn
                    </button>
                    <button
                      onClick={() => handleAction(user.id, "ban")}
                      className="btn btn-xs btn-error"
                      disabled={
                        actionMap[user.status?.userStatus || "ACTIVE"] >=
                        actionMap["BANNED"]
                      }
                    >
                      <MdOutlineBlock />
                      Ban
                    </button>
                    <button
                      onClick={() => handleAction(user.id, "unban")}
                      className="btn btn-xs btn-success"
                    >
                      <GoTrash />
                      Remove Action
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="join inline-flex justify-center ">
          <button
            onClick={() =>
              setFilter((prev) => ({
                ...prev,
                page: Math.max(1, prev.page - 1),
              }))
            }
            className="join-item btn"
            disabled={filter.page === 1}
          >
            «
          </button>
          <button className="join-item btn">
            Page {data?.meta.currentPage} of {data?.meta.totalPage}
          </button>
          <button
            onClick={() =>
              setFilter((prev) => ({
                ...prev,
                page: Math.min(data?.meta.totalPage || 1, prev.page + 1),
              }))
            }
            className="join-item btn"
            disabled={filter.page === data?.meta.totalPage}
          >
            »
          </button>
        </div>
      </div>
    </>
  );
};
export default HomePageAdmin;
