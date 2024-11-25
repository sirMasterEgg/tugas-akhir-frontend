export type SendReportDto = {
  postId?: string;
  userId?: string;
  replyId?: string;
};

export type SendReportResponseDto = {
  message: string;
  id: string;
};
