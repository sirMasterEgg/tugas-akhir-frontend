import { axiosInstance } from "../index.api.ts";
import {
  ToggleQuestionDto,
  ToggleQuestionResponseDto,
} from "../../dto/user/toggle-question.dto.ts";

export const toggleQuestionApi = async ([token, data]: [
  string,
  ToggleQuestionDto
]): Promise<ToggleQuestionResponseDto> => {
  const response = await axiosInstance.post(`/user/toggle-status`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
