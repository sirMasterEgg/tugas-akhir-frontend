import { GlobalUserDto } from "../shared/user.dto.ts";

export interface ToggleQuestionDto {
  accept: boolean;
}
export interface ToggleQuestionResponseDto {
  user: GlobalUserDto;
}
