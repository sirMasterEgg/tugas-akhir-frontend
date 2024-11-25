import { GlobalUserDto } from "../shared/user.dto.ts";

export type CreateQuestionRepliesDto = {
  content: string;
  anonymous: boolean;
  postId: string;
};

export type CreateQuestionRepliesResponseDto = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  anonymous: boolean;
  owner?: GlobalUserDto;
};
