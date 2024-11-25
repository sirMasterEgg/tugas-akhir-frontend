import { axiosInstance } from "../index.api.ts";
import {
  GetVoteStatusDto,
  GetVoteStatusResponseDto,
} from "../../dto/vote/get-vote-status.dto.ts";

export const getVoteStatusApi = async ([token, data]: [
  string,
  GetVoteStatusDto
]): Promise<GetVoteStatusResponseDto> => {
  if (data.replyId) {
    const response = await axiosInstance.get(`/vote/reply/${data.replyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  const response = await axiosInstance.get(`/vote/post/${data.questionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
