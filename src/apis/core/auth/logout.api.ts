import { axiosInstance } from "../index.api.ts";
import { LogoutDto, LogoutResponseDto } from "../../dto/auth/logout.dto.ts";

export const logoutApi = async ([accessToken, data]: [
  string,
  LogoutDto
]): Promise<LogoutResponseDto> => {
  const result = await axiosInstance.post("/auth/logout", data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return result.data;
};
