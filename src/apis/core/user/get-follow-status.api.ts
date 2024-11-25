import { axiosInstance } from "../index.api.ts";
import {
  GetFollowStatusDto,
  GetFollowStatusResponseDto,
} from "../../dto/user/get-follow-status.dto.ts";

export const getFollowStatusApi = async ([token, data]: [
  string,
  GetFollowStatusDto
]): Promise<GetFollowStatusResponseDto> => {
  const response = await axiosInstance.get(
    `/user/follow-status/${data.userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
