import { axiosInstance } from "../index.api.ts";
import { VerifyDto, VerifyResponseDto } from "../../dto/auth/verify.dto.ts";

export const verifyApi = async ([data]: [
  VerifyDto
]): Promise<VerifyResponseDto> => {
  const response = await axiosInstance.get(
    `/auth/verification?token=${encodeURI(data.token)}`
  );
  return response.data;
};
