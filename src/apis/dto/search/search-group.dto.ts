import { GlobalGroupDto } from "../shared/group.dto.ts";
import { MetaDto } from "../shared/meta.dto.ts";

export type SearchGroupDto = {
  q: string;
};
export type SearchGroupResponseDto = {
  groups: GlobalGroupDto[];
  meta: MetaDto;
};
