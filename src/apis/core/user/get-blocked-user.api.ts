import { axiosInstance } from "../index.api.ts";
import {
  GetBlockedUserDto,
  GetBlockedUserResponseDto,
} from "../../dto/user/get-blocked-user.dto.ts";

export const getBlockedUserApi = async ([token, data]: [
  string,
  GetBlockedUserDto
]): Promise<GetBlockedUserResponseDto> => {
  const response = await axiosInstance.get(
    `/user/blocked-user?page=${data.page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
