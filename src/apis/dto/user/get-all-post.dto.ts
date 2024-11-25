import { Question } from "../shared/question.dto.ts";
import { MetaDto } from "../shared/meta.dto.ts";

export type GetAllPostDto = {
  page: number;
};

export type GetAllPostResponseDto = {
  questions: Question[];
  meta: MetaDto;
};
