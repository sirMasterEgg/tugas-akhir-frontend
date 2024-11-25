import { GlobalUserDto } from "../shared/user.dto.ts";

export type RefreshTokenDto = {
  token: string;
};

export type RefreshTokenResponseDto = {
  user: GlobalUserDto;
  accessToken: string;
};
