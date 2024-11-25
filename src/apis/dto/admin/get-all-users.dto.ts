import { GlobalUserDto } from "../shared/user.dto.ts";
import { MetaDto } from "../shared/meta.dto.ts";

export type GetAllUsersDto = {
  page: number;
  size: number;
  filter: string;
  search: string;
};

export type GetAllUsersResponseDto = {
  users: GlobalUserDto[];
  meta: MetaDto;
};
