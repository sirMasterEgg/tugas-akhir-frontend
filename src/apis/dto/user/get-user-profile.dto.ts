import { GlobalUserDto } from "../shared/user.dto.ts";

export type GetUserProfileDto = {
  username: string | "current";
};
export type GetUserProfileResponseDto = {
  user: GlobalUserDto & {
    totalQuestions: number;
    totalFollowers: number;
    totalUpVotes: number;
  };
};
