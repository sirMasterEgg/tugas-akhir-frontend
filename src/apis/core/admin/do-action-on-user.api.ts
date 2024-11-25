import { axiosInstance } from "../index.api.ts";
import {
  DoActionOnUserDto,
  DoActionOnUserResponseDto,
} from "../../dto/admin/do-action-on-user.dto.ts";

export const doActionOnUserApi = async ([token, data]: [
  string,
  DoActionOnUserDto
]): Promise<DoActionOnUserResponseDto> => {
  const response = await axiosInstance.post(`/admin/users/actions`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
