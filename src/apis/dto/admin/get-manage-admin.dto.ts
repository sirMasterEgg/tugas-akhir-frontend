import { GlobalUserDto } from "../shared/user.dto.ts";
import { MetaDto } from "../shared/meta.dto.ts";

export type GetManageAdminDto = {
  page?: number;
  size?: number;
  q?: string;
  key?: string;
};

export type GetManageAdminResponseDto = {
  users: GlobalUserDto[];
  meta: MetaDto;
};
