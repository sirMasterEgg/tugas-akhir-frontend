import { GlobalUserDto } from "../shared/user.dto.ts";

export type EditGroupDto = {
  groupId: string;
  groupName?: string;
  memberId?: string[];
  removeMemberId?: string[];
  ownerId?: string;
};
export type EditGroupResponseDto = {
  id: string;
  name: string;
  identifier: string;
  owner: GlobalUserDto;
  members: (GlobalUserDto & { joinedAt: Date })[];
};
