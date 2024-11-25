import { GlobalUserDto } from "../shared/user.dto.ts";

export type LoginDto = {
  username: string;
  password: string;
};

export type LoginResponseDto = {
  user: GlobalUserDto;
  accessToken: string;
  refreshToken: string;
};
