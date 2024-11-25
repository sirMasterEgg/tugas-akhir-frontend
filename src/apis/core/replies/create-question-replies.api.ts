import { axiosInstance } from "../index.api.ts";
import {
  CreateQuestionRepliesDto,
  CreateQuestionRepliesResponseDto,
} from "../../dto/replies/create-question-replies.dto.ts";

export const createQuestionRepliesApi = async ([token, data]: [
  string,
  CreateQuestionRepliesDto
]): Promise<CreateQuestionRepliesResponseDto> => {
  const response = await axiosInstance.post(
    `/reply/${data.postId}`,
    { content: data.content, anonymous: data.anonymous },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
