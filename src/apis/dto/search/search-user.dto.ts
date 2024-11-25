import { GlobalUserDto } from "../shared/user.dto.ts";
import { MetaDto } from "../shared/meta.dto.ts";

export type SearchUserDto = {
  username?: string;
  page?: number;
  size?: number;
};
export type SearchUserResponseDto = {
  users: GlobalUserDto[];
  meta: MetaDto;
};
