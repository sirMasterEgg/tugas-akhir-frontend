import { axiosInstance } from "../index.api.ts";
import {
  DoActionOnReportsDto,
  DoActionOnReportsResponseDto,
} from "../../dto/admin/do-action-on-reports.dto.ts";

export const doActionOnReportApi = async ([token, data]: [
  string,
  DoActionOnReportsDto
]): Promise<DoActionOnReportsResponseDto> => {
  const response = await axiosInstance.post(`/admin/reports/actions`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
