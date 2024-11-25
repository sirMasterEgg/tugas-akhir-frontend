import { FaMagnifyingGlass } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/index.store.ts";
import useQueryParams from "../../../hooks/useQueryParams.ts";
import { useEffect, useRef, useState } from "react";
import useDebounce from "../../../hooks/useDebounce.tsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllReportsApi } from "../../../apis/core/admin/get-all-reports.api.ts";
import { PiFileMagnifyingGlass } from "react-icons/pi";
import { SlOptionsVertical } from "react-icons/sl";
import { doActionOnReportApi } from "../../../apis/core/admin/do-action-on-reports.api.ts";
import { getReportPreviewApi } from "../../../apis/core/admin/get-report-preview.api.ts";

const actionMap: { [key: string]: number } = {
  BANNED: 4,
  WARNED: 3,
  TIMEOUT: 2,
  ACTIVE: 1,
};

const ReportPageAdmin = () => {
  const { setQueryParams, getQueryParams } = useQueryParams();
  const auth = useSelector((state: RootState) => state.auth);

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

  const modalPreviewRef = useRef<HTMLDialogElement>(null);

  const { data } = useQuery({
    queryKey: [
      "admin/reports",
      auth.token,
      getQueryParams<string>("filter"),
      getQueryParams<string>("q"),
      getQueryParams<string>("page"),
    ],
    queryFn: ({ queryKey }) =>
      getAllReportsApi([
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

  const handleAction = (
    reportId: string,
    action: "ban" | "warn" | "timeout" | "reject"
  ) => {
    userActionMutation.mutate(
      [
        auth.token,
        {
          reportId,
          action,
        },
      ],
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["admin/reports"],
          });
        },
      }
    );
  };

  const userActionMutation = useMutation({
    mutationFn: doActionOnReportApi,
  });

  const reportPreviewMutation = useMutation({
    mutationFn: getReportPreviewApi,
  });

  const handlePreview = (reportId: string) => {
    reportPreviewMutation.mutate(
      [
        auth.token,
        {
          reportId,
        },
      ],
      {
        onSuccess: () => {
          modalPreviewRef.current?.showModal();
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
              placeholder="Search Report ID"
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
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-primary text-primary-content">
              <tr>
                <th></th>
                <th>Report ID</th>
                <th>Reporter</th>
                <th>Report Type</th>
                <th>Report Status</th>
                <th className="inline-flex flex-col justify-center items-center">
                  <span>Reported Account</span>
                  <span>Current Status</span>
                </th>
                <th>Reported Content</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.reports.map((report, index) => (
                <tr key={report.id}>
                  <th>{index + 1}</th>
                  <td>{report.id}</td>
                  <td>{report.reporter.username}</td>
                  <td>{report.reportType}</td>
                  <td>
                    {report.reportStatus === "pending" && (
                      <div className="badge badge-warning">Pending</div>
                    )}
                    {report.reportStatus === "resolved" && (
                      <div className="badge badge-success">Resolved</div>
                    )}
                    {report.reportStatus === "rejected" && (
                      <div className="badge badge-error">Rejected</div>
                    )}
                  </td>
                  <td className="inline-flex flex-col justify-center items-center gap-1">
                    <span>{report.reportedUser.username}</span>
                    {report.reportedUser?.status?.userStatus === "BANNED" && (
                      <div className="badge badge-error">Banned</div>
                    )}
                    {report.reportedUser?.status?.userStatus === "TIMEOUT" && (
                      <div className="badge badge-neutral">Timeout</div>
                    )}
                    {report.reportedUser?.status?.userStatus === "WARNED" && (
                      <div className="badge badge-warning">Warned</div>
                    )}
                    {!report.reportedUser.status?.userStatus && (
                      <div className="badge badge-success">Active</div>
                    )}
                  </td>
                  <td>
                    {report.reportType === "content" && (
                      <button
                        onClick={() => handlePreview(report.id)}
                        className="btn btn-active btn-primary btn-xs"
                      >
                        <PiFileMagnifyingGlass />
                        Preview
                      </button>
                    )}
                  </td>
                  <td className="inline-flex flex-col gap-1 w-full">
                    <div className="dropdown dropdown-left">
                      <button
                        tabIndex={0}
                        className="btn btn-xs btn-ghost rounded-full h-8 w-8"
                      >
                        <SlOptionsVertical />
                      </button>
                      <ul
                        tabIndex={0}
                        className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow gap-1"
                      >
                        <li>
                          <button
                            onClick={() => handleAction(report.id, "timeout")}
                            className="btn btn-xs btn-neutral"
                            disabled={
                              actionMap[
                                report.reportedUser.status?.userStatus ||
                                  "ACTIVE"
                              ] >= actionMap["TIMEOUT"] ||
                              report.reportStatus !== "pending"
                            }
                          >
                            Timeout
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleAction(report.id, "warn")}
                            className="btn btn-xs btn-warning"
                            disabled={
                              actionMap[
                                report.reportedUser.status?.userStatus ||
                                  "ACTIVE"
                              ] >= actionMap["WARNED"] ||
                              report.reportStatus !== "pending"
                            }
                          >
                            Warn
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleAction(report.id, "ban")}
                            className="btn btn-xs btn-error"
                            disabled={
                              actionMap[
                                report.reportedUser.status?.userStatus ||
                                  "ACTIVE"
                              ] >= actionMap["BANNED"] ||
                              report.reportStatus !== "pending"
                            }
                          >
                            Ban
                          </button>
                        </li>

                        <div className="divider"></div>

                        <li>
                          <button
                            onClick={() => handleAction(report.id, "reject")}
                            className="btn btn-xs btn-error btn-outline"
                            disabled={report.reportStatus !== "pending"}
                          >
                            Reject Report
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="join inline-flex justify-center">
          <button
            onClick={() =>
              setFilter((prev) => ({
                ...prev,
                page: Math.max(1, prev.page - 1), // Ensures page doesn't go below 1
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
                page: Math.min(data?.meta.totalPage || 1, prev.page + 1), // Ensures page doesn't go beyond totalPage
              }))
            }
            className="join-item btn"
            disabled={filter.page === data?.meta.totalPage}
          >
            »
          </button>
        </div>
      </div>
      <dialog ref={modalPreviewRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Preview</h3>
          <pre className="p-4 bg-gray-200 mt-4">
            {reportPreviewMutation.data?.question?.question}
            {reportPreviewMutation.data?.reply?.content}
          </pre>
          File Attachments:
          <div className="p-4 mb-4">
            <ul className="list-disc list-inside">
              {reportPreviewMutation.data?.question?.files.map((attachment) => (
                <li key={attachment.id}>
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    className="link"
                    target="_blank"
                  >
                    {attachment.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <form method="dialog" className="w-full">
            <button className="btn w-full">Close</button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ReportPageAdmin;
