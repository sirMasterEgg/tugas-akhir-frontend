import { GlobalUserDto } from "../shared/user.dto.ts";

export type GetSingleGroupDto = {
  id: string;
};
export type GetSingleGroupResponseDto = {
  group: SingleGroupResponseDto;
};
type SingleGroupResponseDto = {
  id: string;
  name: string;
  identifier: string;
  owner: GlobalUserDto;
  members: (GlobalUserDto & { joinedAt: Date; current: boolean })[];
};
