import { axiosInstance } from "../index.api.ts";
import { UpvoteDto, UpvoteResponseDto } from "../../dto/vote/upvote.dto.ts";

export const upvoteApi = async ([token, data]: [
  string,
  UpvoteDto
]): Promise<UpvoteResponseDto> => {
  const response = await axiosInstance.post(`/vote/upvote`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
