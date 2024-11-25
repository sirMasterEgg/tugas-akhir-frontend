import { axiosInstance } from "../index.api.ts";
import {
  GetAllPostDto,
  GetAllPostResponseDto,
} from "../../dto/user/get-all-post.dto.ts";

export const getAllPostApi = async ([token, data]: [
  string,
  GetAllPostDto
]): Promise<GetAllPostResponseDto> => {
  const response = await axiosInstance.get(`/user/question?page=${data.page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
