import { GlobalUserDto } from "../shared/user.dto.ts";

export type VerifyDto = {
  token: string;
};

export type VerifyResponseDto = {
  user: GlobalUserDto;
  accessToken: string;
  refreshToken: string;
};
