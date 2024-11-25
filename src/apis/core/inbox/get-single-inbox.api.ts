import { axiosInstance } from "../index.api.ts";
import {
  GetSingleInboxDto,
  GetSingleInboxResponseDto,
} from "../../dto/inbox/get-single-inbox.dto.ts";

export const getSingleInboxApi = async ([token, data]: [
  string,
  GetSingleInboxDto
]): Promise<GetSingleInboxResponseDto> => {
  const response = await axiosInstance.get(`/inbox/${data.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
