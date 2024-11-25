import { GlobalUserDto } from "../shared/user.dto.ts";
import { GlobalGroupDto } from "../shared/group.dto.ts";

export type SearchDto = {
  q: string;
};
export type SearchResponseDto = {
  results: (SearchUser | SearchGroup)[];
};

export type SearchUser = GlobalUserDto & {
  type: "user";
};
export type SearchGroup = GlobalGroupDto & {
  type: "group";
};
