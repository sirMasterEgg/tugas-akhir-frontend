import { GlobalUserDto } from "../shared/user.dto.ts";

export type BlockUserDto = {
  postId?: string;
  userId?: string;
  block: boolean;
};

export type BlockUserResponseDto = {
  blockedUsers: GlobalUserDto[];
};
