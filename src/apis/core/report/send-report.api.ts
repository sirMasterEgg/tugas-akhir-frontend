import { axiosInstance } from "../index.api.ts";
import {
  SendReportDto,
  SendReportResponseDto,
} from "../../dto/report/send-report.dto.ts";

export const sendReportApi = async ([token, data]: [
  string,
  SendReportDto
]): Promise<SendReportResponseDto> => {
  const response = await axiosInstance.post(
    `/report`,
    {
      ...data,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
