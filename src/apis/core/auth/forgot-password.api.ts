import { axiosInstance } from "../index.api.ts";
import {
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
} from "../../dto/auth/forgot-password.dto.ts";

export const forgotPasswordApi = async ([data]: [
  ForgotPasswordDto
]): Promise<ForgotPasswordResponseDto> => {
  const response = await axiosInstance.post("/auth/forgot-password", data);
  return response.data;
};
