import { axiosInstance } from "../index.api.ts";
import {
  GetInboxDto,
  GetInboxResponseDto,
} from "../../dto/inbox/get-inbox.dto.ts";

export const getInboxApi = async ([token, data]: [
  string,
  GetInboxDto
]): Promise<GetInboxResponseDto> => {
  const response = await axiosInstance.get(`/inbox`, {
    params: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
