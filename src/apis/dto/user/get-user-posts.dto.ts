import { Question } from "../shared/question.dto.ts";
import { MetaDto } from "../shared/meta.dto.ts";

export type GetUserPostsDto = {
  userId: string;
  page: number;
};

export type GetUserPostsResponseDto = {
  questions: Question[];
  meta: MetaDto;
};
