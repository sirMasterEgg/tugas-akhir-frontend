import { axiosInstance } from "../index.api.ts";
import {
  GetAllReportsDto,
  GetAllReportsResponseDto,
} from "../../dto/admin/get-all-reports.dto.ts";

export const getAllReportsApi = async ([token, data]: [
  string,
  GetAllReportsDto
]): Promise<GetAllReportsResponseDto> => {
  const search = new URLSearchParams();

  if (data.page) {
    search.append("page", data.page.toString());
  }

  if (data.size) {
    search.append("size", data.size.toString());
  }

  if (data.filter) {
    search.append("filter", data.filter);
  }

  if (data.search) {
    search.append("q", data.search);
  }

  const response = await axiosInstance.get(
    `/admin/reports?${search.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
