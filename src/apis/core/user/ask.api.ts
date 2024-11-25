import { axiosInstance } from "../index.api.ts";
import { AskDto, AskResponseDto } from "../../dto/user/ask.dto.ts";

export const askApi = async ([data]: [AskDto]): Promise<AskResponseDto> => {
  const response = await axiosInstance.post(`/user/ask`, data);
  return response.data;
};
