import { MetaDto } from "../shared/meta.dto.ts";
import { GlobalUserDto } from "../shared/user.dto.ts";

export type GetAllReportsDto = {
  page: number;
  size: number;
  filter: string;
  search: string;
};

export type Report = {
  id: string;
  reportStatus: "pending" | "resolved" | "rejected";
  reportType: "user" | "content";
  reportedUser: GlobalUserDto;
  reporter: GlobalUserDto;
  createdAt: Date;
  updatedAt: Date;
  reportedPostId?: string;
  reportedPostType?: "question" | "reply";
};

export type GetAllReportsResponseDto = {
  reports: Report[];
  meta: MetaDto;
};
