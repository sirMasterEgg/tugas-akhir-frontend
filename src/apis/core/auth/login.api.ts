import { axiosInstance } from "../index.api.ts";
import { LoginDto, LoginResponseDto } from "../../dto/auth/login.dto.ts";

export const loginApi = async ([data]: [
  LoginDto
]): Promise<LoginResponseDto> => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};
