import { axiosInstance } from "../index.api.ts";
import {
  GetUserProfileDto,
  GetUserProfileResponseDto,
} from "../../dto/user/get-user-profile.dto.ts";

export const getUserProfileApi = async ([token, data]: [
  string,
  GetUserProfileDto
]): Promise<GetUserProfileResponseDto> => {
  const response = await axiosInstance.get(`/user/${data.username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
