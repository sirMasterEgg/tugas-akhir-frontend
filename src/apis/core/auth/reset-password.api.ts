import { axiosInstance } from "../index.api.ts";
import {
  ResetPasswordDto,
  ResetPasswordResponseDto,
} from "../../dto/auth/reset-password.dto.ts";

export const resetPasswordApi = async ([token, data]: [
  string,
  ResetPasswordDto
]): Promise<ResetPasswordResponseDto> => {
  const result = await axiosInstance.post(
    `/auth/reset-password?token=${encodeURI(token)}`,
    data
  );
  return result.data;
};

export const headResetPasswordApi = async ([token]: [string]) => {
  const result = await axiosInstance.head(
    `/auth/reset-password?token=${encodeURI(token)}`
  );
  return result.status;
};
