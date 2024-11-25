import { GlobalUserDto } from "../shared/user.dto.ts";
import { GlobalGroupDto } from "../shared/group.dto.ts";

export type FollowDto = {
  userId?: string;
  groupId?: string;
  follow: boolean;
};

export type FollowResponseDto = {
  userFollowing: GlobalUserDto[];
  groupFollowing: GlobalGroupDto[];
};
