export type GetVoteStatusDto = {
  questionId?: string;
  replyId?: string;
};

export type GetVoteStatusResponseDto = {
  voted: boolean;
};
