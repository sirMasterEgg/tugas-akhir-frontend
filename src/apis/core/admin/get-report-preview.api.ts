import { axiosInstance } from "../index.api.ts";
import {
  GetReportPreviewDto,
  GetReportPreviewResponseDto,
} from "../../dto/admin/get-report-preview.dto.ts";

export const getReportPreviewApi = async ([token, data]: [
  string,
  GetReportPreviewDto
]): Promise<GetReportPreviewResponseDto> => {
  const search = new URLSearchParams();

  if (data.reportId) {
    search.append("reportId", data.reportId.toString());
  }

  const response = await axiosInstance.get(
    `/admin/reports/preview?${search.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
