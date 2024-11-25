import { axiosInstance } from "../index.api.ts";
import {
  MarkAsReadDto,
  MarkAsReadResponseDto,
} from "../../dto/user/mark-as-read.dto.ts";

export const markAsReadApi = async ([token, data]: [
  string,
  MarkAsReadDto
]): Promise<MarkAsReadResponseDto> => {
  const response = await axiosInstance.post(`/user/notification`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
