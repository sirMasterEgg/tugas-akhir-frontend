import { GlobalUserDto } from "../shared/user.dto.ts";

export type GetBlockedUserDto = {
  page: number;
};

export type GetBlockedUserResponseDto = {
  blockedUsers: GlobalUserDto[];
  meta: {
    currentPage: number;
    nextPage: number;
    totalPage: number;
  };
};
