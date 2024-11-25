import { Replies } from "../shared/question.dto.ts";
import { MetaDto } from "../shared/meta.dto.ts";
import { GlobalUserDto } from "../shared/user.dto.ts";
import { FileDto } from "../shared/file.dto.ts";
import { GlobalGroupDto } from "../shared/group.dto.ts";

export type GetInboxDto = {
  filter: string;
  page: number;
  size: number;
};

export type GetInboxResponseDto = {
  questions: QuestionInbox[];
  meta: MetaDto;
};

export type QuestionInbox = {
  id: string;
  question: string;
  anonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: GlobalUserDto;
  targetUser?: GlobalUserDto;
  targetGroup?: GlobalGroupDto;
  files: FileDto[];
  replies: Replies[];
};
