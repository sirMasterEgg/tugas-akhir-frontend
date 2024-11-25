import { GlobalUserDto } from "./user.dto.ts";
import { FileDto } from "./file.dto.ts";

export type Question = {
  id: string;
  question: string;
  anonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: GlobalUserDto;
  files: FileDto[];
  replies: Replies[];
  vote: number;
  voted: boolean;
};

export type Replies = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  anonymous: boolean;
  owner: GlobalUserDto;
  vote: number;
  voted: boolean;
};
