import { axiosInstance } from "../index.api.ts";
import { FollowDto, FollowResponseDto } from "../../dto/user/follow.dto.ts";

export const followApi = async ([token, data]: [
  string,
  FollowDto
]): Promise<FollowResponseDto> => {
  const response = await axiosInstance.post(`/user/follow`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
