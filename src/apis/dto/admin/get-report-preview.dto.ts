import { Question, Replies } from "../shared/question.dto.ts";

export type GetReportPreviewDto = {
  reportId: string;
};

export type GetReportPreviewResponseDto = {
  reply?: Replies;
  question?: Question;
};
