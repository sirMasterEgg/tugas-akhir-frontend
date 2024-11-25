import { GlobalUserDto } from "../shared/user.dto.ts";

export type CreateGroupDto = {
  groupName: string;
  memberId: string[];
};
export type CreateGroupResponseDto = {
  id: string;
  name: string;
  identifier: string;
  owner: GlobalUserDto;
  members: (GlobalUserDto & { joinedAt: Date })[];
};
