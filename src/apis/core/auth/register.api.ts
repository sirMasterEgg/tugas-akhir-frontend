import { axiosInstance } from "../index.api.ts";
import {
  RegisterDto,
  RegisterResponseDto,
} from "../../dto/auth/register.dto.ts";

export const registerApi = async ([data]: [
  RegisterDto
]): Promise<RegisterResponseDto> => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};
