import { GlobalUserDto } from "../shared/user.dto.ts";

export type RegisterDto = {
  name: string;
  username: string;
  password: string;
  email: string;
  birthday: string;
};

export type RegisterResponseDto = {
  user: GlobalUserDto;
};
