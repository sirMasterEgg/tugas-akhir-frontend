import { Replies } from "../shared/question.dto.ts";
import { GlobalUserDto } from "../shared/user.dto.ts";
import { FileDto } from "../shared/file.dto.ts";
import { GlobalGroupDto } from "../shared/group.dto.ts";

export type GetSingleInboxDto = {
  id: string;
};

export type GetSingleInboxResponseDto = {
  question: QuestionInbox;
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
