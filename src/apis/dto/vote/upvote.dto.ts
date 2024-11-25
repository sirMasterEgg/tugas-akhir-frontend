import { Question, Replies } from "../shared/question.dto.ts";

export type UpvoteDto = {
  questionId?: string;
  replyId?: string;
  isUpvote: boolean;
};

export type UpvoteResponseDto = {
  question?: Question;
  reply?: Replies;
};
