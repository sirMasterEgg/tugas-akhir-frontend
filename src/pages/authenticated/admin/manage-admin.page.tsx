import { PiKey, PiPencil, PiPlus } from "react-icons/pi";
import useQueryParams from "../../../hooks/useQueryParams.ts";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/index.store.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkKeyApi } from "../../../apis/core/admin/check-key.api.ts";
import useDebounce from "../../../hooks/useDebounce.tsx";
import { getManageAdminApi } from "../../../apis/core/admin/get-manage-admin.api.ts";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import { postManageAdminApi } from "../../../apis/core/admin/post-manage-admin.api.ts";
import { updateManageAdminApi } from "../../../apis/core/admin/update-manage-admin.api.ts";
import { deleteManageAdminApi } from "../../../apis/core/admin/delete-manage-admin.api.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddAdminSchema,
  EditAdminSchema,
} from "../../../validations/add-admin.validation.ts";
import { toast, ToastContainer } from "react-toastify";
import { GlobalUserDto } from "../../../apis/dto/shared/user.dto.ts";

export default function ManageAdminPage() {
  const { setQueryParams, getQueryParams } = useQueryParams();
  const [locked, setLocked] = useState<boolean>(true);
  const auth = useSelector((selector: RootState) => selector.auth);
  const [key, setKey] = useState<string>("");

  const checkKeyMutation = useMutation({
    mutationFn: checkKeyApi,
  });

  useEffect(() => {
    if (!getQueryParams("key")) {
      setLocked(true);
      return;
    }

    checkKeyApi([
      auth.token,
      {
        key: getQueryParams("key")!,
      },
    ]).then(() => {
      setLocked(false);
    });
  }, [getQueryParams("key")]);

  const handleCheckKey = () => {
    checkKeyMutation.mutate(
      [
        auth.token,
        {
          key: key,
        },
      ],
      {
        onSuccess: () => {
          setQueryParams({ key: key });
          setLocked(false);
        },
      }
    );
  };

  return (
    <>
      {locked ? (
        <div className="flex items-center justify-center h-[calc(100%_-_28px_-_1.25rem)]">
          <div className="flex flex-row gap-2">
            <label className="input input-bordered flex items-center gap-2">
              <PiKey />
              <input
                onChange={(e) => setKey(e.target.value)}
                type="text"
                className="grow"
                placeholder="Access Key"
              />
            </label>
            <button
              className="btn btn-primary"
              onClick={() => handleCheckKey()}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <RenderAdminPage />
      )}
    </>
  );
}

export type AddAdminForm = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type EditAdminForm = {
  name: string;
  username: string;
  email: string;
  password: string;
  id: string;
};

function RenderAdminPage() {
  const auth = useSelector((state: RootState) => state.auth);

  const { setQueryParams, getQueryParams } = useQueryParams();

  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<{
    page: number;
  }>({
    page: 1,
  });

  const modalAddAdminRef = useRef<HTMLDialogElement>(null);
  const modalEditAdminRef = useRef<HTMLDialogElement>(null);

  const debouncedSearch = useDebounce(search, 500);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<AddAdminForm>({
    resolver: zodResolver(AddAdminSchema),
  });

  const {
    handleSubmit: handleEditSubmit,
    register: registerEdit,
    formState: { errors: editErrors },
    reset: resetEdit,
    setValue: setEditValue,
  } = useForm<EditAdminForm>({
    resolver: zodResolver(EditAdminSchema),
  });

  useEffect(() => {
    setQueryParams({
      q: debouncedSearch,
      page: filter.page.toString(),
    });
  }, [filter, debouncedSearch]);

  const { data } = useQuery({
    queryKey: [
      "admin/admin",
      auth.token,
      getQueryParams<string>("filter"),
      getQueryParams<string>("q"),
      getQueryParams<string>("page"),
    ],
    queryFn: ({ queryKey }) =>
      getManageAdminApi([
        queryKey[1] || "",
        {
          page: queryKey[4] ? parseInt(queryKey[4]) : 1,
          size: 10,
          q: queryKey[3] ?? "",
          key: getQueryParams<string>("key")!,
        },
      ]),
    enabled: !!auth.token,
  });

  const queryClient = useQueryClient();

  const addAdminMutation = useMutation({
    mutationFn: postManageAdminApi,
  });

  const editAdminMutation = useMutation({
    mutationFn: updateManageAdminApi,
  });

  const deleteAdminMutation = useMutation({
    mutationFn: deleteManageAdminApi,
  });

  const handleEditAction = (user: GlobalUserDto) => {
    setEditValue("name", user.name);
    setEditValue("username", user.username);
    setEditValue("email", user.email);
    setEditValue("id", user.id);
    modalEditAdminRef?.current?.showModal();
  };

  const handleAction = (id: string, action: "delete") => {
    if (action === "delete") {
      deleteAdminMutation.mutate(
        [
          auth.token,
          {
            key: getQueryParams<string>("key")!,
            id,
          },
        ],
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["admin/admin"],
            });
            toast.success("Admin deleted successfully");
          },
          onError: () => {
            toast.error("Failed to delete admin");
          },
        }
      );
    }
  };

  const handleAddAdminModal = () => {
    modalAddAdminRef.current?.showModal();
  };

  const handleFormSubmit = (data: AddAdminForm) => {
    addAdminMutation.mutate(
      [
        auth.token,
        {
          key: getQueryParams<string>("key")!,
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
        },
      ],
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["admin/admin"],
          });
          reset();
          modalAddAdminRef.current?.close();
        },
        onError: () => {
          toast.error("Failed to add admin", {
            containerId: "local",
          });
        },
      }
    );
  };

  const handleFormEditSubmit = (data: EditAdminForm) => {
    editAdminMutation.mutate(
      [
        auth.token,
        {
          key: getQueryParams<string>("key")!,
          id: data.id,
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
        },
      ],
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["admin/admin"],
          });
          resetEdit();
          modalEditAdminRef.current?.close();
        },
        onError: () => {
          toast.error("Failed to edit admin", {
            containerId: "local2",
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
          <button
            onClick={() => handleAddAdminModal()}
            className="btn btn-primary"
          >
            <PiPlus />
            Add Admin
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-primary text-primary-content">
              <tr>
                <th></th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((user, index) => (
                <tr key={user.id}>
                  <th>{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td className="inline-flex flex-col gap-1 w-full">
                    <button
                      onClick={() => handleEditAction(user)}
                      className="btn btn-xs btn-warning"
                    >
                      <PiPencil />
                      Edit
                    </button>
                    <button
                      onClick={() => handleAction(user.id, "delete")}
                      className="btn btn-xs btn-error"
                    >
                      <GoTrash />
                      Delete
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
      <dialog ref={modalAddAdminRef} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add Admin</h3>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="flex flex-col gap-2 py-2">
              <label
                className={`input input-bordered ${
                  errors.name && "input-error"
                } flex items-center gap-2`}
              >
                Name
                <input type="text" className="grow" {...register("name")} />
              </label>
              <label
                className={`input input-bordered ${
                  errors.username && "input-error"
                } flex items-center gap-2`}
              >
                Username
                <input type="text" className="grow" {...register("username")} />
              </label>
              <label
                className={`input input-bordered ${
                  errors.email && "input-error"
                } flex items-center gap-2`}
              >
                Email
                <input type="text" className="grow" {...register("email")} />
              </label>
              <label
                className={`input input-bordered ${
                  errors.password && "input-error"
                } flex items-center gap-2`}
              >
                Password
                <input
                  type="password"
                  className="grow"
                  {...register("password")}
                />
              </label>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Add Admin
              </button>
            </div>
          </form>
        </div>
        <ToastContainer position="bottom-right" containerId="local" />
      </dialog>
      <dialog ref={modalEditAdminRef} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Edit Admin</h3>
          <form onSubmit={handleEditSubmit(handleFormEditSubmit)}>
            <div className="flex flex-col gap-2 py-2">
              <label
                className={`input input-bordered ${
                  editErrors.name && "input-error"
                } flex items-center gap-2`}
              >
                Name
                <input type="text" className="grow" {...registerEdit("name")} />
              </label>
              <label
                className={`input input-bordered ${
                  editErrors.username && "input-error"
                } flex items-center gap-2`}
              >
                Username
                <input
                  type="text"
                  className="grow"
                  {...registerEdit("username")}
                />
              </label>
              <label
                className={`input input-bordered ${
                  editErrors.email && "input-error"
                } flex items-center gap-2`}
              >
                Email
                <input
                  type="text"
                  className="grow"
                  {...registerEdit("email")}
                />
              </label>
              <label
                className={`input input-bordered ${
                  editErrors.password && "input-error"
                } flex items-center gap-2`}
              >
                Password
                <input
                  type="password"
                  className="grow"
                  {...registerEdit("password")}
                />
              </label>
              <input type="hidden" {...registerEdit("id")} />
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Edit Admin
              </button>
            </div>
          </form>
        </div>
        <ToastContainer position="bottom-right" containerId="local2" />
      </dialog>
    </>
  );
}
