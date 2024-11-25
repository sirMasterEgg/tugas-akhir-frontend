import { axiosInstance } from "../index.api.ts";
import {
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from "../../dto/auth/refresh-token.dto.ts";

export const refreshTokenApi = async ([data]: [
  RefreshTokenDto
]): Promise<RefreshTokenResponseDto> => {
  const response = await axiosInstance.post(`/auth/refresh-token`, data);
  return response.data;
};
