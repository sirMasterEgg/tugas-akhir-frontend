import { axiosInstance } from "../index.api.ts";
import {
  BlockUserDto,
  BlockUserResponseDto,
} from "../../dto/user/block-user.dto.ts";

export const blockUserApi = async ([token, data]: [
  string,
  BlockUserDto
]): Promise<BlockUserResponseDto> => {
  const response = await axiosInstance.post(`/user/block`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
