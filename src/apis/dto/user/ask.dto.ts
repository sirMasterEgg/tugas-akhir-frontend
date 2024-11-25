import { FileDto } from "../shared/file.dto.ts";
import { GlobalUserDto } from "../shared/user.dto.ts";

export type AskDto = {
  userId?: string;
  groupId?: string;
  content: string;
  anonymous: boolean;
  files: File[];
};

export type AskResponseDto = {
  id: string;
  question: string;
  anonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: GlobalUserDto;
  targetUser: GlobalUserDto;
  files: FileDto[];
};
